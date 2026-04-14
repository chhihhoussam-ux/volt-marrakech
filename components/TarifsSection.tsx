'use client'

import Link from 'next/link'
import { Clock, Calendar, MapPin, Check } from 'lucide-react'
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
    <section id="tarifs" style={{ padding: '120px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Nos formules
          </p>
          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}>
            Tarifs simples. Aucune mauvaise surprise.
          </h2>
          <p style={{
            fontSize: 16, color: '#757575', lineHeight: 1.7, maxWidth: 520, margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Que vous ayez deux heures devant vous ou une semaine entière, Keewee s&apos;adapte à votre voyage. Tous nos tarifs incluent casque, antivol et assistance.
          </p>
        </div>

        <div
          className="tarifs-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 20 }}
        >
          {tarifs.map((tarif, i) => (
            <div
              key={i}
              style={{
                borderRadius: 12,
                border: tarif.accent ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
                background: tarif.accent ? '#0a0a0a' : '#ffffff',
                padding: '36px',
                position: 'relative',
              }}
            >
              {tarif.accent && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: '#00B050', color: '#ffffff', padding: '4px 14px',
                  borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  Le plus populaire
                </div>
              )}
              <div style={{
                width: 44, height: 44,
                background: tarif.accent ? 'rgba(0,176,80,0.12)' : '#F5F5F5',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tarif.accent ? '#00B050' : '#757575', marginBottom: 24,
              }}>
                {ICONS[i]}
              </div>
              <p style={{
                fontSize: 13, color: tarif.accent ? 'rgba(255,255,255,0.5)' : '#757575', marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                {tarif.duration}
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{
                  fontSize: 13, color: tarif.accent ? 'rgba(255,255,255,0.4)' : '#757575',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  à partir de{' '}
                </span>
                <span style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em',
                  color: tarif.accent ? '#ffffff' : '#0a0a0a',
                }}>
                  {tarif.price}
                </span>
                <span style={{
                  fontSize: 14, color: tarif.accent ? 'rgba(255,255,255,0.4)' : '#757575', marginLeft: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  MAD
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {tarif.features.map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18,
                      background: tarif.accent ? 'rgba(0,176,80,0.15)' : '#F5F5F5',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <Check size={10} strokeWidth={2.5} color="#00B050" />
                    </div>
                    <span style={{
                      fontSize: 14, color: tarif.accent ? 'rgba(255,255,255,0.75)' : '#0a0a0a',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      lineHeight: 1.5,
                    }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/reserver" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', padding: '14px', borderRadius: 8,
                  border: tarif.accent ? 'none' : '0.5px solid rgba(0,0,0,0.12)',
                  background: tarif.accent ? '#00B050' : 'transparent',
                  color: tarif.accent ? '#ffffff' : '#0a0a0a',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
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
