'use client'

import Link from 'next/link'
import { Battery, ArrowRight, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Scooter } from '@/lib/types'

interface ScooterCardProps {
  scooter: Scooter
  showReserveButton?: boolean
}

export default function ScooterCard({ scooter, showReserveButton = true }: ScooterCardProps) {
  const isAvailable = scooter.status === 'available'
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      style={{
        borderRadius: 12,
        background: '#F5F5F5',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Image */}
      <div style={{ height: 220, background: '#EBEBEB', position: 'relative', overflow: 'hidden' }}>
        {scooter.image_url ? (
          <motion.img
            src={scooter.image_url}
            alt={scooter.name}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 0 }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#EBEBEB',
          }}>
            <Zap size={48} strokeWidth={1} color="#D0D0D0" />
          </div>
        )}
        {/* Status badge */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
            background: isAvailable ? 'rgba(0,176,80,0.15)' : 'rgba(220,0,0,0.1)',
            color: isAvailable ? '#004d20' : '#8a0000',
            backdropFilter: 'blur(4px)',
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: isAvailable ? 'var(--accent)' : '#cc0000',
              display: 'inline-block',
            }} />
            {isAvailable ? 'Disponible' : 'Loué'}
          </span>
        </div>

        {/* Hover reserve button — slides up */}
        <AnimatePresence>
          {hovered && showReserveButton && isAvailable && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px',
              }}
            >
              <Link href={`/reserver?scooter=${scooter.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '12px', borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: 500,
                  cursor: 'pointer',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  Réserver <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 20px' }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 3, letterSpacing: '-0.01em',
          }}>
            {scooter.name}
          </h3>
          <p style={{
            fontSize: 12, color: '#757575',
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            {scooter.model}
          </p>
        </div>

        {/* Autonomy */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', background: '#EBEBEB', borderRadius: 8, marginBottom: 16,
        }}>
          <Battery size={15} strokeWidth={1.5} color="#757575" />
          <span style={{
            fontSize: 13, color: '#757575',
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            {scooter.autonomy_km} km d&apos;autonomie
          </span>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
              fontSize: 24, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em',
            }}>
              {scooter.price_per_day.toFixed(0)}
            </span>
            <span style={{
              fontSize: 13, color: '#757575', marginLeft: 4,
              fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            }}>
              MAD/jour
            </span>
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
                  background: isAvailable ? 'var(--accent)' : '#E0E0E0',
                  color: isAvailable ? '#ffffff' : '#757575',
                  transition: 'background 0.2s',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}
              >
                {isAvailable ? 'Réserver' : 'Indisponible'}
                {isAvailable && <ArrowRight size={14} strokeWidth={1.5} />}
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
