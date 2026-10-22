import { describe, expect, it } from 'vitest'
import { courseProgress, deckOrder, EMPTY_STATE, itemKey, moduleProgress, nextInDeck, percent } from './progress'
import type { CourseState } from './progress'
import type { Course, CourseModule } from './types'

const mod = (id: string, q: number, c: number, p: number): CourseModule => ({
  id,
  title: id,
  subtitle: '',
  vault: '',
  lesson: '',
  quiz: Array.from({ length: q }, (_, i) => ({ id: `q${i}`, q: '', options: ['a', 'b'], answer: 0, explanation: '' })),
  cards: Array.from({ length: c }, (_, i) => ({ id: `c${i}`, front: '', back: '' })),
  practice: Array.from({ length: p }, (_, i) => ({ id: `p${i}`, question: '', answer: '' })),
})
const course = (...modules: CourseModule[]): Course => ({
  id: 'c',
  title: 'C',
  emoji: '',
  summary: '',
  intro: '',
  groups: [{ id: 'g', label: 'G' }],
  modules,
})
const row = (prefix: string, moduleId: string, index: number, courseId = 'c') => ({
  id: itemKey(courseId, moduleId, `${prefix}${index}`),
  courseId,
  moduleId,
  itemId: `${prefix}${index}`,
  updatedAt: 0,
})
const quiz = (moduleId: string, index: number, correct: 0 | 1, courseId = 'c') => ({
  ...row('q', moduleId, index, courseId),
  selected: 0,
  correct,
})
const card = (moduleId: string, index: number) => row('c', moduleId, index)
const practice = (moduleId: string, index: number, done: 0 | 1) => ({ ...row('p', moduleId, index), done, notes: 'n' })

describe('moduleProgress', () => {
  const m = mod('a', 4, 4, 2)

  it('is 0 with no state and for an empty module', () => {
    expect(moduleProgress('c', m, EMPTY_STATE)).toMatchObject({ done: 0, total: 10, percent: 0 })
    expect(moduleProgress('c', mod('e', 0, 0, 0), EMPTY_STATE)).toMatchObject({ total: 0, percent: 0 })
  })

  it('counts right quiz answers, known cards and done practice, not wrong or undone ones', () => {
    const state: CourseState = {
      quiz: [quiz('a', 0, 1), quiz('a', 1, 0)],
      cards: [card('a', 0), card('a', 3)],
      practice: [practice('a', 0, 1), practice('a', 1, 0)],
    }
    const p = moduleProgress('c', m, state)
    expect(p.quiz).toEqual({ done: 1, total: 4 })
    expect(p.cards).toEqual({ done: 2, total: 4 })
    expect(p.practice).toEqual({ done: 1, total: 2 })
    expect(p).toMatchObject({ done: 4, total: 10, percent: 40 })
  })

  it('ignores other modules, other courses and items the content no longer has', () => {
    const state: CourseState = {
      quiz: [quiz('b', 0, 1), quiz('a', 0, 1, 'other'), quiz('a', 9, 1)],
      cards: [card('a', 4), card('a', -1)],
      practice: [],
    }
    expect(moduleProgress('c', m, state).done).toBe(0)
  })
})

describe('courseProgress', () => {
  it('is items done over items total, not an average of module percentages', () => {
    const c = course(mod('a', 1, 0, 0), mod('b', 9, 0, 0))
    const state: CourseState = { quiz: [quiz('a', 0, 1)], cards: [], practice: [] }
    const p = courseProgress(c, state)
    expect(p.modules.a?.percent).toBe(100)
    expect(p.modules.b?.percent).toBe(0)
    expect(p).toMatchObject({ done: 1, total: 10, percent: 10 })
  })
})

describe('deck', () => {
  const cards = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `c${i}` }))

  it('shows only unknown cards, in order', () => {
    expect(deckOrder(cards(5), new Set(['c1', 'c3']))).toEqual([0, 2, 4])
    expect(deckOrder(cards(2), new Set(['c0', 'c1']))).toEqual([])
  })

  it('wraps round the remaining deck on "review again"', () => {
    expect(nextInDeck(0, 3)).toBe(1)
    expect(nextInDeck(2, 3)).toBe(0)
    expect(nextInDeck(0, 0)).toBe(0)
  })
})

describe('percent', () => {
  it('rounds and guards a zero total', () => {
    expect(percent(1, 3)).toBe(33)
    expect(percent(2, 3)).toBe(67)
    expect(percent(0, 0)).toBe(0)
  })
})
