'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, Truck, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAdminSession, adminLogout } from '@/lib/admin-auth'

type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed'
type TabKey = 'today' | 'upcoming' | 'all'
type QuickFilter = 'all' | 'pending' | 'delivery' | 'pickup'

interface Row {
  id: string
  user_id: string
  scooter_id: string | null
  start_date: string
  end_date: string
  total_price: number
  status: Status
  rental_type: 'hourly' | 'daily' | 'weekly' | null
  duration_value: number | null
  phone: string | null
  client_email: string | null
  pickup_type: string | null
  pickup_address: string | null
  dropoff_type: string | null
  dropoff_address: string | null
  delivery_fee: number | null
  pickup_fee: number | null
  created_at: string
  client_name: string
  scooter_name: string
}

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

const ST: Record<Status, { label: string; bg: string; color: string }> = {
  pending:   { label: 'En attente', bg: 'rgba(255,103,0,0.15)',   color: '#FF6700' },
  confirmed: { label: 'Confirmée',  bg: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
  cancelled: { label: 'Annulée',    bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
  completed: { label: 'Terminée',   bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function rentalSummary(r: Row) {
  if (!r.rental_type || !r.duration_value) return '—'
  const labels = { hourly: 'heure', daily: 'jour', weekly: 'semaine' }
  const l = labels[r.rental_type]
  return `${r.duration_value} ${l}${r.duration_value > 1 ? 's' : ''}`
}

export default function OperationsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('today')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const session = getAdminSession()

  useEffect(() => {
    if (!session) { router.replace('/admin/login'); return }
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [
      { data: reservationsData },
      { data: scootersData },
      { data: profilesData },
    ] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('scooters').select('id, name'),
      supabase.from('profiles').select('id, full_name, email'),
    ])
    const merged = (reservationsData || []).map(r => {
      const profile = profilesData?.find(p => p.id === r.user_id)
      return {
        ...r,
        scooter_name: scootersData?.find(s => s.id === r.scooter_id)?.name ?? 'Scooter inconnu',
        client_name: profile?.full_name ?? r.phone ?? `Client #${r.user_id?.slice(0, 6)}`,
        client_email: r.client_email || profile?.email || null,
      }
    }) as Row[]
    // Pending first
    merged.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    setRows(merged)
    setLoading(false)
  }

  async function changeStatus(id: string, status: Status) {
    setUpdating(id)
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
    if (!error) {
      setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      const row = rows.find(r => r.id === id)
      const emailType = status === 'confirmed' ? 'confirmee' : status === 'cancelled' ? 'annulee' : null
      if (emailType && row?.client_email) {
        fetch('/api/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: emailType, reservationId: id,
            clientEmail: row.client_email, clientName: row.client_name,
            scooterName: row.scooter_name, phone: row.phone || '',
          }),
        }).catch(() => {})
      }
    }
    setUpdating(null)
  }

  function handleLogout() {
    adminLogout()
    router.push('/admin/login')
  }

  const today = todayStr()

  const tabFiltered = (() => {
    if (tab === 'today') return rows.filter(r => r.start_date <= today && r.end_date >= today)
    if (tab === 'upcoming') return rows.filter(r => r.start_date > today)
    return rows
  })()

  const filtered = tabFiltered.filter(r => {
    if (quickFilter === 'pending') return r.status === 'pending'
    if (quickFilter === 'delivery') return r.pickup_type === 'delivery'
    if (quickFilter === 'pickup') return r.dropoff_type === 'delivery' || r.dropoff_type === 'pickup'
    return true
  })

  const pendingToday = rows.filter(r =>
    r.status === 'pending' && r.start_date <= today && r.end_date >= today
  ).length

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'upcoming', label: 'À venir' },
    { key: 'all', label: 'Toutes' },
  ]

  const quickFilters: { key: QuickFilter; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'delivery', label: 'Livraisons' },
    { key: 'pickup', label: 'Récupérations' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
      {/* Simplified sidebar */}
      <aside style={{
        width: 220, background: '#111111',
        borderRight: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0,
      }}>
        <div style={{ padding: '22px 20px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <span style={{ ...sf, fontSize: 18, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>
            almone.
          </span>
          <span style={{ ...sf, fontSize: 10, color: '#FF6700', marginLeft: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ops
          </span>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{
            ...sf,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(255,103,0,0.1)', color: '#FF6700',
            fontSize: 13, fontWeight: 500,
          }}>
            <Calendar size={16} strokeWidth={1.5} />
            Réservations
          </div>
        </nav>

        <div style={{ padding: '12px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          {session && (
            <div style={{
              padding: '8px 12px', marginBottom: 4,
              background: 'rgba(255,255,255,0.04)', borderRadius: 8,
            }}>
              <div style={{ ...sf, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{session.name}</div>
              <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Opérateur
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              ...sf,
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <LogOut size={16} strokeWidth={1.5} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 60px' }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ ...sf, fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Bonjour, {session?.name?.split(' ')[0] ?? 'Opérateur'}
              </h1>
              {pendingToday > 0 && (
                <span style={{
                  ...sf,
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(255,103,0,0.15)', color: '#FF6700',
                  fontSize: 12, fontWeight: 600,
                }}>
                  {pendingToday} en attente aujourd&apos;hui
                </span>
              )}
            </div>
            <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 20,
            background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3, width: 'fit-content',
          }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  ...sf,
                  padding: '7px 18px', borderRadius: 8, border: 'none', fontSize: 13, cursor: 'pointer',
                  background: tab === t.key ? '#FF6700' : 'transparent',
                  color: tab === t.key ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  fontWeight: tab === t.key ? 600 : 400, transition: 'all 0.12s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick filters */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {quickFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setQuickFilter(f.key)}
                style={{
                  ...sf,
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  border: '0.5px solid',
                  borderColor: quickFilter === f.key ? '#FF6700' : 'rgba(255,255,255,0.1)',
                  background: quickFilter === f.key ? 'rgba(255,103,0,0.12)' : 'transparent',
                  color: quickFilter === f.key ? '#FF6700' : 'rgba(255,255,255,0.4)',
                  fontWeight: quickFilter === f.key ? 500 : 400, transition: 'all 0.12s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 160, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              padding: '48px 24px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              border: '0.5px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
                Aucune réservation à afficher.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(r => {
                const st = ST[r.status]
                const canConfirm = r.status === 'pending'
                const canCancel = r.status === 'pending' || r.status === 'confirmed'
                const hasDelivery = r.pickup_type === 'delivery'
                const hasPickup = r.dropoff_type === 'delivery' || r.dropoff_type === 'pickup'

                return (
                  <div
                    key={r.id}
                    style={{
                      background: '#161616',
                      border: `0.5px solid ${r.status === 'pending' ? 'rgba(255,103,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 12,
                      padding: '20px 24px',
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          ...sf,
                          display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 600,
                        }}>
                          {st.label}
                        </span>
                        <span style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                          #{r.id.slice(0, 8)}
                        </span>
                      </div>
                      <span style={{ ...sf, fontSize: 14, fontWeight: 700, color: '#FF6700' }}>
                        {r.total_price.toFixed(0)} MAD
                      </span>
                    </div>

                    {/* Client info */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ ...sf, fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                        {r.client_name}
                      </div>
                      {r.phone && (
                        <a href={`tel:${r.phone}`} style={{ ...sf, fontSize: 16, color: '#FF6700', textDecoration: 'none', fontWeight: 600 }}>
                          {r.phone}
                        </a>
                      )}
                    </div>

                    {/* Details grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px 24px', marginBottom: 16 }}>
                      {/* Scooter */}
                      <div>
                        <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Scooter
                        </div>
                        <div style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff' }}>
                          {r.scooter_name}
                        </div>
                      </div>

                      {/* Durée */}
                      <div>
                        <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Durée
                        </div>
                        <div style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff' }}>
                          {rentalSummary(r)}
                        </div>
                      </div>

                      {/* Dates */}
                      <div>
                        <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Période
                        </div>
                        <div style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                          {fmtDate(r.start_date)}
                          {r.start_date !== r.end_date && <> → {fmtDate(r.end_date)}</>}
                        </div>
                      </div>

                      {/* Récupération */}
                      <div>
                        <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Récupération
                        </div>
                        {hasDelivery ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Truck size={13} color="#FF6700" strokeWidth={1.5} />
                            <span style={{ ...sf, fontSize: 13, color: '#FF6700', fontWeight: 600 }}>
                              LIVRAISON → {r.pickup_address || '—'}
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Building2 size={13} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                            <span style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                              Retrait agence
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Retour */}
                      <div>
                        <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Retour
                        </div>
                        {hasPickup ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Truck size={13} color="#FF6700" strokeWidth={1.5} />
                            <span style={{ ...sf, fontSize: 13, color: '#FF6700', fontWeight: 600 }}>
                              RÉCUPÉRATION → {r.dropoff_address || '—'}
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Building2 size={13} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                            <span style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                              Retour agence
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {canConfirm && (
                        <button
                          onClick={() => changeStatus(r.id, 'confirmed')}
                          disabled={updating === r.id}
                          style={{
                            ...sf,
                            padding: '8px 20px', borderRadius: 8, border: 'none',
                            background: '#22c55e', color: '#ffffff',
                            fontSize: 13, fontWeight: 600, cursor: updating === r.id ? 'not-allowed' : 'pointer',
                            opacity: updating === r.id ? 0.6 : 1,
                          }}
                        >
                          {updating === r.id ? '…' : 'Confirmer'}
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => changeStatus(r.id, 'cancelled')}
                          disabled={updating === r.id}
                          style={{
                            ...sf,
                            padding: '8px 20px', borderRadius: 8,
                            border: '0.5px solid rgba(220,0,0,0.3)',
                            background: 'rgba(220,0,0,0.08)', color: '#ff6b6b',
                            fontSize: 13, fontWeight: 600, cursor: updating === r.id ? 'not-allowed' : 'pointer',
                            opacity: updating === r.id ? 0.6 : 1,
                          }}
                        >
                          Annuler
                        </button>
                      )}
                      {r.status === 'confirmed' && !canConfirm && (
                        <span style={{
                          ...sf,
                          display: 'inline-flex', alignItems: 'center',
                          padding: '8px 16px', borderRadius: 8,
                          background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                          fontSize: 13, fontWeight: 600,
                        }}>
                          ✓ Confirmée
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
