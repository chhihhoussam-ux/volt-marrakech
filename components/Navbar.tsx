'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSettings } from '@/lib/settings-context'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logo_url: logoUrl } = useSettings()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [avatarHovered, setAvatarHovered] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auth state detection
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u)
      if (u) fetchProfile(u.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  function getInitials(): string {
    if (profile?.full_name) {
      const parts = profile.full_name.trim().split(/\s+/)
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return parts[0][0].toUpperCase()
    }
    if (user?.email) return user.email[0].toUpperCase()
    return '?'
  }

  function getFirstName(): string {
    if (profile?.full_name) return profile.full_name.trim().split(/\s+/)[0]
    if (user?.email) return user.email.split('@')[0]
    return ''
  }

  async function handleSignOut() {
    setDropdownOpen(false)
    setMenuOpen(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navLinks = [
    { href: '/scooters', label: 'Scooters' },
    { href: '/guide', label: 'Guide' },
    { href: '/#tarifs', label: 'Tarifs' },
    { href: '/contact', label: 'Contact' },
  ]

  const AvatarCircle = ({ size = 32 }: { size?: number }) => (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: '#FF6700',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: Math.round(size * 0.38),
      fontWeight: 700,
      fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
      flexShrink: 0,
      transform: avatarHovered ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 150ms ease',
      userSelect: 'none',
    }}>
      {getInitials()}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar-dropdown {
          animation: fadeInDropdown 150ms ease forwards;
        }
      `}</style>

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
              <img src={logoUrl} alt="Almone" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <span style={{
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#0a0a0a',
                letterSpacing: '-0.03em',
              }}>
                almone.
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {navLinks.map((link) => (
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
            {user ? (
              /* Connected: avatar + dropdown */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  onMouseEnter={() => setAvatarHovered(true)}
                  onMouseLeave={() => setAvatarHovered(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 0,
                  }}
                >
                  <AvatarCircle size={32} />
                  <span style={{
                    fontSize: 14,
                    color: '#0a0a0a',
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontWeight: 500,
                  }}>
                    {getFirstName()}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="navbar-dropdown"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 12px)',
                      right: 0,
                      minWidth: 200,
                      background: '#ffffff',
                      border: '0.5px solid #E0E0E0',
                      borderRadius: 12,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      overflow: 'hidden',
                    }}
                  >
                    <Link
                      href="/compte"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontSize: 14,
                        color: '#0a0a0a',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F5F5F5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Mon compte
                    </Link>
                    <div style={{ height: '0.5px', background: '#E0E0E0', margin: '4px 0' }} />
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: 14,
                        color: '#E53935',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not connected: Mon compte link */
              <Link href="/compte" style={{ textDecoration: 'none' }}>
                <span style={{
                  fontSize: 14,
                  color: '#757575',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}>
                  Mon compte
                </span>
              </Link>
            )}

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
            {/* Mobile user section */}
            {user ? (
              <>
                {/* Logged in header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 0',
                  borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#FF6700',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    flexShrink: 0,
                  }}>
                    {getInitials()}
                  </div>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#0a0a0a',
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                  }}>
                    Bonjour, {getFirstName()}
                  </span>
                </div>

                {/* Nav links */}
                {navLinks.map((link) => (
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

                {/* Account links */}
                <Link
                  href="/compte"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#757575',
                    textDecoration: 'none',
                    padding: '14px 0',
                    borderBottom: '0.5px solid rgba(0,0,0,0.05)',
                    letterSpacing: '-0.02em',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Mon tableau de bord
                </Link>
                <Link
                  href="/compte#reservations"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#757575',
                    textDecoration: 'none',
                    padding: '14px 0',
                    borderBottom: '0.5px solid rgba(0,0,0,0.05)',
                    letterSpacing: '-0.02em',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Mes réservations
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#E53935',
                    padding: '14px 0',
                    borderBottom: '0.5px solid rgba(0,0,0,0.05)',
                    letterSpacing: '-0.02em',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                {/* Not logged in: nav links + auth links */}
                {navLinks.map((link) => (
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
                <Link
                  href="/compte"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 28,
                    fontWeight: 700,
                    color: pathname === '/compte' ? '#0a0a0a' : '#757575',
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
                  Se connecter
                </Link>
              </>
            )}
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
