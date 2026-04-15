'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ScooterCard from '@/components/ScooterCard'
import type { Scooter } from '@/lib/types'

export default function FeaturedScooters() {
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('scooters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setScooters(data)
        setLoading(false)
      })
  }, [])

  return (
    <section style={{ padding: '120px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 56, flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
              letterSpacing: '0.15em', marginBottom: 12,
              fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            }}>
              Notre flotte
            </p>
            <h2 style={{
              fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              lineHeight: 1.1,
            }}>
              Des scooters taillés<br />pour Marrakech.
            </h2>
          </div>
          <Link href="/scooters" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', background: 'transparent',
              border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 8,
              fontSize: 13, color: '#0a0a0a', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            }}>
              Voir tout <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </Link>
        </div>

        <p style={{
          fontSize: 16, color: '#757575', lineHeight: 1.7, marginBottom: 48, maxWidth: 600,
          fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
        }}>
          Chaque modèle de notre flotte a été sélectionné pour affronter les ruelles de la médina, les grands axes de Guéliz et les chemins de la Palmeraie. Silencieux, maniables et rechargés chaque nuit.
        </p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: 12, background: '#F5F5F5', overflow: 'hidden' }}>
                <div style={{ height: 220, background: '#E8E8E8' }} />
                <div style={{ padding: 24 }}>
                  <div style={{ height: 18, background: '#E8E8E8', borderRadius: 6, marginBottom: 10, width: '60%' }} />
                  <div style={{ height: 13, background: '#E8E8E8', borderRadius: 6, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : scooters.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px', background: '#F5F5F5', borderRadius: 12,
          }}>
            <p style={{ color: '#757575', fontSize: 15, fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif' }}>
              Aucun scooter disponible pour l&apos;instant.
            </p>
          </div>
        ) : (
          <div
            className="scooters-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: 20 }}
          >
            {scooters.map(scooter => (
              <ScooterCard key={scooter.id} scooter={scooter} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
