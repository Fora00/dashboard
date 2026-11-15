// Pure merge of the per-language word lists into Vocabolario words and themes (unit-tested in vocab.test.ts).
import { LANGS, type Lang, type VocabTheme, type VocabThemeInfo, type VocabWord, type WordEntry } from './types'

export type WordLists = Partial<Record<Lang, readonly WordEntry[]>>

/**
 * Merges by `id`, in es, fr, de, ru order: word order = first appearance; headword, part of speech, theme and
 * headword note come from the first language that has them. A language without the id stays `undefined`.
 */
export function mergeWords(lists: WordLists): VocabWord[] {
  const byId = new Map<string, VocabWord>()
  for (const l of LANGS)
    for (const e of lists[l] ?? []) {
      let w = byId.get(e.id)
      if (!w) {
        w = { id: e.id, it: e.it, pos: e.pos, theme: e.theme }
        byId.set(e.id, w)
      }
      if (w[l]) continue // duplicate id in one language: the first wins (vocab.test.ts forbids it)
      w[l] = e
      if (w.note === undefined && e.itNote) w.note = e.itNote
    }
  for (const w of byId.values()) {
    const its = [...new Set(LANGS.flatMap((l) => (w[l]?.ex && w[l].exIt ? [w[l].exIt] : [])))]
    if (its.length === 1) w.exIt = its[0]!
  }
  return [...byId.values()]
}

/** The languages of `langs` that this word has (the others render "—" and are skipped by the flashcards). */
export const wordLangs = (w: VocabWord, langs: readonly Lang[]): Lang[] => langs.filter((l) => w[l] !== undefined)

/** Groups words by theme, in theme order; a word with an unknown theme id goes to `fallbackId`. */
export function groupThemes(infos: readonly VocabThemeInfo[], words: readonly VocabWord[], fallbackId: string) {
  const known = new Set(infos.map((t) => t.id))
  return infos.map((t): VocabTheme => ({
    ...t,
    words: words.filter((w) => (known.has(w.theme) ? w.theme : fallbackId) === t.id),
  }))
}
