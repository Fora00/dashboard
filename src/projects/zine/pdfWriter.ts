// Minimal PDF writer: one full-bleed JPEG per page. No dependencies (a JPEG goes into a PDF as-is via
// DCTDecode), so the "Scarica PDF" chunk stays small and has no optional deps to precache.

export interface PdfPage {
  // Page size in millimetres.
  widthMm: number
  heightMm: number
  // Baseline JPEG bytes (canvas.toBlob('image/jpeg')) and their pixel size.
  jpeg: Uint8Array
  pxWidth: number
  pxHeight: number
}

const PT_PER_MM = 72 / 25.4
const enc = new TextEncoder()

export function buildPdf(pages: PdfPage[], title = ''): Blob {
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let size = 0
  const push = (b: Uint8Array | string) => {
    const bytes = typeof b === 'string' ? enc.encode(b) : b
    chunks.push(bytes)
    size += bytes.length
  }
  const obj = (id: number, body: () => void) => {
    offsets[id] = size
    push(`${id} 0 obj\n`)
    body()
    push('\nendobj\n')
  }

  // Object ids: 1 catalog, 2 pages tree, 3 info, then per page: page, content, image.
  const pageId = (k: number) => 4 + k * 3
  push('%PDF-1.4\n')
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])) // "%" + 4 high bytes: marks the file as binary

  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'))
  obj(2, () =>
    push(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, k) => `${pageId(k)} 0 R`).join(' ')}] >>`),
  )
  obj(3, () => push(`<< /Title (${pdfString(title)}) /Producer (ZINE//SPORCA) >>`))

  pages.forEach((p, k) => {
    const w = round(p.widthMm * PT_PER_MM)
    const hgt = round(p.heightMm * PT_PER_MM)
    const id = pageId(k)
    obj(id, () =>
      push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${hgt}] /Resources << /XObject << /Im0 ${id + 2} 0 R >> >> /Contents ${id + 1} 0 R >>`,
      ),
    )
    const content = `q ${w} 0 0 ${hgt} 0 0 cm /Im0 Do Q`
    obj(id + 1, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`))
    obj(id + 2, () => {
      push(
        `<< /Type /XObject /Subtype /Image /Width ${p.pxWidth} /Height ${p.pxHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`,
      )
      push(p.jpeg)
      push('\nendstream')
    })
  })

  const count = pageId(pages.length)
  const xref = size
  let table = `xref\n0 ${count}\n0000000000 65535 f \n`
  for (let id = 1; id < count; id++) table += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  push(table)
  push(`trailer\n<< /Size ${count} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  return new Blob(chunks as BlobPart[], { type: 'application/pdf' })
}

const round = (n: number) => Math.round(n * 100) / 100

// PDF literal string: ASCII only (accents folded), with \ ( ) escaped.
function pdfString(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[\\()]/g, '\\$&')
}
