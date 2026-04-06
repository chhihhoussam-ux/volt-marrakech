'use client'

import { useState, useEffect } from 'react'
import { Filter, Zap, Search } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScooterCard from '@/components/ScooterCard'
import { supabase } from '@/lib/supabase'
import type { Scooter, ScooterStatus } from '@/lib/types'

export default function ScootersPage() {
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ScooterStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('scooters')
        .select('*')
        .order('created_at', { ascending: false })
      console.log('[/scooters] fetched:', data, 'error:', error)
      if (data) setScooters(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = scooters.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter
    const matchesSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.model.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filterOptions: { value: ScooterStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'available', label: 'Disponibles' },
    { value: 'rented', label: 'Loués' },
  ]

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 56 }}>
        {/* Header */}
        <div style={{
          padding: '48px 24px 0',
          maxWidth: 1120,
          margin: '0 auto',
        }}>
          <div style={{ paddingTop: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Notre flotte
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Catalogue scooters
            </h1>
            <p style={{ fontSize: 15, color: '#757575' }}>
              {scooters.filter(s => s.status === 'available').length} scooter{scooters.filter(s => s.status === 'available').length > 1 ? 's' : ''} disponible{scooters.filter(s => s.status === 'available').length > 1 ? 's' : ''} en ce moment
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          padding: '24px 24px',
          maxWidth: 1120,
          margin: '0 auto',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#757575', marginRight: 4 }}>
              <Filter size={14} strokeWidth={1.5} />
              <span style={{ fontSize: 12 }}>Filtrer</span>
            </div>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '0.5px solid',
                  borderColor: filter === opt.value ? '#0a0a0a' : 'rgba(0,0,0,0.1)',
                  background: filter === opt.value ? '#0a0a0a' : 'transparent',
                  color: filter === opt.value ? '#ffffff' : '#0a0a0a',
                  fontSize: 13,
                  fontWeight: filter === opt.value ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.5} color="#757575" style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
            }} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 220,
                padding: '8px 12px 8px 34px',
                borderRadius: 8,
                border: '0.5px solid rgba(0,0,0,0.1)',
                background: '#F5F5F5',
                fontSize: 13,
                color: '#0a0a0a',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{
          padding: '0 24px 80px',
          maxWidth: 1120,
          margin: '0 auto',
        }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  borderRadius: 12,
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: 200, background: '#F5F5F5' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 16, background: '#F5F5F5', borderRadius: 6, marginBottom: 8, width: '60%' }} />
                    <div style={{ height: 12, background: '#F5F5F5', borderRadius: 6, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: '#F5F5F5',
              borderRadius: 12,
            }}>
              <Zap size={32} strokeWidth={1} color="#E0E0E0" style={{ marginBottom: 12 }} />
              <p style={{ color: '#757575', fontSize: 15 }}>
                {scooters.length === 0
                  ? 'Aucun scooter trouvé. Vérifiez votre configuration Supabase.'
                  : 'Aucun résultat pour ces filtres.'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}>
              {filtered.map((scooter) => (
                <ScooterCard key={scooter.id} scooter={scooter} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
