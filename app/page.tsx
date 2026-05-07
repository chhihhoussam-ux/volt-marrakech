import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import FeaturedScooters from '@/components/FeaturedScooters'
import TarifsSection from '@/components/TarifsSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FAQSection from '@/components/FAQSection'
import dynamic from 'next/dynamic'
const MapSection = dynamic(() => import('@/components/MapSection'), {
  ssr: false,
  loading: () => <div style={{ height: 480, background: '#F5F5F5' }} />,
})

export const metadata: Metadata = {
  title: 'Almone — Location de scooters électriques à Marrakech | Yallah, Almone !',
  description:
    "Louez un scooter électrique à Marrakech avec Almone. 20 ans d'expérience dans la mobilité, flotte premium, réservation en ligne. Explorez la médina, Guéliz et les jardins à votre rythme. Dès 60 MAD.",
  openGraph: {
    title: 'Almone — Location de scooters électriques à Marrakech | Yallah, Almone !',
    description: "Louez un scooter électrique à Marrakech avec Almone. Flotte premium, livraison à domicile. Dès 60 MAD.",
  },
}

export default function HomePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Almone',
    description: 'Location de scooters électriques à Marrakech',
    url: 'https://www.almone-scooter.com',
    telephone: '+212600000000',
    email: 'contact@almone-scooter.com',
    image: 'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?w=1600&q=80',
    priceRange: '60-950 MAD',
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

<TarifsSection />

      <HowItWorksSection />

<FAQSection />

      <MapSection />

      {/* ─── CTA final ─── */}
      <section id="contact" style={{ padding: '0 24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'var(--accent)',
            padding: '80px 64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 40,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#0a0a0a',
                marginBottom: 16,
                lineHeight: 1.1,
              }}>
                Prêt à bouger<br />plus librement ?
              </h2>
              <p style={{
                fontSize: 16, color: 'rgba(0,0,0,0.6)', maxWidth: 400,
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
              }}>
                Réservez simplement votre scooter et profitez de Marrakech sans dépendre des bouchons.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 28px', background: '#0a0a0a', border: 'none',
                  borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  Réserver un scooter <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 28px', background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
