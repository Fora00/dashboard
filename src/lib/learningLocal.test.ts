import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import {
  addSketch,
  courseSketches,
  deleteSketch,
  MAX_SKETCH_NOTE_LENGTH,
  normaliseChecked,
  resetChecks,
  setChecks,
  setSketchNote,
  setSketchScore,
  sketchesOf,
  toggleCheck,
} from './learningLocal'

beforeEach(resetDb)

const C = 'disegno'
const photo = (s = 'x') => new Blob([s], { type: 'image/jpeg' })

describe('checklist ticks', () => {
  it('saves one row per exercise, toggles indices and queues one upsert per change (synced)', async () => {
    await toggleCheck(C, 'm1', 'p1', 2, true)
    await toggleCheck(C, 'm1', 'p1', 0, true)
    await toggleCheck(C, 'm1', 'p1', 2, true) // twice: still once
    expect(await db.learningChecks.get(`${C}:m1:p1`)).toMatchObject({
      courseId: C,
      moduleId: 'm1',
      itemId: 'p1',
      checked: [0, 2],
    })
    await toggleCheck(C, 'm1', 'p1', 0, false)
    expect((await db.learningChecks.get(`${C}:m1:p1`))?.checked).toEqual([2])
    expect((await db.outbox.toArray()).every((o) => o.table === 'learning_checks' && o.rowId === `${C}:m1:p1`)).toBe(
      true,
    )
    expect(await db.outbox.count()).toBe(4)
  })

  it('normalises and resets per course only', async () => {
    expect(normaliseChecked([3, 1, 1, -1, 2.5])).toEqual([1, 3])
    await setChecks(C, 'm1', 'p1', [1])
    await setChecks('other', 'm1', 'p1', [1])
    await resetChecks(C)
    expect((await db.learningChecks.toArray()).map((r) => r.courseId)).toEqual(['other'])
  })
})

describe('photo diary', () => {
  it('stores photos per exercise, oldest first, with note and self-score', async () => {
    const a = await addSketch(C, 'm1', 'p1', photo('a'))
    await new Promise((r) => setTimeout(r, 2))
    const b = await addSketch(C, 'm1', 'p1', photo('b'), 'seconda')
    await addSketch(C, 'm2', 'p1', photo('c'))
    expect((await sketchesOf(C, 'm1', 'p1')).map((s) => s.id)).toEqual([a, b])
    expect(await courseSketches(C)).toHaveLength(3)
    expect(await (await db.learningSketches.get(a))!.photo.text()).toBe('a')

    await setSketchNote(a, 'n'.repeat(MAX_SKETCH_NOTE_LENGTH + 10))
    await setSketchScore(a, 4)
    await setSketchScore(a, 9) // ignored
    expect(await db.learningSketches.get(a)).toMatchObject({ selfScore: 4 })
    expect((await db.learningSketches.get(a))?.note).toHaveLength(MAX_SKETCH_NOTE_LENGTH)
    await setSketchScore(a, null)
    expect((await db.learningSketches.get(a))?.selfScore).toBeUndefined()

    await deleteSketch(b)
    expect((await sketchesOf(C, 'm1', 'p1')).map((s) => s.id)).toEqual([a])
    expect(await db.outbox.count()).toBe(0)
  })

  it('resetting the ticks keeps the photos', async () => {
    await addSketch(C, 'm1', 'p1', photo())
    await setChecks(C, 'm1', 'p1', [0])
    await resetChecks(C)
    expect(await db.learningSketches.count()).toBe(1)
  })
})
