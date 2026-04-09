const reviews = [
  {
    text: "On a loué deux scooters pour 3 jours. L'équipe nous a livré directement à notre riad, tout était impeccable. La carte des spots est un vrai plus !",
    author: 'Sophie & Marc',
    location: 'Lyon',
  },
  {
    text: "Impossible d'imaginer visiter Marrakech autrement maintenant. Silencieux, pratique, et on se faufile partout dans la médina.",
    author: 'Karim B.',
    location: 'Casablanca',
  },
  {
    text: "Service professionnel, scooter en parfait état. Ça fait plaisir de voir une entreprise locale avec ce niveau d'exigence.",
    author: 'Anna T.',
    location: 'Amsterdam',
  },
]

export default function TestimonialsSection() {
  return (
    <section style={{ padding: '80px 24px', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Ce qu&apos;ils en disent
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#0a0a0a' }}>
            Ils ont roulé avec Rouli.
          </h2>
        </div>

        <div
          className="reviews-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}
        >
          {reviews.map((review, i) => (
            <div key={i} style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '28px',
              border: '0.5px solid rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#C8FF00" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 14, color: '#0a0a0a', lineHeight: 1.7, flex: 1 }}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>{review.author}</p>
                <p style={{ fontSize: 12, color: '#757575' }}>{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
