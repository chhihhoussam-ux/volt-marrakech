'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, AlertCircle, Battery } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Scooter, ScooterStatus } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'

const STATUS_CFG: Record<ScooterStatus, { label: string; bg: string; color: string }> = {
  available: { label: 'Disponible', bg: 'rgba(0,176,80,0.15)',   color: '#00B050' },
  rented:    { label: 'Loué',       bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
}

type FormData = Omit<Scooter, 'id' | 'created_at'>

const EMPTY: FormData = {
  name: '', model: '', description: '',
  price_per_hour: 0, price_per_day: 0, price_per_week: 0,
  autonomy_km: 0, image_url: '', status: 'available',
}

const sf: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
}

export default function ScootersPage() {
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Scooter | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('scooters').select('*').order('created_at')
    setScooters(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setFormError('')
    setModal('add')
  }

  function openEdit(s: Scooter) {
    setEditing(s)
    setForm({
      name: s.name, model: s.model, description: s.description || '',
      price_per_hour: s.price_per_hour, price_per_day: s.price_per_day,
      price_per_week: s.price_per_week, autonomy_km: s.autonomy_km,
      image_url: s.image_url || '', status: s.status,
    })
    setFormError('')
    setModal('edit')
  }

  async function handleSave() {
    if (!form.name || !form.model) { setFormError('Nom et modèle requis.'); return }
    setSaving(true)
    setFormError('')
    try {
      if (modal === 'add') {
        const result = await supabase.from('scooters').insert([form]).select().single()
        if (result.error) throw result.error
      } else if (editing) {
        const result = await supabase.from('scooters').update(form).eq('id', editing.id).select()
        if (result.error) throw result.error
      }
      setModal(null)
      await load()
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('scooters').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    await load()
  }

  async function toggleAvailability(s: Scooter) {
    setToggling(s.id)
    const next: ScooterStatus = s.status === 'available' ? 'rented' : 'available'
    const result = await supabase.from('scooters').update({ status: next }).eq('id', s.id).select()
    setToggling(null)
    if (!result.error) setScooters(prev => prev.map(x => x.id === s.id ? { ...x, status: next } : x))
  }

  function setF(key: keyof FormData, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff',
          }}>
            Scooters
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {scooters.length} scooter{scooters.length !== 1 ? 's' : ''} dans la flotte
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            ...sf,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: '#00B050', color: '#ffffff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Plus size={16} strokeWidth={1.5} />
          Ajouter un scooter
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: 56, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
          </div>
        ) : scooters.length === 0 ? (
          <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun scooter. Ajoutez-en un pour commencer.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Scooter', 'Autonomie', 'Prix/jour', 'Statut', 'Dispo', 'Actions'].map(h => (
                    <th key={h} style={{
                      ...sf, padding: '11px 20px', textAlign: 'left', fontWeight: 500,
                      color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
                      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scooters.map((s, i) => {
                  const st = STATUS_CFG[s.status]
                  const isAvail = s.status === 'available'
                  return (
                    <tr
                      key={s.id}
                      style={{ borderBottom: i < scooters.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {s.image_url && (
                            <img src={s.image_url} alt={s.name}
                              style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                          )}
                          <div>
                            <div style={{ ...sf, fontWeight: 500, color: '#ffffff', fontSize: 13 }}>{s.name}</div>
                            <div style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.model}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', fontSize: 13 }}>
                        <Battery size={13} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        {s.autonomy_km} km
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', fontWeight: 500, whiteSpace: 'nowrap', color: '#ffffff', fontSize: 13 }}>
                        {s.price_per_day.toFixed(0)} MAD
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          ...sf,
                          display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                          background: st.bg, color: st.color, fontSize: 11, fontWeight: 500,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => toggleAvailability(s)}
                          disabled={toggling === s.id}
                          title={isAvail ? 'Marquer comme loué' : 'Marquer comme disponible'}
                          style={{
                            width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: isAvail ? '#00B050' : 'rgba(255,255,255,0.15)',
                            position: 'relative', transition: 'background 0.2s',
                            opacity: toggling === s.id ? 0.5 : 1, flexShrink: 0,
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: 3, left: isAvail ? 18 : 3,
                            width: 14, height: 14, borderRadius: '50%', background: '#ffffff',
                            transition: 'left 0.2s',
                          }} />
                        </button>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => openEdit(s)}
                            style={{
                              ...sf,
                              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
                              borderRadius: 7, border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent',
                              fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                            }}
                          >
                            <Pencil size={13} strokeWidth={1.5} />Modifier
                          </button>
                          <button
                            onClick={() => setDeleteId(s.id)}
                            style={{
                              ...sf,
                              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
                              borderRadius: 7, border: '0.5px solid rgba(220,0,0,0.3)', background: 'rgba(220,0,0,0.08)',
                              fontSize: 12, color: '#ff6b6b', cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Ajouter un scooter' : 'Modifier le scooter'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MField label="Nom *">
                <MI value={form.name} onChange={v => setF('name', v)} placeholder="Yadea C1S" />
              </MField>
              <MField label="Modèle *">
                <MI value={form.model} onChange={v => setF('model', v)} placeholder="Yadea C1S Pro" />
              </MField>
            </div>

            <MField label="Description">
              <textarea
                value={form.description || ''}
                onChange={e => setF('description', e.target.value)}
                rows={3}
                style={inputStyle}
                placeholder="Description du scooter…"
              />
            </MField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MField label="Prix / heure (MAD)">
                <MI type="number" value={String(form.price_per_hour)} onChange={v => setF('price_per_hour', parseFloat(v) || 0)} placeholder="35" />
              </MField>
              <MField label="Prix / jour (MAD)">
                <MI type="number" value={String(form.price_per_day)} onChange={v => setF('price_per_day', parseFloat(v) || 0)} placeholder="200" />
              </MField>
              <MField label="Prix / semaine (MAD)">
                <MI type="number" value={String(form.price_per_week)} onChange={v => setF('price_per_week', parseFloat(v) || 0)} placeholder="1100" />
              </MField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MField label="Autonomie (km)">
                <MI type="number" value={String(form.autonomy_km)} onChange={v => setF('autonomy_km', parseInt(v) || 0)} placeholder="80" />
              </MField>
              <MField label="Statut">
                <select
                  value={form.status}
                  onChange={e => setF('status', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="available">Disponible</option>
                  <option value="rented">Loué</option>
                </select>
              </MField>
            </div>

            <MField label="Photo du scooter">
              <ImageUpload
                value={form.image_url || ''}
                onChange={v => setF('image_url', v)}
                accept="image/jpeg,image/png,image/webp"
                fit="cover"
                height={140}
              />
            </MField>

            {formError && (
              <div style={{
                ...sf,
                display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderRadius: 8,
                background: 'rgba(220,0,0,0.1)', border: '0.5px solid rgba(220,0,0,0.25)', fontSize: 13, color: '#ff6b6b',
              }}>
                <AlertCircle size={14} strokeWidth={1.5} />{formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button onClick={() => setModal(null)} style={{
                ...sf,
                padding: '10px 18px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.12)',
                background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
              }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                ...sf,
                padding: '10px 18px', borderRadius: 8, border: 'none',
                background: '#00B050', color: '#ffffff', fontSize: 13, fontWeight: 500,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Enregistrement…' : modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteId(null)} small>
          <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Cette action est irréversible. Le scooter sera définitivement supprimé.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteId(null)} style={{
              ...sf,
              padding: '10px 18px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.12)',
              background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            }}>
              Annuler
            </button>
            <button onClick={handleDelete} disabled={deleting} style={{
              ...sf,
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: 'rgba(220,0,0,0.9)', color: '#ffffff', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', opacity: deleting ? 0.7 : 1,
            }}>
              {deleting ? 'Suppression…' : 'Supprimer'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '0.5px solid rgba(255,255,255,0.15)', background: '#1a1a1a',
  fontSize: 13, color: '#ffffff', outline: 'none', boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
}

function MI({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
}

function MField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 6,
        color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Modal({ title, onClose, children, small }: { title: string; onClose: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: small ? 400 : 560,
        background: '#1a1a1a', borderRadius: 16,
        border: '0.5px solid rgba(255,255,255,0.1)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', flexShrink: 0,
        }}>
          <span style={{
            fontSize: 14, fontWeight: 500, color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}>
            {title}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
