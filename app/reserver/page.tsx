'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, ChevronDown, ArrowRight, AlertCircle, Lock, Zap, Clock, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import type { Scooter, RentalType } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diffDays(start: string, end: string): number {
  if (!start || !end) return 0
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
}

function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtDateShort(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function calcTotal(scooter: Scooter, type: RentalType, value: number): number {
  if (value <= 0) return 0
  if (type === 'hourly') return value * scooter.price_per_hour
  if (type === 'daily')  return value * scooter.price_per_day
  if (type === 'weekly') return value * scooter.price_per_week
  return 0
}

function priceLabel(scooter: Scooter, type: RentalType, value: number): string {
  if (value <= 0) return ''
  if (type === 'hourly') return `${value} heure${value > 1 ? 's' : ''} × ${scooter.price_per_hour} MAD`
  if (type === 'daily')  return `${value} jour${value > 1 ? 's' : ''} × ${scooter.price_per_day} MAD`
  if (type === 'weekly') return `${value} semaine${value > 1 ? 's' : ''} × ${scooter.price_per_week} MAD`
  return ''
}

const SELECT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 40px 12px 16px', borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
  fontSize: 14, color: '#0a0a0a', appearance: 'none', outline: 'none', cursor: 'pointer',
}
const DATE_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 12px 12px 36px', borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
  fontSize: 14, color: '#0a0a0a', outline: 'none',
}
const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 12px 12px 36px', borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
  fontSize: 14, color: '#0a0a0a', outline: 'none', boxSizing: 'border-box',
}

// ─── Page shell ──────────────────────────────────────────────────────────────

export default function ReserverPage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zap size={28} strokeWidth={1.5} color="#C8FF00" />
      </div>
    }>
      <ReserverContent />
    </Suspense>
  )
}

// ─── Main content ─────────────────────────────────────────────────────────────

