'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  LogIn, UserPlus, LogOut, Calendar, CheckCircle, XCircle,
  AlertCircle, Zap, User, Clock, Bike, Save, MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Reservation } from '@/lib/types'

type AuthTab = 'login' | 'signup'

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
  fontSize: 14, color: '#0a0a0a', outline: 'none', boxSizing: 'border-box',
  ...sf,
}

const statusConfig: Record<string, {
  label: string; message: string; icon: React.ReactNode; color: string; bg: string
}> = {
  pending: {
    label: 'En attente',
    message: 'Notre équipe va vous contacter pour confirmer',
    icon: <Clock size={13} strokeWidth={1.5} />,
    color: '#FF6700', bg: 'rgba(255,103,0,0.1)',
  },
  confirmed: {
    label: 'Confirmée',
    message: 'Réservation confirmée — à bientôt !',
    icon: <CheckCircle size={13} strokeWidth={1.5} />,
    color: '#00B050', bg: 'rgba(0,176,80,0.1)',
  },
  cancelled: {
    label: 'Annulée',
    message: 'Cette réservation a été annulée',
    icon: <XCircle size={13} strokeWidth={1.5} />,
    color: '#757575', bg: '#F5F5F5',
  },
  completed: {
    label: 'Terminée',
    message: 'Merci pour votre confiance !',
    icon: <CheckCircle size={13} strokeWidth={1.5} />,
    color: '#757575', bg: 'rgba(0,0,0,0.05)',
  },
}

function rentalLabel(type: string, value: number): string {
  switch (type) {
    case 'hourly':  return `Location ${value} heure${value > 1 ? 's' : ''}`
    case 'daily':   return `Location ${value} jour${value > 1 ? 's' : ''}`
    case 'weekly':  return `Location ${value} semaine${value > 1 ? 's' : ''}`
    default:        return 'Location'
  }
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ComptePage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zap size={28} strokeWidth={1.5} color="var(--accent)" />
      </div>
    }>
      <CompteContent />
    </Suspense>
  )
}

