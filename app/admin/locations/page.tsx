'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, AlertCircle, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  description: string
  is_active: boolean
  created_at: string
}

type FormData = Omit<Location, 'id' | 'created_at'>

const EMPTY: FormData = {
  name: '', address: '', lat: 0, lng: 0, description: '', is_active: true,
}

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Location | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('locations').select('*').order('created_at')
    setLocations(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setFormError('')
    setModal('add')
  }

  function openEdit(loc: Location) {
    setEditing(loc)
    setForm({
      name: loc.name, address: loc.address, lat: loc.lat, lng: loc.lng,
      description: loc.description || '', is_active: loc.is_active,
    })
    setFormError('')
    setModal('edit')
  }

  async function handleSave() {
    if (!form.name || !form.address) { setFormError('Nom et adresse requis.'); return }
    setSaving(true)
    setFormError('')
    try {
      if (modal === 'add') {
        const result = await supabase.from('locations').insert([form]).select().single()
        if (result.error) throw result.error
      } else if (editing) {
        const result = await supabase.from('locations').update(form).eq('id', editing.id).select()
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
    await supabase.from('locations').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    await load()
  }

  async function toggleActive(loc: Location) {
    setToggling(loc.id)
    const next = !loc.is_active
    const result = await supabase.from('locations').update({ is_active: next }).eq('id', loc.id).select()
    setToggling(null)
    if (!result.error) setLocations(prev => prev.map(x => x.id === loc.id ? { ...x, is_active: next } : x))
  }

  function setF(key: keyof FormData, value: string | number | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
            fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#ffffff',
          }}>
            Points de retrait
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {locations.length} point{locations.length !== 1 ? 's' : ''} configuré{locations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            ...sf,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: '#FF6700', color: '#ffffff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Plus size={16} strokeWidth={1.5} />
          Ajouter un point
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: 56, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
          </div>
        ) : locations.length === 0 ? (
          <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun point de retrait. Ajoutez-en un pour commencer.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Nom', 'Adresse', 'Lat / Lng', 'Statut', 'Actif', 'Actions'].map(h => (
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
                {locations.map((loc, i) => {
                  const isActive = loc.is_active
                  return (
                    <tr
                      key={loc.id}
                      style={{ borderBottom: i < locations.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <MapPin size={15} strokeWidth={1.5} style={{ color: '#FF6700', flexShrink: 0 }} />
                          <div style={{ ...sf, fontWeight: 500, color: '#ffffff', fontSize: 13 }}>{loc.name}</div>
                        </div>
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                        {loc.address}
                      </td>
                      <td style={{ ...sf, padding: '14px 20px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', fontSize: 12, fontFamily: 'monospace' }}>
                        {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          ...sf,
                          display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                          background: isActive ? 'rgba(255,103,0,0.15)' : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#FF6700' : 'rgba(255,255,255,0.4)',
                          fontSize: 11, fontWeight: 500,
                        }}>
                          {isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => toggleActive(loc)}
                          disabled={toggling === loc.id}
                          title={isActive ? 'Désactiver' : 'Activer'}
                          style={{
                            width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: isActive ? '#FF6700' : 'rgba(255,255,255,0.15)',
                            position: 'relative', transition: 'background 0.2s',
                            opacity: toggling === loc.id ? 0.5 : 1, flexShrink: 0,
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: 3, left: isActive ? 18 : 3,
                            width: 14, height: 14, borderRadius: '50%', background: '#ffffff',
                            transition: 'left 0.2s',
                          }} />
                        </button>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => openEdit(loc)}
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
                            onClick={() => setDeleteId(loc.id)}
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
        <Modal title={modal === 'add' ? 'Ajouter un point' : 'Modifier le point'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <MField label="Nom du point *">
              <MI value={form.name} onChange={v => setF('name', v)} placeholder="Gare de Marrakech" />
            </MField>

            <MField label="Adresse *">
              <MI value={form.address} onChange={v => setF('address', v)} placeholder="Avenue Hassan II, Marrakech" />
            </MField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MField label="Latitude">
                <MI type="number" value={String(form.lat)} onChange={v => setF('lat', parseFloat(v) || 0)} placeholder="31.63000" />
              </MField>
              <MField label="Longitude">
                <MI type="number" value={String(form.lng)} onChange={v => setF('lng', parseFloat(v) || 0)} placeholder="-8.00000" />
              </MField>
            </div>

            <MField label="Description">
              <textarea
                value={form.description || ''}
                onChange={e => setF('description', e.target.value)}
                rows={3}
                style={inputStyle}
                placeholder="Description du point de retrait..."
              />
            </MField>

            <MField label="Statut">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setF('is_active', !form.is_active)}
                  style={{
                    width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: form.is_active ? '#FF6700' : 'rgba(255,255,255,0.15)',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: form.is_active ? 18 : 3,
                    width: 14, height: 14, borderRadius: '50%', background: '#ffffff',
                    transition: 'left 0.2s',
                  }} />
                </button>
                <span style={{ ...sf, fontSize: 13, color: form.is_active ? '#FF6700' : 'rgba(255,255,255,0.4)' }}>
                  {form.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
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
                background: '#FF6700', color: '#ffffff', fontSize: 13, fontWeight: 500,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Enregistrement...' : modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteId(null)} small>
          <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Cette action est irreversible. Le point de retrait sera definitivement supprime.
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
              {deleting ? 'Suppression...' : 'Supprimer'}
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
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
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
        fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
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
            fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
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
