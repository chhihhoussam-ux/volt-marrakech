import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import FeaturedScooters from '@/components/FeaturedScooters'
import TarifsSection from '@/components/TarifsSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title: 'Keewee — Location de scooters électriques à Marrakech | Yallah, Keewee !',
  description:
    "Louez un scooter électrique à Marrakech avec Keewee. 20 ans d'expérience dans la mobilité, flotte premium, réservation en ligne. Explorez la médina, Guéliz et les jardins à votre rythme. Dès 60 MAD.",
  openGraph: {
    title: 'Keewee — Location de scooters électriques à Marrakech | Yallah, Keewee !',
    description: "Louez un scooter électrique à Marrakech avec Keewee. Flotte premium, livraison à domicile. Dès 60 MAD.",
  },
}

export default function HomePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Keewee',
    description: 'Location de scooters électriques à Marrakech',
    url: 'https://keewee.ma',
    telephone: '+212600000000',
    email: 'contact@keewee.ma',
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

      <AboutSection />

      <TarifsSection />

      <HowItWorksSection />

      <TestimonialsSection />

      <FAQSection />

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
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#0a0a0a',
                marginBottom: 16,
                lineHeight: 1.1,
              }}>
                Prêt à explorer<br />Marrakech autrement ?
              </h2>
              <p style={{
                fontSize: 16, color: 'rgba(0,0,0,0.6)', maxWidth: 400,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                Réservez votre scooter en quelques clics. Livraison à votre hôtel, casque inclus, support 7j/7.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 28px', background: '#0a0a0a', border: 'none',
                  borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  Réserver maintenant <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 28px', background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
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
