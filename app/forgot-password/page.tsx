'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://volt-marrakech.vercel.app/reset-password',
      })
      if (error) throw error
      setSuccess(true)
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
              Espace client
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em' }}>
              Mot de passe oubli&eacute;
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '11px 14px',
                  borderRadius: 8,
                  background: 'rgba(34,139,34,0.06)',
                  border: '0.5px solid rgba(34,139,34,0.2)',
                }}>
                  <CheckCircle size={15} strokeWidth={1.5} color="#228B22" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: '#228B22', lineHeight: 1.5 }}>
                    Un email de r&eacute;initialisation a &eacute;t&eacute; envoy&eacute; &agrave; {email}. V&eacute;rifiez votre bo&icirc;te de r&eacute;ception.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
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
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  width: '100%',
                  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                }}
              >
                <Mail size={16} strokeWidth={1.5} />
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <Link
                href="/compte"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#757575',
                  textDecoration: 'none',
                  marginTop: 8,
                }}
              >
                Retour &agrave; la connexion
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
