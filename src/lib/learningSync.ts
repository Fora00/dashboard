import { db, type LearningCard, type LearningPractice, type LearningQuizAnswer } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { itemKey } from '../projects/learning/progress'

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

const engine = createCloudSync({
  projectId: 'learning',
  tables: [quizTable, cardsTable, practiceTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function answerQuiz(
  courseId: string,
  moduleId: string,
  itemId: string,
  selected: number,
  answer: number,
): Promise<void> {
  const id = itemKey(courseId, moduleId, itemId)
  // The answer is locked: the first pick stays until the quiz is reset.
  if (await db.learningQuiz.get(id)) return
  await engine.upsert('learning_quiz', {
    id,
    courseId,
    moduleId,
    itemId,
    selected,
    correct: selected === answer ? 1 : 0,
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

export async function resetQuiz(courseId: string, moduleId: string): Promise<void> {
  await engine.removeMany('learning_quiz', await idsOf('learningQuiz', courseId, moduleId))
}

export async function setCardKnown(courseId: string, moduleId: string, itemId: string, known: boolean): Promise<void> {
  const id = itemKey(courseId, moduleId, itemId)
  if (known) await engine.upsert('learning_cards', { id, courseId, moduleId, itemId, updatedAt: Date.now() })
  else await engine.remove('learning_cards', id)
}

export async function resetCards(courseId: string, moduleId: string): Promise<void> {
  await engine.removeMany('learning_cards', await idsOf('learningCards', courseId, moduleId))
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
  updatePractice(courseId, moduleId, itemId, { notes: notes.slice(0, MAX_NOTES_LENGTH) })

/** Reset everything the learner did in one course (quiz, cards, practice incl. notes). */
export async function resetCourse(courseId: string): Promise<void> {
  await db.transaction('rw', db.learningQuiz, db.learningCards, db.learningPractice, db.outbox, async () => {
    await engine.removeMany('learning_quiz', await idsOf('learningQuiz', courseId))
    await engine.removeMany('learning_cards', await idsOf('learningCards', courseId))
    await engine.removeMany('learning_practice', await idsOf('learningPractice', courseId))
  })
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
