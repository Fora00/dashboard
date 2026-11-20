// "Scarica PDF": rasterizes the imposed sheets (already in the DOM, fonts loaded, images decoded) and writes
// one JPEG page per sheet. Lazy-loaded on click (its own chunk, still in the PWA precache).
// modern-screenshot clones each sheet into an SVG foreignObject (computed styles inlined, images and the
// self-hosted fonts embedded as data URLs), so CSS filters, mix-blend-mode (white-as-transparent collage),
// clip-path tape and transforms look as on screen. We draw that SVG ourselves (see drawSvg).

import { domToForeignObjectSvg } from 'modern-screenshot'
import { buildPdf, type PdfPage } from './pdfWriter'

export interface RenderOptions {
  widthMm: number
  heightMm: number
  dpi: number
  title: string
  onProgress: (done: number, total: number) => void
  isCancelled: () => boolean
}

const PX_PER_MM = 96 / 25.4

export async function renderSheetsToPdf(sheets: HTMLElement[], opt: RenderOptions): Promise<Blob | null> {
  const pages: PdfPage[] = []
  const scale = opt.dpi / 96
  const width = Math.round(opt.widthMm * PX_PER_MM)
  const height = Math.round(opt.heightMm * PX_PER_MM)
  for (let i = 0; i < sheets.length; i++) {
    if (opt.isCancelled()) return null
    opt.onProgress(i, sheets.length)
    // Let the progress dialog paint before the (blocking) clone.
    await new Promise((r) => setTimeout(r, 30))
    const svg = await domToForeignObjectSvg(sheets[i]!, {
      width,
      height,
      // No font.preferredFormat: modern-screenshot 4.7's filter for it reuses a global RegExp and drops the
      // src of every other @font-face (fonts.css is woff2-only anyway).
      timeout: 30000,
    })
    const canvas = await drawSvg(svg, width, height, scale)
    const jpeg = await toJpeg(canvas)
    pages.push({ widthMm: opt.widthMm, heightMm: opt.heightMm, jpeg, pxWidth: canvas.width, pxHeight: canvas.height })
    // Free the bitmap now (iOS keeps a tight canvas memory budget).
    canvas.width = canvas.height = 0
  }
  if (opt.isCancelled()) return null
  opt.onProgress(sheets.length, sheets.length)
  return buildPdf(pages, opt.title)
}

// Characters XML forbids (control chars, lone surrogates, U+FFFE/FFFF): they would break the SVG image.
// oxlint-disable-next-line no-control-regex
const XML_INVALID = /[\u0000-\u0008\v\f\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu

// Draws the foreignObject SVG on a white canvas. Fonts and images embedded in an SVG image can finish
// loading after its load event (always an issue in Safari, sometimes in Chrome), so draw, wait, and draw
// again; modern-screenshot's own domToCanvas only redraws in Safari/Firefox and only when images are present.
async function drawSvg(svg: SVGElement, width: number, height: number, scale: number) {
  const xml = new XMLSerializer().serializeToString(svg).replace(XML_INVALID, '')
  const img = new Image()
  img.decoding = 'sync'
  const loaded = new Promise<void>((res, rej) => {
    img.onload = () => res()
    img.onerror = () => rej(new Error('rendering del foglio non riuscito'))
  })
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
  await loaded
  await img.decode().catch(() => {})
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(width * scale)
  canvas.height = Math.floor(height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d non disponibile')
  const draw = () => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  for (const wait of [0, 120, 250]) {
    if (wait) await new Promise((r) => setTimeout(r, wait))
    draw()
  }
  return canvas
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((res, rej) =>
    canvas.toBlob(
      (b) => {
        if (!b) return rej(new Error('JPEG non riuscito'))
        b.arrayBuffer().then((buf) => res(new Uint8Array(buf)), rej)
      },
      'image/jpeg',
      0.9,
    ),
  )
}
