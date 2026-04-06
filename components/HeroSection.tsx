'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'
import { SETTINGS_DEFAULTS } from '@/lib/settings'

export default function HeroSection() {
  const s = useSettings()
  const bg = s.hero_image_url || SETTINGS_DEFAULTS.hero_image_url

  const stats = [
    { value: s.stat1_value || SETTINGS_DEFAULTS.stat1_value, label: s.stat1_label || SETTINGS_DEFAULTS.stat1_label },
    { value: s.stat2_value || SETTINGS_DEFAULTS.stat2_value, label: s.stat2_label || SETTINGS_DEFAULTS.stat2_label },
    { value: s.stat3_value || SETTINGS_DEFAULTS.stat3_value, label: s.stat3_label || SETTINGS_DEFAULTS.stat3_label },
    { value: s.stat4_value || SETTINGS_DEFAULTS.stat4_value, label: s.stat4_label || SETTINGS_DEFAULTS.stat4_label },
  ]

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
      }} />
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1120, margin: '0 auto',
          padding: '140px 24px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ maxWidth: 680 }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(200,255,0,0.15)', border: '0.5px solid rgba(200,255,0,0.4)',
            marginBottom: 32,
          }}>
            <Zap size={12} strokeWidth={2} color="#C8FF00" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#C8FF00' }}>
              100% électrique · Zéro émission
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 500, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 24,
            }}
          >
            Explorez Marrakech<br />
            <span style={{ color: '#C8FF00' }}>autrement.</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6, marginBottom: 40, maxWidth: 480,
          }}>
            Location de scooters électriques au cœur de la ville rouge.
            Silencieux, propres, et parfaits pour naviguer dans les ruelles de Marrakech.
          </p>

          <div className="hero-cta-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/reserver" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px', background: '#C8FF00', border: 'none',
                borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                minHeight: 48,
              }}>
                Réserver maintenant
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </Link>
            <Link href="/scooters" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px', background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.3)',
                borderRadius: 10, fontSize: 15, fontWeight: 400, color: '#ffffff', cursor: 'pointer',
                minHeight: 48,
              }}>
                Voir les scooters
              </button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="hero-stats-bar"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderTop: '0.5px solid rgba(255,255,255,0.1)',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{
              padding: '20px 24px',
              borderRight: i < stats.length - 1 ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
