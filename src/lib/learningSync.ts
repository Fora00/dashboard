import {
  db,
  type LearningCard,
  type LearningCheck,
  type LearningPosition,
  type LearningPractice,
  type LearningQuizAnswer,
  type LearningReview,
} from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { itemKey } from '../projects/learning/engine/progress'
import { MAX_STEP, reviewId, schedule, type Grade, type ReviewSource } from '../projects/learning/engine/review'
import { encodeSelected } from '../projects/learning/engine/quizAnswer'
import { isOldVocabRow, VOCAB_COURSE_ID, vocabRekeyPlan } from '../projects/learning/vocab/progress'
import type { QuizQuestion } from '../projects/learning/engine/types'

/** What answerQuiz / answerReviewQuiz need of a question: the right shown slot and the shuffle. */
type QuizKey = Pick<QuizQuestion, 'answer' | 'order'>

// Local-first sync for the Learning project (owner-only: it is the owner's
// personal progress), built on the generic engine in cloudSync.ts. Content is
// static bundle data and never synced; only the learner's rows are.
//
// Row ids are deterministic (`${courseId}:${moduleId}:${itemId}`), so two
// devices answering the same item converge on one row by last-writer-wins on
// updatedAt. A known card is a row that exists (un-knowing deletes it); quiz
// answers are locked until the module quiz is reset (a real delete).
//
// Remote access is is_owner() only (see the migration): on any other account
// pushes are rejected with 42501 and dead-lettered, the local rows stay.

/** MUST match the check on learning_practice.notes in the migration. */
export const MAX_NOTES_LENGTH = 2000

/** MUST match the check on learning_checks.checked in the migration. */
export const MAX_CHECKS = 100

interface CheckRow {
  id: string
  course_id: string
  module_id: string
  item_id: string
  checked: number[]
  updated_at: number
}

interface PositionRow {
  id: string
  course_id: string
  module_id: string
  tab: LearningPosition['tab']
  updated_at: number
}

const TABS: readonly string[] = ['lesson', 'quiz', 'cards', 'practice']

interface ReviewRow {
  id: string
  kind: LearningReview['kind']
  course_id: string
  module_id: string
  item_id: string
  step: number
  due: string
  reviewed_on: string | null
  updated_at: number
}

const DAY = /^\d{4}-\d{2}-\d{2}$/

interface QuizRow {
  id: string
  course_id: string
  module_id: string
  item_id: string
  selected: number
  correct: boolean
  updated_at: number
}

interface CardRow {
  id: string
  course_id: string
  module_id: string
  item_id: string
  updated_at: number
}

interface PracticeRow {
  id: string
  course_id: string
  module_id: string
  item_id: string
  done: boolean
  notes: string
  updated_at: number
}

const quizTable: TableSync<LearningQuizAnswer, QuizRow> = {
  remote: 'learning_quiz',
  table: () => db.learningQuiz,
  columns: 'id, course_id, module_id, item_id, selected, correct, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    course_id: r.courseId,
    module_id: r.moduleId,
    item_id: r.itemId,
    selected: r.selected,
    correct: r.correct === 1,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    courseId: r.course_id,
    moduleId: r.module_id,
    itemId: r.item_id,
    selected: Number(r.selected),
    correct: r.correct ? 1 : 0,
    updatedAt: Number(r.updated_at),
  }),
}

const cardsTable: TableSync<LearningCard, CardRow> = {
  remote: 'learning_cards',
  table: () => db.learningCards,
  columns: 'id, course_id, module_id, item_id, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    course_id: r.courseId,
    module_id: r.moduleId,
    item_id: r.itemId,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    courseId: r.course_id,
    moduleId: r.module_id,
    itemId: r.item_id,
    updatedAt: Number(r.updated_at),
  }),
}

const practiceTable: TableSync<LearningPractice, PracticeRow> = {
  remote: 'learning_practice',
  table: () => db.learningPractice,
  columns: 'id, course_id, module_id, item_id, done, notes, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    course_id: r.courseId,
    module_id: r.moduleId,
    item_id: r.itemId,
    done: r.done === 1,
    notes: r.notes,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => {
    if (typeof r.notes !== 'string') throw new Error('learning_practice: bad row')
    return {
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      itemId: r.item_id,
      done: r.done ? 1 : 0,
      notes: r.notes,
      updatedAt: Number(r.updated_at),
    }
  },
}

