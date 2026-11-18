import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { courseById } from '../projects/learning/courses'
import { courseProgress } from '../projects/learning/engine/progress'
import {
  answerQuiz,
  answerReviewQuiz,
  gradeReview,
  MAX_NOTES_LENGTH,
  migrateVocabKeys,
  resetCards,
  resetCourse,
  resetQuiz,
  resetWrongQuiz,
  setCardKnown,
  setPracticeDone,
  setPosition,
  setPracticeNotes,
  toggleCheck,
} from './learningSync'
import { resetThemeLangs, setWordKnown } from '../projects/learning/vocab/store'

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
    await answerQuiz(C, 'http', 'q1', 1, { answer: 2 })
    await answerQuiz(C, 'http', 'q1', 2, { answer: 2 }) // second tap is ignored
    const rows = await db.learningQuiz.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      id: `${C}:http:q1`,
      itemId: 'q1',
      selected: 11,
      correct: 0,
    })
    expect(await ops('learning_quiz')).toHaveLength(1)
  })

  it('retry resets only that module, queues the deletes, and is answerable again', async () => {
    await answerQuiz(C, 'http', 'q1', 2, { answer: 2 })
    await answerQuiz(C, 'api', 'q1', 0, { answer: 0 })
    await resetQuiz(C, 'http')
    expect((await db.learningQuiz.toArray()).map((r) => r.moduleId)).toEqual(['api'])
    expect((await ops('learning_quiz')).some((o) => o.op === 'delete' && o.rowId === `${C}:http:q1`)).toBe(true)
    await answerQuiz(C, 'http', 'q1', 2, { answer: 2 })
    expect(await db.learningQuiz.count()).toBe(2)
  })

  it('retry of the wrong ones keeps the right answers of that module and other modules', async () => {
    await answerQuiz(C, 'http', 'q1', 2, { answer: 2 }) // right
    await answerQuiz(C, 'http', 'q2', 0, { answer: 1 }) // wrong
    await answerQuiz(C, 'api', 'q1', 0, { answer: 1 }) // wrong, other module
    await resetWrongQuiz(C, 'http')
    expect((await db.learningQuiz.toArray()).map((r) => r.id).sort()).toEqual([`${C}:api:q1`, `${C}:http:q1`])
    const dels = (await ops('learning_quiz')).filter((o) => o.op === 'delete').map((o) => o.rowId)
    expect(dels).toEqual([`${C}:http:q2`])
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
    await answerQuiz(C, 'http', q.id, q.answer, q)
    await setCardKnown(C, 'http', http.cards[0]!.id, true)
    await setPracticeDone(C, 'http', http.practice[1]!.id, true)
    const p = courseProgress(course, await state())
    expect(p.modules.http).toMatchObject({ done: 3, total: 10, percent: 30 })
    expect(p.done).toBe(3)

    await resetCourse(C)
    expect(courseProgress(course, await state()).done).toBe(0)
  })
})

describe('checklist ticks and position (synced)', () => {
  it('ticks queue upserts and resetCourse also clears ticks and position', async () => {
    await toggleCheck(C, 'http', 'p1', 1, true)
    await setPosition(C, 'http', 'quiz')
    expect(await db.learningChecks.count()).toBe(1)
    expect(await db.learningPosition.get(C)).toMatchObject({
      moduleId: 'http',
      tab: 'quiz',
    })
    expect((await ops('learning_checks')).length).toBe(1)
    await resetCourse(C)
    expect(await db.learningChecks.count()).toBe(0)
    expect(await db.learningPosition.count()).toBe(0)
  })

  it('setPosition keeps one row per course and skips unchanged writes', async () => {
    await setPosition(C, 'http', 'lesson')
    await setPosition(C, 'http', 'lesson')
    await setPosition(C, 'api', 'cards')
    expect(await db.learningPosition.count()).toBe(1)
    expect(await db.learningPosition.get(C)).toMatchObject({
      moduleId: 'api',
      tab: 'cards',
    })
    expect((await ops('learning_position')).length).toBe(2)
  })
})

