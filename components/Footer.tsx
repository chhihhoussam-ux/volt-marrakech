import Link from 'next/link'
import { MessageCircle, MapPin, Mail } from 'lucide-react'

const sf = 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif'

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      color: '#ffffff',
      padding: '64px 20px 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          marginBottom: 56,
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
              <span style={{
                fontFamily: sf,
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}>
                almone.
              </span>
            </Link>
            <p style={{
              fontSize: 12, fontWeight: 500, color: 'var(--accent)', marginBottom: 10,
              fontFamily: sf, letterSpacing: '0.04em',
            }}>
              Yallah, Almone !
            </p>
            <p style={{
              fontSize: 13, color: '#757575', lineHeight: 1.7, maxWidth: 280,
              fontFamily: sf,
            }}>
              Explorez la ville rouge à votre rythme avec nos scooters électriques. Réservation en ligne, livraison à domicile, assistance 7j/7.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, color: '#757575', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 16,
              fontFamily: sf,
            }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { href: '/', label: 'Accueil' },
                { href: '/scooters', label: 'Catalogue' },
                { href: '/guide', label: 'Guide Marrakech' },
                { href: '/reserver', label: 'Réserver' },
                { href: '/contact', label: 'Contact' },
                { href: '/compte', label: 'Mon compte' },
                { href: '/mentions-legales', label: 'Mentions légales' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  fontSize: 15,
                  lineHeight: 2,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontFamily: sf,
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
              letterSpacing: '0.12em', marginBottom: 16,
              fontFamily: sf,
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
                  color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: sf,
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} color="var(--accent)" style={{ flexShrink: 0 }} />
                WhatsApp
              </a>
              <a
                href="mailto:contact@almone-scooter.com"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: sf,
                  wordBreak: 'break-word', overflowWrap: 'break-word',
                }}
              >
                <Mail size={16} strokeWidth={1.5} color="var(--accent)" style={{ flexShrink: 0 }} />
                <span>contact@almone-scooter.com</span>
              </a>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: sf,
                wordBreak: 'break-word', overflowWrap: 'break-word',
              }}>
                <MapPin size={16} strokeWidth={1.5} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Avenue Mohammed V,<br />Marrakech 40000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 28,
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: '#757575', fontFamily: sf, marginBottom: 4 }}>
            © 2025 Almone. Tous droits réservés.
          </p>
          <p style={{ fontSize: 12, color: '#757575', fontFamily: sf }}>
            Fait à Marrakech
          </p>
        </div>
      </div>
    </footer>
  )
}
