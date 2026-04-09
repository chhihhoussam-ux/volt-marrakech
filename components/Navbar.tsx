'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/settings-context'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logo_url: logoUrl } = useSettings()

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const links = [
    { href: '/scooters', label: 'Scooters' },
    { href: '/guide', label: 'Guide' },
    { href: '/#tarifs', label: 'Tarifs' },
    { href: '/#contact', label: 'Contact' },
    { href: '/compte', label: 'Mon compte' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        }}
      >
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Rouli" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{
                  width: 28, height: 28, background: '#C8FF00', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Zap size={15} strokeWidth={2} color="#0a0a0a" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                  rouli.
                </span>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            {links.filter(l => l.href !== '/compte').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  color: pathname === link.href ? '#0a0a0a' : '#757575',
                  textDecoration: 'none',
                  fontWeight: pathname === link.href ? 500 : 400,
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
            <Link href="/compte" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 14, color: '#757575' }}>Mon compte</span>
            </Link>
            <Link href="/reserver" style={{ textDecoration: 'none' }}>
              <button style={{
                height: 36, padding: '0 16px', background: '#C8FF00', border: 'none',
                borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
              }}>
                Réserver
              </button>
            </Link>
          </div>

          {/* Mobile hamburger — only on < md */}
          <button
            className="md:hidden touch-target"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            }}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px 40px',
            overflowY: 'auto',
          }}
        >
          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: pathname === link.href ? '#0a0a0a' : '#757575',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '0.5px solid rgba(0,0,0,0.05)',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 56,
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#C8FF00', flexShrink: 0,
                  }} />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA at bottom */}
          <div style={{ paddingTop: 32 }}>
            <Link href="/reserver" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '16px 24px', background: '#C8FF00', border: 'none',
                borderRadius: 12, fontSize: 16, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                minHeight: 56,
              }}>
                Réserver maintenant
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