describe('ripasso (synced)', () => {
  const item = (kind: 'card' | 'quiz', itemId: string, step = 0) => ({
    id: `${kind}:${C}:http:${itemId}`,
    kind,
    courseId: C,
    moduleId: 'http',
    itemId,
    updatedAt: 1,
    step,
  })

  it('grading a card stores step, due day and today, and queues one upsert', async () => {
    await gradeReview(item('card', 'c1', 1), 'easy', '2026-11-20')
    expect(await db.learningReviews.get(`card:${C}:http:c1`)).toMatchObject({
      step: 2,
      due: '2026-11-27',
      reviewedOn: '2026-11-20',
    })
    expect(await ops('learning_reviews')).toHaveLength(1)
  })

  it('a wrong quiz answered right in Ripasso becomes right in the module; wrong again comes back tomorrow', async () => {
    await answerQuiz(C, 'http', 'q1', 0, { answer: 2 })
    await answerReviewQuiz(item('quiz', 'q1'), 1, { answer: 2 }, '2026-11-20')
    expect(await db.learningQuiz.get(`${C}:http:q1`)).toMatchObject({
      correct: 0,
    })
    expect(await db.learningReviews.get(`quiz:${C}:http:q1`)).toMatchObject({
      step: 0,
      due: '2026-11-21',
    })
    await answerReviewQuiz(item('quiz', 'q1'), 2, { answer: 2 }, '2026-11-21')
    expect(await db.learningQuiz.get(`${C}:http:q1`)).toMatchObject({
      correct: 1,
      selected: 12,
    })
    expect(await db.learningReviews.get(`quiz:${C}:http:q1`)).toMatchObject({
      reviewedOn: '2026-11-21',
    })
  })

  it('resetCourse also clears the Ripasso rows of that course', async () => {
    await gradeReview(item('card', 'c1'), 'hard', '2026-11-20')
    await resetCourse(C)
    expect(await db.learningReviews.count()).toBe(0)
  })

  it('per-module resets and un-knowing remove the matching Ripasso rows, only in that module', async () => {
    await setCardKnown(C, 'http', 'c1', true)
    await setCardKnown(C, 'http', 'c2', true)
    await setCardKnown(C, 'api', 'c1', true)
    await answerQuiz(C, 'http', 'q1', 0, { answer: 2 })
    for (const [k, m, i] of [
      ['card', 'http', 'c1'],
      ['card', 'http', 'c2'],
      ['card', 'api', 'c1'],
      ['quiz', 'http', 'q1'],
    ] as const)
      await gradeReview({ ...item(k, i), moduleId: m, id: `${k}:${C}:${m}:${i}` }, 'hard', '2026-11-20')
    const ids = async () => (await db.learningReviews.toArray()).map((r) => r.id).sort()

    await setCardKnown(C, 'http', 'c1', false)
    expect(await ids()).not.toContain(`card:${C}:http:c1`)
    await resetQuiz(C, 'http')
    expect(await ids()).not.toContain(`quiz:${C}:http:q1`)
    await resetCards(C, 'http')
    expect(await ids()).toEqual([`card:${C}:api:c1`])
    const dels = (await ops('learning_reviews')).filter((o) => o.op === 'delete').map((o) => o.rowId)
    expect(dels.sort()).toEqual([`card:${C}:http:c1`, `card:${C}:http:c2`, `quiz:${C}:http:q1`])
  })
})

describe('Vocabolario rows keyed by word (A2)', () => {
  const V = 'vocabolario'
  const oldCard = (theme: string, itemId: string, updatedAt: number) => ({
    id: `${V}:${theme}:${itemId}`,
    courseId: V,
    moduleId: theme,
    itemId,
    updatedAt,
  })

  it('rewrites theme-keyed cards and Ripasso rows through the outbox, once (idempotent)', async () => {
    await db.learningCards.bulkPut([oldCard('saluti', 'pane.es', 3), oldCard('cibo-bevande', 'pane.es', 5)])
    await db.learningReviews.put({
      id: `card:${V}:saluti:pane.es`,
      kind: 'card',
      courseId: V,
      moduleId: 'saluti',
      itemId: 'pane.es',
      step: 2,
      due: '2026-12-01',
      reviewedOn: '2026-11-20',
      updatedAt: 6,
    })
    await setCardKnown(C, 'http', 'c1', true) // a course card: untouched
    await db.outbox.clear()
    await Promise.all([migrateVocabKeys(), migrateVocabKeys()]) // concurrent calls share one run
    expect((await db.learningCards.toArray()).map((c) => c.id).sort()).toEqual([`${C}:http:c1`, `${V}:_words:pane.es`])
    expect(await db.learningCards.get(`${V}:_words:pane.es`)).toMatchObject({
      moduleId: '_words',
      updatedAt: 5,
    })
    expect((await db.learningReviews.toArray()).map((r) => [r.id, r.step])).toEqual([[`card:${V}:_words:pane.es`, 2]])
    const cardOps = (await ops('learning_cards')).map((o) => `${o.op} ${o.rowId}`).sort()
    expect(cardOps).toEqual([
      `delete ${V}:cibo-bevande:pane.es`,
      `delete ${V}:saluti:pane.es`,
      `upsert ${V}:_words:pane.es`,
    ])
    expect((await ops('learning_reviews')).map((o) => `${o.op} ${o.rowId}`).sort()).toEqual([
      `delete card:${V}:saluti:pane.es`,
      `upsert card:${V}:_words:pane.es`,
    ])
    const before = await db.outbox.count()
    await migrateVocabKeys()
    expect(await db.outbox.count()).toBe(before)
  })

  it('a word marked known stays known in any theme; setWordKnown and resets write one batch', async () => {
    await setWordKnown('pane', ['es', 'fr', 'de'], true)
    expect((await db.learningCards.toArray()).map((c) => c.id).sort()).toEqual([
      `${V}:_words:pane.de`,
      `${V}:_words:pane.es`,
      `${V}:_words:pane.fr`,
    ])
    const word = {
      id: 'pane',
      it: 'pane',
      pos: 'n' as const,
      theme: 'any',
      es: {} as never,
      fr: {} as never,
    }
    const known = new Set((await db.learningCards.toArray()).map((c) => c.itemId))
    await resetThemeLangs([word], known, ['es', 'de']) // de missing in this word: its mark stays
    expect((await db.learningCards.toArray()).map((c) => c.itemId).sort()).toEqual(['pane.de', 'pane.fr'])
    expect((await ops('learning_cards')).length).toBe(4) // 3 upserts + 1 delete
  })

  it('setWordKnown first rewrites old rows, so un-knowing reaches a theme-keyed mark', async () => {
    await db.learningCards.put(oldCard('saluti', 'pane.es', 3))
    await setWordKnown('pane', ['es'], false)
    expect(await db.learningCards.count()).toBe(0)
  })
})
