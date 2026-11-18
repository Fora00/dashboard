// Ripasso: one daily review queue across every course and Vocabolario (owner, 2026-11-17).
// Pure (no Dexie): the page feeds it the stored rows. What comes back:
//   - every KNOWN flashcard (learningCards rows: course cards and Vocabolario words), and
//   - every quiz question answered WRONG (learningQuiz rows with correct 0) until it is answered right.
// Grades: "Di nuovo" back to tomorrow, "Difficile" repeats the current interval, "Facile" moves one step on.
// A learningReviews row exists only once the item has been graded; until then (or when the source row is newer,
// e.g. a card marked known again) the due date is computed: the day after the source, and for items that were
// already there when Ripasso arrived, spread over the following week so day one is not a wall.
import type { LearningCard, LearningQuizAnswer, LearningReview } from '../../../lib/db'
import { addDays, dayKey } from '../../../lib/dates'
import { fnv1a } from '../../../lib/hash'

/** Days until the next review, by step. MAX_STEP MUST match the check on learning_reviews.step. */
export const INTERVALS = [1, 3, 7, 21, 60, 120] as const
export const MAX_STEP = INTERVALS.length - 1
export const DAILY_LIMIT = 15
/** Items whose source row is older than this day are spread over the week after it. */
export const LAUNCH_DAY = '2026-11-17'

export type ReviewKind = LearningReview['kind']
export type Grade = 'again' | 'hard' | 'easy'

export const reviewId = (kind: ReviewKind, courseId: string, moduleId: string, itemId: string) =>
  `${kind}:${courseId}:${moduleId}:${itemId}`

/** 'YYYY-MM-DD' + n days (local calendar, DST-safe). */
export { addDays }

/** Next step and due day after a grade given today. */
export function schedule(step: number, grade: Grade, today: string): { step: number; due: string } {
  const s = grade === 'again' ? 0 : grade === 'hard' ? Math.min(step, MAX_STEP) : Math.min(step + 1, MAX_STEP)
  return { step: s, due: addDays(today, grade === 'again' ? 1 : INTERVALS[s]!) }
}

/** Days the button would push the item out (for the labels). */
export const gradeDays = (step: number, grade: Grade): number =>
  grade === 'again' ? 1 : INTERVALS[schedule(step, grade, LAUNCH_DAY).step]!

export interface ReviewSource {
  id: string
  kind: ReviewKind
  courseId: string
  moduleId: string
  itemId: string
  updatedAt: number
}

/** Items that belong in Ripasso: known cards and wrong quiz answers. */
export function sourcesOf(cards: readonly LearningCard[], quiz: readonly LearningQuizAnswer[]): ReviewSource[] {
  const src = (kind: ReviewKind, r: LearningCard | LearningQuizAnswer): ReviewSource => ({
    id: reviewId(kind, r.courseId, r.moduleId, r.itemId),
    kind,
    courseId: r.courseId,
    moduleId: r.moduleId,
    itemId: r.itemId,
    updatedAt: r.updatedAt,
  })
  return [...cards.map((c) => src('card', c)), ...quiz.filter((q) => q.correct !== 1).map((q) => src('quiz', q))]
}

/** Due day of an item never graded (or re-added after its last grading). */
export function computedDue(s: ReviewSource): string {
  const day = dayKey(new Date(s.updatedAt))
  return day < LAUNCH_DAY ? addDays(LAUNCH_DAY, 1 + (fnv1a(s.id) % 7)) : addDays(day, 1)
}

export interface QueueItem extends ReviewSource {
  step: number
  due: string
}

export interface Queue {
  /** What to review now, in order (at most what is left of today's limit). */
  items: QueueItem[]
  /** Everything due today or earlier (may exceed the limit). */
  dueCount: number
  /** Graded today, across devices. */
  doneToday: number
  limit: number
}

export function buildQueue(
  sources: readonly ReviewSource[],
  reviews: readonly LearningReview[],
  today: string,
  limit = DAILY_LIMIT,
): Queue {
  const byId = new Map(reviews.map((r) => [r.id, r]))
  const pending: QueueItem[] = []
  for (const s of sources) {
    const r = byId.get(s.id)
    // A source newer than its last grading (card known again, quiz wrong again) starts over.
    const live = r && r.updatedAt >= s.updatedAt ? r : undefined
    const due = live?.due ?? computedDue(s)
    if (due <= today) pending.push({ ...s, step: live?.step ?? 0, due })
  }
  pending.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : fnv1a(a.id + today) - fnv1a(b.id + today)))
  const doneToday = reviews.filter((r) => r.reviewedOn === today).length
  return { items: pending.slice(0, Math.max(0, limit - doneToday)), dueCount: pending.length, doneToday, limit }
}
