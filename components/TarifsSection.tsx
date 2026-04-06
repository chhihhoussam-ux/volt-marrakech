'use client'

import Link from 'next/link'
import { Clock, Calendar, MapPin, Star } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'
import { SETTINGS_DEFAULTS } from '@/lib/settings'

const ICONS = [
  <Clock key="clock" size={20} strokeWidth={1.5} />,
  <Calendar key="calendar" size={20} strokeWidth={1.5} />,
  <MapPin key="mappin" size={20} strokeWidth={1.5} />,
]

export default function TarifsSection() {
  const s = useSettings()

  const tarifs = [
    {
      duration: s.price1_duration || SETTINGS_DEFAULTS.price1_duration,
      price:    s.price1_price    || SETTINGS_DEFAULTS.price1_price,
      features: (s.price1_features || SETTINGS_DEFAULTS.price1_features).split('|').filter(Boolean),
      accent: false,
    },
    {
      duration: s.price2_duration || SETTINGS_DEFAULTS.price2_duration,
      price:    s.price2_price    || SETTINGS_DEFAULTS.price2_price,
      features: (s.price2_features || SETTINGS_DEFAULTS.price2_features).split('|').filter(Boolean),
      accent: true,
    },
    {
      duration: s.price3_duration || SETTINGS_DEFAULTS.price3_duration,
      price:    s.price3_price    || SETTINGS_DEFAULTS.price3_price,
      features: (s.price3_features || SETTINGS_DEFAULTS.price3_features).split('|').filter(Boolean),
      accent: false,
    },
  ]

  return (
    <section id="tarifs" style={{ padding: '80px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Nos formules
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em' }}>
            Tarifs simples et transparents
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {tarifs.map((tarif, i) => (
            <div key={i} style={{
              borderRadius: 12,
              border: tarif.accent ? '1.5px solid #C8FF00' : '0.5px solid rgba(0,0,0,0.08)',
              background: tarif.accent ? '#0a0a0a' : '#ffffff',
              padding: '32px',
              position: 'relative',
            }}>
              {tarif.accent && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#C8FF00', color: '#0a0a0a', padding: '3px 12px',
                  borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  Le plus populaire
                </div>
              )}
              <div style={{
                width: 40, height: 40,
                background: tarif.accent ? 'rgba(200,255,0,0.12)' : '#F5F5F5',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tarif.accent ? '#C8FF00' : '#757575', marginBottom: 20,
              }}>
                {ICONS[i]}
              </div>
              <p style={{ fontSize: 13, color: '#757575', marginBottom: 4 }}>{tarif.duration}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: tarif.accent ? 'rgba(255,255,255,0.5)' : '#757575' }}>
                  à partir de{' '}
                </span>
                <span style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.04em', color: tarif.accent ? '#ffffff' : '#0a0a0a' }}>
                  {tarif.price}
                </span>
                <span style={{ fontSize: 14, color: '#757575', marginLeft: 4 }}>MAD</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {tarif.features.map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 16, height: 16,
                      background: tarif.accent ? 'rgba(200,255,0,0.15)' : '#F5F5F5',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Star size={9} strokeWidth={2} color={tarif.accent ? '#C8FF00' : '#757575'} fill={tarif.accent ? '#C8FF00' : '#757575'} />
                    </div>
                    <span style={{ fontSize: 13, color: tarif.accent ? '#E0E0E0' : '#0a0a0a' }}>{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/reserver" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', padding: '12px', borderRadius: 8,
                  border: tarif.accent ? 'none' : '0.5px solid rgba(0,0,0,0.12)',
                  background: tarif.accent ? '#C8FF00' : 'transparent',
                  color: '#0a0a0a', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}>
                  Choisir cette formule
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
