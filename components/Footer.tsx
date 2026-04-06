import Link from 'next/link'
import { Zap, MessageCircle, MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid rgba(0,0,0,0.08)',
      background: '#0a0a0a',
      color: '#ffffff',
      padding: '48px 24px 32px',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{
                width: 28,
                height: 28,
                background: '#C8FF00',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Zap size={15} strokeWidth={2} color="#0a0a0a" />
              </div>
              <span style={{ fontSize: 17, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.03em' }}>
                volt.
              </span>
            </Link>
            <p style={{ fontSize: 13, color: '#757575', lineHeight: 1.6, maxWidth: 220 }}>
              Location de scooters électriques à Marrakech. Explorez la ville autrement.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/', label: 'Accueil' },
                { href: '/scooters', label: 'Catalogue' },
                { href: '/guide', label: 'Guide Marrakech' },
                { href: '/reserver', label: 'Réserver' },
                { href: '/compte', label: 'Mon compte' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  fontSize: 14,
                  color: '#E0E0E0',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#E0E0E0', fontSize: 14 }}
              >
                <MessageCircle size={16} strokeWidth={1.5} color="#C8FF00" />
                WhatsApp
              </a>
              <a
                href="mailto:contact@volt-marrakech.ma"
                style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#E0E0E0', fontSize: 14 }}
              >
                <Mail size={16} strokeWidth={1.5} color="#C8FF00" />
                contact@volt-marrakech.ma
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#E0E0E0', fontSize: 14 }}>
                <MapPin size={16} strokeWidth={1.5} color="#C8FF00" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Avenue Mohammed V,<br />Marrakech 40000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ fontSize: 12, color: '#757575' }}>
            © 2024 Volt Marrakech. Tous droits réservés.
          </p>
          <p style={{ fontSize: 12, color: '#757575' }}>
            Fait à Marrakech 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  )
}
