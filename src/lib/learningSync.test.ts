import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { courseById } from '../projects/learning/courses'
import { courseProgress } from '../projects/learning/progress'
import {
  answerQuiz,
  MAX_NOTES_LENGTH,
  resetCards,
  resetCourse,
  resetQuiz,
  setCardKnown,
  setPracticeDone,
  setPracticeNotes,
} from './learningSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const C = 'backend-interview-lab'
const state = async () => ({
  quiz: await db.learningQuiz.toArray(),
  cards: await db.learningCards.toArray(),
  practice: await db.learningPractice.toArray(),
})
const ops = async (table: string) => (await db.outbox.toArray()).filter((o) => o.table === table)

describe('quiz', () => {
  it('records correctness, locks the first answer and queues one upsert', async () => {
    await answerQuiz(C, 'http', 'q1', 1, 2)
    await answerQuiz(C, 'http', 'q1', 2, 2) // second tap is ignored
    const rows = await db.learningQuiz.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ id: `${C}:http:q1`, itemId: 'q1', selected: 1, correct: 0 })
    expect(await ops('learning_quiz')).toHaveLength(1)
  })

  it('retry resets only that module, queues the deletes, and is answerable again', async () => {
    await answerQuiz(C, 'http', 'q1', 2, 2)
    await answerQuiz(C, 'api', 'q1', 0, 0)
    await resetQuiz(C, 'http')
    expect((await db.learningQuiz.toArray()).map((r) => r.moduleId)).toEqual(['api'])
    expect((await ops('learning_quiz')).some((o) => o.op === 'delete' && o.rowId === `${C}:http:q1`)).toBe(true)
    await answerQuiz(C, 'http', 'q1', 2, 2)
    expect(await db.learningQuiz.count()).toBe(2)
  })
})

describe('cards', () => {
  it('knows and un-knows a card; reset clears the module deck', async () => {
    await setCardKnown(C, 'http', 'c1', true)
    await setCardKnown(C, 'http', 'c1', true)
    await setCardKnown(C, 'http', 'c2', true)
    expect(await db.learningCards.count()).toBe(2)
    await setCardKnown(C, 'http', 'c2', false)
    expect(await db.learningCards.count()).toBe(1)
    await resetCards(C, 'http')
    expect(await db.learningCards.count()).toBe(0)
  })
})

describe('practice', () => {
  it('keeps notes and done independent, and caps the notes', async () => {
    await setPracticeNotes(C, 'http', 'p1', 'punti')
    await setPracticeDone(C, 'http', 'p1', true)
    await setPracticeNotes(C, 'http', 'p1', 'x'.repeat(MAX_NOTES_LENGTH + 50))
    const [row] = await db.learningPractice.toArray()
    expect(row?.done).toBe(1)
    expect(row?.notes).toHaveLength(MAX_NOTES_LENGTH)
    await setPracticeDone(C, 'http', 'p1', false)
    expect((await db.learningPractice.toArray())[0]?.done).toBe(0)
  })
})

describe('progress survives (reads straight from Dexie)', () => {
  it('computes per-module and overall percent from stored rows, and resetCourse clears them', async () => {
    const course = courseById(C)!
    const http = course.modules.find((m) => m.id === 'http')!
    const q = http.quiz[0]!
    await answerQuiz(C, 'http', q.id, q.answer, q.answer)
    await setCardKnown(C, 'http', http.cards[0]!.id, true)
    await setPracticeDone(C, 'http', http.practice[1]!.id, true)
    const p = courseProgress(course, await state())
    expect(p.modules.http).toMatchObject({ done: 3, total: 10, percent: 30 })
    expect(p.done).toBe(3)

    await resetCourse(C)
    expect(courseProgress(course, await state()).done).toBe(0)
  })
})
