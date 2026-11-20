import { describe, expect, it } from 'vitest'
import { imposition, selectSides, slug } from './imposition'
import { buildPdf } from './pdfWriter'

const oneBased = (n: number) => imposition(n).map((s) => s.pages.map((p) => p + 1).join('|'))

describe('imposition', () => {
  it('8 pages: 2 sheets front/back = 8|1, 2|7, 6|3, 4|5', () => {
    expect(oneBased(8)).toEqual(['8|1', '2|7', '6|3', '4|5'])
  })
  it('12 pages: 3 sheets, innermost last', () => {
    expect(oneBased(12)).toEqual(['12|1', '2|11', '10|3', '4|9', '8|5', '6|7'])
  })
  it('sides filter for manual duplex', () => {
    const p = (s: ReturnType<typeof selectSides>) => s.map((x) => x.pages.map((q) => q + 1).join('|'))
    expect(p(selectSides(8, 'fronts'))).toEqual(['8|1', '6|3'])
    expect(p(selectSides(8, 'backs'))).toEqual(['2|7', '4|5'])
    expect(p(selectSides(8, 'backs-rev'))).toEqual(['4|5', '2|7'])
  })
  it('slug', () => {
    expect(slug('La mia zine sporca!')).toBe('la-mia-zine-sporca')
    expect(slug('')).toBe('zine')
  })
})

describe('buildPdf', () => {
  it('writes one page per image with the right MediaBox and a valid xref', async () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
    const blob = buildPdf(
      [
        { widthMm: 297, heightMm: 210, jpeg, pxWidth: 10, pxHeight: 7 },
        { widthMm: 297, heightMm: 210, jpeg, pxWidth: 10, pxHeight: 7 },
      ],
      'Zine (è)',
    )
    const bytes = new Uint8Array(await blob.arrayBuffer())
    const text = new TextDecoder('latin1').decode(bytes)
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text).toContain('/Count 2')
    expect(text.match(/\/Type \/Page /g)).toHaveLength(2)
    expect(text).toContain('/MediaBox [0 0 841.89 595.28]')
    expect(text).toContain('/Title (Zine \\(e\\))')
    // every xref offset points at "<id> 0 obj"
    const xrefAt = Number(/startxref\n(\d+)/.exec(text)?.[1])
    const rows = text.slice(xrefAt).split('\n').slice(3)
    for (let id = 1; id < 10; id++) {
      const off = Number(rows[id - 1]?.slice(0, 10))
      expect(text.slice(off, off + `${id} 0 obj`.length)).toBe(`${id} 0 obj`)
    }
  })
})
