'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/compte')
      }, 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{
        paddingTop: 56,
        minHeight: '100vh',
        fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
      }}>
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '56px 24px 80px' }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#757575',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}>
              S&eacute;curit&eacute;
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em' }}>
              Nouveau mot de passe
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="8 caractères minimum"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '0.5px solid rgba(0,0,0,0.12)',
                    background: '#F5F5F5',
                    fontSize: 14,
                    color: '#0a0a0a',
                    outline: 'none',
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '0.5px solid rgba(0,0,0,0.12)',
                    background: '#F5F5F5',
                    fontSize: 14,
                    color: '#0a0a0a',
                    outline: 'none',
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 14px',
                  borderRadius: 8,
                  background: 'rgba(220,0,0,0.06)',
                  border: '0.5px solid rgba(220,0,0,0.2)',
                }}>
                  <AlertCircle size={15} strokeWidth={1.5} color="#cc0000" />
                  <span style={{ fontSize: 13, color: '#cc0000' }}>{error}</span>
                </div>
              )}

              {success && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 14px',
                  borderRadius: 8,
                  background: 'rgba(34,139,34,0.06)',
                  border: '0.5px solid rgba(34,139,34,0.2)',
                }}>
                  <CheckCircle size={15} strokeWidth={1.5} color="#228B22" />
                  <span style={{ fontSize: 13, color: '#228B22' }}>
                    Mot de passe mis &agrave; jour avec succ&egrave;s ! Redirection...
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  opacity: loading || success ? 0.7 : 1,
                  width: '100%',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}
              >
                <Lock size={16} strokeWidth={1.5} />
                {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
