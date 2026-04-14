'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed'
type Filter = 'all' | Status

type RentalType = 'hourly' | 'daily' | 'weekly'

interface Row {
  id: string
  user_id: string
  scooter_id: string | null
  start_date: string
  end_date: string
  total_price: number
  status: Status
  rental_type: RentalType | null
  duration_value: number | null
  phone: string | null
  created_at: string
  client_name: string
  scooter_name: string
}

const RENTAL_LABEL: Record<RentalType, string> = {
  hourly: 'Heure',
  daily:  'Jour',
  weekly: 'Semaine',
}

function rentalSummary(r: Row): string {
  if (!r.rental_type || !r.duration_value) return '—'
  const label = RENTAL_LABEL[r.rental_type]
  return `${r.duration_value} ${label.toLowerCase()}${r.duration_value > 1 ? 's' : ''}`
}

const ST: Record<Status, { label: string; bg: string; color: string }> = {
  pending:   { label: 'En attente',  bg: 'rgba(0,176,80,0.15)',    color: '#00B050' },
  confirmed: { label: 'Confirmée',   bg: 'rgba(0,176,80,0.25)',    color: '#00B050' },
  cancelled: { label: 'Annulée',     bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
  completed: { label: 'Terminée',    bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' },
}

const NEXT_STATUS: Record<Status, Status[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['cancelled'],
  cancelled: [],
  completed: [],
}

const ACTION_LABEL: Record<Status, string> = {
  confirmed: 'Confirmer',
  cancelled:  'Annuler',
  pending:   '',
  completed: '',
}

const sf: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReservationsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [
      { data: reservationsData },
      { data: scootersData },
      { data: profilesData },
    ] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('scooters').select('id, name, model'),
      supabase.from('profiles').select('id, full_name'),
    ])
    const merged = (reservationsData || []).map(r => ({
      ...r,
      scooter_name: scootersData?.find(s => s.id === r.scooter_id)?.name ?? 'Scooter inconnu',
      client_name: profilesData?.find(p => p.id === r.user_id)?.full_name ?? r.phone ?? `Client #${r.user_id.slice(0, 6)}`,
    }))
    const sorted = merged.slice().sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return 0
    })
    setRows(sorted as unknown as Row[])
    setLoading(false)
  }

  async function changeStatus(id: string, status: Status) {
    setUpdating(id)
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
    if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    setUpdating(null)
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'cancelled', label: 'Annulées' },
    { value: 'completed', label: 'Terminées' },
  ]

  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  const counts: Record<Filter, number> = {
    all: rows.length,
    pending: rows.filter(r => r.status === 'pending').length,
    confirmed: rows.filter(r => r.status === 'confirmed').length,
    cancelled: rows.filter(r => r.status === 'cancelled').length,
    completed: rows.filter(r => r.status === 'completed').length,
  }

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff',
        }}>
          Réservations
        </h1>
        <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          {rows.length} réservation{rows.length !== 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              ...sf,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '0.5px solid',
              borderColor: filter === f.value ? '#00B050' : 'rgba(255,255,255,0.1)',
              background: filter === f.value ? 'rgba(0,176,80,0.12)' : 'transparent',
              color: filter === f.value ? '#00B050' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: filter === f.value ? 500 : 400,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span style={{
                ...sf,
                minWidth: 18, height: 18, borderRadius: 9,
                background: filter === f.value ? 'rgba(0,176,80,0.2)' : 'rgba(255,255,255,0.08)',
                color: filter === f.value ? '#00B050' : 'rgba(255,255,255,0.4)',
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>
                {counts[f.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ height: 52, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {filter === 'all' ? 'Aucune réservation.' : 'Aucune réservation avec ce statut.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Client', 'Téléphone', 'Scooter', 'Durée', 'Période', 'Prix', 'Statut', 'Actions'].map(h => (
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
                {filtered.map((r, i) => {
                  const st = ST[r.status]
                  const actions = NEXT_STATUS[r.status]
                  return (
                    <tr
                      key={r.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ ...sf, fontWeight: 500, color: '#ffffff', fontSize: 13 }}>
                          {r.client_name}
                        </div>
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', whiteSpace: 'nowrap', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        {r.phone || '—'}
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                        {r.scooter_name}
                      </td>
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          ...sf,
                          display: 'inline-block', padding: '2px 8px', borderRadius: 5,
                          background: 'rgba(255,255,255,0.06)', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)',
                        }}>
                          {rentalSummary(r)}
                        </span>
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {fmt(r.start_date)}{r.start_date !== r.end_date && <><br />{fmt(r.end_date)}</>}
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', fontWeight: 500, whiteSpace: 'nowrap', color: '#ffffff', fontSize: 13 }}>
                        {r.total_price.toFixed(0)} MAD
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          ...sf,
                          display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {actions.length > 0 ? (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {actions.map(next => {
                              const isConfirm = next === 'confirmed'
                              const isCancel  = next === 'cancelled'
                              return (
                                <button
                                  key={next}
                                  onClick={() => changeStatus(r.id, next)}
                                  disabled={updating === r.id}
                                  style={{
                                    ...sf,
                                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    cursor: updating === r.id ? 'not-allowed' : 'pointer',
                                    opacity: updating === r.id ? 0.5 : 1,
                                    border: isConfirm ? 'none' : '0.5px solid rgba(220,0,0,0.3)',
                                    background: isConfirm ? '#00B050' : isCancel ? 'rgba(220,0,0,0.1)' : 'transparent',
                                    color: isConfirm ? '#ffffff' : isCancel ? '#ff6b6b' : 'rgba(255,255,255,0.6)',
                                  }}
                                >
                                  {ACTION_LABEL[next]}
                                </button>
                              )
                            })}
                          </div>
                        ) : (
                          <span style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>—</span>
                        )}
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
