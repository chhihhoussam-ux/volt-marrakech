'use client'

import { useEffect, useState } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SETTINGS_DEFAULTS } from '@/lib/settings'
import type { SiteSettings } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'

type ExtSettings = SiteSettings & { whatsapp_number: string }

const DEFAULTS: ExtSettings = {
  ...SETTINGS_DEFAULTS,
  whatsapp_number: '212600000000',
}

export default function ParametresPage() {
  const [settings, setSettings] = useState<ExtSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const map: Record<string, string> = {}
        for (const row of data) map[row.key] = row.value
        setSettings({
          site_name:       map.site_name       ?? DEFAULTS.site_name,
          accent_color:    map.accent_color    ?? DEFAULTS.accent_color,
          logo_url:        map.logo_url        ?? DEFAULTS.logo_url,
          favicon_url:     map.favicon_url     ?? DEFAULTS.favicon_url,
          hero_image_url:  map.hero_image_url  ?? DEFAULTS.hero_image_url,
          about_text:      map.about_text      ?? DEFAULTS.about_text,
          whatsapp_number: map.whatsapp_number ?? DEFAULTS.whatsapp_number,
          stat1_value:     map.stat1_value     ?? DEFAULTS.stat1_value,
          stat1_label:     map.stat1_label     ?? DEFAULTS.stat1_label,
          stat2_value:     map.stat2_value     ?? DEFAULTS.stat2_value,
          stat2_label:     map.stat2_label     ?? DEFAULTS.stat2_label,
          stat3_value:     map.stat3_value     ?? DEFAULTS.stat3_value,
          stat3_label:     map.stat3_label     ?? DEFAULTS.stat3_label,
          stat4_value:     map.stat4_value     ?? DEFAULTS.stat4_value,
          stat4_label:     map.stat4_label     ?? DEFAULTS.stat4_label,
          price1_duration: map.price1_duration ?? DEFAULTS.price1_duration,
          price1_price:    map.price1_price    ?? DEFAULTS.price1_price,
          price1_features: map.price1_features ?? DEFAULTS.price1_features,
          price2_duration: map.price2_duration ?? DEFAULTS.price2_duration,
          price2_price:    map.price2_price    ?? DEFAULTS.price2_price,
          price2_features: map.price2_features ?? DEFAULTS.price2_features,
          price3_duration: map.price3_duration ?? DEFAULTS.price3_duration,
          price3_price:    map.price3_price    ?? DEFAULTS.price3_price,
          price3_features: map.price3_features ?? DEFAULTS.price3_features,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value: value || '' }))
      console.log('[settings] UPSERT rows:', rows)
      for (const row of rows) {
        const result = await supabase.from('settings').upsert(row, { onConflict: 'key' })
        console.log('[settings] UPSERT', row.key, '->', result)
        if (result.error) throw result.error
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      console.error('[settings] SAVE error:', e)
      setError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  function set(key: keyof ExtSettings, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 40px 60px' }}>
        <div style={{ height: 28, width: 200, background: '#F5F5F5', borderRadius: 6, marginBottom: 32 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 80, background: '#F5F5F5', borderRadius: 10 }} />)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 40px 60px', maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 4 }}>Paramètres du site</h1>
          <p style={{ fontSize: 13, color: '#757575' }}>Modifiez l'apparence et le contenu de Volt Marrakech.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 8,
            border: saved ? '0.5px solid rgba(200,255,0,0.3)' : 'none',
            background: saved ? 'rgba(200,255,0,0.1)' : '#C8FF00',
            color: saved ? '#3a6000' : '#0a0a0a',
            fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap',
          }}
        >
          {saved
            ? <><CheckCircle size={15} strokeWidth={1.5} />Sauvegardé</>
            : <><Save size={15} strokeWidth={1.5} />{saving ? 'Enregistrement...' : 'Sauvegarder'}</>
          }
        </button>
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px',
          borderRadius: 8, background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.2)',
          marginBottom: 20, fontSize: 13, color: '#cc0000',
        }}>
          <AlertCircle size={14} strokeWidth={1.5} />
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Identité */}
        <Section title="Identité">
          <Row label="Nom du site" hint="Affiché dans les balises meta et onglets">
            <Input value={settings.site_name} onChange={v => set('site_name', v)} placeholder="Volt" />
          </Row>
          <Row label="Couleur accent" hint="Format hexadécimal (ex : #C8FF00)">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={settings.accent_color || '#C8FF00'}
                onChange={e => set('accent_color', e.target.value)}
                style={{ width: 44, height: 36, borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.12)', cursor: 'pointer', padding: 2, background: 'none' }}
              />
              <Input value={settings.accent_color} onChange={v => set('accent_color', v)} placeholder="#C8FF00" />
            </div>
          </Row>
          <Row label="Numéro WhatsApp" hint="Sans + ni espaces (ex : 212600000000)">
            <Input value={settings.whatsapp_number} onChange={v => set('whatsapp_number', v)} placeholder="212600000000" />
          </Row>
        </Section>

        {/* Logo & Favicon */}
        <Section title="Logo & Favicon">
          <Row label="Logo" hint="Affiché dans la navbar. Vide = logo texte 'volt.'">
            <ImageUpload
              value={settings.logo_url}
              onChange={v => set('logo_url', v)}
              accept="image/svg+xml,image/png,image/jpeg"
              fit="contain"
              height={100}
            />
          </Row>
          <Row label="Favicon" hint="Format .ico ou .png (32×32 recommandé)">
            <ImageUpload
              value={settings.favicon_url}
              onChange={v => set('favicon_url', v)}
              accept="image/x-icon,image/png,image/svg+xml"
              fit="contain"
              height={80}
            />
          </Row>
        </Section>

        {/* Page d'accueil */}
        <Section title="Page d'accueil">
          <Row label="Image hero" hint="Recommandé : 1600 × 900px minimum, format paysage">
            <ImageUpload
              value={settings.hero_image_url}
              onChange={v => set('hero_image_url', v)}
              accept="image/jpeg,image/png,image/webp"
              fit="cover"
              height={160}
            />
          </Row>
          <Row label="Texte À propos" hint="Affiché dans la section 'Notre histoire' de l'accueil">
            <textarea
              value={settings.about_text}
              onChange={e => set('about_text', e.target.value)}
              rows={5}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
                fontSize: 13, color: '#0a0a0a', outline: 'none', resize: 'vertical',
                lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </Row>
        </Section>

        {/* Chiffres clés */}
        <Section title="Chiffres clés">
          {([
            { vKey: 'stat1_value', lKey: 'stat1_label' },
            { vKey: 'stat2_value', lKey: 'stat2_label' },
            { vKey: 'stat3_value', lKey: 'stat3_label' },
            { vKey: 'stat4_value', lKey: 'stat4_label' },
          ] as const).map((pair, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Row label={`Stat ${i + 1} — Valeur`}>
                <Input value={settings[pair.vKey]} onChange={v => set(pair.vKey, v)} placeholder={DEFAULTS[pair.vKey]} />
              </Row>
              <Row label="Label">
                <Input value={settings[pair.lKey]} onChange={v => set(pair.lKey, v)} placeholder={DEFAULTS[pair.lKey]} />
              </Row>
            </div>
          ))}
        </Section>

        {/* Tarifs */}
        <Section title="Tarifs">
          {([
            { dKey: 'price1_duration', pKey: 'price1_price', fKey: 'price1_features', num: 1 },
            { dKey: 'price2_duration', pKey: 'price2_price', fKey: 'price2_features', num: 2 },
            { dKey: 'price3_duration', pKey: 'price3_price', fKey: 'price3_features', num: 3 },
          ] as const).map((card, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 10,
              border: '0.5px solid rgba(0,0,0,0.08)', background: '#fafafa',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 0 }}>
                Formule {card.num}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Row label="Durée" hint="Ex : 2 Heures, 1 Journée">
                  <Input value={settings[card.dKey]} onChange={v => set(card.dKey, v)} placeholder={DEFAULTS[card.dKey]} />
                </Row>
                <Row label="Prix (MAD)" hint="Chiffre seul, sans MAD">
                  <Input value={settings[card.pKey]} onChange={v => set(card.pKey, v)} placeholder={DEFAULTS[card.pKey]} />
                </Row>
              </div>
              <Row label="Avantages" hint="Une ligne par avantage — séparés par | au stockage">
                <textarea
                  value={(settings[card.fKey] || '').replace(/\|/g, '\n')}
                  onChange={e => set(card.fKey, e.target.value.replace(/\n/g, '|'))}
                  rows={4}
                  placeholder={DEFAULTS[card.fKey].replace(/\|/g, '\n')}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: '0.5px solid rgba(0,0,0,0.12)', background: '#ffffff',
                    fontSize: 13, color: '#0a0a0a', outline: 'none', resize: 'vertical',
                    lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
              </Row>
            </div>
          ))}
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', background: '#ffffff', overflow: 'hidden' }}>
      <div style={{ padding: '13px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: '#757575', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 14px', borderRadius: 8,
        border: '0.5px solid rgba(0,0,0,0.12)', background: '#F5F5F5',
        fontSize: 13, color: '#0a0a0a', outline: 'none', boxSizing: 'border-box',
      }}
    />
  )
}
