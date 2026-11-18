// Learner state of the shared vocabulary: "known" marks are learningCards rows (the same table and the same
// mutations as the course flashcards, so they sync owner-only through learningSync.ts with no migration):
// courseId `vocabolario`, moduleId VOCAB_MODULE_ID (fixed, NOT the theme), itemId = `<wordId>.<lang>`, so a word
// moved to another theme keeps its marks and its Ripasso schedule. Per-theme counts derive from the theme's words.
// Rows written before 2026-11-18 carried the theme as moduleId; vocabRekeyPlan below turns them into the fixed key
// (run by learningSync.ts migrateVocabKeys). Pure helpers here are unit-tested.
// Dexie reads and writes live in ./store.ts (this file stays pure, no IndexedDB import).
import type { LearningCard, LearningReview } from '../../../lib/db'
import { itemKey } from '../engine/progress'
import { reviewId } from '../engine/review'
import { wordLangs } from './merge'
import type { Lang, VocabWord } from './types'

export const VOCAB_COURSE_ID = 'vocabolario'

/**
 * moduleId of every Vocabolario row. Starts with `_` so it can never equal a theme id (kebab-case, checked in
 * vocab.test.ts): an old theme-keyed row is always recognisable as one.
 */
export const VOCAB_MODULE_ID = '_words'

export const vocabItemId = (wordId: string, lang: Lang) => `${wordId}.${lang}`

/** learningCards id of one (word, language) mark. */
export const vocabCardId = (itemId: string) => itemKey(VOCAB_COURSE_ID, VOCAB_MODULE_ID, itemId)

/**
 * Every known (word, language) itemId, whatever the theme (old theme-keyed rows not yet rewritten count too, so the
 * page is right before the rewrite lands). Restrict to a theme by iterating its words (themeCount, wordKnown).
 */
export function knownIn(cards: readonly LearningCard[]): Set<string> {
  return new Set(cards.filter((c) => c.courseId === VOCAB_COURSE_ID).map((c) => c.itemId))
}

/** A Vocabolario row still keyed by its theme (written before the fixed moduleId). */
export const isOldVocabRow = (r: { courseId: string; moduleId: string }) =>
  r.courseId === VOCAB_COURSE_ID && r.moduleId !== VOCAB_MODULE_ID

export interface VocabRekeyPlan {
  upsertCards: LearningCard[]
  removeCards: string[]
  upsertReviews: LearningReview[]
  removeReviews: string[]
}

/**
 * Rewrite of the old theme-keyed Vocabolario rows (cards and their Ripasso rows) to the fixed moduleId. Deterministic:
 * the new id depends only on the itemId, so two devices running it converge on the same rows. Several rows landing
 * on one id (a word known in two themes) keep the newest by updatedAt, the original updatedAt is kept (a rewrite
 * must not make a card look newer than its last grading, which would restart its Ripasso schedule), and an
 * existing new-format row is overwritten only by a strictly newer one. Empty plan = nothing to do (idempotent).
 */
export function vocabRekeyPlan(cards: readonly LearningCard[], reviews: readonly LearningReview[]): VocabRekeyPlan {
  const merge = <T extends { id: string; updatedAt: number }>(
    rows: readonly T[],
    isVocab: (r: T) => boolean,
    rekey: (r: T) => T,
  ): { upsert: T[]; remove: string[] } => {
    const current = new Map<string, T>()
    const best = new Map<string, T>()
    const remove: string[] = []
    for (const r of rows) {
      if (!isVocab(r)) continue
      const next = rekey(r)
      if (next.id === r.id) {
        current.set(r.id, r)
        continue
      }
      remove.push(r.id)
      const prev = best.get(next.id)
      if (!prev || next.updatedAt > prev.updatedAt) best.set(next.id, next)
    }
    const upsert = [...best.values()].filter((r) => {
      const cur = current.get(r.id)
      return !cur || r.updatedAt > cur.updatedAt
    })
    return { upsert, remove }
  }
  const c = merge(
    cards,
    (r) => r.courseId === VOCAB_COURSE_ID,
    (r) => ({ ...r, id: vocabCardId(r.itemId), moduleId: VOCAB_MODULE_ID }),
  )
  const r = merge(
    reviews,
    (x) => x.courseId === VOCAB_COURSE_ID && x.kind === 'card',
    (x) => ({ ...x, id: reviewId('card', VOCAB_COURSE_ID, VOCAB_MODULE_ID, x.itemId), moduleId: VOCAB_MODULE_ID }),
  )
  return { upsertCards: c.upsert, removeCards: c.remove, upsertReviews: r.upsert, removeReviews: r.remove }
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
