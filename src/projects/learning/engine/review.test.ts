import { describe, expect, it } from 'vitest'
import type { LearningCard, LearningQuizAnswer, LearningReview } from '../../../lib/db'
import { addDays, buildQueue, computedDue, DAILY_LIMIT, gradeDays, schedule, sourcesOf } from './review'

const at = (day: string) => new Date(`${day}T10:00:00`).getTime()
const card = (itemId: string, day: string, courseId = 'es'): LearningCard => ({
  id: `${courseId}:m:${itemId}`,
  courseId,
  moduleId: 'm',
  itemId,
  updatedAt: at(day),
})
const quiz = (itemId: string, correct: 0 | 1, day: string): LearningQuizAnswer => ({
  id: `es:m:${itemId}`,
  courseId: 'es',
  moduleId: 'm',
  itemId,
  selected: 0,
  correct,
  updatedAt: at(day),
})
const review = (id: string, p: Partial<LearningReview>): LearningReview => {
  const [kind, courseId, moduleId, itemId] = id.split(':') as [LearningReview['kind'], string, string, string]
  return { id, kind, courseId, moduleId, itemId, step: 0, due: '2026-12-01', reviewedOn: '', updatedAt: 0, ...p }
}

describe('dates and grades', () => {
  it('adds days across month ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 3)).toBe('2027-01-03')
  })
  it('again = tomorrow at step 0, hard = same interval, easy = next step (capped)', () => {
    expect(schedule(3, 'again', '2026-11-20')).toEqual({ step: 0, due: '2026-11-21' })
    expect(schedule(2, 'hard', '2026-11-20')).toEqual({ step: 2, due: '2026-11-27' })
    expect(schedule(0, 'easy', '2026-11-20')).toEqual({ step: 1, due: '2026-11-23' })
    expect(schedule(5, 'easy', '2026-11-20')).toEqual({ step: 5, due: addDays('2026-11-20', 120) })
    expect([gradeDays(1, 'again'), gradeDays(1, 'hard'), gradeDays(1, 'easy')]).toEqual([1, 3, 7])
  })
})

describe('sources and computed due', () => {
  it('takes every known card and only the wrong quiz answers', () => {
    const s = sourcesOf([card('c1', '2026-11-20')], [quiz('q1', 0, '2026-11-20'), quiz('q2', 1, '2026-11-20')])
    expect(s.map((x) => x.id)).toEqual(['card:es:m:c1', 'quiz:es:m:q1'])
  })
  it('new items are due the next day; older ones are spread over the week after launch', () => {
    const [fresh] = sourcesOf([card('c1', '2026-11-20')], [])
    expect(computedDue(fresh!)).toBe('2026-11-21')
    const old = sourcesOf(
      Array.from({ length: 50 }, (_, i) => card(`c${i}`, '2026-10-01')),
      [],
    ).map(computedDue)
    for (const d of old) expect(d >= '2026-11-18' && d <= '2026-11-24', d).toBe(true)
    expect(new Set(old).size).toBeGreaterThan(4)
  })
})

describe('buildQueue', () => {
  const today = '2026-11-25'
  it('keeps what is due, honours stored schedules and the daily limit', () => {
    const s = sourcesOf(
      Array.from({ length: 30 }, (_, i) => card(`c${i}`, '2026-11-20')),
      [quiz('q1', 0, '2026-11-20')],
    )
    const reviews = [
      review('card:es:m:c0', { due: '2026-12-10', updatedAt: at('2026-11-22') }), // not due yet
      review('card:es:m:c1', { reviewedOn: today, due: '2026-11-28', updatedAt: at(today) }), // graded today
    ]
    const q = buildQueue(s, reviews, today)
    expect(q.dueCount).toBe(29) // 31 sources - c0 - c1
    expect(q.doneToday).toBe(1)
    expect(q.items).toHaveLength(DAILY_LIMIT - 1)
    expect(q.items.map((i) => i.id)).not.toContain('card:es:m:c0')
  })
  it('ignores a stored schedule older than its source (card known again)', () => {
    const s = sourcesOf([card('c1', '2026-11-24')], [])
    const r = review('card:es:m:c1', { due: '2027-01-01', step: 4, updatedAt: at('2026-11-01') })
    expect(buildQueue(s, [r], today).items).toMatchObject([{ id: 'card:es:m:c1', step: 0, due: '2026-11-25' }])
  })
  it('returns nothing once the limit is used up', () => {
    const s = sourcesOf([card('c1', '2026-11-20')], [])
    const done = Array.from({ length: DAILY_LIMIT }, (_, i) => review(`card:x:m:d${i}`, { reviewedOn: today }))
    const q = buildQueue(s, done, today)
    expect(q.items).toEqual([])
    expect(q.dueCount).toBe(1)
  })
})
