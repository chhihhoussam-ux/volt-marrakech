'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Faut-il un permis pour louer un scooter électrique à Marrakech ?',
    a: "Pour les scooters de moins de 50cc électriques, le permis B suffit. Pour les modèles plus puissants, un permis A peut être demandé.",
  },
  {
    q: "Quelle est l'autonomie des scooters Keewee ?",
    a: "Entre 60 et 120 km selon le modèle. Pour une journée classique à Marrakech, c'est largement suffisant.",
  },
  {
    q: "Livrez-vous à l'hôtel ou au riad ?",
    a: "Oui, nous livrons et récupérons le scooter directement à votre adresse dans Marrakech.",
  },
  {
    q: "Que se passe-t-il en cas de panne ?",
    a: "Notre équipe est joignable 7j/7 par WhatsApp. Nous intervenons ou remplaçons le scooter dans les meilleurs délais.",
  },
  {
    q: "Peut-on louer deux scooters pour un couple ?",
    a: "Absolument. Vous pouvez réserver plusieurs véhicules simultanément depuis notre site ou via WhatsApp.",
  },
  {
    q: "Keewee, c'est quoi exactement ?",
    a: "Keewee, c'est l'invitation à avancer, explorer, bouger. 20 ans d'expérience dans la mobilité au Maroc, reconvertis au service de la balade électrique.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ padding: '120px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Questions fréquentes
          </p>
          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}>
            Tout ce que vous voulez savoir avant de rouler.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '22px 0', gap: 16, textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  fontSize: 16, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em',
                }}>
                  {faq.q}
                </span>
                <div style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                  background: open === i ? '#00B050' : '#F5F5F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  {open === i
                    ? <Minus size={14} strokeWidth={2} color="#ffffff" />
                    : <Plus size={14} strokeWidth={2} color="#757575" />
                  }
                </div>
              </button>
              {open === i && (
                <p style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  fontSize: 15, color: '#757575', lineHeight: 1.7, paddingBottom: 22,
                }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
