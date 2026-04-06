'use client'

import Link from 'next/link'
import { Battery, ArrowRight, Zap } from 'lucide-react'
import type { Scooter } from '@/lib/types'

interface ScooterCardProps {
  scooter: Scooter
  showReserveButton?: boolean
}

export default function ScooterCard({ scooter, showReserveButton = true }: ScooterCardProps) {
  const isAvailable = scooter.status === 'available'

  return (
    <div
      style={{
        borderRadius: 12,
        border: '0.5px solid rgba(0,0,0,0.08)',
        background: '#ffffff',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
    >
      {/* Image */}
      <div style={{ height: 200, background: '#F5F5F5', position: 'relative', overflow: 'hidden' }}>
        {scooter.image_url ? (
          <img
            src={scooter.image_url}
            alt={scooter.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F5F5F5',
          }}>
            <Zap size={48} strokeWidth={1} color="#E0E0E0" />
          </div>
        )}
        {/* Status badge */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
            background: isAvailable ? 'rgba(200,255,0,0.2)' : 'rgba(220,0,0,0.1)',
            color: isAvailable ? '#3a5a00' : '#8a0000',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: isAvailable ? '#5a9000' : '#cc0000',
              display: 'inline-block',
            }} />
            {isAvailable ? 'Disponible' : 'Loué'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 2 }}>
            {scooter.name}
          </h3>
          <p style={{ fontSize: 12, color: '#757575' }}>{scooter.model}</p>
        </div>

        {/* Autonomy */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', background: '#F5F5F5', borderRadius: 8, marginBottom: 16,
        }}>
          <Battery size={15} strokeWidth={1.5} color="#757575" />
          <span style={{ fontSize: 13, color: '#757575' }}>{scooter.autonomy_km} km d'autonomie</span>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
              {scooter.price_per_day.toFixed(0)}
            </span>
            <span style={{ fontSize: 13, color: '#757575', marginLeft: 3 }}>MAD/jour</span>
          </div>

          {showReserveButton && (
            <Link href={`/reserver?scooter=${scooter.id}`} style={{ textDecoration: 'none' }}>
              <button
                disabled={!isAvailable}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 14px', borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: 500, minHeight: 44,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  background: isAvailable ? '#C8FF00' : '#E0E0E0',
                  color: isAvailable ? '#0a0a0a' : '#757575',
                  transition: 'opacity 0.15s',
                }}
              >
                {isAvailable ? 'Réserver' : 'Indisponible'}
                {isAvailable && <ArrowRight size={14} strokeWidth={1.5} />}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
