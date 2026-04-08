/**
 * Pure Node.js PNG icon generator — no external dependencies.
 * Generates icon-192.png and icon-512.png for the Volt PWA.
 *
 * Usage: node scripts/generate-icons.mjs
 */

import { deflateSync } from 'zlib'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dir, '..', 'public')

// ── Colours ─────────────────────────────────────────────────────────────────
const BG  = [10, 10, 10]       // #0a0a0a
const FG  = [200, 255, 0]      // #C8FF00

// ── PNG utilities ────────────────────────────────────────────────────────────

function uint32BE(n) {
  const b = Buffer.allocUnsafe(4)
  b.writeUInt32BE(n, 0)
  return b
}

function crc32(data) {
  // Build CRC table once
  if (!crc32.table) {
    crc32.table = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
      crc32.table[n] = c
    }
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) crc = crc32.table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const crcInput  = Buffer.concat([typeBytes, data])
  return Buffer.concat([uint32BE(data.length), typeBytes, data, uint32BE(crc32(crcInput))])
}

/**
 * Build a square RGB PNG.
 * @param {number} size - Width and height in pixels.
 * @param {(x:number, y:number, size:number) => boolean} drawFn
 *        Returns true if the pixel should use the foreground colour.
 */
function buildPNG(size, drawFn) {
  const ihdr = pngChunk('IHDR', Buffer.concat([
    uint32BE(size), uint32BE(size),
    Buffer.from([8, 2, 0, 0, 0]), // 8-bit depth, RGB, no compression/filter/interlace
  ]))

  // Build raw scanline bytes (filter byte 0 = None, then R G B per pixel)
  const raw = Buffer.allocUnsafe(size * (1 + size * 3))
  let pos = 0
  for (let y = 0; y < size; y++) {
    raw[pos++] = 0 // filter type: None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = drawFn(x, y, size) ? FG : BG
      raw[pos++] = r
      raw[pos++] = g
      raw[pos++] = b
    }
  }

  const idat = pngChunk('IDAT', deflateSync(raw, { level: 6 }))
  const iend = pngChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    ihdr, idat, iend,
  ])
}

// ── Drawing helpers ───────────────────────────────────────────────────────────

/** Signed distance from point (px,py) to segment (ax,ay)–(bx,by) */
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/**
 * Draw the Volt "V" glyph:
 * - Rounded-rectangle background with a slight inset (looks like an app icon)
 * - Bold "V" formed by two diagonal strokes meeting at the centre bottom
 */
function drawVolt(x, y, size) {
  const s = size

  // ── Rounded-rectangle icon background ──────────────────────────────────
  // iOS icons are clipped to a squircle by the OS; we paint a solid square
  // so we don't need to draw the rounded rect here — just fill the whole canvas.

  // ── V geometry ─────────────────────────────────────────────────────────
  // Top-left corner of left arm
  const padH  = s * 0.18   // horizontal margin
  const padT  = s * 0.20   // top margin
  const padB  = s * 0.20   // bottom margin
  const sw    = s * 0.11   // half-stroke width (distance threshold)

  const topLeftX  = padH
  const topLeftY  = padT
  const topRightX = s - padH
  const topRightY = padT
  const botX      = s * 0.50
  const botY      = s - padB

  const d1 = distToSegment(x, y, topLeftX,  topLeftY,  botX, botY)
  const d2 = distToSegment(x, y, topRightX, topRightY, botX, botY)

  // Anti-alias: smooth the edge over 1.5 px (returns boolean for simplicity)
  return Math.min(d1, d2) <= sw
}

// ── Generate & write ─────────────────────────────────────────────────────────

const sizes = [192, 512]

for (const size of sizes) {
  const png  = buildPNG(size, drawVolt)
  const path = join(publicDir, `icon-${size}.png`)
  writeFileSync(path, png)
  console.log(`✓  Generated ${path}  (${png.length} bytes)`)
}

console.log('Done.')
