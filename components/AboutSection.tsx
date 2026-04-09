'use client'

import { Award, Wrench, Leaf, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: <Award size={20} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Expertise reconnue',
    desc: '20 ans dans la location de véhicules au Maroc. On connaît les routes, les quartiers, et les imprévus.',
  },
  {
    icon: <Wrench size={20} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Flotte premium entretenue',
    desc: 'Chaque scooter est contrôlé, nettoyé et rechargé chaque jour. Vous partez avec un véhicule comme neuf.',
  },
  {
    icon: <Leaf size={20} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Zéro émission, 100% plaisir',
    desc: 'Silencieux dans la médina, agile dans Guéliz, parfait pour la Palmeraie.',
  },
  {
    icon: <MessageCircle size={20} strokeWidth={1.5} color="#C8FF00" />,
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
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Pourquoi Rouli
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 24, lineHeight: 1.15 }}>
            20 ans de terrain.<br />Une nouvelle façon de rouler.
          </h2>
          <p style={{ fontSize: 15, color: '#757575', lineHeight: 1.8, marginBottom: 16, maxWidth: 640 }}>
            Rouli est né d&apos;une conviction simple : la meilleure façon de découvrir Marrakech, c&apos;est à son propre rythme. Forts de 20 ans d&apos;expérience dans la location de véhicules au Maroc, nous avons décidé de tourner la page de l&apos;essence pour embrasser pleinement l&apos;électrique. Même exigence, même fiabilité, même service — mais en version propre, silencieuse et libre.
          </p>
          <p style={{ fontSize: 15, color: '#757575', lineHeight: 1.8, maxWidth: 640 }}>
            Chaque scooter est inspecté et rechargé quotidiennement. Chaque client repart avec un casque homologué, un antivol, et un numéro WhatsApp actif 7j/7. Parce qu&apos;une panne ne prend pas de rendez-vous, notre équipe est toujours là.
          </p>
        </div>

        {/* Feature cards */}
        <div
          className="about-features-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 16, marginBottom: 48 }}
        >
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#0a0a0a',
              borderRadius: 12,
              padding: '28px 24px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(200,255,0,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.01em' }}>
                {f.title}
              </p>
              <p style={{ fontSize: 13, color: '#757575', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Key figures */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: '#F5F5F5', borderRadius: 12, overflow: 'hidden',
        }}
          className="about-figures-grid"
        >
          {keyFigures.map((fig, i) => (
            <div key={i} style={{
              padding: '28px 24px', textAlign: 'center',
              borderRight: i < keyFigures.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.04em', color: '#0a0a0a', marginBottom: 4 }}>
                {fig.value}
              </div>
              <div style={{ fontSize: 12, color: '#757575' }}>{fig.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