const checksTable: TableSync<LearningCheck, CheckRow> = {
  remote: 'learning_checks',
  table: () => db.learningChecks,
  columns: 'id, course_id, module_id, item_id, checked, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    course_id: r.courseId,
    module_id: r.moduleId,
    item_id: r.itemId,
    checked: r.checked,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => {
    if (!Array.isArray(r.checked)) throw new Error('learning_checks: bad row')
    return {
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      itemId: r.item_id,
      checked: normaliseChecked(r.checked.map(Number)),
      updatedAt: Number(r.updated_at),
    }
  },
}

const positionTable: TableSync<LearningPosition, PositionRow> = {
  remote: 'learning_position',
  table: () => db.learningPosition,
  columns: 'id, course_id, module_id, tab, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    course_id: r.courseId,
    module_id: r.moduleId,
    tab: r.tab,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => {
    if (!TABS.includes(r.tab)) throw new Error('learning_position: bad row')
    return {
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      tab: r.tab,
      updatedAt: Number(r.updated_at),
    }
  },
}

const reviewsTable: TableSync<LearningReview, ReviewRow> = {
  remote: 'learning_reviews',
  table: () => db.learningReviews,
  columns: 'id, kind, course_id, module_id, item_id, step, due, reviewed_on, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => ({
    id: r.id,
    kind: r.kind,
    course_id: r.courseId,
    module_id: r.moduleId,
    item_id: r.itemId,
    step: r.step,
    due: r.due,
    reviewed_on: r.reviewedOn || null,
    updated_at: r.updatedAt,
  }),
  fromRow: (r) => {
    if ((r.kind !== 'card' && r.kind !== 'quiz') || !DAY.test(String(r.due)))
      throw new Error('learning_reviews: bad row')
    return {
      id: r.id,
      kind: r.kind,
      courseId: r.course_id,
      moduleId: r.module_id,
      itemId: r.item_id,
      step: Math.min(Math.max(Number(r.step) || 0, 0), MAX_STEP),
      due: String(r.due),
      reviewedOn: r.reviewed_on && DAY.test(String(r.reviewed_on)) ? String(r.reviewed_on) : '',
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'learning',
  tables: [quizTable, cardsTable, practiceTable, checksTable, positionTable, reviewsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function answerQuiz(
  courseId: string,
  moduleId: string,
  itemId: string,
  shown: number,
  quiz: QuizKey,
): Promise<void> {
  const id = itemKey(courseId, moduleId, itemId)
  // The answer is locked: the first pick stays until the quiz is reset.
  if (await db.learningQuiz.get(id)) return
  await engine.upsert('learning_quiz', {
    id,
    courseId,
    moduleId,
    itemId,
    // Author-order index, so a later rewording of the question cannot move it (quizAnswer.ts).
    selected: encodeSelected(quiz, shown),
    correct: shown === quiz.answer ? 1 : 0,
    updatedAt: Date.now(),
  })
}

async function idsOf(
  table: 'learningQuiz' | 'learningCards' | 'learningPractice',
  courseId: string,
  moduleId?: string,
) {
  const t = db[table]
  const rows = moduleId
    ? await t.where('[courseId+moduleId]').equals([courseId, moduleId]).toArray()
    : await t.where('courseId').equals(courseId).toArray()
  return rows.map((r) => r.id)
}

/** Ripasso rows of one kind in a module (its whole quiz / deck went away). */
async function moduleReviewIds(kind: 'quiz' | 'card', courseId: string, moduleId: string): Promise<string[]> {
  const rows = await db.learningReviews.where('courseId').equals(courseId).toArray()
  return rows.filter((r) => r.kind === kind && r.moduleId === moduleId).map((r) => r.id)
}

/** The Ripasso rows that exist for these cards (so no delete is queued for a card never reviewed). */
async function cardReviewIds(courseId: string, moduleId: string, itemIds: readonly string[]): Promise<string[]> {
  const ids = itemIds.map((itemId) => reviewId('card', courseId, moduleId, itemId))
  const rows = await db.learningReviews.bulkGet(ids)
  return ids.filter((_, i) => rows[i])
}

const REMOVE_TABLES = () => [db.learningQuiz, db.learningCards, db.learningReviews, db.outbox]

export async function resetQuiz(courseId: string, moduleId: string): Promise<void> {
  await db.transaction('rw', REMOVE_TABLES(), async () => {
    await engine.removeMany('learning_quiz', await idsOf('learningQuiz', courseId, moduleId))
    await engine.removeMany('learning_reviews', await moduleReviewIds('quiz', courseId, moduleId))
  })
}

/** "Rifai le sbagliate": clears only the wrong answers of one module, keeping the right ones. */
export async function resetWrongQuiz(courseId: string, moduleId: string): Promise<void> {
  const rows = await db.learningQuiz.where('[courseId+moduleId]').equals([courseId, moduleId]).toArray()
  await engine.removeMany(
    'learning_quiz',
    rows.filter((r) => r.correct !== 1).map((r) => r.id),
  )
}

export async function setCardKnown(courseId: string, moduleId: string, itemId: string, known: boolean): Promise<void> {
  const id = itemKey(courseId, moduleId, itemId)
  if (known)
    await engine.upsert('learning_cards', {
      id,
      courseId,
      moduleId,
      itemId,
      updatedAt: Date.now(),
    })
  else await setCardsKnown(courseId, moduleId, [itemId], false)
}

/** Marks several cards of one module known/unknown in one transaction (one outbox batch). */
export async function setCardsKnown(
  courseId: string,
  moduleId: string,
  itemIds: readonly string[],
  known: boolean,
): Promise<void> {
  const ids = [...new Set(itemIds)]
  if (known) {
    const updatedAt = Date.now()
    await engine.upsertMany(
      'learning_cards',
      ids.map((itemId) => ({
        id: itemKey(courseId, moduleId, itemId),
        courseId,
        moduleId,
        itemId,
        updatedAt,
      })),
    )
  } else {
    // Un-knowing also leaves Ripasso: the card's schedule row goes in the same batch.
    await db.transaction('rw', REMOVE_TABLES(), async () => {
      await engine.removeMany(
        'learning_cards',
        ids.map((itemId) => itemKey(courseId, moduleId, itemId)),
      )
      await engine.removeMany('learning_reviews', await cardReviewIds(courseId, moduleId, ids))
    })
  }
}

export async function resetCards(courseId: string, moduleId: string): Promise<void> {
  await db.transaction('rw', REMOVE_TABLES(), async () => {
    await engine.removeMany('learning_cards', await idsOf('learningCards', courseId, moduleId))
    await engine.removeMany('learning_reviews', await moduleReviewIds('card', courseId, moduleId))
  })
}

async function updatePractice(
  courseId: string,
  moduleId: string,
  itemId: string,
  patch: { done?: 0 | 1; notes?: string },
): Promise<void> {
  const id = itemKey(courseId, moduleId, itemId)
  const prev = await db.learningPractice.get(id)
  await engine.upsert('learning_practice', {
    id,
    courseId,
    moduleId,
    itemId,
    done: prev?.done ?? 0,
    notes: prev?.notes ?? '',
    ...patch,
    updatedAt: Date.now(),
  })
}

export const setPracticeDone = (courseId: string, moduleId: string, itemId: string, done: boolean) =>
  updatePractice(courseId, moduleId, itemId, { done: done ? 1 : 0 })

export const setPracticeNotes = (courseId: string, moduleId: string, itemId: string, notes: string) =>
  updatePractice(courseId, moduleId, itemId, {
    notes: notes.slice(0, MAX_NOTES_LENGTH),
  })

// --- Checklist ticks (synced) -----------------------------------------------

/** Normalised tick list: unique, non-negative integers, ascending, capped. */
export function normaliseChecked(checked: readonly number[]): number[] {
  return [...new Set(checked.filter((i) => Number.isInteger(i) && i >= 0))].sort((a, b) => a - b).slice(0, MAX_CHECKS)
}

export async function setChecks(
  courseId: string,
  moduleId: string,
  itemId: string,
  checked: readonly number[],
): Promise<void> {
  await engine.upsert('learning_checks', {
    id: itemKey(courseId, moduleId, itemId),
    courseId,
    moduleId,
    itemId,
    checked: normaliseChecked(checked),
    updatedAt: Date.now(),
  })
}

/** Tick or untick one checklist line (read-modify-write in one transaction). */
export async function toggleCheck(
  courseId: string,
  moduleId: string,
  itemId: string,
  index: number,
  on: boolean,
): Promise<void> {
  await db.transaction('rw', db.learningChecks, db.outbox, async () => {
    const prev = (await db.learningChecks.get(itemKey(courseId, moduleId, itemId)))?.checked ?? []
    const next = on ? [...prev, index] : prev.filter((i) => i !== index)
    await setChecks(courseId, moduleId, itemId, next)
  })
}

/** Clears the ticks of one course. The photo diary is kept on purpose. */
export async function resetChecks(courseId: string): Promise<void> {
  const rows = await db.learningChecks.where('courseId').equals(courseId).primaryKeys()
  await engine.removeMany('learning_checks', rows as string[])
}

// --- Where I left off (synced) ------------------------------------------------

/** Remember the module/tab last opened in a course; no write when unchanged. */
export async function setPosition(courseId: string, moduleId: string, tab: LearningPosition['tab']): Promise<void> {
  const prev = await db.learningPosition.get(courseId)
  if (prev && prev.moduleId === moduleId && prev.tab === tab) return
  await engine.upsert('learning_position', {
    id: courseId,
    courseId,
    moduleId,
    tab,
    updatedAt: Date.now(),
  })
}

/** Reset everything the learner did in one course (quiz, cards, practice incl. notes, ticks, position, Ripasso). */
export async function resetCourse(courseId: string): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.learningQuiz,
      db.learningCards,
      db.learningPractice,
      db.learningChecks,
      db.learningPosition,
      db.learningReviews,
      db.outbox,
    ],
    async () => {
      await engine.removeMany('learning_quiz', await idsOf('learningQuiz', courseId))
      await engine.removeMany('learning_cards', await idsOf('learningCards', courseId))
      await engine.removeMany('learning_practice', await idsOf('learningPractice', courseId))
      await resetChecks(courseId)
      await engine.remove('learning_position', courseId)
      const reviews = await db.learningReviews.where('courseId').equals(courseId).primaryKeys()
      await engine.removeMany('learning_reviews', reviews as string[])
    },
  )
}

