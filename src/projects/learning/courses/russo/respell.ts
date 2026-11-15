// Mechanical check for the russo respelling (legend in russo.pron.ts): every `Cyrillic [pron]` pair is
// compared on (1) number of vowels = number of syllables, (2) the CAPS syllable = the stressed vowel and
// (3) the consonant skeleton (voicing and vowels ignored: reduction and devoicing are written by hand).

export const CYR_VOWELS = 'аеёиоуыэюя'
const ACUTE = '\u0301'

export interface Pair {
  word: string
  pron: string
}

/** `Cyrillic words [pron]` pairs in a lesson/card text (tags stripped). */
export function pairs(html: string): Pair[] {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
  const out: Pair[] = []
  for (const m of text.matchAll(/([^\s[\]]+(?:\s+[^\s[\]]+){0,9})\s*\[([A-Za-z'.,!?;: -]{2,120})\]/g)) {
    const pron = m[2]!
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    const n = pron.split(/\s+/).length
    const words = m[1]!
      .split(/\s+/)
      .slice(-n)
      .map((x) => x.replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, ''))
    if (words.length !== n || words.some((x) => !/[Ѐ-ӿ]/.test(x))) continue
    out.push({ word: words.join(' '), pron })
  }
  return out
}

const LAT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'o',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: '',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'c',
  ш: 'sh',
  щ: 'shsh',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'u',
  я: 'a',
}

/** Consonant skeleton: digraphs folded, voicing folded, vowels/softness/hyphens dropped, doubles collapsed. */
export function skeleton(latin: string): string {
  const s = latin
    .toLowerCase()
    .replace(/[aeiouy' -]/g, '')
    .replace(/shsh|sh|zh/g, 'X')
    .replace(/ts/g, 'T')
    .replace(/gh/g, 'k')
    .replace(/[bvgdz]/g, (c) => ({ b: 'p', v: 'f', g: 'k', d: 't', z: 's' })[c]!)
  return s.replace(/(.)\1+/g, '$1')
}

/** Spelling -> sound changes that are regular enough to apply before comparing consonants. */
const SOUND: [RegExp, string][] = [
  [/дц/g, 'ц'],
  [/(сч|зч|жч)/g, 'щ'],
  [/зж/g, 'ж'],
  [/вств/g, 'ств'],
  [/стн/g, 'сн'],
  [/здн/g, 'зн'],
  [/лнц/g, 'нц'],
  [/рдц/g, 'рц'],
  [/^что/g, 'што'],
  [/^много$/g, 'многа'],
  [/(?<=[ое])го$/g, 'во'],
  [/^сегодня$/g, 'севодня'],
]

export const stripAcute = (w: string): string =>
  w
    .normalize('NFD')
    .replace(/\u0301/g, '')
    .normalize('NFC')

export function cyrSkeleton(word: string): string {
  let w = stripAcute(word).toLowerCase()
  for (const [re, to] of SOUND) w = w.replace(re, to)
  return skeleton(
    Array.from(w)
      .map((c) => LAT[c] ?? '')
      .join(''),
  )
}

/** Index of the stressed vowel (0-based among vowels) of a Cyrillic word; -1 if unmarked. */
export function cyrStressIndex(word: string): number {
  const w = word.normalize('NFC')
  let n = -1
  for (let i = 0; i < w.length; i++) {
    const c = w[i]!
    if (CYR_VOWELS.includes(c.toLowerCase())) {
      n++
      if (w[i + 1] === ACUTE || c.toLowerCase() === 'ё') return n
    }
  }
  return -1
}

export const cyrVowelCount = (word: string): number =>
  Array.from(word.normalize('NFC').toLowerCase()).filter((c) => CYR_VOWELS.includes(c)).length

/** Index of the CAPS syllable inside one word's respelling, or -1. */
export function stressIndex(pron: string): number {
  return pron
    .split('-')
    .filter((s) => /[aeiouyAEIOUY]/.test(s))
    .findIndex((s) => /[A-Z]/.test(s) && s === s.toUpperCase())
}

export const pronSyllables = (pron: string): number => pron.split('-').filter((s) => /[aeiouyAEIOUY]/.test(s)).length

/** Cyrillic words (with stress marks) of 2+ vowels that carry no mark and no ё. */
export function unmarked(html: string): string[] {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
  const out: string[] = []
  for (const m of text.matchAll(/(?:[Ѐ-ӿ]|\u0301)+/g)) {
    const w = m[0]
    // affixes and endings such as "-ешь", "про-", "ни-" are not words
    if (text[m.index - 1] === '-' || text[m.index + w.length] === '-') continue
    if (cyrVowelCount(w) >= 2 && cyrStressIndex(w) < 0) out.push(w)
  }
  return out
}
