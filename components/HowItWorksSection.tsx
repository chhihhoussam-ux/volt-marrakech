'use client'

import { Search, MessageCircle, Bike } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <Search size={22} strokeWidth={1.5} color="#00B050" />,
    title: 'Choisissez votre scooter',
    desc: 'Parcourez notre flotte en ligne et sélectionnez le modèle qui vous correspond.',
  },
  {
    number: '02',
    icon: <MessageCircle size={22} strokeWidth={1.5} color="#00B050" />,
    title: 'Réservez en ligne ou sur WhatsApp',
    desc: 'Quelques clics suffisent. On vous confirme en moins de 10 minutes.',
  },
  {
    number: '03',
    icon: <Bike size={22} strokeWidth={1.5} color="#00B050" />,
    title: 'Yallah, on roule !',
    desc: 'On vous livre le scooter à votre hôtel ou riad, casque et antivol en main.',
  },
]

export default function HowItWorksSection() {
  return (
    <section style={{ padding: '120px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Simple comme bonjour
          </p>
          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
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
              padding: '48px 36px',
              background: '#F5F5F5',
              borderRadius: 12,
              position: 'relative',
            }}>
              {/* Decorative number */}
              <div style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 80, fontWeight: 700, letterSpacing: '-0.05em',
                color: '#00B050', opacity: 0.15, lineHeight: 1,
                position: 'absolute', top: 24, right: 28, userSelect: 'none',
              }}>
                {step.number}
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
              }}>
                {step.icon}
              </div>
              <p style={{
                fontSize: 17, fontWeight: 500, color: '#0a0a0a', marginBottom: 12, letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                {step.title}
              </p>
              <p style={{
                fontSize: 14, color: '#757575', lineHeight: 1.7,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
