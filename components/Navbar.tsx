'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/settings-context'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logo_url: logoUrl } = useSettings()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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
          height: 60,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid #E0E0E0',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Keewee" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <span style={{
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#0a0a0a',
                letterSpacing: '-0.03em',
              }}>
                keewee.
              </span>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {links.filter(l => l.href !== '/compte').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-item${pathname === link.href ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
            <Link href="/compte" style={{ textDecoration: 'none' }}>
              <span style={{
                fontSize: 14,
                color: '#757575',
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
              }}>
                Mon compte
              </span>
            </Link>
            <Link href="/reserver" style={{ textDecoration: 'none' }}>
              <button className="btn-reserve">Réserver</button>
            </Link>
          </div>

          {/* Mobile hamburger */}
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
            top: 60,
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
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: pathname === link.href ? '#0a0a0a' : '#757575',
                  textDecoration: 'none',
                  padding: '14px 0',
                  borderBottom: '0.5px solid rgba(0,0,0,0.05)',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 60,
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--accent)', flexShrink: 0,
                  }} />
                )}
              </Link>
            ))}
          </nav>

          <div style={{ paddingTop: 32 }}>
            <Link href="/reserver" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '16px 24px', background: 'var(--accent)', border: 'none',
                borderRadius: 12, fontSize: 16, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
                minHeight: 56,
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
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
