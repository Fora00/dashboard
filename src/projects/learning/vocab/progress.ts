// Learner state of the shared vocabulary: "known" marks are learningCards rows (the same table and the same
// mutations as the course flashcards, so they sync owner-only through learningSync.ts with no migration):
// courseId `vocabolario`, moduleId = theme id, itemId = `<wordId>.<lang>`. Pure helpers here are unit-tested.
// Dexie reads and writes live in ./store.ts (this file stays pure, no IndexedDB import).
import type { LearningCard } from '../../../lib/db'
import { wordLangs } from './merge'
import type { Lang, VocabWord } from './types'

export const VOCAB_COURSE_ID = 'vocabolario'

export const vocabItemId = (wordId: string, lang: Lang) => `${wordId}.${lang}`

/** itemIds known in one theme. */
export function knownIn(cards: readonly LearningCard[], themeId: string): Set<string> {
  return new Set(cards.filter((c) => c.courseId === VOCAB_COURSE_ID && c.moduleId === themeId).map((c) => c.itemId))
}

/**
 * A word counts as known for a drill when it is known in every chosen language it exists in (a word missing in all
 * of them is never "known": it is simply not in the drill).
 */
export function wordKnown(known: ReadonlySet<string>, w: VocabWord, langs: readonly Lang[]): boolean {
  const ls = wordLangs(w, langs)
  return ls.length > 0 && ls.every((l) => known.has(vocabItemId(w.id, l)))
}

/** Positions of the words still to review for the chosen languages, in theme order (words with none of them skipped). */
export function vocabDeck(words: readonly VocabWord[], known: ReadonlySet<string>, langs: readonly Lang[]): number[] {
  return words.flatMap((w, i) => (wordLangs(w, langs).length === 0 || wordKnown(known, w, langs) ? [] : [i]))
}

/**
 * Known (word, language) pairs of a theme over its total, counting only the languages each word exists in; rows for
 * words no longer in the content are ignored.
 */
export function themeCount(
  words: readonly VocabWord[],
  known: ReadonlySet<string>,
  langs: readonly Lang[],
): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const w of words)
    for (const l of wordLangs(w, langs)) {
      total++
      if (known.has(vocabItemId(w.id, l))) done++
    }
  return { done, total }
}
