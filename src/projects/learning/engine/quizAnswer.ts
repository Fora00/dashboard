import type { QuizQuestion } from './types'

// How a quiz answer is stored in learning_quiz.selected (smallint, check 0..20).
//
// Options are shown shuffled (kit.ts q(), seeded by id + question text), so a
// SHOWN index is not stable: rewording a question reshuffles it. Rows written
// since 2026-11-18 therefore store the AUTHOR-ORDER index (position in the
// options array as written in the course file) plus AUTHOR_BASE, so the value
// survives any rewording of the question or its options. Rows below
// AUTHOR_BASE are legacy: a shown index under the shuffle in force when they
// were saved, which is only right if the question text has not changed since.
//
// The offset keeps the value inside the existing column check (no migration):
// options per question must stay <= 11 (courses.test.ts guards <= 10).

/** Stored values >= this are author-order indexes (value - AUTHOR_BASE). */
export const AUTHOR_BASE = 10

type Q = Pick<QuizQuestion, 'answer' | 'order'>

/** Author-order index of the option shown at `shown`. */
export const authorIndex = (q: Q, shown: number) => q.order?.[shown] ?? shown

/** Shown slot of the option written at author index `author` (-1 if gone). */
export const shownIndex = (q: Q, author: number) => (q.order ? q.order.indexOf(author) : author)

/** The value to store for a tap on the option shown at `shown`. */
export const encodeSelected = (q: Q, shown: number) => AUTHOR_BASE + authorIndex(q, shown)

/**
 * Which shown option a stored row picked, or null when it can no longer be known.
 *
 * - New rows (>= AUTHOR_BASE): exact, whatever the rewording.
 * - Legacy rows whose `correct` disagrees with the current shuffle (the question was
 *   reworded after answering, so the shown index now lands elsewhere):
 *   right ones map back to the right option (we know it was picked); wrong ones
 *   return null (some wrong option, unknown which) and only "Non proprio." shows.
 * - Legacy rows that agree are taken as is (best effort for a wrong one: if reworded,
 *   the ✗ may sit on a different wrong option, never on the right one).
 */
export function pickedShown(q: Q, row: { selected: number; correct: 0 | 1 }): number | null {
  if (row.selected >= AUTHOR_BASE) {
    const i = shownIndex(q, row.selected - AUTHOR_BASE)
    return i >= 0 ? i : null
  }
  if (row.correct === 1) return q.answer
  return row.selected === q.answer ? null : row.selected
}
