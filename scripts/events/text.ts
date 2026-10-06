// Text helpers: HTML → plain text, entity decoding, normalisation, hashing.
import { createHash } from 'node:crypto'

const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  agrave: 'à',
  aacute: 'á',
  egrave: 'è',
  eacute: 'é',
  igrave: 'ì',
  iacute: 'í',
  ograve: 'ò',
  oacute: 'ó',
  ugrave: 'ù',
  uacute: 'ú',
  Agrave: 'À',
  Egrave: 'È',
  Eacute: 'É',
  Igrave: 'Ì',
  Ograve: 'Ò',
  Ugrave: 'Ù',
  auml: 'ä',
  ouml: 'ö',
  uuml: 'ü',
  Auml: 'Ä',
  Ouml: 'Ö',
  Uuml: 'Ü',
  szlig: 'ß',
  ccedil: 'ç',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  laquo: '«',
  raquo: '»',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  bull: '•',
  middot: '·',
  euro: '€',
  deg: '°',
  copy: '©',
  reg: '®',
  trade: '™',
  times: '×',
}

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : whole
    }
    return NAMED[body] ?? whole
  })
}

/** HTML fragment → one line of plain text. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return ''
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
  return decodeEntities(text).replace(/\s+/g, ' ').trim()
}

/**
 * HTML fragment → plain text that keeps paragraph breaks as "\n\n" and
 * <br> as "\n". Input without tags is treated as plain text (its own line
 * breaks are kept), e.g. an iCal DESCRIPTION.
 */
export function htmlToBlocks(html: string | null | undefined): string {
  if (!html) return ''
  if (!/<\/?[a-z][^>]*>/i.test(html)) return tidyBlocks(decodeEntities(html)) // already plain text
  const text = html
    .replace(/\s+/g, ' ') // raw newlines in HTML source are just spaces
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h\d|ul|ol|table|tr|blockquote)>|<(hr)\s*\/?>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
  return tidyBlocks(decodeEntities(text))
}

/** Collapse spaces inside lines, trim lines, at most one blank line in a row. */
export function tidyBlocks(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t\u00a0]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Cap a (multi-line) text at `max` chars on a word boundary, with an ellipsis. */
export function clip(text: string, max = 2000): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const space = cut.search(/\s\S*$/)
  return `${(space > max * 0.8 ? cut.slice(0, space) : cut).replace(/[\s,;:.–-]+$/, '')}…`
}

/** Absolute https URL or null. */
export function absUrl(value: string | null | undefined, base: string): string | null {
  if (!value || !value.trim()) return null
  try {
    const u = new URL(value.trim(), base)
    if (u.protocol === 'http:') u.protocol = 'https:'
    return u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}

/** Plain-text snippet of at most `max` chars, cut at a word boundary. */
export function snippet(text: string, max = 300): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.–-]+$/, '')}…`
}

/** Lowercase, accents stripped, punctuation → spaces, whitespace collapsed. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function stableId(...parts: string[]): string {
  return createHash('sha1').update(parts.join('\u0000')).digest('hex').slice(0, 16)
}

/** "…, 38122 Trento, …" / "…, 39100 Bolzano BZ" → the town after a 5-digit postcode. */
export function cityFromAddress(address: string | null | undefined): string | null {
  if (!address) return null
  const m = address.match(/\b\d{5}\s+([\p{Lu}][\p{L}'’ .-]*?)(?=\s*(?:,|\(|\b[A-Z]{2}\b|$|\s+Italia|\s+Italy))/u)
  return m?.[1]?.trim() || null
}

export function firstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const v of values) if (v && v.trim()) return v
  return ''
}

// Lowercase inside a title (Italian articles, prepositions, conjunctions,
// the clitics ci/vi/ne/si as in "Di un'Amicizia Sol ci Fu Legame"; a few
// English ones for English titles).
const SMALL = new Set([
  'a',
  'ad',
  'ai',
  'agli',
  'al',
  'alla',
  'alle',
  'allo',
  'che',
  'ci',
  'col',
  'con',
  'd',
  'da',
  'dal',
  'dalla',
  'dalle',
  'de',
  'degli',
  'dei',
  'del',
  'della',
  'delle',
  'dello',
  'di',
  'e',
  'ed',
  'gli',
  'i',
  'il',
  'in',
  'l',
  'la',
  'le',
  'lo',
  'ne',
  'nei',
  'nel',
  'nella',
  'nelle',
  'o',
  'per',
  'si',
  'su',
  'sui',
  'sul',
  'sulla',
  'sulle',
  'tra',
  'un',
  'una',
  'vi',
  'è',
  'and',
  'of',
  'the',
])

const ELIDED = new Set(['l', 'd', 'dell', 'dall', 'nell', 'sull', 'all', 'un', 'quell', 'quest'])

/**
 * For sources that write names in capitals (Arteven, some Stabile del Veneto
 * titles). "TEATRO COMUNALE (SALA MAGGIORE)" →
 * "Teatro Comunale (Sala Maggiore)", "MADRE COURAGE E I SUOI FIGLI" →
 * "Madre Courage e i Suoi Figli". Words after ". : ! ? / -" and single-letter
 * initials ("A. VIVALDI") are capitalised.
 */
export function titleCase(s: string): string {
  return s.toLowerCase().replace(/\p{L}+/gu, (w, i: number, all: string) => {
    const before = all.slice(0, i)
    const starts = !/\p{L}/u.test(before) || /[.:!?/–-]\s*$/.test(before) || /["“«(]$/.test(before)
    const initial = w.length === 1 && all[i + 1] === '.'
    // After an apostrophe: capitalised after an elided article ("L'Attrice",
    // "Dell'Arte"), lowercase otherwise ("Cos'è", "Com'è").
    const elided = before.match(/(\p{L}+)['’]$/u)?.[1]
    if (elided) return ELIDED.has(elided) ? (w[0] ?? '').toUpperCase() + w.slice(1) : w
    return SMALL.has(w) && !starts && !initial ? w : (w[0] ?? '').toUpperCase() + w.slice(1)
  })
}
