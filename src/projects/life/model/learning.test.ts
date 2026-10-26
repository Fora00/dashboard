import { describe, expect, it } from 'vitest'
import type { LearningCard, LearningPractice, LearningQuizAnswer } from '../../../lib/db'
import type { Course } from '../../learning/types'
import { buildExportMarkdown, describeLearningActivity, summarizeLearningWeek } from './index'

const WEEK = '2026-10-19' // a Monday
const at = (day: string) => new Date(`${day}T12:00:00`).getTime()
const mod = (id: string, n: number) => ({
  id,
  title: `Module ${id}`,
  subtitle: '',
  vault: '',
  lesson: '',
  quiz: Array.from({ length: n }, (_, i) => ({ id: `q${i}`, q: '', options: [], answer: 0, explanation: '' })),
  cards: [{ id: 'c0', front: '', back: '' }],
  practice: [],
})
const course: Course = {
  id: 'lab',
  title: 'Lab',
  emoji: '🎓',
  summary: '',
  intro: '',
  groups: [],
  modules: [mod('m1', 1), mod('m2', 2)],
}
const quiz = (moduleId: string, itemId: string, correct: 0 | 1, day: string): LearningQuizAnswer => ({
  id: `lab:${moduleId}:${itemId}`,
  courseId: 'lab',
  moduleId,
  itemId,
  selected: 0,
  correct,
  updatedAt: at(day),
})
const card = (moduleId: string, itemId: string, day: string): LearningCard => ({
  id: `lab:${moduleId}:${itemId}`,
  courseId: 'lab',
  moduleId,
  itemId,
  updatedAt: at(day),
})
const state = (q: LearningQuizAnswer[], c: LearningCard[], p: LearningPractice[] = []) =>
  new Map([['lab', { quiz: q, cards: c, practice: p }]])

describe('summarizeLearningWeek', () => {
  it("counts only the week's activity, but progress is overall", () => {
    const s = summarizeLearningWeek(
      [course],
      state(
        [quiz('m1', 'q0', 1, '2026-10-20'), quiz('m2', 'q0', 0, '2026-10-21'), quiz('m2', 'q1', 1, '2026-10-12')],
        [card('m1', 'c0', '2026-10-20')],
      ),
      WEEK,
    )
    const c = s.courses[0]!
    expect(s.active).toBe(true)
    expect(c).toMatchObject({ quiz: 2, quizCorrect: 1, cards: 1, practice: 0, done: 3, total: 5 })
    expect(c.days).toEqual(['2026-10-20', '2026-10-21'])
    expect(c.percent).toBe(60)
    expect(describeLearningActivity(c)).toBe('2 quiz (1 right) · 1 card')
  })

  it('points to the first unfinished module; none when everything is done', () => {
    const none = summarizeLearningWeek([course], state([], []), WEEK)
    expect(none.active).toBe(false)
    expect(none.courses[0]!.next).toMatchObject({ moduleId: 'm1', percent: 0 })
    expect(describeLearningActivity(none.courses[0]!)).toBe('nothing this week')
    const all = summarizeLearningWeek(
      [course],
      state(
        [quiz('m1', 'q0', 1, '2026-10-12'), quiz('m2', 'q0', 1, '2026-10-12'), quiz('m2', 'q1', 1, '2026-10-12')],
        [card('m1', 'c0', '2026-10-12'), card('m2', 'c0', '2026-10-12')],
      ),
      WEEK,
    )
    expect(all.courses[0]!.next).toBeNull()
    expect(all.courses[0]!.percent).toBe(100)
  })

  it('goes into the export, and old callers without it still work', () => {
    const plan = {
      version: 1 as const,
      week: WEEK,
      focus: [],
      rules: [],
      tasks: [],
      trackers: [],
      sundayCheck: [],
      checkins: [],
    }
    const l = summarizeLearningWeek([course], state([quiz('m1', 'q0', 1, '2026-10-20')], []), WEEK)
    const md = buildExportMarkdown(plan, [], undefined, [], { marks: [], favouriteCategories: [] }, l)
    expect(md).toContain('## Learning')
    expect(md).toContain('🎓 Lab: 20% overall (1/5) · this week: 1 quiz (1 right) on 1 day')
    expect(md).toContain('  - next: Module m1 (50%)')
    expect(buildExportMarkdown(plan, [])).not.toContain('## Learning')
  })
})
