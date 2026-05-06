'use client'

import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, Calendar, CheckCircle, Receipt, AlertCircle, ArrowRight, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

type Period = '7d' | '30d' | '3m' | 'all'

interface Reservation {
  id: string
  user_id: string
  scooter_id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  rental_type: string | null
  duration_value: number | null
  delivery_fee: number | null
  pickup_fee: number | null
  created_at: string
  scooter_name: string
  client_name: string
}

interface ScooterRow {
  id: string
  name: string
  status: string
}

function periodStart(p: Period): Date | null {
  const now = new Date()
  if (p === '7d') return new Date(now.getTime() - 7 * 86400000)
  if (p === '30d') return new Date(now.getTime() - 30 * 86400000)
  if (p === '3m') return new Date(now.getTime() - 90 * 86400000)
  return null
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `il y a ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'hier'
  return `il y a ${days}j`
}

function fmtMAD(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' MAD'
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AdminDashboardPage() {
  const [allRes, setAllRes] = useState<Reservation[]>([])
  const [scooters, setScooters] = useState<ScooterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')

  useEffect(() => { load() }, [])

  // Auto-refresh every 5 min
  useEffect(() => {
    const id = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  async function load() {
    const [{ data: resData }, { data: scootData }, { data: profileData }] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('scooters').select('id, name, status'),
      supabase.from('profiles').select('id, full_name'),
    ])

    const merged: Reservation[] = (resData || []).map((r: any) => ({
      ...r,
      scooter_name: scootData?.find((s: any) => s.id === r.scooter_id)?.name ?? 'Scooter',
      client_name: profileData?.find((p: any) => p.id === r.user_id)?.full_name ?? `Client`,
    }))

    setAllRes(merged)
    setScooters((scootData || []) as ScooterRow[])
    setLoading(false)
  }

  // Filter by period
  const res = useMemo(() => {
    const start = periodStart(period)
    if (!start) return allRes
    return allRes.filter(r => new Date(r.created_at) >= start)
  }, [allRes, period])

  const confirmed = res.filter(r => r.status === 'confirmed')
  const pending = res.filter(r => r.status === 'pending')
  const cancelled = res.filter(r => r.status === 'cancelled')

  // KPIs
  const totalCA = confirmed.reduce((s, r) => s + r.total_price, 0)
  const totalResCount = res.length
  const confirmRate = totalResCount > 0 ? Math.round((confirmed.length / totalResCount) * 100) : 0
  const avgRevenue = confirmed.length > 0 ? Math.round(totalCA / confirmed.length) : 0

  // Previous period comparison
  const prevRes = useMemo(() => {
    const start = periodStart(period)
    if (!start) return allRes
    const periodMs = Date.now() - start.getTime()
    const prevStart = new Date(start.getTime() - periodMs)
    return allRes.filter(r => {
      const d = new Date(r.created_at)
      return d >= prevStart && d < start
    })
  }, [allRes, period])
  const prevCA = prevRes.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.total_price, 0)
  const prevCount = prevRes.length
  const caChange = prevCA > 0 ? Math.round(((totalCA - prevCA) / prevCA) * 100) : 0
  const countChange = prevCount > 0 ? Math.round(((totalResCount - prevCount) / prevCount) * 100) : 0

  // Chart: revenue per day
  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {}
    confirmed.forEach(r => {
      const day = r.created_at.slice(0, 10)
      map[day] = (map[day] || 0) + r.total_price
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      value,
    }))
  }, [confirmed])

  // Chart: reservations by status
  const statusData = [
    { name: 'Confirmées', value: confirmed.length, color: '#FF6700' },
    { name: 'En attente', value: pending.length, color: '#FFB400' },
    { name: 'Annulées', value: cancelled.length, color: '#555555' },
  ].filter(d => d.value > 0)

  // Chart: top scooters by revenue
  const topScooters = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; count: number }> = {}
    confirmed.forEach(r => {
      if (!map[r.scooter_id]) map[r.scooter_id] = { name: r.scooter_name, revenue: 0, count: 0 }
      map[r.scooter_id].revenue += r.total_price
      map[r.scooter_id].count += 1
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6)
  }, [confirmed])

  // Fleet performance
  const fleetPerf = useMemo(() => {
    const maxRev = Math.max(...topScooters.map(s => s.revenue), 1)
    return scooters.map(sc => {
      const data = topScooters.find(t => t.name === sc.name)
      return { ...sc, revenue: data?.revenue || 0, count: data?.count || 0, pct: ((data?.revenue || 0) / maxRev) * 100 }
    }).sort((a, b) => b.revenue - a.revenue)
  }, [scooters, topScooters])

  // Rental type breakdown
  const rentalBreakdown = useMemo(() => {
    const types = { hourly: { label: "À l'heure", count: 0, revenue: 0 }, daily: { label: 'À la journée', count: 0, revenue: 0 }, weekly: { label: 'À la semaine', count: 0, revenue: 0 } }
    confirmed.forEach(r => {
      const t = r.rental_type as keyof typeof types
      if (types[t]) { types[t].count++; types[t].revenue += r.total_price }
    })
    const total = confirmed.length || 1
    return Object.values(types).map(t => ({ ...t, pct: Math.round((t.count / total) * 100), avg: t.count > 0 ? Math.round(t.revenue / t.count) : 0 }))
  }, [confirmed])

  // Delivery stats
  const deliveryStats = useMemo(() => {
    const deliveries = confirmed.filter(r => r.delivery_fee && r.delivery_fee > 0)
    const pickups = confirmed.filter(r => r.pickup_fee && r.pickup_fee > 0)
    return {
      deliveryTotal: deliveries.reduce((s, r) => s + (r.delivery_fee || 0), 0),
      pickupTotal: pickups.reduce((s, r) => s + (r.pickup_fee || 0), 0),
      deliveryCount: deliveries.length,
      pickupCount: pickups.length,
    }
  }, [confirmed])

  // Recent 5
  const recent5 = allRes.slice(0, 5)

  // Alerts
  const pendingAlerts = allRes.filter(r => r.status === 'pending' && (Date.now() - new Date(r.created_at).getTime()) > 2 * 3600000)
  const idleScooters = scooters.filter(sc => {
    const lastRes = allRes.find(r => r.scooter_id === sc.id)
    return !lastRes || (Date.now() - new Date(lastRes.created_at).getTime()) > 7 * 86400000
  })

  if (loading) {
    return (
      <div style={{ padding: '40px', background: '#0a0a0a', minHeight: '100%' }}>
        <div style={{ height: 32, width: 200, background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 32 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />)}
        </div>
        <div style={{ height: 320, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1,2].map(i => <div key={i} style={{ height: 280, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />)}
        </div>
      </div>
    )
  }

  const PERIODS: { value: Period; label: string }[] = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '3m', label: '3 mois' },
    { value: 'all', label: 'Tout' },
  ]

  function ChangeTag({ value }: { value: number }) {
    if (value === 0) return null
    const positive = value > 0
    return (
      <span style={{
        ...sf, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6,
        background: positive ? 'rgba(0,176,80,0.15)' : 'rgba(220,0,0,0.12)',
        color: positive ? '#00B050' : '#cc0000',
      }}>
        {positive ? '+' : ''}{value}%
      </span>
    )
  }

  const noData = allRes.length === 0

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      {/* Header + period selector */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ ...sf, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff' }}>
            Dashboard
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Vue d&apos;ensemble de l&apos;activité Almone
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)} style={{
              ...sf, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: period === p.value ? '#FF6700' : 'rgba(255,255,255,0.06)',
              color: period === p.value ? '#ffffff' : 'rgba(255,255,255,0.4)',
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {noData ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', borderRadius: 12, background: '#161616', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <Zap size={48} strokeWidth={1} color="rgba(255,255,255,0.15)" style={{ marginBottom: 20 }} />
          <p style={{ ...sf, fontSize: 18, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Bienvenue sur votre dashboard</p>
          <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Les statistiques apparaîtront dès vos premières réservations.</p>
          <Link href="/admin/scooters" style={{ textDecoration: 'none' }}>
            <button style={{ ...sf, padding: '12px 24px', borderRadius: 8, border: 'none', background: '#FF6700', color: '#ffffff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Ajouter un scooter
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* SECTION 1 — KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { label: "Chiffre d'affaires", value: fmtMAD(totalCA), change: caChange, icon: <TrendingUp size={18} strokeWidth={1.5} />, accent: true },
              { label: 'Réservations', value: String(totalResCount), change: countChange, icon: <Calendar size={18} strokeWidth={1.5} />, accent: false },
              { label: 'Taux confirmation', value: `${confirmRate}%`, change: 0, icon: <CheckCircle size={18} strokeWidth={1.5} />, accent: false },
              { label: 'Revenu moyen', value: fmtMAD(avgRevenue), change: 0, icon: <Receipt size={18} strokeWidth={1.5} />, accent: false },
            ].map((k, i) => (
              <div key={i} style={{
                padding: '22px 24px', borderRadius: 12,
                border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{k.label}</p>
                  <p style={{ ...sf, fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 6 }}>
                    {k.value}
                  </p>
                  <ChangeTag value={k.change} />
                </div>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: k.accent ? 'rgba(255,103,0,0.15)' : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: k.accent ? '#FF6700' : 'rgba(255,255,255,0.4)',
                }}>
                  {k.icon}
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 2 — Charts */}
          {/* Revenue over time */}
          <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '24px', marginBottom: 16 }}>
            <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 20 }}>Revenus</p>
            {revenueByDay.length > 1 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueByDay}>
                  <defs>
                    <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6700" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FF6700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, color: '#ffffff' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    formatter={(v: any) => [`${Number(v).toLocaleString('fr-FR')} MAD`, 'Revenus']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#FF6700" strokeWidth={2} fill="url(#gradOrange)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '60px 0' }}>Pas assez de données pour afficher le graphique</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 16, marginBottom: 32 }}>
            {/* Pie chart — status */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '24px' }}>
              <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 20 }}>Réservations par statut</p>
              {statusData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                    {statusData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                        <span style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '60px 0' }}>Aucune donnée</p>
              )}
            </div>

            {/* Bar chart — top scooters */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '24px' }}>
              <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 20 }}>Top scooters par revenus</p>
              {topScooters.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topScooters} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, color: '#fff' }} formatter={(v: any) => [`${Number(v).toLocaleString('fr-FR')} MAD`]} />
                    <Bar dataKey="revenue" fill="#FF6700" radius={[0, 4, 4, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '60px 0' }}>Aucune donnée</p>
              )}
            </div>
          </div>

          {/* SECTION 3 — Secondary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16, marginBottom: 32 }}>
            {/* Fleet performance */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '20px' }}>
              <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 16 }}>Performance flotte</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {fleetPerf.map(sc => (
                  <div key={sc.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ ...sf, fontSize: 13, color: '#ffffff' }}>{sc.name}</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{sc.count} loc.</span>
                        <span style={{ ...sf, fontSize: 12, fontWeight: 500, color: '#ffffff' }}>{fmtMAD(sc.revenue)}</span>
                        <span style={{
                          ...sf, fontSize: 10, padding: '2px 6px', borderRadius: 4,
                          background: sc.status === 'available' ? 'rgba(255,103,0,0.15)' : 'rgba(255,255,255,0.06)',
                          color: sc.status === 'available' ? '#FF6700' : 'rgba(255,255,255,0.3)',
                        }}>
                          {sc.status === 'available' ? 'Dispo' : 'Loué'}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${sc.pct}%`, background: '#FF6700', borderRadius: 2, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
                {fleetPerf.length === 0 && <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Aucun scooter</p>}
              </div>
            </div>

            {/* Rental type breakdown */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '20px' }}>
              <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 16 }}>Types de location</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {rentalBreakdown.map((t, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ ...sf, fontSize: 13, color: '#ffffff' }}>{t.label}</span>
                      <span style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.count} ({t.pct}%) — moy. {fmtMAD(t.avg)}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${t.pct}%`, background: ['#FF6700', '#FFB400', '#888'][i], borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery stats */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', padding: '20px' }}>
              <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 16 }}>Frais de livraison</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Livraisons', count: deliveryStats.deliveryCount, total: deliveryStats.deliveryTotal },
                  { label: 'Récupérations', count: deliveryStats.pickupCount, total: deliveryStats.pickupTotal },
                ].map((d, i) => (
                  <div key={i}>
                    <p style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{d.label}</p>
                    <p style={{ ...sf, fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>{d.count}</p>
                    <p style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{fmtMAD(d.total)} générés</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4 — Recent activity + alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 16 }}>
            {/* Recent reservations */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff' }}>Activité récente</p>
                <Link href="/admin/reservations" style={{ ...sf, fontSize: 12, color: '#FF6700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Voir tout <ArrowRight size={12} strokeWidth={1.5} />
                </Link>
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recent5.length > 0 ? recent5.map(r => {
                  const st = r.status === 'confirmed' ? { bg: 'rgba(255,103,0,0.1)', color: '#FF6700', label: 'Confirmée' }
                    : r.status === 'pending' ? { bg: 'rgba(255,180,0,0.1)', color: '#FFB400', label: 'En attente' }
                    : { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', label: 'Annulée' }
                  return (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,103,0,0.15)', color: '#FF6700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', ...sf, fontSize: 11, fontWeight: 600, flexShrink: 0,
                      }}>
                        {initials(r.client_name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...sf, fontSize: 13, fontWeight: 500, color: '#ffffff' }}>{r.client_name}</p>
                        <p style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{r.scooter_name} — {relativeTime(r.created_at)}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ ...sf, fontSize: 13, fontWeight: 500, color: '#ffffff' }}>{r.total_price.toFixed(0)} MAD</p>
                        <span style={{ ...sf, fontSize: 10, padding: '2px 6px', borderRadius: 4, background: st.bg, color: st.color }}>{st.label}</span>
                      </div>
                    </div>
                  )
                }) : (
                  <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px 0' }}>Aucune réservation</p>
                )}
              </div>
            </div>

            {/* Alerts */}
            <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <p style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff' }}>Alertes</p>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pendingAlerts.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,103,0,0.08)', border: '0.5px solid rgba(255,103,0,0.2)' }}>
                    <AlertCircle size={16} strokeWidth={1.5} color="#FF6700" style={{ flexShrink: 0 }} />
                    <p style={{ ...sf, fontSize: 13, color: '#FF6700' }}>
                      {pendingAlerts.length} réservation{pendingAlerts.length > 1 ? 's' : ''} en attente depuis +2h
                    </p>
                  </div>
                )}
                {idleScooters.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                    <Clock size={16} strokeWidth={1.5} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
                    <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                      {idleScooters.length} scooter{idleScooters.length > 1 ? 's' : ''} sans réservation depuis 7j
                    </p>
                  </div>
                )}
                {pendingAlerts.length === 0 && idleScooters.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(0,176,80,0.08)' }}>
                    <CheckCircle size={16} strokeWidth={1.5} color="#00B050" style={{ flexShrink: 0 }} />
                    <p style={{ ...sf, fontSize: 13, color: '#00B050' }}>Tout est en ordre</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
