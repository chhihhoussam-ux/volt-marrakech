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
  title: 'Rouli — Location de scooters électriques à Marrakech | Yallah, Rouli !',
  description:
    "Louez un scooter électrique à Marrakech avec Rouli. 20 ans d'expérience dans la mobilité, flotte premium, réservation en ligne. Explorez la médina, Guéliz et les jardins à votre rythme. Dès 60 MAD.",
  openGraph: {
    title: 'Rouli — Location de scooters électriques à Marrakech | Yallah, Rouli !',
    description: "Louez un scooter électrique à Marrakech avec Rouli. Flotte premium, livraison à domicile. Dès 60 MAD.",
  },
}

export default function HomePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Rouli',
    description: 'Location de scooters électriques à Marrakech',
    url: 'https://rouli.ma',
    telephone: '+212600000000',
    email: 'contact@rouli.ma',
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
      <section id="contact" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{
            background: '#0a0a0a', borderRadius: 16, padding: '56px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32,
          }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 12 }}>
                Prêt à explorer<br />Marrakech autrement ?
              </h2>
              <p style={{ fontSize: 15, color: '#757575', maxWidth: 380 }}>
                Réservez votre scooter en quelques clics. Livraison à votre hôtel, casque inclus, support 7j/7.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px', background: '#C8FF00', border: 'none',
                  borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Réserver maintenant <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px', background: 'transparent',
                  border: '0.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
                }}>
                  <MessageCircle size={16} strokeWidth={1.5} /> Nous contacter sur WhatsApp
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
