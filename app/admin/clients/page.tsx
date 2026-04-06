'use client'

import { useEffect, useState } from 'react'
import { X, Calendar, User } from 'lucide-react'
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
  pending:   { bg: 'rgba(255,180,0,0.1)',  color: '#8a6000', label: 'En attente' },
  confirmed: { bg: 'rgba(200,255,0,0.12)', color: '#3a6000', label: 'Confirmée'  },
  cancelled: { bg: 'rgba(220,0,0,0.08)',   color: '#8a0000', label: 'Annulée'    },
  completed: { bg: 'rgba(0,0,0,0.05)',     color: '#757575', label: 'Terminée'   },
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

    // Fetch reservation counts in one query
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
    <div style={{ padding: '40px 40px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Main list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 4 }}>Clients</h1>
          <p style={{ fontSize: 13, color: '#757575' }}>{profiles.length} compte{profiles.length !== 1 ? 's' : ''} enregistré{profiles.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', background: '#ffffff', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ height: 56, background: '#F5F5F5', borderRadius: 8 }} />)}
            </div>
          ) : profiles.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#757575', fontSize: 14 }}>
              Aucun client inscrit pour le moment.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                    {['Client', 'Email', 'Inscrit le', 'Réservations'].map(h => (
                      <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontWeight: 500, color: '#757575', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p, i) => (
                    <tr
                      key={p.id}
                      onClick={() => selectClient(p)}
                      style={{
                        borderBottom: i < profiles.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none',
                        cursor: 'pointer',
                        background: selected?.id === p.id ? 'rgba(200,255,0,0.04)' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#0a0a0a', color: '#C8FF00',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 500, flexShrink: 0,
                          }}>
                            {initials(p.full_name, p.email)}
                          </div>
                          <span style={{ fontWeight: 500 }}>{p.full_name || <span style={{ color: '#757575', fontWeight: 400 }}>Sans nom</span>}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', color: '#757575' }}>{p.email}</td>
                      <td style={{ padding: '12px 20px', color: '#757575', whiteSpace: 'nowrap' }}>{fmtDate(p.created_at)}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                          background: (p.res_count || 0) > 0 ? 'rgba(200,255,0,0.1)' : '#F5F5F5',
                          color: (p.res_count || 0) > 0 ? '#3a6000' : '#757575',
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
          border: '0.5px solid rgba(0,0,0,0.08)',
          background: '#ffffff',
          position: 'sticky',
          top: 24,
          maxHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#C8FF00', fontSize: 12, fontWeight: 500,
              }}>
                {initials(selected.full_name, selected.email)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{selected.full_name || 'Sans nom'}</div>
                <div style={{ fontSize: 11, color: '#757575' }}>{selected.email}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', padding: 2 }}>
              <X size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Meta */}
          <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', gap: 16, flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 10, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Inscrit le</div>
              <div style={{ fontSize: 12 }}>{fmtDate(selected.created_at)}</div>
            </div>
            {selected.phone && (
              <div>
                <div style={{ fontSize: 10, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Téléphone</div>
                <div style={{ fontSize: 12 }}>{selected.phone}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Réservations</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{selected.res_count || 0}</div>
            </div>
          </div>

          {/* Reservations history */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Historique
            </p>
            {histLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 64, background: '#F5F5F5', borderRadius: 8 }} />)}
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#757575', fontSize: 13 }}>
                Aucune réservation.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map(r => {
                  const st = ST_COLOR[r.status] || ST_COLOR.pending
                  return (
                    <div key={r.id} style={{
                      padding: '12px 14px', borderRadius: 10,
                      border: '0.5px solid rgba(0,0,0,0.08)', background: '#fafafa',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{r.scooters?.name || '—'}</span>
                        <span style={{
                          padding: '2px 7px', borderRadius: 5,
                          background: st.bg, color: st.color, fontSize: 10, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#757575', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{fmtDate(r.start_date)} → {fmtDate(r.end_date)}</span>
                        <span style={{ fontWeight: 500, color: '#0a0a0a' }}>{r.total_price.toFixed(0)} MAD</span>
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
