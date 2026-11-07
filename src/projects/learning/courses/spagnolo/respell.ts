// Mechanical check for the spagnolo respelling: spelling -> expected respelling by the legend in
// spagnolo.pron.ts, compared (loosely) with the `word [pron]` pairs found in the course text.

const V = 'aeiouáéíóúü'

/** Letters-only expected respelling of a single Spanish word (no stress, no syllables). */
export function expected(word: string): string {
  const w = word.toLowerCase().normalize('NFC')
  let out = ''
  for (let i = 0; i < w.length; i++) {
    const c = w[i]!
    const n = w[i + 1] ?? ''
    const p = w[i - 1] ?? ''
    const front = 'eéií'.includes(n)
    switch (c) {
      case 'h':
        break
      case 'c':
        if (n === 'h') {
          out += 'c' + ('aou'.includes(w[i + 2] ?? '') ? 'i' : '')
          i++
        } else out += front ? 'th' : 'k'
        break
      case 'q':
        out += 'k'
        if (n === 'u') i++
        break
      case 'z':
        out += 'th'
        break
      case 'j':
        out += 'h'
        break
      case 'g':
        if (n === 'u' && 'eéií'.includes(w[i + 2] ?? '')) {
          out += 'gh'
          i++
        } else out += front ? 'h' : 'g'
        break
      case 'ü':
        out += 'u'
        break
      case 'l':
        if (n === 'l') {
          out += 'y'
          i++
        } else out += 'l'
        break
      case 'r':
        if (n === 'r') {
          out += 'rr'
          i++
        } else out += i === 0 || 'nls'.includes(p) ? 'rr' : 'r'
        break
      case 'ñ':
        out += 'gn'
        break
      case 'v':
        out += 'b'
        break
      case 'x':
        out += i === 0 ? 's' : 'ks'
        break
      case 'y':
        out += i === w.length - 1 && V.includes(p) ? 'i' : 'y'
        break
      case 'á':
        out += 'a'
        break
      case 'é':
        out += 'e'
        break
      case 'í':
        out += 'i'
        break
      case 'ó':
        out += 'o'
        break
      case 'ú':
        out += 'u'
        break
      case 'u':
        if (p === 'q' || (p === 'g' && front)) break
        out += 'u'
        break
      default:
        out += c
    }
  }
  return out
}

/** Normalise the allowed variants: seseo (th/s), ss/s, dh/d, aspirated s. */
const norm = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[-\s']/g, '')
    .replace(/th/g, 's')
    .replace(/ss/g, 's')
    .replace(/dh/g, 'd')
    .replace(/sce/g, 'y')

export interface Pair {
  word: string
  pron: string
}

/** `word [pron]` pairs in a lesson/card text (tags stripped). */
export function pairs(html: string): Pair[] {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
  const out: Pair[] = []
  for (const m of text.matchAll(/([^\s[\]]+(?:\s+[^\s[\]]+){0,3})\s*\[([A-Za-z' -]{2,40})\]/g)) {
    const pron = m[2]!.trim()
    const n = pron.split(/\s+/).length
    const words = m[1]!
      .split(/\s+/)
      .slice(-n)
      .map((x) => x.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ''))
    if (words.some((x) => !x)) continue
    out.push({ word: words.join(' '), pron })
  }
  return out
}

/** Letters of the pron differ from the spelling-derived expectation. */
export function mismatch(p: Pair): boolean {
  const exp = norm(p.word.split(/\s+/).map(expected).join(''))
  const got = norm(p.pron)
  // x -> h in México/mexicano; large distances are alignment noise (Italian word before the bracket)
  return exp !== got && dist(exp, got) <= 3
}

function dist(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0]![j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length]![b.length]!
}

/** Index (0-based) of the syllable written in CAPS inside a single word's respelling, or -1. */
export function stressIndex(pron: string): number {
  return pron.split('-').findIndex((s) => /[A-Z]/.test(s) && s === s.toUpperCase())
}
