import { Search, MessageCircle, Bike } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <Search size={22} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Choisissez votre scooter',
    desc: 'Parcourez notre flotte en ligne et sélectionnez le modèle qui vous correspond.',
  },
  {
    number: '02',
    icon: <MessageCircle size={22} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Réservez en ligne ou sur WhatsApp',
    desc: 'Quelques clics suffisent. On vous confirme en moins de 10 minutes.',
  },
  {
    number: '03',
    icon: <Bike size={22} strokeWidth={1.5} color="#C8FF00" />,
    title: 'Yallah, on roule !',
    desc: 'On vous livre le scooter à votre hôtel ou riad, casque et antivol en main.',
  },
]

export default function HowItWorksSection() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Simple comme bonjour
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a' }}>
            En route en 3 étapes.
          </h2>
        </div>

        <div
          className="how-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 2 }}
        >
          {steps.map((step, i) => (
            <div key={i} style={{
              padding: '40px 32px',
              border: '0.5px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              background: '#ffffff',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 24, right: 24,
                fontSize: 48, fontWeight: 500, letterSpacing: '-0.06em',
                color: 'rgba(0,0,0,0.04)', lineHeight: 1, userSelect: 'none',
              }}>
                {step.number}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                {step.icon}
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {step.title}
              </p>
              <p style={{ fontSize: 14, color: '#757575', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
