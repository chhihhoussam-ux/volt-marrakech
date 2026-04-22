'use client'

import { useState, useCallback, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  brandName: string
  positioning: string
  territory: string[]
  style: string
  complexity: string
  tone: string
  references: string[]
  customReferences: string
  systemType: string
  geometry: string
  shapeBehavior: string[]
  composition: string
  paletteType: string
  dominantColor: string
  structuralColor: string
  accentColor: string
  supportColors: string
  colorRules: string[]
  titleTypography: string
  bodyTypography: string
  hierarchy: string
  typographyInteraction: string
  boardContents: string[]
  applications: string[]
  renderQuality: string
  brandMaturity: string
  tensionLevel: string
  density: string
  signatureRule: string
  customNotes: string
}

const INITIAL: FormState = {
  brandName: '',
  positioning: '',
  territory: [],
  style: '',
  complexity: '',
  tone: '',
  references: [],
  customReferences: '',
  systemType: '',
  geometry: '',
  shapeBehavior: [],
  composition: '',
  paletteType: '',
  dominantColor: '',
  structuralColor: '',
  accentColor: '',
  supportColors: '',
  colorRules: [],
  titleTypography: '',
  bodyTypography: '',
  hierarchy: '',
  typographyInteraction: '',
  boardContents: [],
  applications: [],
  renderQuality: '',
  brandMaturity: '',
  tensionLevel: '',
  density: '',
  signatureRule: '',
  customNotes: '',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSITIONING = [
  'Premium law firm',
  'Luxury brand',
  'Private wealth advisory firm',
  'High-performance sportswear brand',
  'Modern brunch house',
  'Hospitality lifestyle brand',
  'Tech startup',
  'Institutional modern brand',
  'Creative studio',
  'Other',
]

const TERRITORY = [
  'Precision', 'Elegance', 'Power', 'Warmth', 'Innovation',
  'Simplicity', 'Sophistication', 'Aggression', 'Calm', 'Confidence',
  'Timelessness', 'Exclusivity', 'Performance', 'Intimacy', 'Connection', 'Radicality',
]

const STYLES = [
  'Editorial luxury',
  'Architectural minimal',
  'Bold futuristic editorial',
  'Lifestyle aesthetic',
  'Corporate premium',
  'Expressive contemporary',
  'Soft editorial minimalism',
]

const COMPLEXITY = [
  'Ultra minimal',
  'Controlled minimalism',
  'Balanced',
  'Graphic but controlled',
  'Dense controlled',
]

const TONE = [
  'Calm and quiet',
  'Warm and intimate',
  'Bold and aggressive',
  'Energetic and dynamic',
  'Institutional and neutral',
  'Refined and timeless',
]

const REFERENCES = [
  'Hermès', 'Jil Sander', 'Aesop', 'Kinfolk',
  'Apple', 'Nike ACG', 'Acronym', 'McKinsey', 'Acne Studios',
]

const SYSTEM_TYPES = [
  'Geometric forms derived from the logo',
  'Editorial grid system',
  'Structural lines',
  'Color blocks',
  'Typography-led system',
  'Mixed controlled system',
]

const GEOMETRY = [
  'Angular / sharp',
  'Organic / curved',
  'Soft geometric',
  'Modular',
  'Mixed subtle',
]

const SHAPE_BEHAVIOR = [
  'One dominant shape per composition',
  'Multiple controlled shapes',
  'Sharp angular cuts',
  'Rounded shapes',
  'Subtle asymmetry',
  'Strong asymmetry',
  'Overlapping layers',
  'Fragmented shapes',
  'Diagonal movement',
  'Gentle layering',
  'Smooth transitions',
  'Strong interaction with typography',
  'Light interaction with typography',
]

const COMPOSITION = [
  'Static and balanced',
  'Strong asymmetry',
  'Diagonal tension',
  'Centered editorial',
  'Calm balance',
  'Controlled chaos',
]

const PALETTE_TYPES = [
  'Warm neutral palette',
  'Cold neutral palette',
  'High-contrast palette',
  'Soft natural palette',
  'Monochrome palette',
  'Signature color palette',
]

const COLOR_RULES = [
  'Dominant neutral background',
  'One expressive color per composition',
  'Accent used very sparingly',
  'No color overload',
  'Strict control',
  'High contrast',
  'Soft desaturated tones',
  'No harsh contrast',
  'No neon',
]

const TITLE_TYPOGRAPHY = [
  'Elegant high-contrast serif',
  'Soft serif',
  'Modern serif',
  'Bold condensed sans-serif',
  'Modern grotesk',
  'Clean sans-serif',
]

const BODY_TYPOGRAPHY = [
  'Clean modern sans-serif',
  'Humanist sans-serif',
  'Grotesk',
  'Minimal sans-serif',
]

const HIERARCHY = [
  'Editorial hierarchy with large breathing headlines',
  'Structured and highly legible hierarchy',
  'Impact-driven hierarchy with compressed headlines',
  'Airy hierarchy with generous spacing',
]

const TYPOGRAPHY_INTERACTION = [
  'Stable typography',
  'Light interaction with graphic system',
  'Strong interaction with composition',
]

const BOARD_CONTENTS = [
  'Geometric construction system',
  'Grid and alignment lines',
  'Color palette presentation',
  'Typography showcase',
  'Graphic system',
  'Composition variations',
  'Editorial layout examples',
  'Application previews',
]

const APPLICATIONS = [
  'Business card',
  'Document layout',
  'Packaging',
  'Digital interface',
  'Social media post',
  'Website homepage',
]

const RENDER_QUALITY = ['Concept', 'Semi realistic', 'Ultra realistic']

const BRAND_MATURITY = [
  'Startup',
  'Emerging brand',
  'Established premium brand',
  'Legacy brand',
]

const TENSION_LEVEL = [
  'Very calm',
  'Balanced',
  'Controlled tension',
  'Strong tension',
]

const DENSITY = ['Airy', 'Balanced', 'Dense but controlled']

const SIGNATURE_RULE = [
  'One dominant shape',
  'Constant diagonal angle',
  'One recurring curve',
  'Modular repetition',
  'Typographic interaction',
]

// ─── Prompt generator ─────────────────────────────────────────────────────────

function generatePrompt(f: FormState): string {
  const territory = f.territory.length ? f.territory.join(', ') : '—'
  const refs = [
    ...f.references,
    ...(f.customReferences.trim() ? [f.customReferences.trim()] : []),
  ].join(', ') || '—'
  const shapeBehavior = f.shapeBehavior.length ? f.shapeBehavior.join(', ') : '—'
  const colorRulesList = f.colorRules.length
    ? f.colorRules.map(r => `- ${r}`).join('\n')
    : '—'
  const boardList = f.boardContents.length
    ? f.boardContents.map(c => `- ${c}`).join('\n')
    : '—'
  const appList = f.applications.length
    ? f.applications.map(a => `- ${a}`).join('\n')
    : '—'
  const notes = f.customNotes.trim()

  return `Create an ultra premium brand identity system board.

Brand:
${f.brandName || '[Brand Name]'} — ${f.positioning || '—'} — ${territory}

Art direction:
${f.style || '—'} with ${f.complexity || '—'} level and a ${f.tone || '—'} atmosphere, inspired by ${refs}

Graphic system:
${f.systemType || '—'}, using ${f.geometry || '—'} forms with ${shapeBehavior}.
Composition logic: ${f.composition || '—'}.

Colors:
${f.paletteType || '—'}
- dominant: ${f.dominantColor || '—'}
- structural: ${f.structuralColor || '—'}
- accent: ${f.accentColor || '—'}
- support: ${f.supportColors || '—'}

color rules:
${colorRulesList}

Typography:
${f.titleTypography || '—'} for titles combined with ${f.bodyTypography || '—'}

hierarchy:
${f.hierarchy || '—'}
Typography interaction: ${f.typographyInteraction || '—'}

Output:
A structured branding board including:
${boardList}
Application previews:
${appList}

Style:
editorial, architectural, high-end, minimal but expressive

Requirements:
- strong grid layout
- consistent art direction across all sections
- controlled composition
- strong negative space
- no clutter
- no randomness
- no visual noise
- must feel like a real agency branding presentation

Brand maturity: ${f.brandMaturity || '—'}
Tension level: ${f.tensionLevel || '—'}
Density: ${f.density || '—'}
Signature rule: ${f.signatureRule || '—'}
${notes ? `\n${notes}\n` : ''}
-- ${f.renderQuality || 'Ultra realistic'} -- design board -- high-end branding -- minimalism -- structured layout -- no visual noise`
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function SectionCard({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-gray-300 select-none">{index}</span>
        <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  )
}

const selectCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors appearance-none cursor-pointer'

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-colors placeholder:text-gray-300'

function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={selectCls}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function Chips({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={
              'rounded-full border px-3 py-1 text-[12px] leading-none transition-all select-none cursor-pointer ' +
              (active
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700')
            }
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandPromptPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [prompt, setPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm(prev => ({ ...prev, [key]: value })),
    []
  )

  const handleGenerate = () => {
    const result = generatePrompt(form)
    setPrompt(result)
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for non-HTTPS
      const el = document.createElement('textarea')
      el.value = prompt
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReset = () => {
    setForm(INITIAL)
    setPrompt('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] font-sans">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-8">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">
            Design Studio — Internal Tool
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Brand Prompt Generator
          </h1>
          <p className="text-sm text-gray-400 pt-0.5">
            Fill the sections below to generate an ultra-premium branding prompt for image generation.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 space-y-4 pb-8">

        {/* 01 — BRAND */}
        <SectionCard index="01" title="Brand">
          <Field label="Brand name">
            <input
              type="text"
              value={form.brandName}
              onChange={e => set('brandName', e.target.value)}
              placeholder="e.g. Volta, Maison Noir, Apex"
              className={inputCls}
            />
          </Field>
          <Field label="Positioning">
            <Select
              value={form.positioning}
              onChange={v => set('positioning', v)}
              options={POSITIONING}
            />
          </Field>
          <Field label="Territory (multi-select)">
            <Chips
              options={TERRITORY}
              selected={form.territory}
              onChange={v => set('territory', v)}
            />
          </Field>
        </SectionCard>

        {/* 02 — ART DIRECTION */}
        <SectionCard index="02" title="Art Direction">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Style">
              <Select value={form.style} onChange={v => set('style', v)} options={STYLES} />
            </Field>
            <Field label="Complexity">
              <Select value={form.complexity} onChange={v => set('complexity', v)} options={COMPLEXITY} />
            </Field>
          </div>
          <Field label="Tone">
            <Select value={form.tone} onChange={v => set('tone', v)} options={TONE} />
          </Field>
          <Field label="References (multi-select)">
            <Chips
              options={REFERENCES}
              selected={form.references}
              onChange={v => set('references', v)}
            />
          </Field>
          <Field label="Custom references">
            <input
              type="text"
              value={form.customReferences}
              onChange={e => set('customReferences', e.target.value)}
              placeholder="e.g. Bottega Veneta, Zara Home, Muji"
              className={inputCls}
            />
          </Field>
        </SectionCard>

        {/* 03 — GRAPHIC SYSTEM */}
        <SectionCard index="03" title="Graphic System">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="System type">
              <Select value={form.systemType} onChange={v => set('systemType', v)} options={SYSTEM_TYPES} />
            </Field>
            <Field label="Geometry">
              <Select value={form.geometry} onChange={v => set('geometry', v)} options={GEOMETRY} />
            </Field>
          </div>
          <Field label="Shape behavior (multi-select)">
            <Chips
              options={SHAPE_BEHAVIOR}
              selected={form.shapeBehavior}
              onChange={v => set('shapeBehavior', v)}
            />
          </Field>
          <Field label="Composition">
            <Select value={form.composition} onChange={v => set('composition', v)} options={COMPOSITION} />
          </Field>
        </SectionCard>

        {/* 04 — COLORS */}
        <SectionCard index="04" title="Colors">
          <Field label="Palette type">
            <Select value={form.paletteType} onChange={v => set('paletteType', v)} options={PALETTE_TYPES} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Dominant color">
              <input
                type="text"
                value={form.dominantColor}
                onChange={e => set('dominantColor', e.target.value)}
                placeholder="e.g. Warm ivory #F5F0E8"
                className={inputCls}
              />
            </Field>
            <Field label="Structural color">
              <input
                type="text"
                value={form.structuralColor}
                onChange={e => set('structuralColor', e.target.value)}
                placeholder="e.g. Charcoal #1A1A1A"
                className={inputCls}
              />
            </Field>
            <Field label="Accent color">
              <input
                type="text"
                value={form.accentColor}
                onChange={e => set('accentColor', e.target.value)}
                placeholder="e.g. Rust #C4622D"
                className={inputCls}
              />
            </Field>
            <Field label="Support colors (optional)">
              <input
                type="text"
                value={form.supportColors}
                onChange={e => set('supportColors', e.target.value)}
                placeholder="e.g. Dusty rose, Stone grey"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Color rules (multi-select)">
            <Chips
              options={COLOR_RULES}
              selected={form.colorRules}
              onChange={v => set('colorRules', v)}
            />
          </Field>
        </SectionCard>

        {/* 05 — TYPOGRAPHY */}
        <SectionCard index="05" title="Typography">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title typography">
              <Select value={form.titleTypography} onChange={v => set('titleTypography', v)} options={TITLE_TYPOGRAPHY} />
            </Field>
            <Field label="Body typography">
              <Select value={form.bodyTypography} onChange={v => set('bodyTypography', v)} options={BODY_TYPOGRAPHY} />
            </Field>
          </div>
          <Field label="Hierarchy">
            <Select value={form.hierarchy} onChange={v => set('hierarchy', v)} options={HIERARCHY} />
          </Field>
          <Field label="Typography interaction">
            <Select value={form.typographyInteraction} onChange={v => set('typographyInteraction', v)} options={TYPOGRAPHY_INTERACTION} />
          </Field>
        </SectionCard>

        {/* 06 — OUTPUT */}
        <SectionCard index="06" title="Output">
          <Field label="Board contents (multi-select)">
            <Chips
              options={BOARD_CONTENTS}
              selected={form.boardContents}
              onChange={v => set('boardContents', v)}
            />
          </Field>
          <Field label="Applications (multi-select)">
            <Chips
              options={APPLICATIONS}
              selected={form.applications}
              onChange={v => set('applications', v)}
            />
          </Field>
          <Field label="Render quality">
            <Select value={form.renderQuality} onChange={v => set('renderQuality', v)} options={RENDER_QUALITY} />
          </Field>
        </SectionCard>

        {/* 07 — ADVANCED */}
        <SectionCard index="07" title="Advanced">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand maturity">
              <Select value={form.brandMaturity} onChange={v => set('brandMaturity', v)} options={BRAND_MATURITY} />
            </Field>
            <Field label="Tension level">
              <Select value={form.tensionLevel} onChange={v => set('tensionLevel', v)} options={TENSION_LEVEL} />
            </Field>
            <Field label="Density">
              <Select value={form.density} onChange={v => set('density', v)} options={DENSITY} />
            </Field>
            <Field label="Signature rule">
              <Select value={form.signatureRule} onChange={v => set('signatureRule', v)} options={SIGNATURE_RULE} />
            </Field>
          </div>
          <Field label="Custom notes">
            <textarea
              value={form.customNotes}
              onChange={e => set('customNotes', e.target.value)}
              placeholder="Any additional direction, constraints, or context…"
              rows={4}
              className={inputCls + ' resize-none leading-relaxed'}
            />
          </Field>
        </SectionCard>

        {/* Generate button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-xl px-8 py-4 transition-colors"
          >
            Generate Prompt →
          </button>
        </div>

        {/* Output */}
        {prompt && (
          <div ref={outputRef} className="space-y-3 pt-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-300 select-none">↓</span>
                  <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">
                    Generated Prompt
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-300 font-mono">
                    {prompt.length} chars
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={
                      'text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ' +
                      (copied
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900')
                    }
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={prompt}
                rows={28}
                className="w-full font-mono text-[12px] leading-relaxed text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-4 resize-none focus:outline-none"
              />
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full border border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600 font-medium text-sm rounded-xl px-8 py-3 transition-colors bg-white"
            >
              Reset form
            </button>
          </div>
        )}

        {/* Footer spacing */}
        <div className="h-12" />
      </div>
    </div>
  )
}
