/* ZINE//SPORCA: editor di zine A5 rilegabili. Port of the standalone vanilla tool (public/tools/zine/app.js)
   as a module: mountZine(container) builds the UI inside `container` and returns a cleanup that removes every
   global listener, the print root and the @page style. Plain DOM on purpose (not React): the editor re-renders
   by hand and drags mutate the nodes directly. Data stays in its own per-device IndexedDB 'zine-sporca'. */

import { ui } from './ui'
import { selectSides, slug, type PrintOptions } from './imposition'
import {
  DEFAULT_MARGINS,
  marginsOf,
  pageBox,
  setMargin,
  sideOf,
  type Edge,
  type MarginSide,
  type Margins,
} from './margins'

const MM = 96 / 25.4 // px per mm (CSS)
const PW = 148,
  PH = 210 // A5 in mm

const COLORS: Record<string, string> = {
  red: '#e3342f',
  blue: '#0078bf',
  pink: '#ff48b0',
  yellow: '#ffe800',
  green: '#00a95c',
}
const COLOR_KEYS = ['ink', 'paper', 'red', 'blue', 'pink', 'yellow', 'green']
const TAPE: Record<string, string> = {
  masking: 'rgba(232, 220, 180, .82)',
  clear: 'rgba(255, 255, 255, .5)',
  pink: 'rgba(255, 120, 180, .7)',
  black: 'rgba(20, 20, 20, .9)',
}
const FONTS: Record<string, string> = {
  typewriter: 'Macchina da scrivere',
  mono: 'Courier',
  marker: 'Pennarello',
  hand: 'A mano',
  stencil: 'Stencil',
  impact: 'Titolone',
  serif: 'Tabloid',
  block: 'Blocco',
  ransom: 'Lettera anonima',
}
const RANSOM_FONTS = [
  "'Anton'",
  "'Abril Fatface'",
  "'Special Elite'",
  "'Bungee'",
  "'Playfair Display'",
  "'Courier Prime'",
  "'Permanent Marker'",
  "'Stardos Stencil'",
  "'Rubik Mono One'",
]
// Every self-hosted face (fonts.css): loaded up front so pages, print and PDF never fall back.
const FONT_FACES = [
  "16px 'Abril Fatface'",
  "16px 'Anton'",
  "16px 'Bungee'",
  "16px 'Courier Prime'",
  "700 16px 'Courier Prime'",
  "16px 'Permanent Marker'",
  "700 16px 'Playfair Display'",
  "900 16px 'Playfair Display'",
  "16px 'Rock Salt'",
  "16px 'Rubik Mono One'",
  "16px 'Special Elite'",
  "700 16px 'Stardos Stencil'",
]
const IMG_MODES: Record<string, string> = {
  orig: 'Originale',
  xerox: 'Fotocopia',
  halftone: 'Retino',
  dither: 'Dither',
  threshold: 'Soglia 1-bit',
}
// Rasterization resolution for "Scarica PDF" (A4 sheet = 2923 x 2067 px, well under iOS canvas limits).
const PDF_DPI = 250

/* ---------- types ---------- */
interface ElBase {
  id: string
  x: number
  y: number
  w: number
  rot: number
  z: number
}
interface TextEl extends ElBase {
  type: 'text'
  text: string
  font: string
  size: number
  color: string
  align: string
  bg: string
  seed: number
}
interface ImageEl extends ElBase {
  type: 'image'
  h: number
  orig: string
  src: string
  mode: string
  contrast: number
  invert: boolean
  multiply: boolean
  tint: string
}
interface TapeEl extends ElBase {
  type: 'tape'
  h: number
  color: string
}
interface BoxEl extends ElBase {
  type: 'box'
  h: number
  fill: string
  opacity: number
}
type El = TextEl | ImageEl | TapeEl | BoxEl
interface Page {
  bg: 'paper' | 'ink'
  els: El[]
}
interface ZineDoc {
  v: 1
  title: string
  ink: string
  paper: string
  dirt: number
  crooked: boolean
  pageNumbers: boolean
  guides: boolean
  /** Same on every page, mirrored on the spine side (see margins.ts). */
  margins: Margins
  /** Top, bottom and outer margins move together. */
  linkMargins: boolean
  pages: Page[]
  print: PrintOptions
}

type Mode = 'phone' | 'tablet' | 'desktop'
type Pt = { x: number; y: number }
// Touch gestures on the page area. 'view' = one finger on empty space (tap, swipe to turn, pan);
// 'pinch-view' = two fingers there (zoom the page area); 'pinch-el' = a second finger while dragging an
// element (scale + rotate it); 'dead' = ignore the remaining fingers until all are lifted.
type Gesture =
  | {
      kind: 'view'
      id: number
      sx: number
      sy: number
      vx0: number
      vy0: number
      moved: boolean
      axis: '' | 'x' | 'y' | 'pan'
      target: HTMLElement
    }
  | { kind: 'pinch-view'; d0: number; c0: Pt; vz0: number; u0: Pt }
  | {
      kind: 'pinch-el'
      el: El
      node: HTMLElement
      snap: ZineDoc
      start: El
      hmm: number
      d0: number
      a0: number
      c0: Pt
    }
  | {
      kind: 'margin'
      id: number
      edge: Edge
      side: MarginSide
      sx: number
      sy: number
      start: Margins
      snap: ZineDoc
      moved: boolean
      pointerType: string
      grip: HTMLElement
      target: HTMLElement
    }
  | { kind: 'dead' }

const SIDE_LABEL: Record<MarginSide, string> = { top: 'alto', bottom: 'basso', outer: 'esterno', spine: 'dorso' }

/* ---------- utils ---------- */
const uid = () => Math.random().toString(36).slice(2, 10)
const r1 = (n: number) => Math.round(n * 10) / 10
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const seed = () => Math.floor(Math.random() * 1e9)
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
type Kid = Node | string | number | null | undefined | false | Kid[]
type Attrs = Record<string, unknown> | null
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...kids: Kid[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v as EventListener)
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v)
    else if (k === 'value') (e as HTMLInputElement).value = String(v as string | number)
    else if (k === 'checked') (e as HTMLInputElement).checked = !!v
    else e.setAttribute(k, v === true ? '' : String(v as string | number))
  }
  const flat = (kids as unknown[]).flat(Infinity) as (Node | string | number | null | undefined | false)[]
  for (const k of flat) if (k != null && k !== false) e.append(typeof k === 'object' ? k : String(k))
  return e
}
const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })
const colorVar = (k: string) => (k === 'paper' ? 'var(--paper)' : `var(--c-${k})`)
const hex2rgb = (hx: string) => {
  const n = parseInt(hx.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}
const target = <T extends HTMLElement = HTMLInputElement>(e: Event) => e.target as T
const ctx2d = (c: HTMLCanvasElement) => {
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('canvas 2d non disponibile')
  return ctx
}

/* ---------- storage (IndexedDB, own database: per-device, not the shared Dexie db) ---------- */
class KV {
  db: IDBDatabase | null = null
  open() {
    return new Promise<void>((res, rej) => {
      const r = indexedDB.open('zine-sporca', 1)
      r.onupgradeneeded = () => r.result.createObjectStore('kv')
      r.onsuccess = () => {
        this.db = r.result
        res()
      }
      r.onerror = () => rej(r.error)
    })
  }
  get<T>(k: string) {
    return new Promise<T | undefined>((res, rej) => {
      if (!this.db) return res(undefined)
      const q = this.db.transaction('kv').objectStore('kv').get(k)
      q.onsuccess = () => res(q.result as T | undefined)
      q.onerror = () => rej(q.error)
    })
  }
  set(k: string, v: unknown) {
    return new Promise<void>((res, rej) => {
      if (!this.db) return res()
      const q = this.db.transaction('kv', 'readwrite').objectStore('kv').put(v, k)
      q.onsuccess = () => res()
      q.onerror = () => rej(q.error)
    })
  }
  close() {
    this.db?.close()
    this.db = null
  }
}

/* ---------- pure-ish model helpers ---------- */
function newText(over: Partial<TextEl> = {}): TextEl {
  return {
    id: uid(),
    type: 'text',
    x: 20,
    y: 30,
    w: 108,
    rot: 0,
    z: 1,
    text: 'Scrivi qui',
    font: 'typewriter',
    size: 6,
    color: 'ink',
    align: 'left',
    bg: 'none',
    seed: seed(),
    ...over,
  }
}
function blankZine(): ZineDoc {
  const pages: Page[] = Array.from({ length: 8 }, () => ({ bg: 'paper', els: [] }))
  pages[0]!.els.push(
    newText({ x: 10, y: 22, w: 128, text: 'LA MIA\nZINE SPORCA', font: 'ransom', size: 17, z: 3, rot: -3 }),
    { id: uid(), type: 'tape', x: 52, y: 14, w: 44, h: 11, rot: -8, z: 4, color: 'masking' },
    { id: uid(), type: 'box', x: 0, y: 150, w: 148, h: 60, rot: 0, z: 1, fill: 'ink', opacity: 1 },
    newText({
      x: 12,
      y: 168,
      w: 124,
      text: 'n°1 — fatto a mano, fotocopiato male',
      font: 'typewriter',
      size: 5,
      color: 'paper',
      z: 2,
    }),
  )
  pages[1]!.els.push(
    newText({ x: 14, y: 16, w: 120, text: 'EDITORIALE', font: 'impact', size: 14, z: 1 }),
    newText({
      x: 14,
      y: 40,
      w: 120,
      text: 'Doppio click (o doppio tocco) per scrivere. Trascina per spostare.\nPallino rosa = ridimensiona, nero = ruota.\nTrascina qui le tue foto.',
      font: 'typewriter',
      size: 4.6,
      z: 2,
    }),
  )
  pages[7]!.els.push(
    newText({ x: 14, y: 180, w: 120, text: 'copia, ruba, ristampa.', font: 'hand', size: 4.5, align: 'center', z: 1 }),
  )
  return {
    v: 1,
    title: 'La mia zine sporca',
    ink: '#151515',
    paper: '#f3efe4',
    dirt: 0.25,
    crooked: true,
    pageNumbers: true,
    guides: true,
    margins: { ...DEFAULT_MARGINS },
    linkMargins: false,
    pages,
    print: { mode: 'booklet', sides: 'all', creep: 0, marks: true, paper: false },
  }
}

/** A saved or opened doc on top of the defaults; docs from before per-side margins carry `margin`/`gutter`. */
function loadDoc(z: Partial<ZineDoc> & { margin?: number; gutter?: number }): ZineDoc {
  const doc: ZineDoc & { margin?: number; gutter?: number } = { ...blankZine(), ...z, margins: marginsOf(z) }
  delete doc.margin
  delete doc.gutter
  return doc
}

// Grain texture: canvas PNG with toner specks + roller streaks. (SVG feTurbulence greys the first tile in
// Chrome's print.) Shared across mounts: pure function of n.
const noiseCache: Record<number, string> = {}
function noise(n: number) {
  n = n % 5
  if (noiseCache[n]) return noiseCache[n]
  const S = 1040,
    c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = ctx2d(c),
    rnd = mulberry32(n * 7919 + 1)
  ctx.fillStyle = '#000'
  for (let i = 0; i < 9000; i++) {
    const r = rnd() < 0.93 ? 0.8 + rnd() * 1.2 : 2 + rnd() * 2.5
    ctx.globalAlpha = 0.25 + rnd() * 0.6
    ctx.beginPath()
    ctx.arc(rnd() * S, rnd() * S, r, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 18; i++) {
    ctx.globalAlpha = 0.05 + rnd() * 0.1
    ctx.fillRect(rnd() * S, rnd() * S, 1.5 + rnd() * 2, 60 + rnd() * 300)
  }
  return (noiseCache[n] = `url(${c.toDataURL('image/png')})`)
}

/** A picked file whose bytes the browser could not read (iCloud/Drive placeholder not downloaded, moved, locked). */
class UnreadableFile extends Error {}

/**
 * Copy the file's bytes into memory first. An <img> pointed straight at a File re-reads it from disk with a
 * short timeout; a file still downloading from iCloud Drive / Google Drive then fails with ERR_TIMED_OUT.
 * arrayBuffer() waits for the provider instead.
 */
async function inMemory(file: File): Promise<Blob> {
  try {
    return new Blob([await file.arrayBuffer()], { type: file.type })
  } catch {
    throw new UnreadableFile(file.name)
  }
}

async function downscale(file: Blob, max: number) {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImg(url)
    // An SVG without width/height has no intrinsic size in some browsers: draw it at the max size.
    const iw = img.naturalWidth || max,
      ih = img.naturalHeight || max
    const s = Math.min(1, max / Math.max(iw, ih))
    const c = document.createElement('canvas')
    c.width = Math.round(iw * s)
    c.height = Math.round(ih * s)
    const ctx = ctx2d(c)
    const png = /^image\/(png|gif|webp|avif|svg|x-icon|vnd\.microsoft\.icon)/.test(file.type)
    if (!png) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
    }
    ctx.drawImage(img, 0, 0, c.width, c.height)
    return png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.88)
  } finally {
    URL.revokeObjectURL(url)
  }
}

