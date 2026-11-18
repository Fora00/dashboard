// Learner state of the vocabulary in Dexie: reads via useLiveQuery, writes only through learningSync.ts
// (the same learningCards rows as the course flashcards, so the marks sync owner-only like every learningCards row).
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'react'
import { db, type LearningCard } from '../../../lib/db'
import { migrateVocabKeys, setCardsKnown } from '../../../lib/learningSync'
import { wordLangs } from './merge'
import { isOldVocabRow, VOCAB_COURSE_ID, VOCAB_MODULE_ID, vocabItemId } from './progress'
import type { Lang, VocabWord } from './types'

/** All vocabulary marks, live; `undefined` while the first read is loading. */
export function useVocabCards(): LearningCard[] | undefined {
  return useLiveQuery(() => db.learningCards.where('courseId').equals(VOCAB_COURSE_ID).toArray(), [])
}

/**
 * Keeps the Vocabolario rows word-keyed: whenever theme-keyed rows are present (first run on this device, or rows
 * pulled from a device still on an older version) they are rewritten once through the sync engine.
 */
export function useVocabKeyMigration(): void {
  const old = useLiveQuery(async () => {
    const [c, r] = await Promise.all([
      db.learningCards.where('courseId').equals(VOCAB_COURSE_ID).filter(isOldVocabRow).count(),
      db.learningReviews.where('courseId').equals(VOCAB_COURSE_ID).filter(isOldVocabRow).count(),
    ])
    return c + r
  }, [])
  useEffect(() => {
    if (old) void migrateVocabKeys().catch(() => undefined)
  }, [old])
}

/** Marks one word known/unknown in each chosen language (one transaction). */
export async function setWordKnown(wordId: string, langs: readonly Lang[], known: boolean) {
  await migrateVocabKeys()
  await setCardsKnown(
    VOCAB_COURSE_ID,
    VOCAB_MODULE_ID,
    langs.map((l) => vocabItemId(wordId, l)),
    known,
  )
}

/** Forgets the chosen languages of a theme's words (other languages and other themes keep their marks). */
export async function resetThemeLangs(words: readonly VocabWord[], known: ReadonlySet<string>, langs: readonly Lang[]) {
  await migrateVocabKeys()
  const ids = words.flatMap((w) => wordLangs(w, langs).map((l) => vocabItemId(w.id, l))).filter((id) => known.has(id))
  await setCardsKnown(VOCAB_COURSE_ID, VOCAB_MODULE_ID, ids, false)
}
