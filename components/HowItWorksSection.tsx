'use client'

import { ImageIcon } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'

const steps = [
  {
    number: '01',
    title: 'Choisissez votre scooter',
    desc: 'Parcourez notre flotte en ligne et sélectionnez le modèle qui vous correspond.',
  },
  {
    number: '02',
    title: 'Réservez en ligne ou sur WhatsApp',
    desc: 'Quelques clics suffisent. On vous confirme en moins de 10 minutes.',
  },
  {
    number: '03',
    title: 'Yallah, on roule !',
    desc: 'On vous livre le scooter à votre hôtel ou riad, casque et antivol en main.',
  },
]

export default function HowItWorksSection() {
  const s = useSettings()
  const stepImages = [s.etape1_image_url, s.etape2_image_url, s.etape3_image_url]

  return (
    <section style={{ padding: '120px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#FF6700', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            Simple comme bonjour
          </p>
          <h2 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}>
            En route en 3 étapes.
          </h2>
        </div>

        <div
          className="how-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 24 }}
        >
          {steps.map((step, i) => (
            <div key={i} style={{
              background: '#ffffff',
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Step image — edge to edge */}
              <div style={{
                width: '100%', height: 220, overflow: 'hidden',
                background: stepImages[i] ? 'transparent' : '#EBEBEB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {stepImages[i] ? (
                  <img src={stepImages[i]} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={28} strokeWidth={1} color="#D0D0D0" />
                )}
              </div>
              {/* Card content */}
              <div style={{ padding: '32px 36px 40px' }}>
                <p style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
                  color: '#FF6700', textTransform: 'uppercase', marginBottom: 6,
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  Étape {step.number}
                </p>
                <p style={{
                  fontSize: 16, fontWeight: 600, color: '#0a0a0a', marginBottom: 12, letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  {step.title}
                </p>
                <p style={{
                  fontSize: 14, color: '#757575', lineHeight: 1.7,
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
