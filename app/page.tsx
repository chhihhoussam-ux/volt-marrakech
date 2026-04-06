import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import FeaturedScooters from '@/components/FeaturedScooters'
import TarifsSection from '@/components/TarifsSection'

export const metadata: Metadata = {
  title: 'Location de scooters électriques à Marrakech',
  description:
    'Explorez Marrakech autrement avec Volt. Location de scooters électriques silencieux et propres, à partir de 170 MAD/jour. Réservation en ligne.',
  openGraph: {
    title: 'Volt Marrakech — Location de scooters électriques',
    description: 'Explorez Marrakech autrement. Scooters électriques à partir de 170 MAD/jour.',
  },
}

export default function HomePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Volt Marrakech',
    description: 'Location de scooters électriques à Marrakech',
    url: 'https://volt-marrakech.ma',
    telephone: '+212600000000',
    email: 'contact@volt-marrakech.ma',
    image: 'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?w=1600&q=80',
    priceRange: '170-300 MAD',
    currenciesAccepted: 'MAD',
    paymentAccepted: 'Cash, Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Avenue Mohammed V',
      addressLocality: 'Marrakech',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.6295',
      longitude: '-7.9811',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: ['https://wa.me/212600000000'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />

      <HeroSection />

      <FeaturedScooters />

      <AboutSection />

      <TarifsSection />

      {/* ─── CTA section ─── */}
      <section id="contact" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{
            background: '#0a0a0a', borderRadius: 16, padding: '56px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32,
          }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 12 }}>
                Une question ?<br />On est là.
              </h2>
              <p style={{ fontSize: 15, color: '#757575', maxWidth: 360 }}>
                Notre équipe est disponible 7j/7 sur WhatsApp pour vous aider à choisir votre scooter et organiser votre visite.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px', background: '#C8FF00', border: 'none',
                  borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
                </button>
              </a>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px', background: 'transparent',
                  border: '0.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
                }}>
                  Réserver en ligne <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
