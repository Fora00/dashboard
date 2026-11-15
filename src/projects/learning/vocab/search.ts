// Vocabulary search and part-of-speech filter (pure, unit-tested in vocab.test.ts).
import type { Lang, Pos, VocabTheme, VocabWord } from './types'

export type PosFilter = 'all' | Pos

export const POS_FILTERS: { id: PosFilter; label: string }[] = [
  { id: 'all', label: 'Tutti' },
  { id: 'n', label: 'Nomi' },
  { id: 'v', label: 'Verbi' },
  { id: 'a', label: 'Aggettivi' },
  { id: 'x', label: 'Altro' },
]

/**
 * Lowercase, no diacritics: accents (à é ñ ü), the Russian stress mark (U+0301), and also й/ё fold to и/е, so a
 * query typed without them still matches. Apostrophe variants fold to one.
 */
export const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’ʼ]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

export const posMatches = (w: VocabWord, pos: PosFilter) => pos === 'all' || w.pos === pos

/**
 * Whether a word matches a (raw) query on the Italian headword (and each chosen language's own Italian gloss) or on
 * `w` of the chosen languages; missing languages are skipped.
 */
export function wordMatches(w: VocabWord, query: string, langs: readonly Lang[]): boolean {
  const q = normalize(query)
  if (!q) return true
  const texts = [w.it, ...langs.flatMap((l) => (w[l] ? [w[l].w, w[l].it] : []))]
  return texts.some((s) => normalize(s).includes(q))
}

export interface Hit {
  theme: VocabTheme
  word: VocabWord
}

/** Matching words across themes, in theme order; an empty query returns nothing. */
export function searchThemes(
  themes: readonly VocabTheme[],
  query: string,
  langs: readonly Lang[],
  pos: PosFilter,
): Hit[] {
  if (!normalize(query)) return []
  return themes.flatMap((theme) =>
    theme.words.filter((w) => posMatches(w, pos) && wordMatches(w, query, langs)).map((word) => ({ theme, word })),
  )
}
