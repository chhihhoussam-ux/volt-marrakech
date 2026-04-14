'use client'

import { useRef, useState } from 'react'
import { Upload, X, RotateCcw, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const BUCKET = 'volt-assets'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
  accept?: string
  /** 'cover' for hero/scooters, 'contain' for logo/favicon */
  fit?: 'cover' | 'contain'
  height?: number
}

export default function ImageUpload({
  value,
  onChange,
  label,
  hint,
  accept = 'image/*',
  fit = 'cover',
  height = 140,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setProgress(10)

    try {
      // Sanitize filename and prefix with timestamp to avoid conflicts
      const safe = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.\-_]/g, '')
      const fileName = `${Date.now()}-${safe}`

      // Fake incremental progress since Supabase JS SDK doesn't expose XHR progress
      const timer = setInterval(() => {
        setProgress(p => (p < 80 ? p + 15 : p))
      }, 250)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { upsert: true, cacheControl: '31536000' })

      clearInterval(timer)

      if (uploadError) throw new Error(uploadError.message)

      setProgress(100)

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName)

      onChange(urlData.publicUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload.')
    } finally {
      setUploading(false)
      setProgress(0)
      // Reset so same file can be picked again
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function triggerPick() {
    inputRef.current?.click()
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Zone */}
      <div
        onClick={!uploading ? triggerPick : undefined}
        style={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: 10,
          border: `0.5px ${value && !uploading ? 'solid rgba(0,0,0,0.1)' : 'dashed rgba(0,0,0,0.2)'}`,
          background: value && !uploading ? 'transparent' : '#F5F5F5',
          overflow: 'hidden',
          cursor: uploading ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => {
          if (!uploading) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.35)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor =
            value && !uploading ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)'
        }}
      >
        {/* ── State: image preview ── */}
        {value && !uploading && (
          <>
            <img
              src={value}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: fit,
                objectPosition: 'center',
                display: 'block',
              }}
              onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
            />
            {/* Overlay buttons on hover */}
            <div
              className="img-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: 0,
                transition: 'opacity 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                e.stopPropagation()
                const el = e.currentTarget as HTMLElement
                el.style.opacity = '1'
                el.style.background = 'rgba(0,0,0,0.45)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.opacity = '0'
                el.style.background = 'rgba(0,0,0,0)'
              }}
            >
              <button
                type="button"
                onClick={e => { e.stopPropagation(); triggerPick() }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, border: 'none',
                  background: '#ffffff', color: '#0a0a0a',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} strokeWidth={1.5} />
                Changer
              </button>
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,0.9)', color: '#0a0a0a',
                  cursor: 'pointer',
                }}
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          </>
        )}

        {/* ── State: uploading ── */}
        {uploading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '0 32px', width: '100%' }}>
            {/* Spinner */}
            <svg
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              style={{ animation: 'spin 0.8s linear infinite' }}
            >
              <circle cx="12" cy="12" r="10" stroke="#E0E0E0" strokeWidth="2.5" />
              <path d="M12 2 a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: 200, height: 3, borderRadius: 2, background: '#E0E0E0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--accent)', borderRadius: 2,
                width: `${progress}%`, transition: 'width 0.25s ease',
              }} />
            </div>
            <p style={{ fontSize: 12, color: '#757575', margin: 0 }}>Envoi en cours…</p>
          </div>
        )}

        {/* ── State: empty (no image, not uploading) ── */}
        {!value && !uploading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: '#E0E0E0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Upload size={18} strokeWidth={1.5} color="#757575" />
            </div>
            <p style={{ fontSize: 12, color: '#757575', margin: 0, textAlign: 'center' }}>
              Cliquer pour uploader
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, marginTop: 8,
          padding: '8px 12px', borderRadius: 7,
          background: 'rgba(220,0,0,0.06)', border: '0.5px solid rgba(220,0,0,0.2)',
          fontSize: 12, color: '#cc0000',
        }}>
          <AlertCircle size={13} strokeWidth={1.5} />
          {error}
        </div>
      )}

      {hint && (
        <p style={{ fontSize: 11, color: '#757575', marginTop: 5 }}>{hint}</p>
      )}

    </div>
  )
}
