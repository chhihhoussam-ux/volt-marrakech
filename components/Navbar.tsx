'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '@/lib/settings-context'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(true) // start true to avoid flash of transparent navbar
  const { logo_url: logoUrl } = useSettings()

  const isHome = pathname === '/'
  // Transparent navbar ONLY on homepage when not scrolled and menu closed
  const isTransparent = isHome && !scrolled && !menuOpen

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    onScroll() // immediately check real scroll position after mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const links = [
    { href: '/scooters', label: 'Scooters' },
    { href: '/guide', label: 'Guide' },
    { href: '/#tarifs', label: 'Tarifs' },
    { href: '/contact', label: 'Contact' },
    { href: '/compte', label: 'Mon compte' },
  ]

  const navBg = isTransparent ? 'transparent' : 'rgba(255,255,255,0.95)'
  const navBorder = isTransparent ? 'transparent' : '#E0E0E0'
  const textColor = isTransparent ? '#ffffff' : '#0a0a0a'
  const linkColor = isTransparent ? 'rgba(255,255,255,0.7)' : '#757575'
  const linkActiveColor = isTransparent ? '#ffffff' : '#0a0a0a'

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
          background: navBg,
          backdropFilter: isTransparent ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(12px)',
          borderBottom: `0.5px solid ${navBorder}`,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div className="nav-inner" style={{
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
              <img src={logoUrl} alt="Almone" className="nav-logo-img"
                style={{ height: 30, width: 'auto', maxWidth: 160, objectFit: 'contain' }} />
            ) : (
              <span style={{
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: textColor,
                letterSpacing: '-0.03em',
                transition: 'color 0.3s',
              }}>
                almone.
              </span>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {links.filter(l => l.href !== '/compte').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                  fontSize: 14,
                  textDecoration: 'none',
                  color: pathname === link.href ? linkActiveColor : linkColor,
                  transition: 'color 0.2s',
                }}
                className={`nav-link-item${pathname === link.href ? ' active' : ''}${isTransparent ? ' nav-link-light' : ''}`}
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
                color: linkColor,
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                transition: 'color 0.3s',
              }}>
                Mon compte
              </span>
            </Link>
            <Link href="/reserver" style={{ textDecoration: 'none' }}>
              <button className="btn-reserve">Réserver</button>
            </Link>
          </div>

          {/* Mobile hamburger — animated lines */}
          <button
            className="md:hidden touch-target"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              position: 'relative',
            }}
          >
            <div style={{ width: 22, height: 16, position: 'relative' }}>
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
                  background: menuOpen ? '#0a0a0a' : textColor, borderRadius: 1,
                  display: 'block', transformOrigin: 'center',
                }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 7, left: 0, width: '100%', height: 2,
                  background: menuOpen ? '#0a0a0a' : textColor, borderRadius: 1,
                  display: 'block',
                }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute', top: 14, left: 0, width: '100%', height: 2,
                  background: menuOpen ? '#0a0a0a' : textColor, borderRadius: 1,
                  display: 'block', transformOrigin: 'center',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
              padding: '32px 24px',
              paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
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
                  padding: '16px 24px', background: '#FF6700', border: 'none',
                  borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#ffffff', cursor: 'pointer',
                  minHeight: 56,
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  Réserver maintenant
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
