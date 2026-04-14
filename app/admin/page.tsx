'use client'

import { useEffect, useState } from 'react'
import { Zap, Calendar, Users, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalScooters: number
  pendingRes: number
  confirmedRes: number
  totalClients: number
}

interface RecentReservation {
  id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  created_at: string
  profiles: { full_name: string | null; email: string } | null
  scooters: { name: string } | null
}

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'En attente',  bg: 'rgba(0,176,80,0.15)',    color: '#00B050' },
  confirmed: { label: 'Confirmée',   bg: 'rgba(0,176,80,0.25)',    color: '#00B050' },
  cancelled: { label: 'Annulée',     bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
  completed: { label: 'Terminée',    bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' },
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [
          { count: totalScooters },
          { count: pendingRes },
          { count: confirmedRes },
          { count: totalClients },
          { data: recentData },
        ] = await Promise.all([
          supabase.from('scooters').select('*', { count: 'exact', head: true }),
          supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase
            .from('reservations')
            .select('id, start_date, end_date, total_price, status, created_at, profiles(full_name, email), scooters(name)')
            .order('created_at', { ascending: false })
            .limit(5),
        ])
        setStats({
          totalScooters: totalScooters ?? 0,
          pendingRes: pendingRes ?? 0,
          confirmedRes: confirmedRes ?? 0,
          totalClients: totalClients ?? 0,
        })
        setRecent((recentData as unknown as RecentReservation[]) || [])
      } catch {
        setError('Impossible de charger les données. Vérifiez la configuration Supabase.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const kpis = stats ? [
    { label: 'Scooters', value: stats.totalScooters, icon: <Zap size={18} strokeWidth={1.5} />, accent: true },
    { label: 'En attente', value: stats.pendingRes, icon: <AlertCircle size={18} strokeWidth={1.5} />, accent: false },
    { label: 'Confirmées', value: stats.confirmedRes, icon: <Calendar size={18} strokeWidth={1.5} />, accent: false },
    { label: 'Clients', value: stats.totalClients, icon: <Users size={18} strokeWidth={1.5} />, accent: false },
  ] : []

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff',
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.4)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          Vue d&apos;ensemble de l&apos;activité Keewee
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 24,
          background: 'rgba(220,0,0,0.08)', border: '0.5px solid rgba(220,0,0,0.2)',
          fontSize: 13, color: '#ff6b6b',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          {error}
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 12, marginBottom: 32 }}>
        {loading
          ? [1,2,3,4].map(i => <Skeleton key={i} h={96} />)
          : kpis.map((k, i) => (
            <div key={i} style={{
              padding: '22px 24px',
              borderRadius: 12,
              border: '0.5px solid rgba(255,255,255,0.08)',
              background: '#161616',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 4, color: '#ffffff',
                }}>
                  {k.value}
                </div>
                <div style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.4)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {k.label}
                </div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: k.accent ? 'rgba(0,176,80,0.15)' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: k.accent ? '#00B050' : 'rgba(255,255,255,0.4)',
              }}>
                {k.icon}
              </div>
            </div>
          ))
        }
      </div>

      {/* Recent reservations */}
      <div style={{
        borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{
            fontSize: 14, fontWeight: 500, color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Dernières réservations
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4,5].map(i => <Skeleton key={i} h={44} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{
            padding: '40px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Aucune réservation pour l&apos;instant.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Client', 'Scooter', 'Période', 'Statut', 'Prix'].map(h => (
                    <th key={h} style={{
                      padding: '11px 24px', textAlign: 'left', fontWeight: 500,
                      color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
                      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => {
                  const st = STATUS_STYLE[r.status] || STATUS_STYLE.pending
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: i < recent.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{
                          fontWeight: 500, marginBottom: 1, color: '#ffffff', fontSize: 13,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        }}>
                          {r.profiles?.full_name || '—'}
                        </div>
                        <div style={{
                          fontSize: 11, color: 'rgba(255,255,255,0.35)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        }}>
                          {r.profiles?.email || '—'}
                        </div>
                      </td>
                      <td style={{
                        padding: '14px 24px', color: 'rgba(255,255,255,0.7)', fontSize: 13,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      }}>
                        {r.scooters?.name || '—'}
                      </td>
                      <td style={{
                        padding: '14px 24px', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.4)', fontSize: 13,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      }}>
                        {fmt(r.start_date)} → {fmt(r.end_date)}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 500,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{
                        padding: '14px 24px', fontWeight: 500, whiteSpace: 'nowrap', color: '#ffffff', fontSize: 13,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      }}>
                        {r.total_price.toFixed(0)} MAD
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Skeleton({ h }: { h: number }) {
  return <div style={{ height: h, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
}