// --- Ripasso (synced) ----------------------------------------------------------

/** Grade a flashcard in Ripasso: stores its next step and due day (review.ts `schedule`). */
export async function gradeReview(item: ReviewSource & { step: number }, grade: Grade, today: string): Promise<void> {
  const next = schedule(item.step, grade, today)
  await engine.upsert('learning_reviews', {
    id: item.id,
    kind: item.kind,
    courseId: item.courseId,
    moduleId: item.moduleId,
    itemId: item.itemId,
    ...next,
    reviewedOn: today,
    updatedAt: Date.now(),
  })
}

/**
 * Answer a wrong-quiz item in Ripasso. Right: the module's quiz answer becomes the right one (progress goes up and
 * the item leaves Ripasso). Wrong: it comes back tomorrow. Either way it counts toward today's limit.
 */
export async function answerReviewQuiz(
  item: ReviewSource & { step: number },
  shown: number,
  quiz: QuizKey,
  today: string,
): Promise<void> {
  const right = shown === quiz.answer
  await db.transaction('rw', db.learningQuiz, db.learningReviews, db.outbox, async () => {
    if (right)
      await engine.upsert('learning_quiz', {
        id: itemKey(item.courseId, item.moduleId, item.itemId),
        courseId: item.courseId,
        moduleId: item.moduleId,
        itemId: item.itemId,
        selected: encodeSelected(quiz, shown),
        correct: 1,
        updatedAt: Date.now(),
      })
    await gradeReview(item, right ? 'easy' : 'again', today)
  })
}

