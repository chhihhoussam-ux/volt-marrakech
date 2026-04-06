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
  pending:   { label: 'En attente',  bg: 'rgba(255,180,0,0.1)',  color: '#8a6000' },
  confirmed: { label: 'Confirmée',   bg: 'rgba(200,255,0,0.12)', color: '#3a6000' },
  cancelled: { label: 'Annulée',     bg: 'rgba(220,0,0,0.08)',   color: '#8a0000' },
  completed: { label: 'Terminée',    bg: 'rgba(0,0,0,0.05)',     color: '#757575' },
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
      { data: reservationsData, error },
      { data: scootersData },
      { data: profilesData },
    ] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('scooters').select('id, name, model'),
      supabase.from('profiles').select('id, full_name'),
    ])
    console.log('reservations:', reservationsData)
    console.log('error:', error)
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
    <div style={{ padding: '40px 40px 60px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 4 }}>Réservations</h1>
        <p style={{ fontSize: 13, color: '#757575' }}>{rows.length} réservation{rows.length !== 1 ? 's' : ''} au total</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '0.5px solid',
              borderColor: filter === f.value ? '#0a0a0a' : 'rgba(0,0,0,0.1)',
              background: filter === f.value ? '#0a0a0a' : '#ffffff',
              color: filter === f.value ? '#ffffff' : '#757575',
              fontSize: 12, fontWeight: filter === f.value ? 500 : 400,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span style={{
                minWidth: 18, height: 18, borderRadius: 9,
                background: filter === f.value ? 'rgba(255,255,255,0.15)' : '#F5F5F5',
                color: filter === f.value ? '#ffffff' : '#757575',
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>
                {counts[f.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', background: '#ffffff', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ height: 52, background: '#F5F5F5', borderRadius: 8 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#757575', fontSize: 14 }}>
            {filter === 'all' ? 'Aucune réservation.' : `Aucune réservation avec ce statut.`}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                  {['Client', 'Téléphone', 'Scooter', 'Durée', 'Période', 'Prix', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontWeight: 500, color: '#757575', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const st = ST[r.status]
                  const actions = NEXT_STATUS[r.status]
                  return (
                    <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ fontWeight: 500 }}>
                          {r.client_name}
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', whiteSpace: 'nowrap', fontSize: 12, color: '#757575' }}>
                        {r.phone || '—'}
                      </td>
                      <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                        {r.scooter_name}
                      </td>
                      <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: 5,
                          background: '#F5F5F5', fontSize: 11, fontWeight: 500, color: '#757575',
                        }}>
                          {rentalSummary(r)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', color: '#757575', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {fmt(r.start_date)}{r.start_date !== r.end_date && <><br />{fmt(r.end_date)}</>}
                      </td>
                      <td style={{ padding: '12px 20px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {r.total_price.toFixed(0)} MAD
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 9px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
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
                                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    cursor: updating === r.id ? 'not-allowed' : 'pointer',
                                    opacity: updating === r.id ? 0.5 : 1,
                                    border: isConfirm ? 'none' : '0.5px solid rgba(220,0,0,0.2)',
                                    background: isConfirm ? '#C8FF00' : isCancel ? 'rgba(220,0,0,0.04)' : 'transparent',
                                    color: isConfirm ? '#0a0a0a' : isCancel ? '#cc0000' : '#0a0a0a',
                                  }}
                                >
                                  {ACTION_LABEL[next]}
                                </button>
                              )
                            })}
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#C0C0C0' }}>—</span>
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
