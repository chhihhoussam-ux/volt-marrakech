'use client'

import { useEffect, useState } from 'react'
import { Zap, Calendar, Users, TrendingUp, AlertCircle } from 'lucide-react'
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
  pending:   { label: 'En attente',  bg: 'rgba(255,180,0,0.1)',   color: '#8a6000' },
  confirmed: { label: 'Confirmée',   bg: 'rgba(200,255,0,0.12)',  color: '#3a6000' },
  cancelled: { label: 'Annulée',     bg: 'rgba(220,0,0,0.08)',    color: '#8a0000' },
  completed: { label: 'Terminée',    bg: 'rgba(0,0,0,0.05)',      color: '#757575' },
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
      } catch (e: unknown) {
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
    <div style={{ padding: '40px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#757575' }}>Vue d&apos;ensemble de l&apos;activité Rouli</p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 24,
          background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.15)',
          fontSize: 13, color: '#cc0000',
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
              padding: '20px 24px',
              borderRadius: 12,
              border: '0.5px solid rgba(0,0,0,0.08)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.04em', marginBottom: 2 }}>
                  {k.value}
                </div>
                <div style={{ fontSize: 12, color: '#757575' }}>{k.label}</div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: k.accent ? '#C8FF00' : '#F5F5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: k.accent ? '#0a0a0a' : '#757575',
              }}>
                {k.icon}
              </div>
            </div>
          ))
        }
      </div>

      {/* Recent reservations */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 500 }}>Dernières réservations</h2>
        </div>

        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4,5].map(i => <Skeleton key={i} h={44} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#757575', fontSize: 14 }}>
            Aucune réservation pour l'instant.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                  {['Client', 'Scooter', 'Période', 'Statut', 'Prix'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontWeight: 500, color: '#757575', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => {
                  const st = STATUS_STYLE[r.status] || STATUS_STYLE.pending
                  return (
                    <tr key={r.id} style={{ borderBottom: i < recent.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 500, marginBottom: 1 }}>
                          {r.profiles?.full_name || '—'}
                        </div>
                        <div style={{ fontSize: 11, color: '#757575' }}>{r.profiles?.email || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 24px', color: '#0a0a0a' }}>
                        {r.scooters?.name || '—'}
                      </td>
                      <td style={{ padding: '12px 24px', whiteSpace: 'nowrap', color: '#757575' }}>
                        {fmt(r.start_date)} → {fmt(r.end_date)}
                      </td>
                      <td style={{ padding: '12px 24px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 9px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 24px', fontWeight: 500, whiteSpace: 'nowrap' }}>
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
  return <div style={{ height: h, borderRadius: 8, background: '#F5F5F5' }} />
}