function ReserverContent() {
  const searchParams = useSearchParams()
  const today = new Date().toISOString().split('T')[0]

  const [user, setUser] = useState<User | null>(null)
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [whatsappNumber, setWhatsappNumber] = useState('212600000000')

  // Form fields
  const [selectedId, setSelectedId] = useState(searchParams.get('scooter') || '')
  const [rentalType, setRentalType] = useState<RentalType>('daily')
  const [hours, setHours] = useState(2)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [weeks, setWeeks] = useState(1)
  const [phone, setPhone] = useState('')

  const selectedScooter = scooters.find(s => s.id === selectedId) || null

  const durationValue = rentalType === 'hourly' ? hours
    : rentalType === 'daily'  ? diffDays(startDate, endDate)
    : weeks

  const effectiveEndDate = rentalType === 'weekly' && startDate
    ? addDays(startDate, weeks * 7)
    : endDate

  const totalPrice = selectedScooter ? calcTotal(selectedScooter, rentalType, durationValue) : 0

  const canContinue = !!selectedId && !!selectedScooter && !!phone.trim() && durationValue > 0 &&
    (rentalType === 'hourly' ? !!startDate
      : rentalType === 'daily' ? !!startDate && !!endDate && durationValue > 0
      : !!startDate)

  useEffect(() => {
    async function init() {
      const [{ data: { user } }, { data: scoots }, { data: settings }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('scooters').select('*').eq('status', 'available'),
        supabase.from('settings').select('key, value').eq('key', 'whatsapp_number'),
      ])
      setUser(user)
      setScooters(scoots || [])
      if (settings?.[0]?.value) setWhatsappNumber(settings[0].value)
      setLoading(false)
    }
    init()
  }, [])

  function buildWhatsAppUrl(reservationDetails: {
    name: string; scooter: string; start: string; end: string; price: number; phone: string; type: string; duration: number
  }): string {
    const typeLabel = reservationDetails.type === 'hourly' ? 'heure(s)' : reservationDetails.type === 'daily' ? 'jour(s)' : 'semaine(s)'
    const text = `Nouvelle réservation :\n` +
      `• Client : ${reservationDetails.name}\n` +
      `• Scooter : ${reservationDetails.scooter}\n` +
      `• Type : ${reservationDetails.duration} ${typeLabel}\n` +
      `• Début : ${reservationDetails.start}\n` +
      `• Fin : ${reservationDetails.end}\n` +
      `• Prix total : ${reservationDetails.price} MAD\n` +
      `• Tél : ${reservationDetails.phone}`
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
  }

  async function handleSubmit() {
    if (!user || !selectedScooter || !canContinue) return
    setSubmitting(true)
    setError('')
    try {
      const { error: err } = await supabase.from('reservations').insert({
        user_id: user.id,
        scooter_id: selectedScooter.id,
        start_date: startDate,
        end_date: effectiveEndDate || startDate,
        total_price: totalPrice,
        status: 'pending',
        rental_type: rentalType,
        duration_value: durationValue,
        phone: phone.trim(),
      })
      if (err) throw err
      setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Zap size={28} strokeWidth={1.5} color="#C8FF00" />
            <p style={{ color: '#757575', fontSize: 14 }}>Chargement...</p>
          </div>
        </main>
      </>
    )
  }

  // ── Submitted (pending) ────────────────────────────────────────────────────
  if (submitted) {
    const waUrl = selectedScooter ? buildWhatsAppUrl({
      name: user?.user_metadata?.full_name || user?.email || 'Client',
      scooter: selectedScooter.name,
      start: fmtDateShort(startDate),
      end: fmtDateShort(effectiveEndDate || startDate),
      price: totalPrice,
      phone,
      type: rentalType,
      duration: durationValue,
    }) : '#'

    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            {/* Pending icon */}
            <div style={{
              width: 56, height: 56, background: 'rgba(255,180,0,0.12)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            }}>
              <Clock size={24} strokeWidth={1.5} color="#8a6000" />
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 12, textAlign: 'center' }}>
              Demande envoyée !
            </h1>
            <p style={{ color: '#757575', fontSize: 15, marginBottom: 8, lineHeight: 1.7, textAlign: 'center' }}>
              Votre demande de réservation pour <strong>{selectedScooter?.name}</strong> a bien été enregistrée.
            </p>
            <p style={{ color: '#757575', fontSize: 15, marginBottom: 32, lineHeight: 1.7, textAlign: 'center' }}>
              Notre équipe vous contactera dans les plus brefs délais au{' '}
              <strong style={{ color: '#0a0a0a' }}>{phone}</strong> pour confirmer.
            </p>

            {/* WhatsApp CTA */}
            <div style={{
              padding: '16px 20px', borderRadius: 12,
              background: 'rgba(37,211,102,0.06)', border: '0.5px solid rgba(37,211,102,0.25)',
              marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, color: '#757575', marginBottom: 12, textAlign: 'center' }}>
                Vous pouvez aussi nous contacter directement via WhatsApp :
              </p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 8, border: 'none',
                  background: '#25D366', color: '#ffffff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}>
                  <MessageCircle size={16} strokeWidth={1.5} />
                  Confirmer via WhatsApp
                </button>
              </a>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/compte" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '11px 20px', borderRadius: 8, background: '#C8FF00', border: 'none',
                  fontSize: 14, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Mes réservations
                </button>
              </Link>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '11px 20px', borderRadius: 8, background: 'transparent',
                  border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Retour à l'accueil
                </button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Nouvelle réservation
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em' }}>
              {step === 'form' ? 'Réservez votre scooter' : 'Confirmez votre réservation'}
            </h1>
          </div>

          {/* Auth gate */}
          {!user && (
            <div style={{
              padding: '20px 24px', borderRadius: 12, background: '#F5F5F5',
              border: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            }}>
              <Lock size={18} strokeWidth={1.5} color="#757575" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Connexion requise</p>
                <p style={{ fontSize: 13, color: '#757575' }}>
                  <Link href="/compte" style={{ color: '#0a0a0a', textDecoration: 'underline' }}>Connectez-vous</Link>
                  {' '}ou{' '}
                  <Link href="/compte?tab=signup" style={{ color: '#0a0a0a', textDecoration: 'underline' }}>créez un compte</Link>
                  {' '}pour finaliser votre réservation.
                </p>
              </div>
            </div>
          )}

          {step === 'form' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ── Scooter select ── */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Scooter</label>
                <div style={{ position: 'relative' }}>
                  <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={SELECT_STYLE}>
                    <option value="">Sélectionner un scooter</option>
                    {scooters.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — {s.price_per_day} MAD/jour</option>
                    ))}
                  </select>
                  <ChevronDown size={16} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* ── Scooter preview ── */}
              {selectedScooter && (
                <div style={{
                  padding: '16px', borderRadius: 10,
                  border: '0.5px solid rgba(200,255,0,0.4)', background: 'rgba(200,255,0,0.04)',
                  display: 'flex', gap: 16, alignItems: 'center',
                }}>
                  {selectedScooter.image_url && (
                    <img src={selectedScooter.image_url} alt={selectedScooter.name}
                      style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  )}
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{selectedScooter.name}</p>
                    <p style={{ fontSize: 12, color: '#757575' }}>{selectedScooter.model} · {selectedScooter.autonomy_km} km</p>
                    <p style={{ fontSize: 12, color: '#5a9000', marginTop: 4 }}>
                      {selectedScooter.price_per_hour} MAD/h · {selectedScooter.price_per_day} MAD/j · {selectedScooter.price_per_week} MAD/sem
                    </p>
                  </div>
                </div>
              )}

              {/* ── Rental type ── */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Type de location</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {([
                    { value: 'hourly', label: 'À l\'heure', sub: selectedScooter ? `${selectedScooter.price_per_hour} MAD/h` : 'par heure' },
                    { value: 'daily',  label: 'À la journée', sub: selectedScooter ? `${selectedScooter.price_per_day} MAD/j` : 'par jour' },
                    { value: 'weekly', label: 'À la semaine', sub: selectedScooter ? `${selectedScooter.price_per_week} MAD/sem` : 'par semaine' },
                  ] as { value: RentalType; label: string; sub: string }[]).map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => { setRentalType(opt.value); setStartDate(''); setEndDate('') }}
                      style={{
                        padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: rentalType === opt.value ? '1.5px solid #0a0a0a' : '0.5px solid rgba(0,0,0,0.12)',
                        background: rentalType === opt.value ? '#0a0a0a' : '#ffffff',
                        transition: 'all 0.12s',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500, color: rentalType === opt.value ? '#ffffff' : '#0a0a0a', marginBottom: 2 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: rentalType === opt.value ? 'rgba(255,255,255,0.55)' : '#757575' }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Duration inputs ── */}
              {rentalType === 'hourly' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Date</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} style={DATE_STYLE} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Nombre d'heures</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <select value={hours} onChange={e => setHours(Number(e.target.value))} style={{ ...SELECT_STYLE, paddingLeft: 36 }}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                          <option key={h} value={h}>{h} heure{h > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {rentalType === 'daily' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Date de début</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input type="date" value={startDate} min={today} onChange={e => { setStartDate(e.target.value); if (endDate && e.target.value >= endDate) setEndDate('') }} style={DATE_STYLE} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Date de fin</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input type="date" value={endDate} min={startDate ? addDays(startDate, 1) : today} onChange={e => setEndDate(e.target.value)} style={DATE_STYLE} />
                    </div>
                  </div>
                </div>
              )}

              {rentalType === 'weekly' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Date de début</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} style={DATE_STYLE} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Nombre de semaines</label>
                    <div style={{ position: 'relative' }}>
                      <select value={weeks} onChange={e => setWeeks(Number(e.target.value))} style={SELECT_STYLE}>
                        {[1, 2, 3, 4].map(w => (
                          <option key={w} value={w}>{w} semaine{w > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Phone ── */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Numéro de téléphone <span style={{ color: '#cc0000' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} strokeWidth={1.5} color="#757575" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={INPUT_STYLE}
                  />
                </div>
                <p style={{ fontSize: 11, color: '#757575', marginTop: 4 }}>
                  Nous vous contacterons sur ce numéro pour confirmer votre réservation.
                </p>
              </div>

              {/* ── Price summary ── */}
              {selectedScooter && durationValue > 0 &&
                (rentalType === 'hourly' ? startDate : rentalType === 'daily' ? (startDate && endDate) : startDate) && (
                <div style={{ padding: '20px 24px', borderRadius: 10, background: '#0a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#757575', marginBottom: 4 }}>
                      {priceLabel(selectedScooter, rentalType, durationValue)} =
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.03em' }}>
                      {totalPrice.toFixed(0)} <span style={{ fontSize: 14, fontWeight: 400, color: '#757575' }}>MAD</span>
                    </p>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(200,255,0,0.1)', fontSize: 12, color: '#C8FF00' }}>
                    {rentalType === 'hourly' ? 'Tarif heure' : rentalType === 'daily' ? 'Tarif jour' : 'Tarif semaine'}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('confirm')}
                disabled={!canContinue}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 24px', borderRadius: 10, border: 'none',
                  background: canContinue ? '#C8FF00' : '#E0E0E0',
                  color: canContinue ? '#0a0a0a' : '#757575',
                  fontSize: 14, fontWeight: 500,
                  cursor: canContinue ? 'pointer' : 'not-allowed',
                }}
              >
                Continuer <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>

          ) : (
            /* ── Confirmation step ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {selectedScooter?.image_url && (
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={selectedScooter.image_url} alt={selectedScooter.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Récapitulatif</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { label: 'Scooter', value: `${selectedScooter?.name} — ${selectedScooter?.model}` },
                      { label: 'Type', value: rentalType === 'hourly' ? 'À l\'heure' : rentalType === 'daily' ? 'À la journée' : 'À la semaine' },
                      { label: 'Début', value: fmtDate(startDate) },
                      ...(rentalType !== 'hourly' ? [{ label: 'Fin', value: fmtDate(effectiveEndDate || startDate) }] : []),
                      { label: 'Durée', value: rentalType === 'hourly' ? `${durationValue} heure${durationValue > 1 ? 's' : ''}` : rentalType === 'daily' ? `${durationValue} jour${durationValue > 1 ? 's' : ''}` : `${durationValue} semaine${durationValue > 1 ? 's' : ''}` },
                      { label: 'Téléphone', value: phone },
                      { label: 'Calcul', value: selectedScooter ? `${priceLabel(selectedScooter, rentalType, durationValue)} = ${totalPrice.toFixed(0)} MAD` : '' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <span style={{ fontSize: 13, color: '#757575', flexShrink: 0 }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ paddingTop: 14, borderTop: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>Total estimé</span>
                      <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.03em' }}>
                        {totalPrice.toFixed(0)} <span style={{ fontSize: 13, fontWeight: 400, color: '#757575' }}>MAD</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending info banner */}
              <div style={{
                padding: '14px 18px', borderRadius: 10,
                background: 'rgba(255,180,0,0.08)', border: '0.5px solid rgba(255,180,0,0.3)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Clock size={16} strokeWidth={1.5} color="#8a6000" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: '#8a6000', lineHeight: 1.5 }}>
                  Votre demande sera <strong>en attente de confirmation</strong>. Notre équipe vous contactera au <strong>{phone}</strong> pour valider.
                </p>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8, background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.2)' }}>
                  <AlertCircle size={16} strokeWidth={1.5} color="#cc0000" />
                  <span style={{ fontSize: 13, color: '#cc0000' }}>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep('form')}
                  style={{ flex: 1, padding: '13px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.12)', background: 'transparent', fontSize: 14, color: '#0a0a0a', cursor: 'pointer' }}
                >
                  Modifier
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!user || submitting}
                  style={{
                    flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px', borderRadius: 10, border: 'none',
                    background: user ? '#C8FF00' : '#E0E0E0',
                    color: user ? '#0a0a0a' : '#757575',
                    fontSize: 14, fontWeight: 500,
                    cursor: user && !submitting ? 'pointer' : 'not-allowed',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Envoi...' : user ? 'Envoyer la demande' : 'Connexion requise'}
                  {!submitting && user && <ArrowRight size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
