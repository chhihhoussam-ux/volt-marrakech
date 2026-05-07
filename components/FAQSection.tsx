'use client'

import { useEffect, useState } from 'react'
import { Plus, Minus, ImageIcon } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'
import { supabase } from '@/lib/supabase'

interface FaqItem {
  id: string
  question: string
  answer: string
  order_index: number
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const s = useSettings()
  const faqImage = s.faq_image_url

  useEffect(() => {
    supabase
      .from('faq')
      .select('id, question, answer, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) setFaqs(data)
      })
  }, [])

  return (
    <section style={{ padding: '120px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            fontSize: 11, fontWeight: 500, color: '#FF6700', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 16,
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
          }}>
            Questions fréquentes
          </p>
          <h2 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}>
            Tout ce que vous voulez savoir avant de rouler.
          </h2>
        </div>

        <div className="faq-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 48, alignItems: 'start' }}>
          {/* Left: image */}
          <div className="faq-image" style={{
            borderRadius: 12, overflow: 'hidden', minHeight: 400,
            background: faqImage ? 'transparent' : '#F5F5F5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {faqImage ? (
              <img src={faqImage} alt="FAQ" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }} />
            ) : (
              <ImageIcon size={36} strokeWidth={1} color="#D0D0D0" />
            )}
          </div>

          {/* Right: accordion */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, i) => (
              <div key={faq.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '22px 0', gap: 16, textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 16, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em',
                  }}>
                    {faq.question}
                  </span>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                    background: open === i ? '#FF6700' : '#F5F5F5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}>
                    {open === i
                      ? <Minus size={14} strokeWidth={2} color="#ffffff" />
                      : <Plus size={14} strokeWidth={2} color="#757575" />
                    }
                  </div>
                </button>
                {open === i && (
                  <p style={{
                    fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                    fontSize: 15, color: '#757575', lineHeight: 1.7, paddingBottom: 22,
                  }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
            {faqs.length === 0 && (
              <p style={{
                fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
                fontSize: 14, color: '#757575', padding: '24px 0',
              }}>
                Aucune question disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
