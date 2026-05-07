'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { SESSION_KEY } from '@/lib/admin-auth'

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          authenticated: true,
          role: data.role,
          name: data.name,
          email: data.email,
        }))
        if (data.role === 'operator') {
          router.push('/admin/operations')
        } else {
          router.push('/admin')
        }
      } else {
        setError(data.message || 'Email ou mot de passe incorrect.')
      }
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    ...sf,
    display: 'block',
    width: '100%',
    padding: '13px 16px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.07)',
    border: `0.5px solid ${hasError ? 'rgba(255,80,80,0.6)' : 'rgba(255,255,255,0.12)'}`,
    color: '#ffffff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ ...sf, fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>
            almone.
          </span>
          <span style={{ ...sf, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            admin
          </span>
        </div>

        <h1 style={{ ...sf, fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Connexion
        </h1>
        <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
          Accès réservé à l&apos;équipe Almone.
        </p>

        {/* Email */}
        <div style={{ marginBottom: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter') handleConnect() }}
            autoFocus
            autoComplete="email"
            style={inputStyle(!!error)}
          />
        </div>

        {/* Password */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter') handleConnect() }}
            autoComplete="current-password"
            style={{ ...inputStyle(!!error), paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            tabIndex={-1}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#757575',
              padding: 4, display: 'flex',
            }}
          >
            {showPwd ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 8, marginBottom: 12,
            background: 'rgba(220,0,0,0.12)', border: '0.5px solid rgba(220,0,0,0.3)',
          }}>
            <AlertCircle size={14} strokeWidth={1.5} color="#ff6b6b" />
            <span style={{ ...sf, fontSize: 13, color: '#ff6b6b' }}>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleConnect}
          disabled={loading || !email || !password}
          style={{
            ...sf,
            display: 'block', width: '100%', padding: '13px', borderRadius: 8,
            border: 'none', background: '#FF6700', color: '#ffffff',
            fontSize: 14, fontWeight: 500,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !email || !password ? 0.6 : 1,
          }}
        >
          {loading ? 'Vérification...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )
}
