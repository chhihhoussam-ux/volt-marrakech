'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { isAdminAuthed } from '@/lib/admin-auth'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const auth = isAdminAuthed()
    setAuthed(auth)
    if (!auth && !isLoginPage) {
      router.replace('/admin/login')
    }
    setChecked(true)
  }, [pathname])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <span style={{
          fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          fontSize: 22, fontWeight: 700, color: '#00B050', letterSpacing: '-0.03em',
        }}>
          keewee.
        </span>
      </div>
    )
  }

  if (!authed) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <div
          className="md:hidden"
          style={{
            height: 52,
            background: '#111111',
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <span style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em',
          }}>
            keewee.
          </span>
        </div>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
