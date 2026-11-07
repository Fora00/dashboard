import { db, type LearningSketch } from './db'

// Learning state that stays on THIS device only: the photo diary of the
// learner's sheets. Deliberately not in learningSync.ts: no outbox, no Supabase
// table. Photos are Blobs (too big for the free tier and private by nature).
// Checklist ticks used to live here; they are synced now (learningSync.ts) and
// re-exported below for existing callers. Works offline and signed out.

export const MAX_SKETCH_NOTE_LENGTH = 500

export { normaliseChecked, resetChecks, setChecks, toggleCheck } from './learningSync'

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
