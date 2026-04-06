'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Settings, Zap, Calendar, Users, Globe, LogOut, X,
} from 'lucide-react'
import { adminLogout } from '@/lib/admin-auth'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/scooters', label: 'Scooters', icon: Zap },
  { href: '/admin/reservations', label: 'Réservations', icon: Calendar },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(item: typeof NAV[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  function handleLogout() {
    adminLogout()
    router.push('/admin/login')
  }

  const sidebar = (
    <aside style={{
      width: 240,
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, background: '#C8FF00', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Zap size={14} strokeWidth={2} color="#0a0a0a" />
          </div>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.03em' }}>volt.</span>
            <span style={{ fontSize: 11, color: '#757575', marginLeft: 4 }}>admin</span>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575', padding: 2 }}
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                background: active ? 'rgba(200,255,0,0.1)' : 'transparent',
                color: active ? '#C8FF00' : '#757575',
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                transition: 'all 0.12s',
              }}
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
            color: '#757575', fontSize: 13, marginBottom: 2,
          }}
        >
          <Globe size={16} strokeWidth={1.5} />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: 'none', background: 'transparent',
            color: '#757575', fontSize: 13, cursor: 'pointer', textAlign: 'left',
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
          Déconnexion
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
        >
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
          />
          {/* Sidebar */}
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}>
            {sidebar}
          </div>
        </div>
      )}
    </>
  )
}
