'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, AlertCircle } from 'lucide-react'

interface Operator {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

function fmtDate(d: string | null) {
  if (!d) return 'Jamais'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface ModalProps {
  operator?: Operator | null
  onClose: () => void
  onSaved: () => void
}

function OperatorModal({ operator, onClose, onSaved }: ModalProps) {
  const isEdit = !!operator
  const [name, setName] = useState(operator?.name ?? '')
  const [email, setEmail] = useState(operator?.email ?? '')
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(operator?.is_active ?? true)
  const [showPwd, setShowPwd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim() || !email.trim()) { setError('Nom et email requis.'); return }
    if (!isEdit && !password.trim()) { setError('Mot de passe requis.'); return }
    setSaving(true)
    setError('')

    if (isEdit) {
      const updates: Partial<Operator> = { name, email, is_active: isActive }
      if (password.trim()) updates.password_hash = password
      const { error: err } = await supabase.from('admin_users').update(updates).eq('id', operator!.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('admin_users').insert({
        name, email, password_hash: password, role: 'operator', is_active: isActive,
      })
      if (err) { setError(err.message); setSaving(false); return }
    }

    setSaving(false)
    onSaved()
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    ...sf,
    display: 'block', width: '100%', padding: '11px 14px', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)',
    color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 420,
        background: '#1a1a1a', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.1)',
        padding: '28px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ ...sf, fontSize: 17, fontWeight: 700, color: '#ffffff', margin: 0 }}>
            {isEdit ? 'Modifier l\'opérateur' : 'Ajouter un opérateur'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Prénom Nom"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div>
            <label style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="prenom@almone.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              {isEdit ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe temporaire'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isEdit ? 'Laisser vide = inchangé' : 'Mot de passe'}
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#757575', padding: 4, display: 'flex',
                }}
              >
                {showPwd ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Actif toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
            <span style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Compte actif</span>
            <button
              onClick={() => setIsActive(v => !v)}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                background: isActive ? '#FF6700' : 'rgba(255,255,255,0.15)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: isActive ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#ffffff',
                transition: 'left 0.2s', display: 'block',
              }} />
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 12,
            padding: '10px 14px', borderRadius: 8,
            background: 'rgba(220,0,0,0.12)', border: '0.5px solid rgba(220,0,0,0.3)',
          }}>
            <AlertCircle size={14} strokeWidth={1.5} color="#ff6b6b" />
            <span style={{ ...sf, fontSize: 13, color: '#ff6b6b' }}>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              ...sf, flex: 1, padding: '11px', borderRadius: 8,
              border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent',
              color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...sf, flex: 1, padding: '11px', borderRadius: 8,
              border: 'none', background: '#FF6700', color: '#ffffff',
              fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EquipePage() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | Operator | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Operator | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('role', 'operator')
      .order('created_at', { ascending: false })
    setOperators(data ?? [])
    setLoading(false)
  }

  async function toggleActive(op: Operator) {
    setTogglingId(op.id)
    await supabase.from('admin_users').update({ is_active: !op.is_active }).eq('id', op.id)
    setOperators(prev => prev.map(o => o.id === op.id ? { ...o, is_active: !o.is_active } : o))
    setTogglingId(null)
  }

  async function deleteOperator(op: Operator) {
    setDeleting(op.id)
    await supabase.from('admin_users').delete().eq('id', op.id)
    setOperators(prev => prev.filter(o => o.id !== op.id))
    setConfirmDelete(null)
    setDeleting(null)
  }

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ ...sf, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: '#ffffff' }}>
            Équipe
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {operators.length} opérateur{operators.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal('add')}
          style={{
            ...sf,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: '#FF6700', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={15} strokeWidth={2} />
          Ajouter un opérateur
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 56, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
          </div>
        ) : operators.length === 0 ? (
          <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun opérateur. Ajoutez votre premier opérateur.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['Nom', 'Email', 'Statut', 'Dernière connexion', 'Actions'].map(h => (
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
                {operators.map((op, i) => (
                  <tr
                    key={op.id}
                    style={{ borderBottom: i < operators.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ ...sf, fontWeight: 600, color: '#ffffff', fontSize: 14 }}>{op.name}</div>
                    </td>
                    <td style={{ ...sf, padding: '16px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      {op.email}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {/* Toggle active */}
                      <button
                        onClick={() => toggleActive(op)}
                        disabled={togglingId === op.id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: 'none', border: 'none', cursor: togglingId === op.id ? 'not-allowed' : 'pointer',
                          padding: 0, opacity: togglingId === op.id ? 0.5 : 1,
                        }}
                      >
                        <div style={{
                          width: 36, height: 20, borderRadius: 10,
                          background: op.is_active ? '#FF6700' : 'rgba(255,255,255,0.15)',
                          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                        }}>
                          <span style={{
                            position: 'absolute', top: 2, left: op.is_active ? 18 : 2,
                            width: 16, height: 16, borderRadius: '50%', background: '#ffffff',
                            transition: 'left 0.2s', display: 'block',
                          }} />
                        </div>
                        <span style={{
                          ...sf, fontSize: 12, fontWeight: 500,
                          color: op.is_active ? '#FF6700' : 'rgba(255,255,255,0.3)',
                        }}>
                          {op.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </button>
                    </td>
                    <td style={{ ...sf, padding: '16px 20px', color: 'rgba(255,255,255,0.35)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {fmtDate(op.last_login)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setModal(op)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 12px', borderRadius: 6, border: '0.5px solid rgba(255,255,255,0.12)',
                            background: 'transparent', color: 'rgba(255,255,255,0.5)',
                            fontSize: 12, cursor: 'pointer',
                          }}
                        >
                          <Pencil size={12} strokeWidth={1.5} />
                          Modifier
                        </button>
                        <button
                          onClick={() => setConfirmDelete(op)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 12px', borderRadius: 6,
                            border: '0.5px solid rgba(220,0,0,0.2)',
                            background: 'rgba(220,0,0,0.06)', color: '#ff6b6b',
                            fontSize: 12, cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} strokeWidth={1.5} />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {(modal === 'add' || (modal && modal !== 'add')) && (
        <OperatorModal
          operator={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null) }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmDelete(null)} />
          <div style={{
            position: 'relative', zIndex: 1, width: '100%', maxWidth: 360,
            background: '#1a1a1a', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.1)',
            padding: '28px', textAlign: 'center',
          }}>
            <Trash2 size={28} color="#ff6b6b" strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <h3 style={{ ...sf, fontSize: 17, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Supprimer l&apos;opérateur ?
            </h3>
            <p style={{ ...sf, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
              <strong style={{ color: '#ffffff' }}>{confirmDelete.name}</strong> sera définitivement supprimé.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  ...sf, flex: 1, padding: '11px', borderRadius: 8,
                  border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent',
                  color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => deleteOperator(confirmDelete)}
                disabled={deleting === confirmDelete.id}
                style={{
                  ...sf, flex: 1, padding: '11px', borderRadius: 8,
                  border: 'none', background: 'rgba(220,0,0,0.8)', color: '#ffffff',
                  fontSize: 14, fontWeight: 600, cursor: deleting === confirmDelete.id ? 'not-allowed' : 'pointer',
                  opacity: deleting === confirmDelete.id ? 0.7 : 1,
                }}
              >
                {deleting === confirmDelete.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
