'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Zap } from 'lucide-react'
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

  // Login page — no sidebar, no auth check needed
  if (isLoginPage) {
    return <>{children}</>
  }

  // Waiting for auth check
  if (!checked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fafafa',
      }}>
        <Zap size={24} strokeWidth={1.5} color="#C8FF00" />
      </div>
    )
  }

  if (!authed) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      {/* Sidebar (desktop fixed, mobile overlay) */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <div
          className="md:hidden"
          style={{
            height: 52,
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', padding: 4 }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, background: '#C8FF00', borderRadius: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={11} strokeWidth={2} color="#0a0a0a" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em' }}>volt.</span>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
