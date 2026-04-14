import Link from 'next/link'
import { MessageCircle, MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      color: '#ffffff',
      padding: '64px 24px 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          gap: 48,
          marginBottom: 56,
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
              <span style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}>
                keewee.
              </span>
            </Link>
            <p style={{
              fontSize: 12, fontWeight: 500, color: 'var(--accent)', marginBottom: 10,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              letterSpacing: '0.04em',
            }}>
              Yallah, Keewee !
            </p>
            <p style={{
              fontSize: 13, color: '#757575', lineHeight: 1.7, maxWidth: 220,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Explorez la ville rouge à votre rythme avec nos scooters électriques. Réservation en ligne, livraison à domicile, assistance 7j/7.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, color: '#757575', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/', label: 'Accueil' },
                { href: '/scooters', label: 'Catalogue' },
                { href: '/guide', label: 'Guide Marrakech' },
                { href: '/reserver', label: 'Réserver' },
                { href: '/compte', label: 'Mon compte' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, color: '#757575', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 20,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}>
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)', fontSize: 14,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} color="var(--accent)" />
                WhatsApp
              </a>
              <a
                href="mailto:contact@keewee.ma"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)', fontSize: 14,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                <Mail size={16} strokeWidth={1.5} color="var(--accent)" />
                contact@keewee.ma
              </a>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                color: 'rgba(255,255,255,0.6)', fontSize: 14,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                <MapPin size={16} strokeWidth={1.5} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Avenue Mohammed V,<br />Marrakech 40000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          paddingTop: 28,
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{
            fontSize: 12, color: '#757575',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            © 2025 Keewee. Tous droits réservés.
          </p>
          <p style={{
            fontSize: 12, color: '#757575',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            Fait à Marrakech 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  )
}
