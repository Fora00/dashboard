// Learner state of the vocabulary in Dexie: reads via useLiveQuery, writes only through learningSync.ts
// (the same setCardKnown as the course flashcards, so the marks sync owner-only like every learningCards row).
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LearningCard } from '../../../lib/db'
import { setCardKnown } from '../../../lib/learningSync'
import { VOCAB_COURSE_ID, vocabItemId } from './progress'
import type { Lang } from './types'

/** All vocabulary marks, live; `undefined` while the first read is loading. */
export function useVocabCards(): LearningCard[] | undefined {
  return useLiveQuery(() => db.learningCards.where('courseId').equals(VOCAB_COURSE_ID).toArray(), [])
}

/** Marks one word known/unknown in each chosen language. */
export async function setWordKnown(themeId: string, wordId: string, langs: readonly Lang[], known: boolean) {
  for (const l of langs) await setCardKnown(VOCAB_COURSE_ID, themeId, vocabItemId(wordId, l), known)
}

/** Forgets the chosen languages of a theme (the other languages keep their marks). */
export async function resetThemeLangs(themeId: string, known: ReadonlySet<string>, langs: readonly Lang[]) {
  for (const id of known)
    if (langs.some((l) => id.endsWith(`.${l}`))) await setCardKnown(VOCAB_COURSE_ID, themeId, id, false)
}
