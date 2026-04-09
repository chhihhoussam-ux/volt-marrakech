'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Faut-il un permis pour louer un scooter électrique à Marrakech ?',
    a: "Pour les scooters de moins de 50cc électriques, le permis B suffit. Pour les modèles plus puissants, un permis A peut être demandé.",
  },
  {
    q: "Quelle est l'autonomie des scooters Rouli ?",
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
    q: "Rouli, c'est quoi exactement ?",
    a: "Rouli, c'est roule en darija marocaine — l'invitation à avancer, explorer, bouger. 20 ans d'expérience dans la mobilité au Maroc, reconvertis au service de la balade électrique.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Questions fréquentes
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a' }}>
            Tout ce que vous voulez savoir avant de rouler.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 0', gap: 16, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  {faq.q}
                </span>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                  background: open === i ? '#0a0a0a' : '#F5F5F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    color={open === i ? '#C8FF00' : '#757575'}
                    style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </div>
              </button>
              {open === i && (
                <p style={{ fontSize: 14, color: '#757575', lineHeight: 1.7, paddingBottom: 20 }}>
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