const HEIC = /\.(heic|heif)$/i
const TIFF = /\.tiff?$/i
/** What the image picker offers: every browser image type plus formats only we decode (HEIC, TIFF, camera RAW, PSD). */
const IMAGE_ACCEPT =
  'image/*,.heic,.heif,.tif,.tiff,.dng,.cr2,.cr3,.nef,.nrw,.arw,.srf,.sr2,.raf,.orf,.rw2,.pef,.srw,.x3f,.psd,.psb,.svg'
const isHeic = (f: File) => /^image\/hei[cf]/.test(f.type) || HEIC.test(f.name)
const isTiff = (f: File) => f.type === 'image/tiff' || TIFF.test(f.name)

/** TIFF (Chrome/Firefox can't): first page through UTIF (~100 KB, lazy). */
async function tiffToPng(file: File): Promise<Blob> {
  const mod = await import('utif2')
  // CommonJS package: the namespace or its default, depending on the bundler interop.
  const UTIF = (mod.default as typeof mod | undefined) ?? mod
  const buf = await file.arrayBuffer()
  const [page] = UTIF.decode(buf)
  if (!page) throw new Error('empty tiff')
  UTIF.decodeImage(buf, page)
  const rgba = UTIF.toRGBA8(page)
  const c = document.createElement('canvas')
  c.width = page.width
  c.height = page.height
  ctx2d(c).putImageData(
    new ImageData(new Uint8ClampedArray(rgba.subarray(0, page.width * page.height * 4)), page.width, page.height),
    0,
    0,
  )
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('tiff'))), 'image/png'))
}

/**
 * Photoshop PSD/PSB: the flattened composite stored at the end of the file (8-bit RGB, grayscale or CMYK,
 * raw or PackBits). Needs "Maximize compatibility", Photoshop's default; layers are not read.
 */
async function psdToPng(file: File): Promise<Blob> {
  const b = new Uint8Array(await file.arrayBuffer())
  const v = new DataView(b.buffer)
  if (v.getUint32(0) !== 0x38425053) throw new Error('not psd') // "8BPS"
  const psb = v.getUint16(4) === 2
  const ch = v.getUint16(12),
    h = v.getUint32(14),
    w = v.getUint32(18),
    depth = v.getUint16(22),
    mode = v.getUint16(24)
  if (depth !== 8 || ![1, 3, 4].includes(mode)) throw new Error('psd mode')
  let o = 26
  o += 4 + v.getUint32(o) // colour mode data
  o += 4 + v.getUint32(o) // image resources
  o += psb ? 8 + Number(v.getBigUint64(o)) : 4 + v.getUint32(o) // layer and mask info
  const comp = v.getUint16(o)
  o += 2
  const planes = Math.min(ch, mode === 4 ? 4 : mode === 3 ? 3 : 1)
  const plane = () => new Uint8Array(w * h)
  const out = Array.from({ length: ch }, plane)
  if (comp === 0) {
    for (let c = 0; c < ch; c++, o += w * h) out[c]!.set(b.subarray(o, o + w * h))
  } else if (comp === 1) {
    const cs = psb ? 4 : 2
    const counts: number[] = []
    for (let r = 0; r < ch * h; r++, o += cs) counts.push(psb ? v.getUint32(o) : v.getUint16(o))
    for (let r = 0; r < ch * h; r++) {
      const dst = out[Math.floor(r / h)]!
      let di = (r % h) * w
      const end = o + counts[r]!
      while (o < end) {
        const n = (b[o++]! << 24) >> 24
        if (n >= 0) {
          dst.set(b.subarray(o, o + n + 1), di)
          di += n + 1
          o += n + 1
        } else if (n !== -128) {
          dst.fill(b[o++]!, di, di + 1 - n)
          di += 1 - n
        }
      }
    }
  } else throw new Error('psd compression')
  const rgba = new Uint8ClampedArray(w * h * 4)
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    if (planes === 1) rgba[p] = rgba[p + 1] = rgba[p + 2] = out[0]![i]!
    else if (mode === 4) {
      // PSD stores CMYK inverted (0 = full ink).
      const k = out[3]![i]! / 255
      rgba[p] = out[0]![i]! * k
      rgba[p + 1] = out[1]![i]! * k
      rgba[p + 2] = out[2]![i]! * k
    } else {
      rgba[p] = out[0]![i]!
      rgba[p + 1] = out[1]![i]!
      rgba[p + 2] = out[2]![i]!
    }
    rgba[p + 3] = 255
  }
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  ctx2d(c).putImageData(new ImageData(rgba, w, h), 0, 0)
  return new Promise((res, rej) => c.toBlob((x) => (x ? res(x) : rej(new Error('psd'))), 'image/png'))
}

/**
 * Camera RAW (DNG, CR2/CR3, NEF, ARW, RAF, ORF, RW2...) and PSD carry a JPEG preview inside: take the
 * largest embedded JPEG (SOI ff d8 ff ... EOI ff d9). No RAW development, but the preview is what the camera
 * showed, usually full size.
 */
async function embeddedJpeg(file: File): Promise<Blob> {
  const b = new Uint8Array(await file.arrayBuffer())
  let best: [number, number] | null = null
  for (let i = 0; i < b.length - 3; i++) {
    if (b[i] !== 0xff || b[i + 1] !== 0xd8 || b[i + 2] !== 0xff) continue
    // Walk the JPEG segments to its end instead of searching for ff d9 (thumbnails nest inside EXIF).
    let j = i + 2
    let end = -1
    while (j < b.length - 1) {
      if (b[j] !== 0xff) break
      const m = b[j + 1]!
      if (m === 0xd9) {
        end = j + 2
        break
      }
      if (m === 0xd8 || (m >= 0xd0 && m <= 0xd7) || m === 0x01 || m === 0xff) {
        j += m === 0xff ? 1 : 2
        continue
      }
      const len = (b[j + 2]! << 8) | b[j + 3]!
      if (m === 0xda) {
        // Entropy-coded scan: skip to the next marker that is not a stuffed byte or restart.
        j += 2 + len
        while (j < b.length - 1 && !(b[j] === 0xff && b[j + 1] !== 0 && (b[j + 1]! < 0xd0 || b[j + 1]! > 0xd7))) j++
        continue
      }
      j += 2 + len
    }
    if (end > 0) {
      if (!best || end - i > best[1] - best[0]) best = [i, end]
      i = end - 1
    }
  }
  if (!best || best[1] - best[0] < 2048) throw new Error('no preview')
  return new Blob([b.slice(best[0], best[1])], { type: 'image/jpeg' })
}

/**
 * Any image file to a downscaled data URL. Native decode first (covers JPEG, PNG, GIF, WebP, AVIF, BMP, ICO,
 * SVG and, in Safari, HEIC/TIFF); then HEIC via heic-to (libheif, ~3 MB, lazy, runtime-cached by the service
 * worker on first use), TIFF via UTIF, and finally the embedded JPEG preview of camera RAW / PSD files.
 */
async function importImage(original: File, max: number) {
  const file = new File([await inMemory(original)], original.name, { type: original.type })
  try {
    return await downscale(file, max)
  } catch (err) {
    const asJpeg = (blob: Blob, ext: string) =>
      downscale(new File([blob], file.name.replace(/\.[^.]+$/, ext), { type: blob.type }), max)
    if (isHeic(file)) {
      const { heicTo } = await import('heic-to')
      return asJpeg(await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 }), '.jpg')
    }
    if (isTiff(file)) {
      try {
        return await asJpeg(await tiffToPng(file), '.png')
      } catch {
        /* some TIFFs (JPEG-in-TIFF, DNG-like) still have a preview: fall through */
      }
    }
    if (/\.ps[db]$/i.test(file.name) || file.type === 'image/vnd.adobe.photoshop') {
      try {
        return await asJpeg(await psdToPng(file), '.png')
      } catch {
        /* 16-bit, Lab, no composite: fall back to the embedded thumbnail below */
      }
    }
    try {
      return await asJpeg(await embeddedJpeg(file), '.jpg')
    } catch {
      throw err
    }
  }
}

const isTouchDevice = () => navigator.maxTouchPoints > 0

