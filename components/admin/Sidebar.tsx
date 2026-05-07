'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Settings, Zap, Calendar, Users, Globe, LogOut, X, MapPin, UserCog, HelpCircle,
} from 'lucide-react'
import { adminLogout, getAdminSession } from '@/lib/admin-auth'

const ALL_NAV = [
  { href: '/admin',            label: 'Dashboard',     icon: LayoutDashboard, exact: true,         superAdminOnly: false },
  { href: '/admin/scooters',   label: 'Scooters',      icon: Zap,             exact: false,        superAdminOnly: false },
  { href: '/admin/reservations', label: 'Réservations', icon: Calendar,       exact: false,        superAdminOnly: false },
  { href: '/admin/clients',    label: 'Clients',       icon: Users,           exact: false,        superAdminOnly: false },
  { href: '/admin/locations',  label: 'Nos adresses',  icon: MapPin,          exact: false,        superAdminOnly: false },
  { href: '/admin/equipe',     label: 'Équipe',        icon: UserCog,         exact: false,        superAdminOnly: true  },
  { href: '/admin/faq',        label: 'FAQ',           icon: HelpCircle,      exact: false,        superAdminOnly: false },
  { href: '/admin/parametres', label: 'Paramètres',    icon: Settings,        exact: false,        superAdminOnly: false },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const session = getAdminSession()
  const isSuperAdmin = session?.role === 'superadmin'

  const NAV = ALL_NAV.filter(item => !item.superAdminOnly || isSuperAdmin)

  function isActive(item: typeof ALL_NAV[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  function handleLogout() {
    adminLogout()
    router.push('/admin/login')
  }

  const sf: React.CSSProperties = {
    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
  }

  const sidebar = (
    <aside style={{
      width: 240, background: '#111111',
      borderRight: '0.5px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div>
            <span style={{ ...sf, fontSize: 18, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>
              almone.
            </span>
            <span style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              admin
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                ...sf,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                background: active ? 'rgba(255,103,0,0.1)' : 'transparent',
                color: active ? '#FF6700' : 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: active ? 500 : 400, transition: 'all 0.12s',
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
        {/* Session info */}
        {session && (
          <div style={{
            padding: '8px 12px', marginBottom: 4,
            background: 'rgba(255,255,255,0.04)', borderRadius: 8,
          }}>
            <div style={{ ...sf, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
              {session.name}
            </div>
            <div style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {session.role === 'superadmin' ? 'Super Admin' : 'Opérateur'}
            </div>
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          style={{
            ...sf,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 2,
          }}
        >
          <Globe size={16} strokeWidth={1.5} />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            ...sf,
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', textAlign: 'left',
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
      <div className="hidden md:flex" style={{ width: 240, height: '100vh', flexShrink: 0 }}>
        {sidebar}
      </div>
      {mobileOpen && (
        <div className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}>
            {sidebar}
          </div>
        </div>
      )}
    </>
  )
}
