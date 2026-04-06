'use client'

import Link from 'next/link'
import { ArrowRight, Users, Leaf, Shield } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'

const metrics = [
  { icon: <Users size={18} strokeWidth={1.5} color="#C8FF00" />, value: '500+', label: 'Clients satisfaits' },
  { icon: <Leaf size={18} strokeWidth={1.5} color="#C8FF00" />, value: '0', label: 'Émissions CO₂' },
  { icon: <Shield size={18} strokeWidth={1.5} color="#C8FF00" />, value: '5 ans', label: "D'expérience locale" },
]

export default function AboutSection() {
  const { about_text } = useSettings()

  return (
    <section style={{ padding: '80px 24px' }}>
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
        className="about-grid"
      >
        {/* Text left */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Notre histoire
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 24, lineHeight: 1.1 }}>
            Une équipe passionnée<br />par Marrakech.
          </h2>
          <p style={{ fontSize: 15, color: '#757575', lineHeight: 1.8, marginBottom: 32 }}>
            {about_text}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/guide" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 20px', background: '#0a0a0a', border: 'none',
                borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
              }}>
                Guide Marrakech <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </Link>
          </div>
        </div>

        {/* Visual right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: 16,
          padding: '48px 32px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 320,
        }}>
          {/* Decorative number */}
          <div style={{
            position: 'absolute',
            fontSize: 160,
            fontWeight: 500,
            letterSpacing: '-0.08em',
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
            userSelect: 'none',
            right: -16,
            bottom: -16,
          }}>
            5+
          </div>
          {/* Key metrics */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {metrics.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(200,255,0,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.03em' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 12, color: '#757575' }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
