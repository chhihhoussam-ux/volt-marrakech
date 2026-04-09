'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
    <>
      <style>{`
        .hero-h1 { font-size: clamp(72px, 10vw, 140px); }
        .hero-text { padding-left: 64px; padding-bottom: 80px; padding-right: 24px; }
        @media (max-width: 768px) {
          .hero-h1 { font-size: clamp(52px, 12vw, 72px); }
          .hero-text { padding-left: 24px; padding-bottom: 60px; }
        }
      `}</style>

      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${bg}')`,
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />

        {/* Content — flex column, pushes text to bottom then stats bar */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          {/* Text block */}
          <div className="hero-text">
            {/* Eyebrow */}
            <p style={{
              fontSize: 12,
              letterSpacing: '0.15em',
              color: '#ffffff',
              opacity: 0.6,
              textTransform: 'uppercase',
              marginBottom: 24,
              fontWeight: 400,
            }}>
              100% électrique · Zéro émission · Marrakech
            </p>

            {/* H1 */}
            <h1
              className="hero-h1"
              style={{
                fontWeight: 500,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                marginBottom: 40,
              }}
            >
              <span style={{ color: '#ffffff' }}>Yallah, </span>
              <span style={{ color: '#C8FF00' }}>Rouli !</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 16,
              color: '#ffffff',
              opacity: 0.65,
              maxWidth: 480,
              lineHeight: 1.6,
              marginBottom: 48,
              fontWeight: 400,
            }}>
              La médina à votre rythme. La ville rouge sous un nouvel angle. Louez un scooter électrique et explorez Marrakech librement — silencieux, propre, sans effort.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', background: '#C8FF00', border: 'none',
                  borderRadius: 8, fontSize: 15, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Réserver maintenant
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
              <Link href="/scooters" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', background: 'transparent',
                  border: '0.5px solid rgba(255,255,255,0.3)',
                  borderRadius: 8, fontSize: 15, fontWeight: 400, color: '#ffffff', cursor: 'pointer',
                }}>
                  Voir nos scooters
                </button>
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="hero-stats-bar"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              borderTop: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '20px 24px',
                borderRight: i < stats.length - 1 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 2 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