// --- Vocabolario: theme-keyed rows -> word-keyed (A2, 2026-11-18) -------------

let rekeying: Promise<void> | undefined

/**
 * Rewrites the old theme-keyed Vocabolario rows (known marks + their Ripasso rows) to the fixed moduleId, through
 * the engine so the change syncs to every device: one transaction, upserts of the new ids and deletes of the old
 * ones. Idempotent and cheap when there is nothing to do (it is driven by detecting old rows, not by a flag, so rows
 * an older app version writes later are rewritten too); two devices running it write the same deterministic ids.
 */
export function migrateVocabKeys(): Promise<void> {
  rekeying ??= db
    .transaction('rw', db.learningCards, db.learningReviews, db.outbox, async () => {
      const [cards, reviews] = await Promise.all([
        db.learningCards.where('courseId').equals(VOCAB_COURSE_ID).toArray(),
        db.learningReviews.where('courseId').equals(VOCAB_COURSE_ID).toArray(),
      ])
      if (!cards.some(isOldVocabRow) && !reviews.some(isOldVocabRow)) return
      const plan = vocabRekeyPlan(cards, reviews)
      await engine.upsertMany('learning_cards', plan.upsertCards)
      await engine.removeMany('learning_cards', plan.removeCards)
      await engine.upsertMany('learning_reviews', plan.upsertReviews)
      await engine.removeMany('learning_reviews', plan.removeReviews)
    })
    .finally(() => {
      rekeying = undefined
    })
  return rekeying
}

// --- Sync engine ------------------------------------------------------------
export const flush = engine.flush
export const syncNow = engine.syncNow

/** The engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine
/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)
/** Start syncing (call when a session exists). Returns a stop function. */
export const startLearningSync = engine.start
