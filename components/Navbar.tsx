'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '@/lib/settings-context'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logo_url: logoUrl } = useSettings()

  const links = [
    { href: '/scooters', label: 'Scooters' },
    { href: '/guide', label: 'Guide' },
    { href: '/#tarifs', label: 'Tarifs' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
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
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo — dynamic or fallback text */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Volt"
              style={{ height: 28, width: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <>
              <div style={{
                width: 28,
                height: 28,
                background: '#C8FF00',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Zap size={15} strokeWidth={2} color="#0a0a0a" />
              </div>
              <span style={{ fontSize: 17, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                volt.
              </span>
            </>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                color: pathname === link.href ? '#0a0a0a' : '#757575',
                textDecoration: 'none',
                transition: 'color 0.15s',
                fontWeight: pathname === link.href ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/compte" style={{ textDecoration: 'none' }} className="hidden md:block">
            <span style={{ fontSize: 14, color: '#757575' }}>Mon compte</span>
          </Link>
          <Link href="/reserver" style={{ textDecoration: 'none' }}>
            <button style={{
              height: 36,
              padding: '0 16px',
              background: '#C8FF00',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#0a0a0a',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}>
              Réserver
            </button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#0a0a0a',
            }}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }} className="md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 15,
                color: '#0a0a0a',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/compte"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: 15, color: '#757575', textDecoration: 'none' }}
          >
            Mon compte
          </Link>
        </div>
      )}
    </nav>
  )
}
