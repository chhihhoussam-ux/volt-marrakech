'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MessageCircle, Mail, MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const fontFamily = 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'reservation',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    const fetchWhatsapp = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'whatsapp_number')
        .single()
      if (data?.value) setWhatsappNumber(data.value)
    }
    fetchWhatsapp()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          contactName: form.name,
          contactEmail: form.email,
          contactPhone: form.phone,
          contactSubject: form.subject,
          contactMessage: form.message,
        }),
      })

      if (!res.ok) throw new Error('Erreur lors de l\'envoi du message.')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setSending(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '0.5px solid rgba(0,0,0,0.12)',
    background: '#ffffff',
    fontSize: 14,
    fontFamily,
    color: '#0a0a0a',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    fontFamily,
    marginBottom: 8,
  }

  return (
    <div style={{ fontFamily }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background: '#0a0a0a',
          padding: '156px 24px 80px',
          fontFamily,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#FF6700',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 16,
              fontFamily,
            }}
          >
            NOUS CONTACTER
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: 20,
              fontFamily,
            }}
          >
            Une question ? On est là.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 560,
              fontFamily,
            }}
          >
            Notre équipe répond en moins de 24h. Pour les urgences, contactez-nous
            directement sur WhatsApp.
          </p>
        </div>
      </section>

      {/* Coordonnées Section */}
      <section style={{ background: '#ffffff', padding: '80px 24px', fontFamily }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 20,
          }}
        >
          {/* WhatsApp Card */}
          <div
            style={{
              padding: 32,
              borderRadius: 12,
              border: '0.5px solid rgba(0,0,0,0.08)',
              background: '#ffffff',
              fontFamily,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,103,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <MessageCircle size={22} color="#FF6700" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, fontFamily }}>
              WhatsApp
            </p>
            <p
              style={{
                fontSize: 14,
                color: '#757575',
                lineHeight: 1.6,
                marginBottom: 20,
                fontFamily,
              }}
            >
              Réponse en moins de 10 minutes
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                fontFamily,
                cursor: 'pointer',
                textDecoration: 'none',
                background: '#25D366',
                color: '#ffffff',
              }}
            >
              Ouvrir WhatsApp
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Email Card */}
          <div
            style={{
              padding: 32,
              borderRadius: 12,
              border: '0.5px solid rgba(0,0,0,0.08)',
              background: '#ffffff',
              fontFamily,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,103,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Mail size={22} color="#FF6700" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, fontFamily }}>
              Email
            </p>
            <p
              style={{
                fontSize: 14,
                color: '#757575',
                lineHeight: 1.6,
                marginBottom: 20,
                fontFamily,
              }}
            >
              contact@almone-scooter.com
            </p>
            <a
              href="mailto:contact@almone-scooter.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                fontFamily,
                cursor: 'pointer',
                textDecoration: 'none',
                background: '#0a0a0a',
                color: '#ffffff',
              }}
            >
              Envoyer un email
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Marrakech Card */}
          <div
            style={{
              padding: 32,
              borderRadius: 12,
              border: '0.5px solid rgba(0,0,0,0.08)',
              background: '#ffffff',
              fontFamily,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,103,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <MapPin size={22} color="#FF6700" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, fontFamily }}>
              Marrakech
            </p>
            <p
              style={{
                fontSize: 14,
                color: '#757575',
                lineHeight: 1.6,
                marginBottom: 20,
                fontFamily,
              }}
            >
              Nous intervenons dans tout Marrakech et ses environs
            </p>
            <a
              href="/#carte"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 8,
                border: '0.5px solid rgba(0,0,0,0.12)',
                fontSize: 13,
                fontWeight: 500,
                fontFamily,
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'transparent',
                color: '#0a0a0a',
              }}
            >
              Voir nos points relais
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ background: '#F5F5F5', padding: '80px 24px', fontFamily }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 8,
              textAlign: 'center',
              fontFamily,
            }}
          >
            Envoyez-nous un message
          </h2>
          <p
            style={{
              fontSize: 15,
              color: '#757575',
              textAlign: 'center',
              marginBottom: 40,
              fontFamily,
            }}
          >
            Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
          </p>

          {sent ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', gap: 16,
              padding: '40px 0',
            }}>
              <CheckCircle
                size={64}
                strokeWidth={1.5}
                color="#FF6700"
                style={{ width: 64, height: 64 }}
              />
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily,
                }}
              >
                Message envoyé !
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: '#757575',
                  fontFamily,
                }}
              >
                Nous vous répondrons dans les plus brefs délais.
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setForm({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'reservation',
                    message: '',
                  })
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  background: '#ffffff',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily,
                  cursor: 'pointer',
                }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name + Email */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="name">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="phone">
                      Téléphone (optionnel)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+212 6XX XX XX XX"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="subject">
                      Sujet
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="reservation">Réservation</option>
                      <option value="question">Question générale</option>
                      <option value="technique">Problème technique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      borderRadius: 8,
                      background: 'rgba(220,38,38,0.08)',
                      color: '#dc2626',
                      fontSize: 13,
                      fontFamily,
                    }}
                  >
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: '100%',
                    padding: 14,
                    borderRadius: 10,
                    border: 'none',
                    background: '#FF6700',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily,
                    cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
