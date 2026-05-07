'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, AlertCircle } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: string
  order_index: number
  is_active: boolean
  created_at: string
}

const sf: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif',
}

interface ModalProps {
  item?: FaqItem | null
  onClose: () => void
  onSaved: () => void
  nextOrder: number
}

function FaqModal({ item, onClose, onSaved, nextOrder }: ModalProps) {
  const isEdit = !!item
  const [question, setQuestion] = useState(item?.question ?? '')
  const [answer, setAnswer] = useState(item?.answer ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!question.trim() || !answer.trim()) { setError('Question et réponse requises.'); return }
    setSaving(true)
    setError('')

    if (isEdit) {
      const { error: err } = await supabase
        .from('faq')
        .update({ question, answer })
        .eq('id', item!.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase
        .from('faq')
        .insert({ question, answer, order_index: nextOrder, is_active: true })
      if (err) { setError(err.message); setSaving(false); return }
    }

    setSaving(false)
    onSaved()
    onClose()
  }

  const textareaStyle: React.CSSProperties = {
    ...sf,
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '0.5px solid rgba(255,255,255,0.15)', background: '#1a1a1a',
    fontSize: 13, color: '#ffffff', outline: 'none', resize: 'vertical',
    lineHeight: 1.6, boxSizing: 'border-box',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 520,
        background: '#1a1a1a', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.1)',
        padding: '28px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ ...sf, fontSize: 17, fontWeight: 700, color: '#ffffff', margin: 0 }}>
            {isEdit ? 'Modifier la question' : 'Ajouter une question'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Question
            </label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={2}
              placeholder="Ex : Faut-il un permis pour louer ?"
              style={textareaStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={{ ...sf, fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Réponse
            </label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={5}
              placeholder="Réponse détaillée..."
              style={textareaStyle}
            />
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
            {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FaqAdminPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'add' | FaqItem>(null)
  const [confirmDelete, setConfirmDelete] = useState<FaqItem | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('faq')
      .select('*')
      .order('order_index', { ascending: true })
    setItems(data ?? [])
    setLoading(false)
  }

  async function toggleActive(item: FaqItem) {
    setTogglingId(item.id)
    await supabase.from('faq').update({ is_active: !item.is_active }).eq('id', item.id)
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i))
    setTogglingId(null)
  }

  async function moveItem(item: FaqItem, direction: 'up' | 'down') {
    const idx = items.findIndex(i => i.id === item.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return

    const other = items[swapIdx]
    await Promise.all([
      supabase.from('faq').update({ order_index: other.order_index }).eq('id', item.id),
      supabase.from('faq').update({ order_index: item.order_index }).eq('id', other.id),
    ])

    const updated = [...items]
    updated[idx] = { ...item, order_index: other.order_index }
    updated[swapIdx] = { ...other, order_index: item.order_index }
    updated.sort((a, b) => a.order_index - b.order_index)
    setItems(updated)
  }

  async function deleteItem(item: FaqItem) {
    setDeleting(item.id)
    await supabase.from('faq').delete().eq('id', item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
    setConfirmDelete(null)
    setDeleting(null)
  }

  const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0

  return (
    <div style={{ padding: '40px 40px 60px', background: '#0a0a0a', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ ...sf, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: '#ffffff' }}>
            FAQ
          </h1>
          <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {items.length} question{items.length !== 1 ? 's' : ''}
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
          Ajouter une question
        </button>
      </div>

      {/* List */}
      <div style={{ borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.08)', background: '#161616', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 72, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ ...sf, padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucune question. Ajoutez la première.
          </div>
        ) : (
          <div>
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < items.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
              >
                {/* Order controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, paddingTop: 2 }}>
                  <button
                    onClick={() => moveItem(item, 'up')}
                    disabled={i === 0}
                    style={{
                      background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer',
                      color: i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)',
                      padding: 2, display: 'flex',
                    }}
                  >
                    <ChevronUp size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => moveItem(item, 'down')}
                    disabled={i === items.length - 1}
                    style={{
                      background: 'none', border: 'none', cursor: i === items.length - 1 ? 'default' : 'pointer',
                      color: i === items.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)',
                      padding: 2, display: 'flex',
                    }}
                  >
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...sf, fontSize: 14, fontWeight: 500, color: '#ffffff', marginBottom: 4 }}>
                    {item.question}
                  </div>
                  <div style={{ ...sf, fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {item.answer.length > 120 ? item.answer.slice(0, 120) + '…' : item.answer}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(item)}
                    disabled={togglingId === item.id}
                    style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: item.is_active ? '#FF6700' : 'rgba(255,255,255,0.15)',
                      border: 'none', cursor: togglingId === item.id ? 'not-allowed' : 'pointer',
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                      opacity: togglingId === item.id ? 0.5 : 1,
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2, left: item.is_active ? 18 : 2,
                      width: 16, height: 16, borderRadius: '50%', background: '#ffffff',
                      transition: 'left 0.2s', display: 'block',
                    }} />
                  </button>

                  <button
                    onClick={() => setModal(item)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 6, border: '0.5px solid rgba(255,255,255,0.12)',
                      background: 'transparent', color: 'rgba(255,255,255,0.5)',
                      fontSize: 12, cursor: 'pointer', ...sf,
                    }}
                  >
                    <Pencil size={12} strokeWidth={1.5} />
                    Modifier
                  </button>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 6,
                      border: '0.5px solid rgba(220,0,0,0.2)',
                      background: 'rgba(220,0,0,0.06)', color: '#ff6b6b',
                      fontSize: 12, cursor: 'pointer', ...sf,
                    }}
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal !== null && (
        <FaqModal
          item={modal === 'add' ? null : modal as FaqItem}
          onClose={() => setModal(null)}
          onSaved={load}
          nextOrder={nextOrder}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget && !deleting) setConfirmDelete(null) }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => { if (!deleting) setConfirmDelete(null) }} />
          <div style={{
            position: 'relative', zIndex: 1, width: '100%', maxWidth: 360,
            background: '#1a1a1a', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.1)',
            padding: '28px', textAlign: 'center',
          }}>
            <Trash2 size={28} color="#ff6b6b" strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <h3 style={{ ...sf, fontSize: 17, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Supprimer cette question ?
            </h3>
            <p style={{ ...sf, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.5 }}>
              &ldquo;{confirmDelete.question.slice(0, 60)}{confirmDelete.question.length > 60 ? '…' : ''}&rdquo;
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={!!deleting}
                style={{
                  ...sf, flex: 1, padding: '11px', borderRadius: 8,
                  border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent',
                  color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => deleteItem(confirmDelete)}
                disabled={!!deleting}
                style={{
                  ...sf, flex: 1, padding: '11px', borderRadius: 8,
                  border: 'none', background: 'rgba(220,0,0,0.85)', color: '#ffffff',
                  fontSize: 14, fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
