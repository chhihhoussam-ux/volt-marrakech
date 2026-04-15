'use client'

import { useEffect, useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  res_count?: number
}

interface Reservation {
  id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  scooters: { name: string } | null
}

const ST_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(0,176,80,0.15)',    color: '#00B050',               label: 'En attente' },
  confirmed: { bg: 'rgba(0,176,80,0.25)',    color: '#00B050',               label: 'Confirmée'  },
  cancelled: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', label: 'Annulée'    },
  completed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', label: 'Terminée'   },
}

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name: string | null, email: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

export default function ClientsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Profile | null>(null)
  const [history, setHistory] = useState<Reservation[]>([])
  const [histLoading, setHistLoading] = useState(false)

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    setLoading(true)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!profileData) { setLoading(false); return }

    const { data: resData } = await supabase
      .from('reservations')
      .select('user_id')

    const countMap: Record<string, number> = {}
    for (const r of (resData || [])) {
      countMap[r.user_id] = (countMap[r.user_id] || 0) + 1
    }

    setProfiles(profileData.map(p => ({ ...p, res_count: countMap[p.id] || 0 })))
    setLoading(false)
  }

  async function selectClient(p: Profile) {
    setSelected(p)
    setHistLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('id, start_date, end_date, total_price, status, scooters(name)')
      .eq('user_id', p.id)
      .order('created_at', { ascending: false })
    setHistory((data as unknown as Reservation[]) || [])
    setHistLoading(false)
  }

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Main list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff',
          }}>
            Clients
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {profiles.length} compte{profiles.length !== 1 ? 's' : ''} enregistré{profiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ height: 56, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
            </div>
          ) : profiles.length === 0 ? (
            <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Aucun client inscrit pour le moment.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Client', 'Email', 'Inscrit le', 'Réservations'].map(h => (
                      <th key={h} style={{
                        ...sf, padding: '11px 20px', textAlign: 'left', fontWeight: 500,
                        color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
                        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p, i) => (
                    <tr
                      key={p.id}
                      onClick={() => selectClient(p)}
                      style={{
                        borderBottom: i < profiles.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                        cursor: 'pointer',
                        background: selected?.id === p.id ? 'rgba(0,176,80,0.06)' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                      onMouseLeave={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'rgba(0,176,80,0.15)', color: '#00B050',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            ...sf, fontSize: 11, fontWeight: 500, flexShrink: 0,
                          }}>
                            {initials(p.full_name, p.email)}
                          </div>
                          <span style={{ ...sf, fontWeight: 500, color: '#ffffff', fontSize: 13 }}>
                            {p.full_name || <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Sans nom</span>}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{p.email}</td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontSize: 13 }}>{fmtDate(p.created_at)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          ...sf,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                          background: (p.res_count || 0) > 0 ? 'rgba(0,176,80,0.15)' : 'rgba(255,255,255,0.06)',
                          color: (p.res_count || 0) > 0 ? '#00B050' : 'rgba(255,255,255,0.3)',
                        }}>
                          <Calendar size={10} strokeWidth={2} />
                          {p.res_count || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div style={{
          width: 340,
          flexShrink: 0,
          borderRadius: 12,
          border: '0.5px solid rgba(255,255,255,0.08)',
          background: '#161616',
          position: 'sticky',
          top: 24,
          maxHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,176,80,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00B050', ...sf, fontSize: 12, fontWeight: 500,
              }}>
                {initials(selected.full_name, selected.email)}
              </div>
              <div>
                <div style={{ ...sf, fontSize: 13, fontWeight: 500, color: '#ffffff' }}>{selected.full_name || 'Sans nom'}</div>
                <div style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{selected.email}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 2 }}>
              <X size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Meta */}
          <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', gap: 16, flexShrink: 0 }}>
            <div>
              <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Inscrit le</div>
              <div style={{ ...sf, fontSize: 12, color: '#ffffff' }}>{fmtDate(selected.created_at)}</div>
            </div>
            {selected.phone && (
              <div>
                <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Téléphone</div>
                <div style={{ ...sf, fontSize: 12, color: '#ffffff' }}>{selected.phone}</div>
              </div>
            )}
            <div>
              <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Réservations</div>
              <div style={{ ...sf, fontSize: 12, fontWeight: 500, color: '#ffffff' }}>{selected.res_count || 0}</div>
            </div>
          </div>

          {/* Reservations history */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
            <p style={{ ...sf, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Historique
            </p>
            {histLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 64, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
              </div>
            ) : history.length === 0 ? (
              <div style={{ ...sf, textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                Aucune réservation.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map(r => {
                  const st = ST_COLOR[r.status] || ST_COLOR.pending
                  return (
                    <div key={r.id} style={{
                      padding: '12px 14px', borderRadius: 10,
                      border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ ...sf, fontSize: 12, fontWeight: 500, color: '#ffffff' }}>{r.scooters?.name || '—'}</span>
                        <span style={{
                          ...sf,
                          padding: '2px 7px', borderRadius: 5,
                          background: st.bg, color: st.color, fontSize: 10, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </div>
                      <div style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{fmtDate(r.start_date)} → {fmtDate(r.end_date)}</span>
                        <span style={{ fontWeight: 500, color: '#ffffff' }}>{r.total_price.toFixed(0)} MAD</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
