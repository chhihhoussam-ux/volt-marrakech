'use client'

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
    <section style={{ padding: '120px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#00B050', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Ce qu&apos;ils en disent
          </p>
          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
          }}>
            Ils ont roulé avec Keewee.
          </h2>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 20 }}
        >
          {reviews.map((review, i) => (
            <div key={i} style={{
              background: '#F5F5F5',
              borderRadius: 12,
              padding: '36px 32px',
              display: 'flex', flexDirection: 'column', gap: 20,
              position: 'relative',
            }}>
              {/* Decorative quote */}
              <div style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 80, fontWeight: 700, color: '#00B050', opacity: 0.15,
                lineHeight: 0.8, position: 'absolute', top: 20, left: 28, userSelect: 'none',
              }}>
                &ldquo;
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#00B050" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{
                fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, flex: 1,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p style={{
                  fontSize: 14, fontWeight: 500, color: '#0a0a0a',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {review.author}
                </p>
                <p style={{
                  fontSize: 12, color: '#757575',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {review.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
