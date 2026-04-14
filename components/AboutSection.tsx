'use client'

import { Award, Wrench, Leaf, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: <Award size={20} strokeWidth={1.5} color="#00B050" />,
    title: 'Expertise reconnue',
    desc: '20 ans dans la location de véhicules au Maroc. On connaît les routes, les quartiers, et les imprévus.',
  },
  {
    icon: <Wrench size={20} strokeWidth={1.5} color="#00B050" />,
    title: 'Flotte premium entretenue',
    desc: 'Chaque scooter est contrôlé, nettoyé et rechargé chaque jour. Vous partez avec un véhicule comme neuf.',
  },
  {
    icon: <Leaf size={20} strokeWidth={1.5} color="#00B050" />,
    title: 'Zéro émission, 100% plaisir',
    desc: 'Silencieux dans la médina, agile dans Guéliz, parfait pour la Palmeraie.',
  },
  {
    icon: <MessageCircle size={20} strokeWidth={1.5} color="#00B050" />,
    title: 'Assistance humaine, vraie',
    desc: 'Pas de chatbot. Un numéro WhatsApp, une équipe locale, une réponse en moins de 10 minutes.',
  },
]

const keyFigures = [
  { value: '20 ans', label: "D'expérience" },
  { value: '+1 000', label: 'Clients satisfaits' },
  { value: '0g', label: 'CO₂ émis' },
  { value: '7j/7', label: 'Assistance' },
]

export default function AboutSection() {
  return (
    <section style={{ padding: '120px 24px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          className="about-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}
        >
          {/* Left */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
              letterSpacing: '0.15em', marginBottom: 16,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Pourquoi Keewee
            </p>
            <h2 style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: 28,
              lineHeight: 1.1,
            }}>
              20 ans de terrain.<br />Une nouvelle façon de rouler.
            </h2>
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Keewee est né d&apos;une conviction simple : la meilleure façon de découvrir Marrakech, c&apos;est à son propre rythme. Forts de 20 ans d&apos;expérience dans la location de véhicules au Maroc, nous avons embrassé l&apos;électrique.
            </p>
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Chaque scooter est inspecté et rechargé quotidiennement. Chaque client repart avec un casque homologué, un antivol, et un numéro WhatsApp actif 7j/7.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 48 }}>
              {keyFigures.map((fig, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em',
                    color: '#ffffff', lineHeight: 1, marginBottom: 6,
                  }}>
                    {fig.value}
                  </div>
                  <div style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  }}>
                    {fig.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2x2 feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                padding: '28px 24px',
                border: '0.5px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(0,176,80,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <p style={{
                  fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {f.title}
                </p>
                <p style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