function CompteContent() {
  const searchParams = useSearchParams()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<AuthTab>((searchParams.get('tab') as AuthTab) || 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  const [reservations, setReservations] = useState<(Reservation & { scooters?: { name: string; model: string; image_url: string | null } })[]>([])
  const [resLoading, setResLoading] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)

  // Profile
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // WhatsApp
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    // Fetch whatsapp number
    supabase.from('settings').select('value').eq('key', 'whatsapp_number').single()
      .then(({ data }) => { if (data?.value) setWhatsappNumber(data.value) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      loadReservations()
      loadProfile()
    }
  }, [user])

  async function loadReservations() {
    setResLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('*, scooters(name, model, image_url)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setReservations(data || [])
    setResLoading(false)
  }

  async function loadProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user!.id)
      .single()
    if (data) {
      setProfileName(data.full_name || user!.user_metadata?.full_name || '')
      setProfilePhone(data.phone || '')
    } else {
      setProfileName(user!.user_metadata?.full_name || '')
    }
  }

  async function handleSaveProfile() {
    if (!user) return
    setProfileSaving(true)
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email!,
      full_name: profileName,
      phone: profilePhone,
    }, { onConflict: 'id' })
    setProfileSaving(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function handleCancelReservation(id: string) {
    setCancellingId(id)
    const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
    if (!error) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
      // Send cancellation email
      fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'annulee',
          reservationId: id,
          clientEmail: user?.email,
          clientName: user?.user_metadata?.full_name || user?.email,
        }),
      }).catch(() => {})
    }
    setCancellingId(null)
    setConfirmCancelId(null)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    else setAuthSuccess('Connexion réussie !')
    setAuthLoading(false)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    })
    if (error) setAuthError(error.message)
    else setAuthSuccess('Compte créé ! Vérifiez vos emails pour confirmer votre compte.')
    setAuthLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setReservations([])
  }

  // ── Loading ──
  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={28} strokeWidth={1.5} color="var(--accent)" />
        </main>
      </>
    )
  }

  // ── Auth form ──
  if (!user) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 56, minHeight: '100vh' }}>
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ marginBottom: 40 }}>
              <p style={{ ...sf, fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Espace client
              </p>
              <h1 style={{ ...sf, fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em' }}>
                {tab === 'login' ? 'Connexion' : 'Créer un compte'}
              </h1>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#F5F5F5', borderRadius: 10, padding: 4, marginBottom: 32 }}>
              {(['login', 'signup'] as const).map((t) => (
                <button key={t}
                  onClick={() => { setTab(t); setAuthError(''); setAuthSuccess('') }}
                  style={{
                    ...sf, flex: 1, padding: '10px 20px', borderRadius: 7, border: 'none',
                    background: tab === t ? '#ffffff' : 'transparent',
                    color: '#0a0a0a', fontSize: 13, fontWeight: tab === t ? 500 : 400,
                    cursor: 'pointer', minHeight: 44,
                    boxShadow: tab === t ? '0 0 0 0.5px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t === 'login' ? 'Se connecter' : "S'inscrire"}
                </button>
              ))}
            </div>

            <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {tab === 'signup' && (
                  <div>
                    <label style={{ ...sf, display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Nom complet</label>
                    <input type="text" placeholder="Votre nom" value={fullName}
                      onChange={(e) => setFullName(e.target.value)} required style={INPUT_STYLE} />
                  </div>
                )}
                <div>
                  <label style={{ ...sf, display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Email</label>
                  <input type="email" placeholder="votre@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required style={INPUT_STYLE} />
                </div>
                <div>
                  <label style={{ ...sf, display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Mot de passe</label>
                  <input type="password" placeholder={tab === 'signup' ? '8 caractères minimum' : '••••••••'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required minLength={tab === 'signup' ? 8 : undefined} style={INPUT_STYLE} />
                </div>

                {authError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.2)' }}>
                    <AlertCircle size={15} strokeWidth={1.5} color="#cc0000" />
                    <span style={{ ...sf, fontSize: 13, color: '#cc0000' }}>{authError}</span>
                  </div>
                )}
                {authSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, background: 'rgba(255,103,0,0.08)', border: '0.5px solid rgba(255,103,0,0.3)' }}>
                    <CheckCircle size={15} strokeWidth={1.5} color="#FF6700" />
                    <span style={{ ...sf, fontSize: 13, color: '#FF6700' }}>{authSuccess}</span>
                  </div>
                )}

                <button type="submit" disabled={authLoading} style={{
                  ...sf, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px', borderRadius: 10, border: 'none',
                  background: 'var(--accent)', color: '#ffffff',
                  fontSize: 14, fontWeight: 500, cursor: authLoading ? 'not-allowed' : 'pointer',
                  opacity: authLoading ? 0.7 : 1,
                }}>
                  {tab === 'login'
                    ? <><LogIn size={16} strokeWidth={1.5} />{authLoading ? 'Connexion...' : 'Se connecter'}</>
                    : <><UserPlus size={16} strokeWidth={1.5} />{authLoading ? 'Création...' : 'Créer mon compte'}</>
                  }
                </button>

                {tab === 'login' && (
                  <Link href="/forgot-password" style={{ ...sf, display: 'block', textAlign: 'center', fontSize: 13, color: '#FF6700', textDecoration: 'none' }}>
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Dashboard ──
  const firstName = (user.user_metadata?.full_name || profileName || 'Utilisateur').split(' ')[0]

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56, minHeight: '100vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ ...sf, fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Bonjour, {firstName} 👋
              </h1>
              <p style={{ ...sf, fontSize: 15, color: '#757575' }}>
                Gérez vos réservations et informations personnelles
              </p>
            </div>
            <button onClick={handleLogout} style={{
              ...sf, display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.1)', background: 'transparent',
              fontSize: 13, color: '#757575', cursor: 'pointer',
            }}>
              <LogOut size={14} strokeWidth={1.5} />
              Se déconnecter
            </button>
          </div>

          {/* Reservations */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ ...sf, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
              Mes réservations
            </h2>

            {resLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2].map(i => <div key={i} style={{ height: 160, borderRadius: 12, background: '#F5F5F5' }} />)}
              </div>
            ) : reservations.length === 0 ? (
              /* Empty state */
              <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F5F5F5', borderRadius: 16 }}>
                <Bike size={48} strokeWidth={1} color="#D0D0D0" style={{ marginBottom: 20 }} />
                <p style={{ ...sf, fontSize: 18, fontWeight: 600, color: '#0a0a0a', marginBottom: 8 }}>
                  Vous n&apos;avez pas encore de réservation
                </p>
                <p style={{ ...sf, fontSize: 14, color: '#757575', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
                  Explorez notre flotte et réservez votre scooter en quelques clics.
                </p>
                <Link href="/scooters" style={{ textDecoration: 'none' }}>
                  <button style={{
                    ...sf, padding: '14px 28px', borderRadius: 8, border: 'none',
                    background: 'var(--accent)', color: '#ffffff',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Voir nos scooters
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reservations.map((res: any) => {
                  const sc = res.scooters
                  const cfg = statusConfig[res.status] || statusConfig.pending
                  return (
                    <div key={res.id} style={{
                      borderRadius: 12,
                      border: '0.5px solid rgba(0,0,0,0.08)',
                      background: '#ffffff',
                      overflow: 'hidden',
                    }}>
                      {/* Card header */}
                      <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Top row: badge + ref */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <span style={{
                            ...sf, display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '5px 12px', borderRadius: 6,
                            background: cfg.bg, color: cfg.color,
                            fontSize: 12, fontWeight: 500,
                          }}>
                            {cfg.icon}{cfg.label}
                          </span>
                          <span style={{ ...sf, fontSize: 12, color: '#757575' }}>
                            #{res.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>

                        {/* Scooter info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {sc?.image_url && (
                            <img src={sc.image_url} alt={sc.name}
                              style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ ...sf, fontSize: 16, fontWeight: 600, color: '#0a0a0a', marginBottom: 2 }}>
                              {sc?.name || 'Scooter'}
                            </p>
                            <p style={{ ...sf, fontSize: 13, color: '#757575' }}>
                              Du {fmtDate(res.start_date)} au {fmtDate(res.end_date)}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ ...sf, fontSize: 24, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                              {res.total_price.toFixed(0)}
                            </p>
                            <p style={{ ...sf, fontSize: 12, color: '#757575' }}>MAD</p>
                          </div>
                        </div>

                        {/* Duration */}
                        {res.rental_type && res.duration_value && (
                          <p style={{ ...sf, fontSize: 13, color: '#757575' }}>
                            {rentalLabel(res.rental_type, res.duration_value)}
                          </p>
                        )}
                      </div>

                      {/* Status bar */}
                      <div style={{
                        padding: '12px 24px',
                        borderTop: '0.5px solid rgba(0,0,0,0.06)',
                        background: cfg.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 8,
                      }}>
                        <p style={{ ...sf, fontSize: 13, color: cfg.color }}>{cfg.message}</p>
                        {res.status === 'pending' && (
                          confirmCancelId === res.id ? (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => setConfirmCancelId(null)} style={{
                                ...sf, padding: '6px 14px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.12)',
                                background: 'transparent', fontSize: 12, color: '#757575', cursor: 'pointer',
                              }}>
                                Non
                              </button>
                              <button onClick={() => handleCancelReservation(res.id)}
                                disabled={cancellingId === res.id}
                                style={{
                                  ...sf, padding: '6px 14px', borderRadius: 6, border: 'none',
                                  background: 'rgba(220,0,0,0.9)', color: '#ffffff', fontSize: 12,
                                  fontWeight: 500, cursor: 'pointer',
                                  opacity: cancellingId === res.id ? 0.6 : 1,
                                }}>
                                {cancellingId === res.id ? 'Annulation...' : 'Confirmer'}
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmCancelId(res.id)} style={{
                              ...sf, padding: '6px 14px', borderRadius: 6,
                              border: '0.5px solid rgba(220,0,0,0.3)', background: 'rgba(220,0,0,0.06)',
                              fontSize: 12, color: '#cc0000', cursor: 'pointer',
                            }}>
                              Annuler
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Profile section */}
          <div style={{
            borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)',
            background: '#ffffff', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              <h2 style={{ ...sf, fontSize: 16, fontWeight: 600 }}>Mon profil</h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ ...sf, display: 'block', fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Email
                </label>
                <input type="email" value={user.email || ''} disabled style={{
                  ...INPUT_STYLE, background: '#EBEBEB', color: '#757575', cursor: 'not-allowed',
                }} />
              </div>
              <div>
                <label style={{ ...sf, display: 'block', fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Nom complet
                </label>
                <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)}
                  placeholder="Votre nom complet" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={{ ...sf, display: 'block', fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Téléphone
                </label>
                <input type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX" style={INPUT_STYLE} />
              </div>
              <button onClick={handleSaveProfile} disabled={profileSaving} style={{
                ...sf, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '12px 20px', borderRadius: 8, border: 'none',
                background: profileSaved ? 'rgba(0,176,80,0.1)' : 'var(--accent)',
                color: profileSaved ? '#00B050' : '#ffffff',
                fontSize: 13, fontWeight: 500, cursor: profileSaving ? 'not-allowed' : 'pointer',
                opacity: profileSaving ? 0.7 : 1, alignSelf: 'flex-start',
              }}>
                {profileSaved
                  ? <><CheckCircle size={15} strokeWidth={1.5} /> Sauvegardé</>
                  : <><Save size={15} strokeWidth={1.5} /> {profileSaving ? 'Enregistrement...' : 'Sauvegarder'}</>
                }
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* WhatsApp floating button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 40,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 20px', borderRadius: 50,
            background: '#25D366', color: '#ffffff',
            textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            ...sf,
          }}
        >
          <MessageCircle size={18} strokeWidth={1.5} />
          Nous contacter
        </a>
      )}
    </>
  )
}
