'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LogIn, UserPlus, LogOut, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Zap, User } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Reservation } from '@/lib/types'

type AuthTab = 'login' | 'signup'

const statusConfig: Record<string, {
  label: string
  message: string
  icon: React.ReactNode
  color: string
  bg: string
}> = {
  pending: {
    label: 'En attente',
    message: 'Votre réservation est en cours de traitement',
    icon: <Clock size={13} strokeWidth={1.5} />,
    color: '#8a6000', bg: 'rgba(255,180,0,0.1)',
  },
  confirmed: {
    label: 'Confirmée',
    message: 'Réservation confirmée — à bientôt !',
    icon: <CheckCircle size={13} strokeWidth={1.5} />,
    color: 'var(--accent)', bg: 'rgba(0,176,80,0.12)',
  },
  cancelled: {
    label: 'Annulée',
    message: 'Cette réservation a été annulée',
    icon: <XCircle size={13} strokeWidth={1.5} />,
    color: '#8a0000', bg: 'rgba(220,0,0,0.08)',
  },
  completed: {
    label: 'Terminée',
    message: 'Merci pour votre confiance !',
    icon: <CheckCircle size={13} strokeWidth={1.5} />,
    color: '#757575', bg: 'rgba(0,0,0,0.05)',
  },
}

export default function ComptePage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={28} strokeWidth={1.5} color="var(--accent)" /></div>}>
      <CompteContent />
    </Suspense>
  )
}

function CompteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<AuthTab>((searchParams.get('tab') as AuthTab) || 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [reservations, setReservations] = useState<(Reservation & { scooter_name?: string })[]>([])
  const [resLoading, setResLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) loadReservations()
  }, [user])

  async function loadReservations() {
    setResLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          scooters (name, model, image_url)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setResLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setAuthSuccess('Connexion réussie !')
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : 'Identifiants incorrects.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      setAuthSuccess('Compte créé ! Vérifiez vos emails pour confirmer votre compte.')
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : 'Erreur lors de l\'inscription.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setReservations([])
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={28} strokeWidth={1.5} color="var(--accent)" />
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56, minHeight: '100vh' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 24px 80px' }}>

          {!user ? (
            /* Auth form */
            <div>
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Espace client
                </p>
                <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em' }}>
                  {tab === 'login' ? 'Connexion' : 'Créer un compte'}
                </h1>
              </div>

              {/* Tab switcher */}
              <div style={{
                display: 'flex',
                background: '#F5F5F5',
                borderRadius: 10,
                padding: 4,
                marginBottom: 32,
              }}>
                {(['login', 'signup'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setAuthError(''); setAuthSuccess('') }}
                    style={{
                      flex: 1, padding: '10px 20px',
                      borderRadius: 7, border: 'none',
                      background: tab === t ? '#ffffff' : 'transparent',
                      color: '#0a0a0a', fontSize: 13,
                      fontWeight: tab === t ? 500 : 400,
                      cursor: 'pointer', minHeight: 44,
                      boxShadow: tab === t ? '0 0 0 0.5px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t === 'login' ? 'Se connecter' : "S'inscrire"}
                  </button>
                ))}
              </div>

              <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {tab === 'signup' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                        Nom complet
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={tab === 'signup'}
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: 8,
                          border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
                          fontSize: 14, color: '#0a0a0a', outline: 'none',
                        }}
                      />
                    </div>
                  )}

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
                        width: '100%', padding: '12px 16px', borderRadius: 8,
                        border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
                        fontSize: 14, color: '#0a0a0a', outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder={tab === 'signup' ? '8 caractères minimum' : '••••••••'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={tab === 'signup' ? 8 : undefined}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 8,
                        border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
                        fontSize: 14, color: '#0a0a0a', outline: 'none',
                      }}
                    />
                  </div>

                  {authError && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '11px 14px', borderRadius: 8,
                      background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.2)',
                    }}>
                      <AlertCircle size={15} strokeWidth={1.5} color="#cc0000" />
                      <span style={{ fontSize: 13, color: '#cc0000' }}>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '11px 14px', borderRadius: 8,
                      background: 'rgba(0,176,80,0.08)', border: '0.5px solid rgba(0,176,80,0.3)',
                    }}>
                      <CheckCircle size={15} strokeWidth={1.5} color="#5a9000" />
                      <span style={{ fontSize: 13, color: 'var(--accent)' }}>{authSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '13px', borderRadius: 10, border: 'none',
                      background: 'var(--accent)', color: '#0a0a0a',
                      fontSize: 14, fontWeight: 500, cursor: authLoading ? 'not-allowed' : 'pointer',
                      opacity: authLoading ? 0.7 : 1,
                    }}
                  >
                    {tab === 'login'
                      ? <><LogIn size={16} strokeWidth={1.5} />{authLoading ? 'Connexion...' : 'Se connecter'}</>
                      : <><UserPlus size={16} strokeWidth={1.5} />{authLoading ? 'Création...' : 'Créer mon compte'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Connected — profile + reservations */
            <div>
              {/* Profile card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderRadius: 12,
                border: '0.5px solid rgba(0,0,0,0.08)',
                background: '#F5F5F5',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    background: '#0a0a0a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User size={20} strokeWidth={1.5} color="var(--accent)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500 }}>
                      {user.user_metadata?.full_name || 'Utilisateur'}
                    </p>
                    <p style={{ fontSize: 13, color: '#757575' }}>{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8,
                    border: '0.5px solid rgba(0,0,0,0.1)', background: 'transparent',
                    fontSize: 13, color: '#757575', cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Déconnexion
                </button>
              </div>

              {/* Reservations */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <Calendar size={18} strokeWidth={1.5} color="#0a0a0a" />
                  <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>
                    Mes réservations
                  </h2>
                  {reservations.length > 0 && (
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, background: '#F5F5F5',
                      fontSize: 12, color: '#757575',
                    }}>
                      {reservations.length}
                    </span>
                  )}
                </div>

                {resLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2].map((i) => (
                      <div key={i} style={{
                        height: 88,
                        borderRadius: 10,
                        background: '#F5F5F5',
                        border: '0.5px solid rgba(0,0,0,0.06)',
                      }} />
                    ))}
                  </div>
                ) : reservations.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '56px 24px',
                    background: '#F5F5F5',
                    borderRadius: 12,
                  }}>
                    <Calendar size={28} strokeWidth={1} color="#E0E0E0" style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: 14, color: '#757575', marginBottom: 16 }}>
                      Aucune réservation pour le moment.
                    </p>
                    <a href="/reserver" style={{ textDecoration: 'none' }}>
                      <button style={{
                        padding: '10px 20px', borderRadius: 8, background: 'var(--accent)',
                        border: 'none', fontSize: 13, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                      }}>
                        Faire une réservation
                      </button>
                    </a>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {reservations.map((res: any) => {
                      const sc = res.scooters
                      const cfg = statusConfig[res.status] || statusConfig.pending
                      const start = new Date(res.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                      const end = new Date(res.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                      const sameDay = res.start_date === res.end_date
                      return (
                        <div key={res.id} style={{
                          borderRadius: 10,
                          border: `0.5px solid ${res.status === 'pending' ? 'rgba(255,180,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                          background: res.status === 'pending' ? 'rgba(255,180,0,0.03)' : '#ffffff',
                          overflow: 'hidden',
                        }}>
                          {/* Top row */}
                          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            {sc?.image_url && (
                              <img src={sc.image_url} alt={sc.name}
                                style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{sc?.name || 'Scooter'}</p>
                              <p style={{ fontSize: 12, color: '#757575' }}>
                                {start}{!sameDay ? ` → ${end}` : ''}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '5px 10px', borderRadius: 6,
                                background: cfg.bg, color: cfg.color, fontSize: 12,
                                minHeight: 28, whiteSpace: 'nowrap',
                              }}>
                                {cfg.icon}{cfg.label}
                              </span>
                              <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {res.total_price.toFixed(0)} <span style={{ fontSize: 12, fontWeight: 400, color: '#757575' }}>MAD</span>
                              </span>
                            </div>
                          </div>
                          {/* Status message */}
                          <div style={{
                            padding: '10px 20px',
                            borderTop: '0.5px solid rgba(0,0,0,0.05)',
                            background: cfg.bg,
                          }}>
                            <p style={{ fontSize: 12, color: cfg.color }}>{cfg.message}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
