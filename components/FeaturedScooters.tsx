'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ScooterCard from '@/components/ScooterCard'
import type { Scooter } from '@/lib/types'

export default function FeaturedScooters() {
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('scooters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      console.log('[FeaturedScooters] fetched:', data, 'error:', error)
      if (data) setScooters(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section style={{ padding: '80px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Notre flotte
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a' }}>
              Des scooters taillés pour Marrakech.
            </h2>
          </div>
          <Link href="/scooters" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', background: 'transparent',
              border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 8,
              fontSize: 13, color: '#0a0a0a', cursor: 'pointer',
            }}>
              Voir tout <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </Link>
        </div>

        <p style={{ fontSize: 15, color: '#757575', lineHeight: 1.7, marginBottom: 40, maxWidth: 640 }}>
          Chaque modèle de notre flotte a été sélectionné pour affronter les ruelles de la médina, les grands axes de Guéliz et les chemins de la Palmeraie. Silencieux, maniables et rechargés chaque nuit — vos aventures commencent ici.
        </p>

        {loading ? (
          <div className="scooters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', background: '#ffffff', overflow: 'hidden' }}>
                <div style={{ height: 200, background: '#EBEBEB' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 16, background: '#EBEBEB', borderRadius: 6, marginBottom: 8, width: '60%' }} />
                  <div style={{ height: 12, background: '#EBEBEB', borderRadius: 6, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : scooters.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px', background: '#ffffff',
            borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)',
          }}>
            <Zap size={32} strokeWidth={1} color="#E0E0E0" style={{ marginBottom: 12 }} />
            <p style={{ color: '#757575', fontSize: 14 }}>Connectez votre base Supabase pour afficher les scooters.</p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>Configurez .env.local avec vos clés Supabase</p>
          </div>
        ) : (
          <div className="scooters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
            {scooters.map(scooter => (
              <ScooterCard key={scooter.id} scooter={scooter} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
