import { db, type LearningCheck, type LearningSketch } from './db'
import { itemKey } from '../projects/learning/progress'

// Learning state that stays on THIS device only: checklist ticks of drawing
// exercises and the photo diary of the learner's sheets. Deliberately not in
// learningSync.ts: no outbox, no Supabase table, no migration. Photos are
// Blobs (too big for the free tier and private by nature); ticks are cheap to
// redo, and keeping them next to the photos keeps "saper fare" consistent on
// one device. Works offline and signed out like every other Dexie write.

export const MAX_SKETCH_NOTE_LENGTH = 500

/** Normalised tick list: unique, non-negative integers, ascending. */
export function normaliseChecked(checked: readonly number[]): number[] {
  return [...new Set(checked.filter((i) => Number.isInteger(i) && i >= 0))].sort((a, b) => a - b)
}

export async function setChecks(
  courseId: string,
  moduleId: string,
  itemId: string,
  checked: readonly number[],
): Promise<void> {
  const row: LearningCheck = {
    id: itemKey(courseId, moduleId, itemId),
    courseId,
    moduleId,
    itemId,
    checked: normaliseChecked(checked),
    updatedAt: Date.now(),
  }
  await db.learningChecks.put(row)
}

/** Tick or untick one checklist line (read-modify-write in one transaction). */
export async function toggleCheck(
  courseId: string,
  moduleId: string,
  itemId: string,
  index: number,
  on: boolean,
): Promise<void> {
  await db.transaction('rw', db.learningChecks, async () => {
    const prev = (await db.learningChecks.get(itemKey(courseId, moduleId, itemId)))?.checked ?? []
    const next = on ? [...prev, index] : prev.filter((i) => i !== index)
    await setChecks(courseId, moduleId, itemId, next)
  })
}

/** Clears the ticks of one course ("Azzera i progressi"). The photo diary is kept on purpose. */
export async function resetChecks(courseId: string): Promise<void> {
  await db.learningChecks.where('courseId').equals(courseId).delete()
}

// --- Photo diary ------------------------------------------------------------

export async function addSketch(
  courseId: string,
  moduleId: string,
  itemId: string,
  photo: Blob,
  note = '',
): Promise<string> {
  const id = crypto.randomUUID()
  const row: LearningSketch = {
    id,
    courseId,
    moduleId,
    itemId,
    photo,
    note: note.slice(0, MAX_SKETCH_NOTE_LENGTH),
    createdAt: Date.now(),
  }
  await db.learningSketches.add(row)
  return id
}

export async function setSketchNote(id: string, note: string): Promise<void> {
  await db.learningSketches.update(id, { note: note.slice(0, MAX_SKETCH_NOTE_LENGTH) })
}

/** 1-5, or null to clear it. Out-of-range values are ignored. */
export async function setSketchScore(id: string, score: number | null): Promise<void> {
  if (score === null) {
    await db.learningSketches
      .where('id')
      .equals(id)
      .modify((s) => {
        delete s.selfScore
      })
    return
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) return
  await db.learningSketches.update(id, { selfScore: score })
}

export async function deleteSketch(id: string): Promise<void> {
  await db.learningSketches.delete(id)
}

/** Photos of one exercise, oldest first (so old and new sit side by side in date order). */
export function sketchesOf(courseId: string, moduleId: string, itemId: string): Promise<LearningSketch[]> {
  return db.learningSketches
    .where('[courseId+moduleId+itemId]')
    .equals([courseId, moduleId, itemId])
    .sortBy('createdAt')
}

/** Every photo of a course, oldest first (the Diario view). */
export function courseSketches(courseId: string): Promise<LearningSketch[]> {
  return db.learningSketches.where('courseId').equals(courseId).sortBy('createdAt')
}