/* ---------- the editor ---------- */
export function mountZine(root: HTMLElement): () => void {
  const ac = new AbortController()
  const on = <K extends keyof WindowEventMap>(t: Window, type: K, fn: (e: WindowEventMap[K]) => void) =>
    t.addEventListener(type, fn, { signal: ac.signal })
  let disposed = false
  const store = new KV()

  // DOM skeleton (ids of the original became classes, queried inside root).
  root.innerHTML = `
    <header class="z-bar">
      <a class="z-back ${ui.icon}" href="#/strumenti" aria-label="Strumenti" title="Strumenti">←</a>
      <span class="logo"><span aria-hidden="true">✂️</span> Zine</span>
      <button data-act="text" class="z-add ${ui.btn}">+ Testo</button>
      <button data-act="image" class="z-add ${ui.btn}">+ Immagine</button>
      <button data-act="tape" class="z-add ${ui.btn}">+ Nastro</button>
      <button data-act="box" class="z-add ${ui.btn}">+ Blocco</button>
      <span class="sep z-add"></span>
      <button data-act="undo" class="${ui.icon}" title="Ctrl+Z" aria-label="Annulla">↶</button>
      <button data-act="redo" class="${ui.icon}" title="Ctrl+Shift+Z" aria-label="Ripeti">↷</button>
      <span class="sep z-file"></span>
      <button data-act="new" class="z-file ${ui.btn}">Nuova</button>
      <button data-act="open" class="z-file ${ui.btn}">Apri .json</button>
      <button data-act="export" class="z-file ${ui.btn}">Salva .json</button>
      <span class="grow"></span>
      <button data-act="print" class="z-print ${ui.primary}">Stampa / PDF</button>
      <button data-act="menu" class="z-more ${ui.icon}" aria-label="Altro" aria-haspopup="menu" aria-expanded="false">⋯</button>
      <div class="z-menu ${ui.menu}" role="menu" hidden>
        <button data-act="new" role="menuitem" class="${ui.menuItem}">Nuova zine</button>
        <button data-act="open" role="menuitem" class="${ui.menuItem}">Apri .json</button>
        <button data-act="export" role="menuitem" class="${ui.menuItem}">Salva .json</button>
        <button data-act="settings" role="menuitem" class="z-menu-compact ${ui.menuItem}">Impostazioni zine</button>
        <button data-act="print" role="menuitem" class="${ui.primary} w-full justify-start">Stampa / Scarica PDF</button>
      </div>
      <input type="file" class="z-file-img" accept="${IMAGE_ACCEPT}" multiple hidden>
      <input type="file" class="z-file-json" accept="application/json,.json" hidden>
    </header>
    <aside class="z-nav" aria-label="Pagine"><div class="z-sheet-head z-nav-head"></div><div class="z-nav-body"></div></aside>
    <main class="z-stage">
      <div class="z-spreadwrap"><div class="z-spread spread"></div></div>
      <div class="z-spreadlabel ${ui.hint}"></div>
      <div class="z-pager">
        <button data-act="prev" class="${ui.floating}" aria-label="Pagina precedente">‹</button>
        <span class="z-pager-label ${ui.pill}" aria-live="polite"></span>
        <button data-act="next" class="${ui.floating}" aria-label="Pagina successiva">›</button>
      </div>
    </main>
    <aside class="z-panel" aria-label="Proprietà"><div class="z-sheet-head z-panel-head"></div><div class="z-panel-body"></div></aside>
    <nav class="z-tools" aria-label="Strumenti zine">
      <button data-act="text" class="${ui.tab}"><b>T</b>Testo</button>
      <button data-act="image" class="${ui.tab}"><b>▣</b>Immagine</button>
      <button data-act="tape" class="${ui.tab}"><b>▱</b>Nastro</button>
      <button data-act="box" class="${ui.tab}"><b>■</b>Blocco</button>
      <button data-act="props" class="${ui.tab}"><b>✎</b>Modifica</button>
      <button data-act="pages" class="${ui.tab}"><b>▤</b>Pagine</button>
    </nav>
    <dialog class="z-dlg ${ui.dialog}">
      <form method="dialog" class="z-form">
        <h2 class="${ui.dialogTitle}">Stampa / PDF</h2>
        <label class="field"><span class="${ui.label}">Formato</span>
          <select name="mode" class="${ui.select}">
            <option value="booklet">Libretto A5 spillato (fogli A4 fronte/retro)</option>
            <option value="single">Pagine A5 singole (copisteria, spirale, cucitura)</option>
          </select>
        </label>
        <div class="booklet-only">
          <label class="field"><span class="${ui.label}">Lati</span>
            <select name="sides" class="${ui.select}">
              <option value="all">Fronte + retro (stampante duplex)</option>
              <option value="fronts">Solo fronti (duplex manuale, passo 1)</option>
              <option value="backs">Solo retri (passo 2)</option>
              <option value="backs-rev">Solo retri, ordine invertito (passo 2)</option>
            </select>
          </label>
          <label class="field"><span class="${ui.label}">Creep (mm per foglio)</span>
            <input type="number" name="creep" class="${ui.input}" min="0" max="1" step="0.05" value="0">
          </label>
          <label class="check"><input type="checkbox" name="marks" class="${ui.check}" checked> segni di piega</label>
        </div>
        <label class="check"><input type="checkbox" name="paper" class="${ui.check}"> stampa il colore carta (lascia spento se usi carta colorata)</label>
        <p class="z-info ${ui.info}"></p>
        <div class="dlg-actions">
          <button value="cancel" class="${ui.btn}">Annulla</button>
          <button value="ok" class="${ui.btn}">Stampa</button>
          <button value="pdf" class="${ui.primary}">Scarica PDF</button>
        </div>
      </form>
    </dialog>
    <dialog class="z-progress ${ui.dialog}" aria-live="polite">
      <h2 class="${ui.dialogTitle}">PDF</h2>
      <p class="z-progress-msg"></p>
      <progress class="${ui.range}" max="1" value="0"></progress>
      <div class="dlg-actions"></div>
    </dialog>`
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T
  const stage = q('.z-stage'),
    spreadWrap = q('.z-spreadwrap'),
    spreadEl = q('.z-spread'),
    spreadLabelEl = q('.z-spreadlabel'),
    navSheet = q('.z-nav'),
    nav = q('.z-nav-body'),
    navHead = q('.z-nav-head'),
    panelSheet = q('.z-panel'),
    panel = q('.z-panel-body'),
    panelHead = q('.z-panel-head'),
    pagerLabel = q('.z-pager-label'),
    menu = q('.z-menu'),
    moreBtn = q('.z-more'),
    printDlg = q<HTMLDialogElement>('.z-dlg'),
    printForm = q<HTMLFormElement>('.z-form'),
    progDlg = q<HTMLDialogElement>('.z-progress'),
    fileImg = q<HTMLInputElement>('.z-file-img'),
    fileJson = q<HTMLInputElement>('.z-file-json')

  // Print root: a direct child of <body> so @media print can hide the whole dashboard shell (zine.css).
  const printRoot = h('div', { class: 'zine-scope zine-print' })
  // Off-screen root the PDF sheets are built in (rasterized from there).
  const pdfRoot = h('div', { class: 'zine-scope zine-pdf', 'aria-hidden': 'true' })
  const pageStyle = h('style', { 'data-zine': 'page' })
  document.body.append(printRoot, pdfRoot)
  document.head.append(pageStyle)
  document.documentElement.classList.add('zine-mounted')

  /* ---------- state ---------- */
  let zine: ZineDoc = blankZine()
  let cur = 0,
    sel: string | null = null,
    selPage = 0,
    scale = 1
  let past: ZineDoc[] = [],
    future: ZineDoc[] = []
  let editing = false,
    liveTimer: ReturnType<typeof setTimeout> | null = null
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let navTimer: ReturnType<typeof setTimeout> | undefined
  let lastTap: { id: string; t: number } | null = null
  let pdfBusy = false
  let drag: {
    el: El
    node: HTMLElement
    mode: 'move' | 'resize' | 'rotate'
    sx: number
    sy: number
    start: El
    cx: number
    cy: number
    snap: ZineDoc
    moved: boolean
    pointerType: string
  } | null = null

  /* Responsive mode (set on the root as data-mode): 'desktop' = the original three columns; 'tablet' =
     compact bars + bottom sheets, spread view; 'phone' = same, one page at a time. */
  let mode: Mode = 'desktop'
  let sheet: 'none' | 'panel' | 'nav' = 'none'
  let sheetSize: 'half' | 'full' = 'half'
  // Page-area view (compact modes): zoom on top of the fit scale, and pan in screen px.
  let vz = 1,
    vx = 0,
    vy = 0,
    baseScale = 1
  const touches = new Map<number, { x: number; y: number }>()
  let gesture: Gesture | null = null
  let sheetDrag: { sy: number; dy: number; box: HTMLElement; moved: boolean } | null = null
  let sheetTimer: ReturnType<typeof setTimeout> | undefined
  let editNode: HTMLElement | null = null
  const compact = () => mode !== 'desktop'

  function save() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(flushSave, 400)
  }
  function flushSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = null
    if (store.db) store.set('zine', zine).catch((e: unknown) => console.warn('save failed', e))
  }

  const N = () => zine.pages.length
  const pageAt = (pi: number) => zine.pages[pi]!
  function spreads(): (number | null)[][] {
    const s: (number | null)[][] = [[null, 0]]
    for (let p = 1; p < N() - 1; p += 2) s.push([p, p + 1])
    s.push([N() - 1, null])
    return s
  }
  function spreadLabel(i: number) {
    const s = spreads()
    if (i === 0) return 'Copertina'
    if (i === s.length - 1) return 'Retro'
    return `Pagine ${s[i]![0]! + 1}–${s[i]![1]! + 1}`
  }
  function findEl(id: string) {
    for (let pi = 0; pi < N(); pi++) {
      const el = pageAt(pi).els.find((e) => e.id === id)
      if (el) return { el, pi }
    }
    return null
  }
  const nextZ = (pi: number) => Math.max(0, ...pageAt(pi).els.map((e) => e.z || 0)) + 1
  const colorHex = (k: string) => (k === 'ink' ? zine.ink : k === 'paper' ? zine.paper : COLORS[k] || '#111111')

  /* ---------- history ---------- */
  function pushHistory(snap?: ZineDoc) {
    past.push(snap || structuredClone(zine))
    if (past.length > 40) past.shift()
    future = []
  }
  function change(fn: () => void) {
    pushHistory()
    fn()
    save()
    render()
  }
  function liveChange(fn: () => void) {
    if (!liveTimer) pushHistory()
    if (liveTimer) clearTimeout(liveTimer)
    liveTimer = setTimeout(() => {
      liveTimer = null
    }, 700)
    fn()
    save()
    renderStage()
    renderNavSoon()
  }
  function undo() {
    const prev = past.pop()
    if (!prev) return
    future.push(structuredClone(zine))
    zine = prev
    afterLoad()
  }
  function redo() {
    const next = future.pop()
    if (!next) return
    past.push(structuredClone(zine))
    zine = next
    afterLoad()
  }
  function afterLoad() {
    if (sel && !findEl(sel)) sel = null
    cur = clamp(cur, 0, spreads().length - 1)
    selPage = clamp(selPage, 0, N() - 1)
    save()
    render()
  }

  /* ---------- image processing ---------- */
  async function processImage(el: ImageEl) {
    if (el.mode === 'orig' && !el.invert) {
      el.src = el.orig
      return
    }
    const img = await loadImg(el.orig)
    const w = img.naturalWidth,
      hgt = img.naturalHeight
    const c = document.createElement('canvas')
    c.width = w
    c.height = hgt
    const ctx = ctx2d(c)
    ctx.drawImage(img, 0, 0)
    const id = ctx.getImageData(0, 0, w, hgt),
      d = id.data
    const C = clamp(el.contrast, -100, 200)
    const k = (259 * (C + 255)) / (255 * (259 - Math.min(C, 254)))
    const g = new Float32Array(w * hgt)
    for (let i = 0, p = 0; i < g.length; i++, p += 4) {
      let v = d[p + 3]! < 128 ? 255 : 0.299 * d[p]! + 0.587 * d[p + 1]! + 0.114 * d[p + 2]!
      if (el.mode !== 'orig') v = k * (v - 128) + 128
      if (el.invert) v = 255 - v
      g[i] = clamp(v, 0, 255)
    }

    if (el.mode === 'orig') {
      // solo inversione colori
      for (let p = 0; p < d.length; p += 4) {
        d[p] = 255 - d[p]!
        d[p + 1] = 255 - d[p + 1]!
        d[p + 2] = 255 - d[p + 2]!
      }
      ctx.putImageData(id, 0, 0)
      el.src = c.toDataURL('image/png')
      return
    }

    const rnd = mulberry32(42)
    if (el.mode === 'xerox') {
      for (let i = 0; i < g.length; i++) {
        let v = g[i]! < 55 ? 0 : g[i]! > 205 ? 255 : ((g[i]! - 55) / 150) * 255
        v += (rnd() - 0.5) * 50
        g[i] = clamp(v, 0, 255)
      }
    } else if (el.mode === 'threshold') {
      for (let i = 0; i < g.length; i++) g[i] = g[i]! < 128 ? 0 : 255
    } else if (el.mode === 'dither') {
      for (let y = 0; y < hgt; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x,
            o = g[i]!,
            n = o < 128 ? 0 : 255,
            err = o - n
          g[i] = n
          if (x + 1 < w) g[i + 1]! += (err * 7) / 16
          if (y + 1 < hgt) {
            if (x > 0) g[i + w - 1]! += (err * 3) / 16
            g[i + w]! += (err * 5) / 16
            if (x + 1 < w) g[i + w + 1]! += err / 16
          }
        }
    } else if (el.mode === 'halftone') {
      const cell = Math.max(4, Math.round(Math.max(w, hgt) / 120))
      const out = document.createElement('canvas')
      out.width = w
      out.height = hgt
      const o = ctx2d(out)
      o.fillStyle = '#fff'
      o.fillRect(0, 0, w, hgt)
      o.fillStyle = colorHex(el.tint)
      for (let y = 0; y < hgt; y += cell)
        for (let x = 0; x < w; x += cell) {
          let sum = 0,
            cnt = 0
          for (let yy = y; yy < Math.min(y + cell, hgt); yy += 2)
            for (let xx = x; xx < Math.min(x + cell, w); xx += 2) {
              sum += g[yy * w + xx]!
              cnt++
            }
          const dark = 1 - sum / cnt / 255
          const r = cell * 0.72 * Math.sqrt(dark)
          if (r < 0.3) continue
          o.beginPath()
          o.arc(x + cell / 2, y + cell / 2, r, 0, Math.PI * 2)
          o.fill()
        }
      el.src = out.toDataURL('image/png')
      return
    }

    const [tr, tg, tb] = hex2rgb(colorHex(el.tint))
    for (let i = 0, p = 0; i < g.length; i++, p += 4) {
      const t = clamp(g[i]!, 0, 255) / 255 // 0 = inchiostro, 1 = bianco
      d[p] = tr + (255 - tr) * t
      d[p + 1] = tg + (255 - tg) * t
      d[p + 2] = tb + (255 - tb) * t
      d[p + 3] = 255
    }
    ctx.putImageData(id, 0, 0)
    el.src = c.toDataURL('image/png')
  }

  async function addImageFiles(files: Iterable<File | null>, pi = selPage) {
    // No filtering by type or extension: every file gets a decode attempt, failures are reported by name.
    const list = [...files].filter((f): f is File => !!f)
    const failed: string[] = []
    const unreadable: string[] = []
    if (!list.length) return
    const snap = structuredClone(zine)
    let added = 0
    for (const f of list) {
      let orig: string, img: HTMLImageElement
      try {
        orig = await importImage(f, 1800)
        img = await loadImg(orig)
      } catch (err) {
        ;(err instanceof UnreadableFile ? unreadable : failed).push(f.name || 'immagine')
        continue
      }
      if (disposed) return
      added++
      const ar = img.naturalHeight / img.naturalWidth
      let w = 110
      if (w * ar > 170) w = 170 / ar
      const el: ImageEl = {
        id: uid(),
        type: 'image',
        x: r1((PW - w) / 2),
        y: r1(Math.max(6, (PH - w * ar) / 2)),
        w: r1(w),
        h: r1(w * ar),
        rot: 0,
        z: nextZ(pi),
        orig,
        src: orig,
        mode: 'xerox',
        contrast: 30,
        invert: false,
        multiply: true,
        tint: 'ink',
      }
      await processImage(el)
      pageAt(pi).els.push(el)
      sel = el.id
    }
    if (unreadable.length)
      alert(
        `Non riesco a leggere: ${unreadable.join(', ')}. Se il file è su iCloud Drive o Google Drive, scaricalo prima sul dispositivo (o copialo sul Desktop) e riprova.`,
      )
    if (failed.length)
      alert(
        `Non riesco ad aprire: ${failed.join(', ')}. Non sembra un'immagine leggibile: prova a esportarla in JPEG o PNG.`,
      )
    if (!added) return
    pushHistory(snap)
    save()
    render()
    if (compact()) setSheet('panel')
  }

  /* ---------- rendering ---------- */
  function ransom(text: string, s: number) {
    const rnd = mulberry32(s)
    const out: HTMLElement[] = []
    let word: HTMLElement | null = null
    const letter = (ch: string) => {
      const b = rnd()
      const cls = 'rs' + (b < 0.28 ? ' rs-inv' : b < 0.42 ? ' rs-yel' : b < 0.75 ? ' rs-paper' : '')
      return h(
        'span',
        {
          class: cls,
          style: {
            fontFamily: RANSOM_FONTS[Math.floor(rnd() * RANSOM_FONTS.length)],
            fontSize: (0.8 + rnd() * 0.45).toFixed(2) + 'em',
            transform: `rotate(${((rnd() - 0.5) * 12).toFixed(1)}deg) translateY(${((rnd() - 0.5) * 0.15).toFixed(2)}em)`,
            textTransform: rnd() < 0.55 ? 'uppercase' : 'lowercase',
          },
        },
        ch,
      )
    }
    for (const ch of text) {
      if (ch === '\n' || ch === ' ') {
        word = null
        out.push(ch === '\n' ? h('br') : h('span', { class: 'rs-space' }, ' '))
        continue
      }
      if (!word) {
        word = h('span', { class: 'rs-word' })
        out.push(word)
      }
      word.append(letter(ch))
    }
    return out
  }

  function applyElStyle(d: HTMLElement, el: El) {
    d.style.left = el.x + 'mm'
    d.style.top = el.y + 'mm'
    d.style.width = el.w + 'mm'
    d.style.height = el.type === 'text' ? '' : el.h + 'mm'
    d.style.transform = `rotate(${el.rot || 0}deg)`
    d.style.zIndex = String(el.z || 1)
    const t = d.querySelector<HTMLElement>('.txt')
    if (t && el.type === 'text') t.style.fontSize = el.size + 'mm'
  }

  function renderEl(el: El, edit: boolean) {
    const d = h('div', {
      class:
        `el el-${el.type}` +
        (edit && el.id === sel ? ' selected' : '') +
        (el.type === 'image' && el.multiply ? ' blend' : ''),
      'data-id': el.id,
    })
    if (el.type === 'text') {
      const t = h('div', { class: `txt f-${el.font}`, style: { textAlign: el.align, color: colorVar(el.color) } })
      const inverse = el.color === 'paper' ? 'var(--c-ink)' : 'var(--paper)'
      if (el.font === 'ransom') t.append(...ransom(el.text, el.seed))
      else if (el.bg === 'strips')
        t.append(h('span', { class: 'strip', style: { background: colorVar(el.color), color: inverse } }, el.text))
      else t.textContent = el.text
      if (el.bg === 'block' && el.font !== 'ransom')
        Object.assign(t.style, { background: colorVar(el.color), color: inverse, padding: '.35em .5em' })
      d.append(t)
    } else if (el.type === 'image') {
      d.append(h('img', { src: el.src, draggable: 'false', alt: '' }))
    } else if (el.type === 'tape') {
      // Torn edges on an inner fill: clip-path on the element itself would also clip its resize/rotate handles.
      d.append(
        h('div', {
          class: 'tape-fill',
          style: {
            background: TAPE[el.color] || TAPE.masking,
            clipPath: 'polygon(0 6%,3% 0,97% 4%,100% 0,98% 50%,100% 100%,96% 95%,4% 100%,0 96%,2% 50%)',
          },
        }),
      )
    } else {
      d.style.background = colorVar(el.fill)
      d.style.opacity = String(el.opacity)
    }
    applyElStyle(d, el)
    if (edit && el.id === sel) d.append(h('div', { class: 'handle resize' }), h('div', { class: 'handle rotate' }))
    return d
  }

  function renderPage(pi: number, { edit = false, creep = 0 } = {}) {
    const page = pageAt(pi)
    const d = h('div', { class: 'page' + (page.bg === 'ink' ? ' inverted' : ''), 'data-pi': pi })
    const inner = h('div', { class: 'page-inner' })
    const rnd = mulberry32(pi * 977 + 13)
    const tilt = zine.crooked ? (rnd() - 0.5) * 2.4 * zine.dirt : 0
    const off = zine.crooked ? (rnd() - 0.5) * 3 * zine.dirt : 0
    inner.style.transform = `translate(${(creep + off).toFixed(2)}mm, ${off.toFixed(2)}mm) rotate(${tilt.toFixed(2)}deg)`
    for (const el of [...page.els].sort((a, b) => (a.z || 0) - (b.z || 0))) inner.append(renderEl(el, edit))
    if (zine.pageNumbers && pi > 0 && pi < N() - 1)
      inner.append(h('div', { class: 'pnum ' + (pi % 2 ? 'l' : 'r') }, String(pi + 1)))
    d.append(
      inner,
      h('div', {
        class: 'grain',
        style: {
          backgroundImage: `${noise(pi)}, radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)`,
        },
      }),
    )
    if (edit && zine.guides) {
      // Each edge is a thin drag strip with a knob in the middle (pagine dispari stanno a destra: dorso a
      // sinistra). The strip yields to elements under it, the knob only to the selected element.
      const edges: Edge[] = ['top', 'bottom', 'left', 'right']
      const g = h(
        'div',
        { class: 'guides' },
        edges.map((edge) =>
          h(
            'div',
            { class: `gh gh-${edge}`, 'data-edge': edge, title: `Margine ${SIDE_LABEL[sideOf(edge, pi)]}` },
            h('div', { class: 'gh-knob' }),
          ),
        ),
      )
      placeGuides(g, pi)
      d.append(g)
    }
    return d
  }
  function placeGuides(g: HTMLElement, pi: number) {
    const b = pageBox(zine.margins, pi)
    for (const k of ['top', 'bottom', 'left', 'right'] as const) g.style[k] = b[k] + 'mm'
  }
  // Live update of the guides on screen while a margin is dragged (every page shown, mirrored).
  function updateGuides() {
    for (const p of spreadEl.querySelectorAll<HTMLElement>('.page[data-pi]')) {
      const g = p.querySelector<HTMLElement>(':scope > .guides')
      if (g) placeGuides(g, +(p.dataset.pi ?? 0))
    }
  }

  // Zine colours as CSS variables on every root that holds pages (editor, print, PDF).
  function setVars() {
    for (const r of [root, printRoot, pdfRoot]) {
      r.style.setProperty('--c-ink', zine.ink)
      r.style.setProperty('--paper', zine.paper)
      r.style.setProperty('--dirt', String(zine.dirt))
      for (const [k, v] of Object.entries(COLORS)) r.style.setProperty('--c-' + k, v)
    }
  }

  function renderSpreadInto(container: HTMLElement, i: number, edit: boolean) {
    container.innerHTML = ''
    for (const pi of spreads()[i]!)
      container.append(pi == null ? h('div', { class: 'slot' }) : renderPage(pi, { edit }))
  }

  const stageSize = () => ({ sw: (mode === 'phone' ? 1 : 2) * PW * MM, sh: PH * MM })
  // Where the spread sits at scale s with no pan (stage coordinates).
  function centerPos(s: number) {
    const { sw, sh } = stageSize()
    if (!compact())
      return { left: (stage.clientWidth - sw * s) / 2, top: Math.max(10, (stage.clientHeight - 40 - sh * s) / 2) }
    return { left: (stage.clientWidth - sw * s) / 2, top: Math.max(8, (stage.clientHeight - 52 - sh * s) / 2) }
  }
  function layoutStage() {
    if (disposed) return
    const { sw, sh } = stageSize()
    if (!compact()) {
      const W = stage.clientWidth - 60,
        H = stage.clientHeight - 70
      baseScale = scale = Math.max(0.1, Math.min(W / sw, H / sh))
      vz = 1
      vx = vy = 0
    } else {
      const W = stage.clientWidth - 24,
        H = stage.clientHeight - 64
      baseScale = Math.max(0.1, Math.min(W / sw, H / sh))
      scale = baseScale * vz
    }
    const pos = centerPos(scale)
    if (compact()) {
      // Keep at least 80px of the page on screen; at fit zoom the page stays centred horizontally.
      const m = 80,
        w = sw * scale,
        hh = sh * scale
      vx = vz === 1 ? 0 : clamp(vx, m - w - pos.left, stage.clientWidth - m - pos.left)
      vy = clamp(vy, m - hh - pos.top, stage.clientHeight - m - pos.top)
    }
    spreadEl.style.transform = `scale(${scale})`
    spreadEl.style.setProperty('--scale', String(scale))
    spreadWrap.style.width = sw * scale + 'px'
    spreadWrap.style.height = sh * scale + 'px'
    spreadWrap.style.left = pos.left + vx + 'px'
    spreadWrap.style.top = pos.top + vy + 'px'
  }
  function resetView() {
    vz = 1
    vx = vy = 0
  }
  // Programmatic view moves glide; finger-driven ones must not lag.
  function animateView() {
    spreadWrap.classList.add('z-anim')
    layoutStage()
    setTimeout(() => spreadWrap.classList.remove('z-anim'), 240)
  }
  // Pan the page so `r` (a screen rect) is clear of the open sheet and the stage edges.
  function ensureVisible(r: DOMRect | undefined) {
    if (!r || !compact()) return
    const st = stage.getBoundingClientRect()
    const box = sheet === 'panel' ? panelSheet : sheet === 'nav' ? navSheet : null
    const top = st.top + 8,
      bottom = (box ? st.bottom - box.offsetHeight : st.bottom - 48) - 8
    let d = 0
    if (r.bottom > bottom) d = bottom - r.bottom
    if (r.top + d < top) d = top - r.top
    if (!d) return
    vy += d
    animateView()
  }
  const selNode = () => (sel ? spreadEl.querySelector<HTMLElement>(`.el[data-id="${sel}"]`) : null)
  const ensureSelVisible = () => ensureVisible((editNode ?? selNode())?.getBoundingClientRect())

  function computeMode(): Mode {
    const w = window.innerWidth,
      hh = window.innerHeight
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (w < 640 || (coarse && hh < 520)) return 'phone'
    if (w < 1024 || (coarse && hh > w)) return 'tablet'
    return 'desktop'
  }
  function applyMode() {
    const m = computeMode()
    root.classList.toggle('z-touch', window.matchMedia('(pointer: coarse)').matches)
    if (m === mode && root.dataset.mode) return false
    mode = m
    root.dataset.mode = m
    root.classList.toggle('z-compact', m !== 'desktop')
    resetView()
    setSheet('none')
    return true
  }

  // Desktop: the root sits in <main> and fills the viewport below the dashboard header (zine.css reads
  // --zine-top). Compact: the root is fixed between the header and the bottom of the *visual* viewport, so the
  // iOS keyboard shrinks the editor instead of covering it.
  function layoutRoot() {
    if (disposed) return
    if (!compact()) {
      const top = root.getBoundingClientRect().top + window.scrollY
      root.style.setProperty('--zine-top', Math.max(0, Math.round(top)) + 'px')
      root.classList.remove('z-kb')
      return
    }
    const main = root.closest('main')
    const box = main?.parentElement ?? document.body
    const vv = window.visualViewport
    const vTop = vv?.offsetTop ?? 0,
      vH = vv?.height ?? window.innerHeight
    const kb = Math.max(0, Math.round(window.innerHeight - (vTop + vH)))
    if (kb < 80 && !editing && window.scrollY) window.scrollTo(0, 0)
    const br = box.getBoundingClientRect()
    const top = Math.max(main?.getBoundingClientRect().top ?? 0, vTop, 0)
    root.style.setProperty('--zine-top', Math.round(top) + 'px')
    root.style.setProperty('--zine-left', Math.max(0, Math.round(br.left)) + 'px')
    root.style.setProperty(
      '--zine-right',
      Math.max(0, Math.round(document.documentElement.clientWidth - br.right)) + 'px',
    )
    root.style.setProperty('--zine-kb', kb + 'px')
    root.classList.toggle('z-kb', kb >= 80)
  }

  /* ---------- sheets (compact modes) ---------- */
  function setSheet(s: typeof sheet, size: typeof sheetSize = 'half') {
    clearTimeout(sheetTimer)
    if (!compact()) s = 'none'
    const was = sheet
    sheet = s
    sheetSize = size
    root.dataset.sheet = s
    root.dataset.sheetSize = size
    if (s === 'none' && was !== 'none' && vz === 1 && !editing) {
      vy = 0
      animateView()
    }
    if (s !== 'none') requestAnimationFrame(() => ensureSelVisible())
  }
  const toggleSheet = (s: 'panel' | 'nav') => setSheet(sheet === s ? 'none' : s, 'half')

  function pageLabel(pi: number) {
    return pi === 0 ? 'Copertina' : pi === N() - 1 ? 'Retro' : `Pagina ${pi + 1}`
  }
  function renderStage() {
    setVars()
    spreadEl.classList.add('edit')
    if (mode === 'phone') {
      selPage = clamp(selPage, 0, N() - 1)
      cur = Math.max(
        0,
        spreads().findIndex((s) => s.includes(selPage)),
      )
      spreadEl.replaceChildren(renderPage(selPage, { edit: true }))
    } else {
      renderSpreadInto(spreadEl, cur, true)
      const s = spreads()[cur]!
      if (s[0] !== selPage && s[1] !== selPage) selPage = s[1] ?? s[0]!
    }
    layoutStage()
    spreadLabelEl.textContent = `${spreadLabel(cur)} · ${cur + 1}/${spreads().length} · PagSu/PagGiù per sfogliare`
    pagerLabel.textContent =
      mode === 'phone'
        ? `${pageLabel(selPage)} · ${selPage + 1}/${N()}`
        : `${spreadLabel(cur)} · ${cur + 1}/${spreads().length}`
  }
  // Next/previous page (phone) or spread (wider): the swipe, the pager arrows and PagSu/PagGiù.
  function goPage(delta: number) {
    if (mode === 'phone') {
      const t = clamp(selPage + delta, 0, N() - 1)
      if (t === selPage) return false
      selPage = t
    } else {
      const t = clamp(cur + delta, 0, spreads().length - 1)
      if (t === cur) return false
      cur = t
    }
    sel = null
    resetView()
    if (sheet === 'panel') setSheet('none')
    render()
    return true
  }

  function renderNavSoon() {
    clearTimeout(navTimer)
    navTimer = setTimeout(renderNav, 250)
  }
  function renderNav() {
    if (disposed) return
    nav.innerHTML = ''
    renderNavHead()
    if (compact()) return renderNavSheet()
    nav.append(
      h('div', { class: 'nav-title' }, 'Pagine'),
      h(
        'div',
        { class: 'nav-pages' },
        h('button', { class: ui.btn, title: 'Togli 4 pagine', onclick: removePages }, '−4'),
        h('b', {}, `${N()} pag.`),
        h('button', { class: ui.btn, title: 'Aggiungi 4 pagine (un foglio A4)', onclick: addPages }, '+4'),
      ),
      h(
        'div',
        { class: ui.hint, style: { marginBottom: '10px' } },
        `${N() / 4} fogli A4 · le pagine vanno a multipli di 4`,
      ),
    )
    const tw = root.classList.contains('z-touch')
      ? 124
      : window.matchMedia('(max-width: 1100px) and (min-width: 761px)').matches
        ? 124
        : 170
    const s = tw / (2 * PW * MM)
    spreads().forEach((_, i) => {
      const sp = h('div', { class: 'spread', style: { transform: `scale(${s})` } })
      sp.style.setProperty('--scale', String(s))
      renderSpreadInto(sp, i, false)
      nav.append(
        h(
          'div',
          {
            class: ui.thumb(i === cur),
            onclick: () => {
              cur = i
              sel = null
              render()
            },
          },
          h('div', { class: 'thumb-box', style: { width: tw + 'px', height: PH * MM * s + 'px' } }, sp),
          h('div', { class: 'thumb-label' }, spreadLabel(i)),
        ),
      )
    })
  }
  function renderNavHead() {
    navHead.replaceChildren(
      h('span', { class: 'z-sheet-title' }, 'Pagine'),
      h('button', { class: ui.btn, 'data-act': 'rm4', 'aria-label': 'Togli 4 pagine' }, '−4'),
      h('b', { class: 'z-count' }, `${N()} pag.`),
      h('button', { class: ui.btn, 'data-act': 'add4', 'aria-label': 'Aggiungi 4 pagine' }, '+4'),
      h('button', { class: ui.icon, 'data-act': 'sheet-close', 'aria-label': 'Chiudi' }, '✕'),
    )
  }
  // Compact: a grid of thumbnails (single pages on the phone, spreads wider) plus reorder for the current page.
  function renderNavSheet() {
    const single = mode === 'phone'
    nav.append(
      h(
        'div',
        { class: 'row z-reorder' },
        h('span', {}, `${pageLabel(selPage)}:`),
        h('button', { class: ui.btn, 'data-act': 'pg-left', disabled: selPage === 0 }, '← Sposta'),
        h('button', { class: ui.btn, 'data-act': 'pg-right', disabled: selPage === N() - 1 }, 'Sposta →'),
      ),
    )
    const grid = h('div', { class: 'z-thumbs' + (single ? ' single' : '') })
    const tw = single ? 96 : 200
    const pick = (pi: number, i: number) => () => {
      if (single) selPage = pi
      else cur = i
      sel = null
      resetView()
      setSheet('none')
      render()
    }
    if (single)
      for (let pi = 0; pi < N(); pi++) {
        const s = tw / (PW * MM)
        const sp = h('div', { class: 'spread', style: { transform: `scale(${s})` } }, renderPage(pi))
        sp.style.setProperty('--scale', String(s))
        grid.append(
          h(
            'button',
            { class: ui.thumb(pi === selPage), onclick: pick(pi, 0) },
            h('div', { class: 'thumb-box', style: { width: tw + 'px', height: PH * MM * s + 'px' } }, sp),
            h('div', { class: 'thumb-label' }, pi === 0 ? 'Copertina' : pi === N() - 1 ? 'Retro' : String(pi + 1)),
          ),
        )
      }
    else
      spreads().forEach((_, i) => {
        const s = tw / (2 * PW * MM)
        const sp = h('div', { class: 'spread', style: { transform: `scale(${s})` } })
        sp.style.setProperty('--scale', String(s))
        renderSpreadInto(sp, i, false)
        grid.append(
          h(
            'button',
            { class: ui.thumb(i === cur), onclick: pick(0, i) },
            h('div', { class: 'thumb-box', style: { width: tw + 'px', height: PH * MM * s + 'px' } }, sp),
            h('div', { class: 'thumb-label' }, spreadLabel(i)),
          ),
        )
      })
    nav.append(grid, h('p', { class: ui.hint }, `${N() / 4} fogli A4 · le pagine vanno a multipli di 4`))
  }

  /* ---------- panel ---------- */
  const field = (label: string, ctrl: Node) =>
    h('label', { class: 'field' }, h('span', { class: ui.label }, label), ctrl)
  const range = (v: number, min: number, max: number, step: number, fn: (v: number) => void) =>
    h('input', {
      type: 'range',
      class: ui.range,
      min,
      max,
      step,
      value: v,
      oninput: (e: Event) => fn(+target(e).value),
    })
  const select = (v: string, opts: Record<string, string>, fn: (v: string) => void) =>
    h(
      'select',
      { class: ui.select, onchange: (e: Event) => fn(target<HTMLSelectElement>(e).value) },
      Object.entries(opts).map(([k, l]) => h('option', { value: k, selected: k === v }, l)),
    )
  const check = (label: string, v: boolean, fn: (v: boolean) => void) =>
    h(
      'label',
      { class: 'check' },
      h('input', { type: 'checkbox', class: ui.check, checked: v, onchange: (e: Event) => fn(target(e).checked) }),
      label,
    )
  const swatches = (v: string, keys: string[], fn: (v: string) => void) =>
    h(
      'div',
      { class: 'swatches' },
      keys.map((k) =>
        h('button', {
          class: ui.swatch(k === v),
          title: k,
          'aria-label': k,
          style: { background: k === 'ink' ? zine.ink : k === 'paper' ? zine.paper : COLORS[k] },
          onclick: () => fn(k),
        }),
      ),
    )

  // Sheet header (compact): title, the element's quick actions, close. Hidden on desktop.
  function renderPanelHead(found: { el: El; pi: number } | null | '' | undefined) {
    const close = h('button', { class: ui.icon, 'data-act': 'sheet-close', 'aria-label': 'Chiudi' }, '✕')
    if (!found) {
      panelHead.replaceChildren(h('span', { class: 'z-sheet-title' }, `Zine · ${pageLabel(selPage)}`), close)
      return
    }
    const name = { text: 'Testo', image: 'Immagine', tape: 'Nastro', box: 'Blocco' }[found.el.type]
    panelHead.replaceChildren(
      h('span', { class: 'z-sheet-title' }, name),
      ...(found.el.type === 'text' ? [h('button', { class: ui.btn, 'data-act': 'el-edit' }, 'Scrivi')] : []),
      h('button', { class: ui.btn, 'data-act': 'el-dup', 'aria-label': 'Duplica', title: 'Duplica' }, '⧉'),
      h(
        'button',
        { class: ui.btn, 'data-act': 'el-front', 'aria-label': 'In primo piano', title: 'In primo piano' },
        '⬆',
      ),
      h('button', { class: ui.danger, 'data-act': 'el-del', 'aria-label': 'Elimina', title: 'Elimina' }, '🗑'),
      close,
    )
  }

  function renderPanel() {
    panel.innerHTML = ''
    const found = sel && findEl(sel)
    renderPanelHead(found)
    if (found) {
      panel.append(...elementPanel(found.el, found.pi))
      return
    }

    const page = pageAt(selPage)
    const dirtLabel = h('span', { class: ui.label }, `Sporcizia fotocopia: ${Math.round(zine.dirt * 100)}%`)
    panel.append(
      h('h3', { class: ui.heading }, 'Zine'),
      field(
        'Titolo',
        h('input', {
          type: 'text',
          class: ui.input,
          value: zine.title,
          oninput: (e: Event) => {
            zine.title = target(e).value
            save()
          },
        }),
      ),
      h(
        'label',
        { class: 'field' },
        dirtLabel,
        range(zine.dirt, 0, 1, 0.05, (v) =>
          liveChange(() => {
            zine.dirt = v
            dirtLabel.textContent = `Sporcizia fotocopia: ${Math.round(v * 100)}%`
          }),
        ),
      ),
      check('copia storta (pagine leggermente ruotate)', zine.crooked, (v) =>
        change(() => {
          zine.crooked = v
        }),
      ),
      check('numeri di pagina', zine.pageNumbers, (v) =>
        change(() => {
          zine.pageNumbers = v
        }),
      ),
      check('guide margini (non stampate)', zine.guides, (v) =>
        change(() => {
          zine.guides = v
        }),
      ),
      h(
        'div',
        { class: 'z-margins' },
        (
          [
            ['top', 'Alto mm'],
            ['bottom', 'Basso mm'],
            ['outer', 'Esterno mm'],
            ['spine', 'Dorso mm'],
          ] as const
        ).map(([side, label]) =>
          field(
            label,
            h('input', {
              type: 'number',
              class: ui.input,
              inputmode: 'decimal',
              min: 0,
              max: 60,
              step: 0.5,
              value: zine.margins[side],
              'data-margin': side,
              onchange: (e: Event) => {
                const v = parseFloat(target(e).value.replace(',', '.'))
                if (isNaN(v)) return render()
                change(() => {
                  zine.margins = setMargin(zine.margins, side, v, zine.linkMargins)
                })
              },
            }),
          ),
        ),
      ),
      check('collega alto, basso ed esterno', zine.linkMargins, (v) =>
        change(() => {
          zine.linkMargins = v
        }),
      ),
      field(
        'Colore carta (anteprima)',
        h('input', {
          type: 'color',
          class: ui.color,
          value: zine.paper,
          onchange: (e: Event) =>
            change(() => {
              zine.paper = target(e).value
            }),
        }),
      ),
      field(
        'Colore inchiostro',
        h('input', {
          type: 'color',
          class: ui.color,
          value: zine.ink,
          onchange: (e: Event) =>
            change(() => {
              zine.ink = target(e).value
            }),
        }),
      ),
      h('h3', { class: ui.heading }, `Pagina ${selPage + 1}`),
      h(
        'div',
        { class: 'row' },
        h(
          'button',
          {
            class: ui.toggle(page.bg !== 'ink'),
            onclick: () =>
              change(() => {
                page.bg = 'paper'
              }),
          },
          'Carta',
        ),
        h(
          'button',
          {
            class: ui.toggle(page.bg === 'ink'),
            onclick: () =>
              change(() => {
                page.bg = 'ink'
              }),
          },
          'Nera',
        ),
      ),
      h(
        'div',
        { class: 'row' },
        h(
          'button',
          { class: ui.btn, title: 'Scambia con la pagina precedente', onclick: () => swapPage(selPage, -1) },
          '← Sposta',
        ),
        h(
          'button',
          { class: ui.btn, title: 'Scambia con la pagina successiva', onclick: () => swapPage(selPage, 1) },
          'Sposta →',
        ),
        h(
          'button',
          {
            class: ui.btn,
            onclick: () => {
              if (confirm('Svuotare la pagina?'))
                change(() => {
                  page.els = []
                })
            },
          },
          'Svuota',
        ),
      ),
      ...(compact()
        ? [
            h(
              'p',
              { class: ui.hint },
              'Tocca un elemento per le sue proprietà, doppio tocco su un testo per scriverlo. Con due dita su un elemento lo scali e lo ruoti. Sulla pagina vuota: scorri per sfogliare, pizzica per ingrandire. Trascina le guide azzurre per spostare i margini.',
            ),
          ]
        : [
            h(
              'p',
              { class: ui.hint },
              'Clicca una pagina per selezionarla. Trascina immagini dal computer direttamente sulla pagina, oppure incollale (Ctrl/Cmd+V). Trascina le guide azzurre per spostare i margini.',
            ),
            h(
              'p',
              { class: ui.hint },
              'Scorciatoie: Canc elimina · frecce spostano (Shift = 5mm) · Cmd/Ctrl+D duplica · Shift mentre ridimensioni un testo = scala il font · Shift mentre ruoti = scatti di 15°.',
            ),
          ]),
    )
  }

  function elementPanel(el: El, pi: number): Node[] {
    const out: Node[] = [
      h(
        'h3',
        { class: ui.heading },
        { text: 'Testo', image: 'Immagine', tape: 'Nastro', box: 'Blocco' }[el.type] + ` · pag. ${pi + 1}`,
      ),
    ]
    if (el.type === 'text') {
      out.push(
        field(
          'Testo',
          h('textarea', {
            class: ui.textarea,
            value: el.text,
            oninput: (e: Event) =>
              liveChange(() => {
                el.text = target<HTMLTextAreaElement>(e).value
              }),
          }),
        ),
        field(
          'Font',
          select(el.font, FONTS, (v) =>
            change(() => {
              el.font = v
            }),
          ),
        ),
        field(
          'Dimensione',
          range(el.size, 2, 40, 0.2, (v) =>
            liveChange(() => {
              el.size = v
            }),
          ),
        ),
        field(
          'Colore',
          swatches(el.color, COLOR_KEYS, (v) =>
            change(() => {
              el.color = v
            }),
          ),
        ),
      )
      if (el.font === 'ransom')
        out.push(
          h(
            'div',
            { class: 'row' },
            h(
              'button',
              {
                class: ui.btn,
                onclick: () =>
                  change(() => {
                    el.seed = seed()
                  }),
              },
              '🎲 Rimescola lettere',
            ),
          ),
        )
      else
        out.push(
          field(
            'Sfondo',
            select(el.bg, { none: 'Nessuno', strips: 'Strisce ritagliate', block: 'Blocco pieno' }, (v) =>
              change(() => {
                el.bg = v
              }),
            ),
          ),
          h(
            'div',
            { class: 'row' },
            (['left', 'center', 'right', 'justify'] as const).map((a) =>
              h(
                'button',
                {
                  class: ui.toggle(el.align === a),
                  'aria-label': a,
                  onclick: () =>
                    change(() => {
                      el.align = a
                    }),
                },
                { left: '⇤', center: '↔', right: '⇥', justify: '☰' }[a],
              ),
            ),
          ),
        )
    } else if (el.type === 'image') {
      const reprocess = async (fn: () => void) => {
        pushHistory()
        fn()
        await processImage(el)
        save()
        render()
      }
      let ctTimer: ReturnType<typeof setTimeout> | undefined
      out.push(
        field(
          'Effetto',
          select(el.mode, IMG_MODES, (v) => {
            void reprocess(() => {
              el.mode = v
            })
          }),
        ),
        field(
          'Contrasto',
          range(el.contrast, -80, 150, 5, (v) => {
            clearTimeout(ctTimer)
            ctTimer = setTimeout(() => {
              void reprocess(() => {
                el.contrast = v
              })
            }, 150)
          }),
        ),
        field(
          'Inchiostro',
          swatches(
            el.tint,
            COLOR_KEYS.filter((k) => k !== 'paper'),
            (v) => {
              void reprocess(() => {
                el.tint = v
              })
            },
          ),
        ),
        check('inverti', el.invert, (v) => {
          void reprocess(() => {
            el.invert = v
          })
        }),
        check('il bianco diventa trasparente (multiply)', el.multiply, (v) =>
          change(() => {
            el.multiply = v
          }),
        ),
        h(
          'div',
          { class: 'row' },
          h(
            'button',
            {
              class: ui.btn,
              title: 'Tutta la foto visibile, dentro i margini',
              onclick: () => change(() => fitImage(el, pi, 'contain')),
            },
            'Adatta',
          ),
          h(
            'button',
            {
              class: ui.btn,
              title: 'Riempie la pagina fino al bordo (al vivo)',
              onclick: () => change(() => fitImage(el, pi, 'cover')),
            },
            'Riempi al vivo',
          ),
        ),
      )
    } else if (el.type === 'tape') {
      out.push(
        field(
          'Tipo',
          select(el.color, { masking: 'Carta', clear: 'Trasparente', pink: 'Rosa', black: 'Nero (isolante)' }, (v) =>
            change(() => {
              el.color = v
            }),
          ),
        ),
      )
    } else {
      out.push(
        field(
          'Colore',
          swatches(el.fill, COLOR_KEYS, (v) =>
            change(() => {
              el.fill = v
            }),
          ),
        ),
        field(
          'Opacità',
          range(el.opacity, 0.1, 1, 0.05, (v) =>
            liveChange(() => {
              el.opacity = v
            }),
          ),
        ),
      )
    }
    const nums = el as unknown as Record<string, number>
    const keys: [string, string][] = [
      ['x', 'X'],
      ['y', 'Y'],
      ['w', 'L'],
      ...(el.type === 'text' ? [] : ([['h', 'A']] as [string, string][])),
      ['rot', '°'],
    ]
    out.push(
      h('h3', { class: ui.heading }, 'Posizione'),
      h(
        'div',
        { class: 'z-pos' },
        ...keys.map(([k, l]) =>
          field(
            l,
            h('input', {
              type: 'number',
              class: ui.input,
              step: k === 'rot' ? 1 : 0.5,
              value: nums[k] || 0,
              onchange: (e: Event) =>
                change(() => {
                  const v = +target(e).value
                  if (el.type === 'image' && k === 'w') el.h = r1((v * el.h) / el.w)
                  if (el.type === 'image' && k === 'h') el.w = r1((v * el.w) / el.h)
                  nums[k] = v
                }),
            }),
          ),
        ),
      ),
      h(
        'div',
        { class: 'row' },
        h(
          'button',
          {
            class: ui.btn,
            onclick: () =>
              change(() => {
                el.z = nextZ(pi)
              }),
          },
          'In primo piano',
        ),
        h(
          'button',
          {
            class: ui.btn,
            onclick: () =>
              change(() => {
                const els = pageAt(pi).els
                els.forEach((e) => {
                  e.z = (e.z || 0) + 1
                })
                el.z = 0
              }),
          },
          'Sullo sfondo',
        ),
      ),
      h(
        'div',
        { class: 'row' },
        h('button', { class: ui.btn, onclick: duplicate }, 'Duplica'),
        h('button', { class: ui.btn, onclick: () => moveToOtherPage(el, pi) }, 'Sposta su altra pag.'),
        h('button', { class: ui.danger, onclick: removeSel }, 'Elimina'),
      ),
    )
    return out
  }

  function render() {
    if (disposed) return
    renderStage()
    renderPanel()
    renderNavSoon()
  }

  /* ---------- actions ---------- */
  function addEl(type: 'text' | 'tape' | 'box') {
    const pi = selPage,
      z = nextZ(pi)
    const base = { id: uid(), z, rot: 0 }
    const el: El =
      type === 'text'
        ? newText({ ...base, x: 20, y: 80 })
        : type === 'tape'
          ? { ...base, type, x: 50, y: 40, w: 45, h: 11, rot: -6, color: 'masking' }
          : { ...base, type: 'box', x: 24, y: 60, w: 100, h: 50, fill: 'ink', opacity: 1 }
    change(() => {
      pageAt(pi).els.push(el)
      sel = el.id
    })
    if (compact()) setSheet('panel')
  }
  function removeSel() {
    const f = sel && findEl(sel)
    if (!f) return
    change(() => {
      pageAt(f.pi).els = pageAt(f.pi).els.filter((e) => e.id !== sel)
      sel = null
    })
    if (sheet === 'panel') setSheet('none')
  }
  function duplicate() {
    const f = sel && findEl(sel)
    if (!f) return
    const c: El = { ...structuredClone(f.el), id: uid(), x: f.el.x + 5, y: f.el.y + 5, z: nextZ(f.pi) }
    change(() => {
      pageAt(f.pi).els.push(c)
      sel = c.id
    })
  }
  function moveToOtherPage(el: El, pi: number) {
    const to = prompt(`Sposta su quale pagina? (1–${N()})`, String(pi + 1 === N() ? 1 : pi + 2))
    const t = parseInt(to ?? '', 10) - 1
    if (isNaN(t) || t < 0 || t >= N() || t === pi) return
    change(() => {
      pageAt(pi).els = pageAt(pi).els.filter((e) => e.id !== el.id)
      el.z = nextZ(t)
      pageAt(t).els.push(el)
      cur = spreads().findIndex((s) => s.includes(t))
      selPage = t
    })
  }
  function fitImage(el: ImageEl, pi: number, how: 'contain' | 'cover') {
    const ar = el.h / el.w
    const m = how === 'contain' ? pageBox(zine.margins, pi) : { top: 0, bottom: 0, left: 0, right: 0 }
    const bw = PW - m.left - m.right,
      bh = PH - m.top - m.bottom
    const byHeight = how === 'contain' ? ar > bh / bw : ar < bh / bw
    if (byHeight) {
      el.h = bh
      el.w = r1(bh / ar)
    } else {
      el.w = bw
      el.h = r1(bw * ar)
    }
    el.x = r1(m.left + (bw - el.w) / 2)
    el.y = r1(m.top + (bh - el.h) / 2)
    el.rot = 0
  }
  function swapPage(pi: number, dir: number) {
    const t = pi + dir
    if (t < 0 || t >= N()) return
    change(() => {
      ;[zine.pages[pi], zine.pages[t]] = [pageAt(t), pageAt(pi)]
      selPage = t
      cur = spreads().findIndex((s) => s.includes(t))
    })
  }
  function addPages() {
    change(() => {
      zine.pages.splice(N() - 1, 0, ...Array.from({ length: 4 }, (): Page => ({ bg: 'paper', els: [] })))
    })
  }
  function removePages() {
    if (N() <= 4) return
    const doomed = zine.pages.slice(N() - 5, N() - 1)
    if (doomed.some((p) => p.els.length) && !confirm(`Le pagine ${N() - 4}–${N() - 1} non sono vuote. Eliminarle?`))
      return
    change(() => {
      zine.pages.splice(N() - 5, 4)
      sel = null
      cur = clamp(cur, 0, spreads().length - 1)
    })
  }
  function downloadBlob(name: string, blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = h('a', { href: url, download: name })
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  /* ---------- print / imposition ---------- */
  // Builds the imposed sheets into `into`; returns the sheet size in mm. Used by print and by the PDF.
  function buildSheets(opt: PrintOptions, into: HTMLElement) {
    into.innerHTML = ''
    into.classList.toggle('no-paper', !opt.paper)
    setVars()
    if (opt.mode === 'single') {
      for (let pi = 0; pi < N(); pi++) into.append(h('div', { class: 'sheet a5' }, renderPage(pi)))
      return { w: 148, h: 210 }
    }
    for (const s of selectSides(N(), opt.sides)) {
      const shift = s.i * opt.creep // fogli interni: contenuto verso il dorso
      const sheet = h(
        'div',
        { class: 'sheet' },
        renderPage(s.pages[0], { creep: shift }),
        renderPage(s.pages[1], { creep: -shift }),
      )
      if (opt.marks) sheet.append(h('div', { class: 'fold t' }), h('div', { class: 'fold b' }))
      into.append(sheet)
    }
    return { w: 297, h: 210 }
  }
  async function sheetsReady(into: HTMLElement) {
    await Promise.all(FONT_FACES.map((f) => document.fonts.load(f).catch(() => [])))
    await document.fonts.ready
    await Promise.all([...into.querySelectorAll('img')].map((i) => i.decode().catch(() => {})))
  }
  function printInfo() {
    const f = printForm.elements
    const mode = (f.namedItem('mode') as HTMLSelectElement).value,
      n = N()
    q('.booklet-only').style.display = mode === 'booklet' ? '' : 'none'
    q('.z-info').innerHTML =
      mode === 'booklet'
        ? `${n} pagine → <b>${n / 4} fogli A4</b> fronte/retro.<br>Stampa: <b>orizzontale</b>, margini <b>nessuno</b>, scala <b>100%</b>, fronte-retro <b>lato corto</b>.<br>Piega a metà, impila i fogli uno dentro l'altro, spilla sul dorso (2 punti).<br><b>Scarica PDF</b> fa un file già impaginato (A4 orizzontale) da stampare dove vuoi.`
        : `${n} pagine A5 singole in ordine, già ruotate e numerate. Perfetto da mandare in copisteria per spirale o brossura: chiedi “imposizione libretto” se vogliono farla loro.`
  }
  function readPrintForm(): PrintOptions {
    const f = printForm.elements
    const val = (n: string) => (f.namedItem(n) as HTMLInputElement).value
    const chk = (n: string) => (f.namedItem(n) as HTMLInputElement).checked
    return {
      mode: val('mode') === 'single' ? 'single' : 'booklet',
      sides: val('sides') as PrintOptions['sides'],
      creep: +val('creep') || 0,
      marks: chk('marks'),
      paper: chk('paper'),
    }
  }
  function openPrint() {
    if (pdfBusy || printDlg.open) return
    const f = printForm.elements
    const p = zine.print
    ;(f.namedItem('mode') as HTMLSelectElement).value = p.mode
    ;(f.namedItem('sides') as HTMLSelectElement).value = p.sides
    ;(f.namedItem('creep') as HTMLInputElement).value = String(p.creep)
    ;(f.namedItem('marks') as HTMLInputElement).checked = p.marks
    ;(f.namedItem('paper') as HTMLInputElement).checked = p.paper
    printForm.oninput = printInfo
    printInfo()
    printDlg.returnValue = ''
    printDlg.showModal()
  }
  async function onPrintClose() {
    const action = printDlg.returnValue
    if (action !== 'ok' && action !== 'pdf') return
    zine.print = readPrintForm()
    flushSave()
    if (action === 'pdf') return makePdf(zine.print)
    buildSheets(zine.print, printRoot)
    pageStyle.textContent =
      zine.print.mode === 'single'
        ? '@page { size: 148mm 210mm; margin: 0; }'
        : '@page { size: 297mm 210mm; margin: 0; }'
    await sheetsReady(printRoot)
    if (disposed) return
    const prev = document.title
    document.title = slug(zine.title)
    window.print()
    document.title = prev
  }

  /* ---------- Scarica PDF ---------- */
  const progMsg = progDlg.querySelector('.z-progress-msg')!
  const progBar = progDlg.querySelector('progress')!
  const progActions = progDlg.querySelector('.dlg-actions')!
  let cancelPdf = false
  function progress(msg: string, value: number | null, actions: HTMLElement[] = []) {
    progMsg.textContent = msg
    if (value == null) progBar.removeAttribute('value')
    else progBar.value = value
    progBar.style.display = value === 1 && actions.length ? 'none' : ''
    progActions.replaceChildren(...actions)
    if (!progDlg.open) progDlg.showModal()
  }
  const closeBtn = (label = 'Chiudi') =>
    h('button', { class: ui.btn, type: 'button', onclick: () => progDlg.close() }, label)

  async function makePdf(opt: PrintOptions) {
    if (pdfBusy) return
    pdfBusy = true
    cancelPdf = false
    const cancel = h(
      'button',
      {
        class: ui.btn,
        type: 'button',
        onclick: () => {
          cancelPdf = true
        },
      },
      'Annulla',
    )
    try {
      progress('Preparo i fogli…', null, [cancel])
      const size = buildSheets(opt, pdfRoot)
      pdfRoot.classList.add('on')
      const [{ renderSheetsToPdf }] = await Promise.all([import('./pdf'), sheetsReady(pdfRoot)])
      const sheets = [...pdfRoot.querySelectorAll<HTMLElement>('.sheet')]
      const blob = await renderSheetsToPdf(sheets, {
        widthMm: size.w,
        heightMm: size.h,
        dpi: PDF_DPI,
        title: zine.title,
        onProgress: (done, total) =>
          progress(`Foglio ${Math.min(done + 1, total)} di ${total}…`, done / total, [cancel]),
        isCancelled: () => cancelPdf || disposed,
      })
      if (!blob || disposed) {
        if (progDlg.open) progDlg.close()
        return
      }
      await deliverPdf(blob, slug(zine.title) + '.pdf')
    } catch (e) {
      console.error('PDF failed', e)
      if (!disposed)
        progress('Non sono riuscito a creare il PDF: ' + (e instanceof Error ? e.message : String(e)), 0, [closeBtn()])
    } finally {
      pdfRoot.classList.remove('on')
      pdfRoot.innerHTML = ''
      pdfBusy = false
    }
  }

  // iPhone/iPad: Web Share with the file (Salva su File, AirDrop, stampa…). It needs a fresh tap after the
  // long render, so the share happens on a button. Desktop: plain download.
  async function deliverPdf(blob: Blob, name: string) {
    const file = new File([blob], name, { type: 'application/pdf' })
    const mb = (blob.size / 1024 / 1024).toFixed(1)
    const canShare = isTouchDevice() && !!navigator.canShare?.({ files: [file] })
    if (!canShare) {
      downloadBlob(name, blob)
      progress(`PDF pronto: ${name} (${mb} MB). Controlla i download.`, 1, [closeBtn('OK')])
      return
    }
    const share = h(
      'button',
      {
        class: ui.primary,
        type: 'button',

        onclick: () => {
          navigator
            .share({ files: [file], title: zine.title })
            .then(() => progDlg.close())
            .catch((e: unknown) => {
              if (e instanceof DOMException && e.name === 'AbortError') return
              downloadBlob(name, blob)
            })
        },
      },
      'Condividi / salva PDF',
    )
    const dl = h('button', { class: ui.btn, type: 'button', onclick: () => downloadBlob(name, blob) }, 'Scarica')
    progress(`PDF pronto: ${name} (${mb} MB).`, 1, [closeBtn(), dl, share])
  }

  /* ---------- text editing ---------- */
  function editText(elD: HTMLElement) {
    if (editing) return
    const found = findEl(elD.dataset.id ?? '')
    if (!found || found.el.type !== 'text') return
    const el = found.el
    const t = elD.querySelector<HTMLElement>('.txt')
    if (!t) return
    t.textContent = el.text
    t.style.background = ''
    t.style.color = ''
    t.style.padding = ''
    t.contentEditable = 'plaintext-only'
    if (t.contentEditable !== 'plaintext-only') t.contentEditable = 'true'
    editing = true
    editNode = elD
    // Compact: the keyboard needs the room; the visualViewport handler keeps the text above it.
    if (compact()) setSheet('none')
    t.focus()
    const rg = document.createRange()
    rg.selectNodeContents(t)
    const s = getSelection()
    s?.removeAllRanges()
    s?.addRange(rg)
    setTimeout(ensureSelVisible, 350)
    t.addEventListener(
      'blur',
      () => {
        editing = false
        editNode = null
        const v = t.innerText.replace(/\n$/, '')
        if (v !== el.text)
          change(() => {
            el.text = v
          })
        else render()
      },
      { once: true },
    )
  }

  /* ---------- events ---------- */
  const signal = ac.signal
  function setMenu(open: boolean) {
    menu.hidden = !open
    moreBtn.setAttribute('aria-expanded', String(open))
  }
  root.addEventListener(
    'click',
    (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')
      const act = btn?.dataset.act
      if (!act || !root.contains(btn)) return
      if (act !== 'menu') setMenu(false)
      const f = () => (sel ? findEl(sel) : null)
      const acts: Record<string, () => void> = {
        text: () => addEl('text'),
        tape: () => addEl('tape'),
        box: () => addEl('box'),
        image: () => fileImg.click(),
        undo,
        redo,
        print: openPrint,
        open: () => fileJson.click(),
        export: () =>
          downloadBlob(slug(zine.title) + '.zine.json', new Blob([JSON.stringify(zine)], { type: 'application/json' })),
        new: () => {
          if (confirm('Nuova zine? Quella attuale verrà sostituita (salvala prima in .json se ti serve).')) {
            pushHistory()
            zine = blankZine()
            cur = 0
            selPage = 0
            sel = null
            resetView()
            afterLoad()
          }
        },
        menu: () => setMenu(menu.hidden === true),
        settings: () => {
          sel = null
          render()
          setSheet('panel', 'full')
        },
        props: () => toggleSheet('panel'),
        pages: () => toggleSheet('nav'),
        prev: () => void goPage(-1),
        next: () => void goPage(1),
        'sheet-close': () => setSheet('none'),
        'el-edit': () => {
          const n = selNode()
          if (n) editText(n)
        },
        'el-dup': duplicate,
        'el-front': () => {
          const x = f()
          if (x)
            change(() => {
              x.el.z = nextZ(x.pi)
            })
        },
        'el-del': removeSel,
        'pg-left': () => swapPage(selPage, -1),
        'pg-right': () => swapPage(selPage, 1),
        add4: addPages,
        rm4: removePages,
      }
      acts[act]?.()
    },
    { signal },
  )
  // Close the ⋯ menu on any press outside it.
  root.addEventListener(
    'pointerdown',
    (e) => {
      if (menu.hidden !== true && !(e.target as HTMLElement).closest('.z-menu, .z-more')) setMenu(false)
    },
    { signal, capture: true },
  )
  // Sheet header: tap = half/full, drag down = smaller/close, drag up = full.
  for (const box of [panelSheet, navSheet])
    box.querySelector('.z-sheet-head')!.addEventListener(
      'pointerdown',
      (e) => {
        const pe = e as PointerEvent
        if ((pe.target as HTMLElement).closest('button')) return
        sheetDrag = { sy: pe.clientY, dy: 0, box, moved: false }
        pe.preventDefault()
      },
      { signal },
    )

  printDlg.addEventListener('close', () => void onPrintClose(), { signal })
  fileImg.addEventListener(
    'change',
    () => {
      void addImageFiles([...(fileImg.files ?? [])])
      fileImg.value = ''
    },
    { signal },
  )
  fileJson.addEventListener(
    'change',
    async () => {
      const f = fileJson.files?.[0]
      fileJson.value = ''
      if (!f) return
      try {
        const z = JSON.parse(await f.text()) as Partial<ZineDoc>
        if (!Array.isArray(z.pages) || z.pages.length % 4) throw new Error('file non valido')
        pushHistory()
        zine = loadDoc(z)
        cur = 0
        sel = null
        afterLoad()
      } catch (err) {
        alert('Impossibile aprire: ' + (err instanceof Error ? err.message : String(err)))
      }
    },
    { signal },
  )

  const two = () => {
    const [a, b] = [...touches.values()] as [Pt, Pt]
    return {
      d: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
      c: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    }
  }
  // A second finger: pinch the element being dragged, or zoom the page area if the first finger was on
  // empty space.
  function startPinch() {
    const p = two()
    if (gesture?.kind === 'margin') {
      finishMargin(gesture)
      gesture = { kind: 'dead' }
    } else if (drag && drag.pointerType === 'touch') {
      const { el, node, snap } = drag
      drag = null
      gesture = {
        kind: 'pinch-el',
        el,
        node,
        snap,
        start: { ...el },
        hmm: node.offsetHeight / MM,
        d0: p.d,
        a0: p.a,
        c0: p.c,
      }
    } else if (gesture?.kind === 'view' && compact()) {
      spreadWrap.style.translate = ''
      const st = stage.getBoundingClientRect()
      const c = { x: p.c.x - st.left, y: p.c.y - st.top }
      const left = spreadWrap.offsetLeft,
        top = spreadWrap.offsetTop
      gesture = { kind: 'pinch-view', d0: p.d, c0: c, vz0: vz, u0: { x: (c.x - left) / scale, y: (c.y - top) / scale } }
    } else {
      drag = null
      gesture = { kind: 'dead' }
    }
  }
  function moveGesture(e: PointerEvent, g: Gesture) {
    if (g.kind === 'margin') {
      if (e.pointerId !== g.id) return
      const dx = e.clientX - g.sx,
        dy = e.clientY - g.sy
      if (!g.moved && Math.hypot(dx, dy) < (g.pointerType === 'mouse' ? 2 : 6)) return
      if (!g.moved) {
        g.moved = true
        g.grip.classList.add('on')
        spreadEl.classList.add('z-margin-drag')
      }
      const k = 1 / (scale * MM)
      const delta = { top: dy, bottom: -dy, left: dx, right: -dx }[g.edge] * k
      zine.margins = setMargin(g.start, g.side, g.start[g.side] + delta, zine.linkMargins)
      g.grip.dataset.mm = `${String(zine.margins[g.side]).replace('.', ',')} mm`
      updateGuides()
      return
    }
    if (g.kind === 'view') {
      if (e.pointerId !== g.id) return
      const dx = e.clientX - g.sx,
        dy = e.clientY - g.sy
      if (!g.moved && Math.hypot(dx, dy) < 8) return
      g.moved = true
      if (!g.axis) g.axis = vz > 1 ? 'pan' : Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (g.axis === 'x') spreadWrap.style.translate = `${dx}px 0`
      else {
        if (g.axis === 'pan') vx = g.vx0 + dx
        vy = g.vy0 + dy
        layoutStage()
      }
    } else if (g.kind === 'pinch-view' && touches.size >= 2) {
      const p = two()
      const st = stage.getBoundingClientRect()
      vz = clamp((g.vz0 * p.d) / g.d0, 1, 5)
      const s = baseScale * vz,
        pos = centerPos(s)
      vx = p.c.x - st.left - g.u0.x * s - pos.left
      vy = p.c.y - st.top - g.u0.y * s - pos.top
      layoutStage()
    } else if (g.kind === 'pinch-el' && touches.size >= 2) {
      const p = two()
      // At most ~3 page widths, at least a few mm.
      const k = clamp(p.d / g.d0, 3 / g.start.w, (3 * PW) / g.start.w),
        s = g.start,
        el = g.el
      const cx = s.x + s.w / 2 + (p.c.x - g.c0.x) / (scale * MM),
        cy = s.y + g.hmm / 2 + (p.c.y - g.c0.y) / (scale * MM)
      el.w = Math.max(3, r1(s.w * k))
      let hmm = g.hmm * k
      if ((el.type === 'image' || el.type === 'tape' || el.type === 'box') && 'h' in s)
        hmm = el.h = Math.max(2, r1(s.h * k))
      if (el.type === 'text' && s.type === 'text') el.size = r1(clamp(s.size * k, 1, 80))
      el.rot = Math.round((s.rot || 0) + p.a - g.a0)
      el.x = r1(cx - el.w / 2)
      el.y = r1(cy - hmm / 2)
      applyElStyle(g.node, el)
    }
  }
  // Tap on empty space (touch): what a press there does with a mouse, deferred to the lift so a swipe or a
  // pinch does not deselect.
  function tapEmpty(tgt: HTMLElement) {
    if (editing) (document.activeElement as HTMLElement | null)?.blur()
    const pageD = tgt.closest<HTMLElement>('.z-spread .page')
    if (sheet === 'panel') setSheet('none')
    if (!pageD) {
      if (sel) {
        sel = null
        render()
      }
      return
    }
    const pi = +(pageD.dataset.pi ?? 0)
    const changed = sel || selPage !== pi
    selPage = pi
    sel = null
    if (changed) {
      renderStage()
      renderPanel()
    }
  }
  // End of a margin drag: one undo step and a save if it moved; a press that did not move is a tap on the page.
  function finishMargin(g: Extract<Gesture, { kind: 'margin' }>, tap = false) {
    g.grip.classList.remove('on')
    spreadEl.classList.remove('z-margin-drag')
    if (!g.moved) {
      if (tap) tapEmpty(g.target)
      return
    }
    pushHistory(g.snap)
    save()
    renderPanel()
  }
  function endGesture(e: PointerEvent, g: Gesture) {
    if (g.kind === 'margin') {
      if (e.pointerId !== g.id) return
      finishMargin(g, e.type === 'pointerup')
      gesture = touches.size ? { kind: 'dead' } : null
      return
    }
    if (g.kind === 'view') {
      if (e.pointerId !== g.id) return
      gesture = null
      const dx = e.clientX - g.sx
      spreadWrap.style.translate = ''
      if (!g.moved) {
        if (e.type === 'pointerup') tapEmpty(g.target)
      } else if (g.axis === 'x') {
        if (Math.abs(dx) < 60 || !goPage(dx < 0 ? 1 : -1)) {
          // Snap back: let the translate glide to 0.
          spreadWrap.style.translate = `${dx}px 0`
          spreadWrap.classList.add('z-anim')
          requestAnimationFrame(() => {
            spreadWrap.style.translate = ''
            setTimeout(() => spreadWrap.classList.remove('z-anim'), 240)
          })
        }
      }
      return
    }
    if (g.kind === 'pinch-el') {
      pushHistory(g.snap)
      save()
      renderPanel()
      renderNavSoon()
    }
    gesture = touches.size ? { kind: 'dead' } : null
  }

  stage.addEventListener(
    'pointerdown',
    (e) => {
      let tgt = e.target as HTMLElement
      if (tgt.closest('[contenteditable]')) return
      if (e.button > 0) return
      if (tgt.closest('.z-pager')) return
      if (e.pointerType === 'touch') {
        touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
        if (touches.size > 1) {
          if (touches.size === 2) startPinch()
          e.preventDefault()
          return
        }
        if (gesture) gesture = null
      }
      // Margin guides: the knob grabs unless the selected element (or its handles) is under the finger; the
      // rest of the edge strip also lets any element under it win.
      const grip = tgt.closest<HTMLElement>('.z-spread .gh')
      if (grip) {
        const knob = !!tgt.closest('.gh-knob')
        const under = document
          .elementsFromPoint(e.clientX, e.clientY)
          .find(
            (n) =>
              n instanceof HTMLElement &&
              !n.closest('.guides') &&
              (n.classList.contains('handle') || !!n.closest(knob ? '.el.selected' : '.el')),
          ) as HTMLElement | undefined
        if (under) tgt = under
        else {
          const pageD = grip.closest<HTMLElement>('.page')!
          const edge = grip.dataset.edge as Edge
          const side = sideOf(edge, +(pageD.dataset.pi ?? 0))
          if (editing) (document.activeElement as HTMLElement | null)?.blur()
          gesture = {
            kind: 'margin',
            id: e.pointerId,
            edge,
            side,
            sx: e.clientX,
            sy: e.clientY,
            start: { ...zine.margins },
            snap: structuredClone(zine),
            moved: false,
            pointerType: e.pointerType,
            grip,
            target: pageD,
          }
          grip.dataset.mm = `${String(zine.margins[side]).replace('.', ',')} mm`
          e.preventDefault()
          return
        }
      }
      const pageD = tgt.closest<HTMLElement>('.z-spread .page')
      // Compact + finger on empty space: a view gesture, resolved on lift (tap / swipe / pan / pinch).
      if (e.pointerType === 'touch' && compact() && !tgt.closest('.z-spread .el')) {
        gesture = {
          kind: 'view',
          id: e.pointerId,
          sx: e.clientX,
          sy: e.clientY,
          vx0: vx,
          vy0: vy,
          moved: false,
          axis: '',
          target: tgt,
        }
        e.preventDefault()
        return
      }
      if (!pageD) {
        if (sel) {
          sel = null
          render()
        }
        return
      }
      if (editing) (document.activeElement as HTMLElement | null)?.blur()
      const pi = +(pageD.dataset.pi ?? 0)
      const elD = tgt.closest<HTMLElement>('.el')
      if (!elD) {
        const changed = sel || selPage !== pi
        selPage = pi
        sel = null
        if (changed) {
          renderStage()
          renderPanel()
        }
        return
      }
      const id = elD.dataset.id ?? ''
      const isHandle = tgt.classList.contains('handle')
      if (sel !== id || selPage !== pi) {
        sel = id
        selPage = pi
        renderStage()
        renderPanel()
      }
      const node = spreadEl.querySelector<HTMLElement>(`.el[data-id="${id}"]`)
      const found = findEl(id)
      if (!node || !found) return
      const r = node.getBoundingClientRect()
      drag = {
        el: found.el,
        node,
        mode: isHandle ? (tgt.classList.contains('rotate') ? 'rotate' : 'resize') : 'move',
        sx: e.clientX,
        sy: e.clientY,
        start: { ...found.el },
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        snap: structuredClone(zine),
        moved: false,
        pointerType: e.pointerType,
      }
      e.preventDefault()
    },
    { signal },
  )
  on(window, 'pointermove', (e) => {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (gesture) return moveGesture(e, gesture)
    if (sheetDrag) {
      sheetDrag.dy = e.clientY - sheetDrag.sy
      if (Math.abs(sheetDrag.dy) > 6) sheetDrag.moved = true
      if (sheetDrag.moved) sheetDrag.box.style.translate = `0 ${Math.max(0, sheetDrag.dy)}px`
      return
    }
    if (!drag) return
    // A finger jitters more than a mouse: bigger dead zone before a tap becomes a drag.
    const dead = drag.pointerType === 'mouse' ? 3 : 8
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < dead) return
    drag.moved = true
    const k = 1 / (scale * MM),
      dx = (e.clientX - drag.sx) * k,
      dy = (e.clientY - drag.sy) * k
    const el = drag.el,
      s = drag.start
    if (drag.mode === 'move') {
      el.x = r1(s.x + dx)
      el.y = r1(s.y + dy)
    } else if (drag.mode === 'resize') {
      const a = (-(s.rot || 0) * Math.PI) / 180
      const lx = dx * Math.cos(a) - dy * Math.sin(a),
        ly = dx * Math.sin(a) + dy * Math.cos(a)
      el.w = Math.max(3, r1(s.w + lx))
      if (el.type === 'image' && s.type === 'image') el.h = r1((el.w * s.h) / s.w)
      else if (el.type === 'tape' || el.type === 'box') el.h = Math.max(2, r1((s as TapeEl | BoxEl).h + ly))
      else if (el.type === 'text' && s.type === 'text' && e.shiftKey) el.size = r1(clamp((s.size * el.w) / s.w, 1, 80))
    } else {
      const ang = (Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx) * 180) / Math.PI + 45 // maniglia in alto a destra
      el.rot = e.shiftKey ? Math.round(ang / 15) * 15 : Math.round(ang)
    }
    applyElStyle(drag.node, el)
  })
  const endDrag = (e: PointerEvent) => {
    touches.delete(e.pointerId)
    if (gesture) return endGesture(e, gesture)
    if (sheetDrag) {
      const { dy, moved, box } = sheetDrag
      sheetDrag = null
      box.style.translate = ''
      if (!moved) setSheet(sheet, sheetSize === 'half' ? 'full' : 'half')
      else if (dy > 60) setSheet(sheetSize === 'full' ? sheet : 'none', 'half')
      else if (dy < -40) setSheet(sheet, 'full')
      return
    }
    const d = drag
    drag = null
    if (!d) return
    if (d.moved) {
      pushHistory(d.snap)
      save()
      renderPanel()
      renderNavSoon()
      return
    }
    // Touch/pen: a double tap on a text starts editing (iPad has no reliable dblclick). On pointerup so iOS
    // treats the focus as user-initiated and shows the keyboard.
    if (e.type !== 'pointerup' || d.pointerType === 'mouse') return
    const now = Date.now()
    if (d.el.type === 'text' && lastTap?.id === d.el.id && now - lastTap.t < 450) {
      lastTap = null
      clearTimeout(sheetTimer)
      const elD = spreadEl.querySelector<HTMLElement>(`.el[data-id="${d.el.id}"]`)
      if (elD) editText(elD)
    } else {
      lastTap = { id: d.el.id, t: now }
      // Compact: a tap on an element opens its properties, after the double-tap window so the sheet (and
      // the pan that keeps the element visible) does not move the target under a second tap.
      if (compact() && sheet !== 'panel') {
        clearTimeout(sheetTimer)
        sheetTimer = setTimeout(() => setSheet('panel'), d.el.type === 'text' ? 460 : 60)
      }
    }
  }
  on(window, 'pointerup', endDrag)
  on(window, 'pointercancel', endDrag)

  stage.addEventListener(
    'dblclick',
    (e) => {
      const elD = (e.target as HTMLElement).closest<HTMLElement>('.z-spread .el-text')
      if (elD) editText(elD)
    },
    { signal },
  )

  // Drops land anywhere in the editor (page, panels, thumbnails). While the zine is mounted the window also
  // swallows drops, so a near miss never makes the browser open the image in place of the app.
  const hasFiles = (e: DragEvent) =>
    [...(e.dataTransfer?.types ?? [])].some((t) => t === 'Files' || t === 'text/uri-list')
  on(window, 'dragover', (e) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = root.contains(e.target as Node) ? 'copy' : 'none'
  })
  on(window, 'drop', (e) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    if (!root.contains(e.target as Node)) return
    const pageD = (e.target as HTMLElement).closest<HTMLElement>('.z-spread .page')
    const pi = pageD ? +(pageD.dataset.pi ?? 0) : selPage
    const files = [...(e.dataTransfer?.files ?? [])]
    if (files.length) return void addImageFiles(files, pi)
    // An image dragged from another web page: only a URL comes along. Fetch it if the site allows (CORS).
    const url = e.dataTransfer
      ?.getData('text/uri-list')
      .split('\n')
      .find((l) => l && !l.startsWith('#'))
    if (!url) return
    void fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) =>
        addImageFiles([new File([b], url.split('/').pop()?.split('?')[0] || 'immagine', { type: b.type })], pi),
      )
      .catch(() => alert("Questo sito non lascia copiare l'immagine: salvala sul computer e trascina il file."))
  })
  // Focus somewhere in the dashboard outside the editor (palette, dialogs): leave keys and paste alone.
  const focusElsewhere = () => {
    const a = document.activeElement
    return !!a && a !== document.body && !root.contains(a)
  }
  on(window, 'paste', (e) => {
    if (editing || focusElsewhere() || /INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '')) return
    const files = [...(e.clipboardData?.items ?? [])].filter((i) => i.kind === 'file').map((i) => i.getAsFile())
    if (files.length) {
      e.preventDefault()
      void addImageFiles(files)
    }
  })

  on(window, 'keydown', (e) => {
    if (
      editing ||
      focusElsewhere() ||
      /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName ?? '') ||
      printDlg.open ||
      progDlg.open
    )
      return
    const mod = e.metaKey || e.ctrlKey
    const key = e.key.toLowerCase()
    if (mod && key === 'z') {
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
      return
    }
    if (mod && key === 'y') {
      e.preventDefault()
      redo()
      return
    }
    if (mod && key === 'd') {
      e.preventDefault()
      duplicate()
      return
    }
    if (mod && key === 'p') {
      e.preventDefault()
      openPrint()
      return
    }
    if (mod) return
    if (e.key === 'PageDown') {
      goPage(1)
      return
    }
    if (e.key === 'PageUp') {
      goPage(-1)
      return
    }
    if (e.key === 'Escape') {
      sel = null
      render()
      return
    }
    const f = sel && findEl(sel)
    if (!f) return
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      removeSel()
      return
    }
    const step = e.shiftKey ? 5 : 1
    const mv = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as const)[
      e.key as 'ArrowLeft'
    ]
    if (mv) {
      e.preventDefault()
      liveChange(() => {
        f.el.x = r1(f.el.x + mv[0])
        f.el.y = r1(f.el.y + mv[1])
      })
    }
  })

  const relayout = () => {
    if (disposed) return
    const changed = applyMode()
    layoutRoot()
    if (changed) render()
    else layoutStage()
  }
  on(window, 'resize', relayout)
  on(window, 'online', relayout)
  on(window, 'offline', relayout)
  // The stage also changes size without a window resize (dashboard sidebar collapsing).
  const ro = new ResizeObserver(() => {
    layoutStage()
    if (editing) ensureSelVisible()
  })
  ro.observe(stage)
  window.visualViewport?.addEventListener('resize', relayout, { signal })
  window.visualViewport?.addEventListener('scroll', relayout, { signal })
  on(window, 'afterprint', () => {
    printRoot.innerHTML = ''
  })
  // Flush the debounced save when the tab is hidden or closed (iOS kills background PWAs).
  on(window, 'pagehide', flushSave)
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flushSave(), {
    signal,
  })

  /* ---------- boot ---------- */
  // Touch: no auto-zoom when an input or the page text gets focus (iOS still allows pinch-zoom).
  const vpMeta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  const vpPrev = vpMeta?.content
  if (vpMeta && isTouchDevice() && !/maximum-scale/.test(vpPrev ?? '')) vpMeta.content = `${vpPrev}, maximum-scale=1`
  applyMode()
  layoutRoot()
  render()
  const boot = async () => {
    try {
      await store.open()
      if (disposed) return store.close()
      const saved = await store.get<Partial<ZineDoc>>('zine')
      if (disposed) return
      // Only take the saved zine if the user has not started editing in the meantime.
      if (saved && !past.length) {
        zine = loadDoc(saved)
        afterLoad()
      }
    } catch (e) {
      console.warn('IndexedDB non disponibile', e)
    }
  }
  void boot()
  void Promise.all(FONT_FACES.map((f) => document.fonts.load(f).catch(() => []))).then(() => {
    if (!disposed) render()
  })

  return () => {
    disposed = true
    if (saveTimer) flushSave()
    if (liveTimer) clearTimeout(liveTimer)
    clearTimeout(navTimer)
    clearTimeout(sheetTimer)
    if (vpMeta && vpPrev != null) vpMeta.content = vpPrev
    ac.abort()
    ro.disconnect()
    if (printDlg.open) printDlg.close()
    if (progDlg.open) progDlg.close()
    store.close()
    printRoot.remove()
    pdfRoot.remove()
    pageStyle.remove()
    document.documentElement.classList.remove('zine-mounted')
    root.innerHTML = ''
  }
}
