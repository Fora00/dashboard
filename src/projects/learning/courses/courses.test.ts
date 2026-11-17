import { describe, expect, it } from 'vitest'
import { parseHtml } from '../engine/html'
import type { Course, CourseModule } from '../engine/types'
import { courses } from './index'

const IDS = [
  'http',
  'api',
  'auth',
  'sql',
  'tx',
  'data',
  'cache',
  'async',
  'sys',
  'ops',
  'algo',
  'langs',
  'gaps',
  'node',
  'fastify',
  'mongo',
  'rabbit',
  'k8s',
  'gcp',
  'proj',
  'col',
]

// Added with the frontend / mobile / logic extension (2026-10-23).
const EXTENDED_IDS = [
  'jsts',
  'react',
  'state',
  'next',
  'perf',
  'websec',
  'css',
  'fetest',
  'fesd',
  'projui',
  'rn',
  'mobcore',
  'flutter',
  'live',
  'code',
  'story',
]

// ONE lint suite for every course (R2). Universal invariants first, then each course's own
// minimums from PROFILES. Ratchets (`maxSlot`, `maxLongest`) are set at today's values so content
// can only get better; tighten them when a course's quiz is reworked.

interface Profile {
  modules: number
  groups?: string[]
  minLesson: number
  /** Minimum questions in a module that has a quiz; modules in `noQuiz` must have none or may have none. */
  minQuiz: number
  noQuiz?: string[]
  minCards: number
  minPractice: number
  /** Allowed option counts per question. */
  options: number[]
  /** Share of right answers in any one option slot (must stay below). */
  maxSlot: number
  /** Share of questions whose right option is the longest (must stay at or below). */
  maxLongest: number
  minExplanationWords?: number
  /** Code courses legitimately contain backticks and `${`. */
  allowTemplateChars?: boolean
}

const LANG = (modules: number, groups: string[]): Profile => ({
  modules,
  groups,
  minLesson: 2500,
  minQuiz: 6,
  minCards: 8,
  minPractice: 4,
  options: [4],
  maxSlot: 0.4,
  maxLongest: 0.6,
  minExplanationWords: 8,
})
const FULL = ['a1', 'a2', 'b1', 'b2', 'voc', 'drill']

const PROFILES: Record<string, Profile> = {
  'backend-interview-lab': {
    modules: 37,
    minLesson: 900,
    minQuiz: 3,
    noQuiz: ['proj', 'projui', 'story', 'col'],
    minCards: 4,
    minPractice: 1,
    options: [4],
    maxSlot: 0.45,
    maxLongest: 0.72,
  },
  'python-path': {
    modules: 47,
    groups: ['base', 'oop', 'pythonic', 'backend', 'master', 'finale'],
    minLesson: 400,
    minQuiz: 4,
    noQuiz: ['drills', 'drills2', 'capstone', 'interview'],
    minCards: 4,
    minPractice: 2,
    options: [4],
    maxSlot: 0.4,
    maxLongest: 0.81,
    allowTemplateChars: true,
  },
  'databases-path': {
    modules: 20,
    minLesson: 100,
    minQuiz: 5,
    noQuiz: ['drills', 'interview'],
    minCards: 4,
    minPractice: 2,
    options: [4],
    maxSlot: 0.45,
    maxLongest: 0.88,
  },
  'api-path': {
    modules: 20,
    minLesson: 80,
    minQuiz: 5,
    noQuiz: ['drills', 'interview'],
    minCards: 4,
    minPractice: 2,
    options: [4],
    maxSlot: 0.45,
    maxLongest: 0.93,
  },
  disegno: {
    modules: 17,
    minLesson: 1000,
    minQuiz: 1,
    minCards: 0,
    minPractice: 1,
    options: [2, 3, 4],
    maxSlot: 0.65,
    maxLongest: 0.89,
  },
  spagnolo: LANG(37, FULL),
  francese: LANG(36, FULL),
  tedesco: LANG(30, FULL),
  russo: LANG(15, ['a1', 'voc', 'drill']),
}

const nodes = (n: ReturnType<typeof parseHtml>): number =>
  n.reduce<number>((k, x) => (typeof x === 'string' ? k : k + 1 + nodes(x.children)), 0)

/** Every text field that is rendered as HTML. */
const fieldsOf = (m: CourseModule): string[] => [
  m.lesson,
  m.vault,
  m.verify ?? '',
  ...m.cards.flatMap((x) => [x.front, x.back]),
  ...m.practice.flatMap((x) => [x.question, x.answer, ...(x.checklist ?? [])]),
  ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
]

const items = (m: CourseModule) => [...m.quiz, ...m.cards, ...m.practice]

describe('every course: universal invariants', () => {
  it('has a profile here (add one with the course)', () => {
    expect(courses.map((c) => c.id).sort()).toEqual(Object.keys(PROFILES).sort())
  })

  it('has unique course ids and unique module ids per course', () => {
    expect(new Set(courses.map((c) => c.id)).size).toBe(courses.length)
    for (const c of courses) expect(new Set(c.modules.map((m) => m.id)).size, c.id).toBe(c.modules.length)
  })

  it('ids fit the SQL checks of the learning_* tables (no ":", 1-60 chars, row id <= 200)', () => {
    const ok = (s: string) => s.length >= 1 && s.length <= 60 && !s.includes(':')
    for (const c of courses) {
      expect(ok(c.id), c.id).toBe(true)
      for (const m of c.modules) {
        expect(ok(m.id), `${c.id}/${m.id}`).toBe(true)
        for (const it of items(m)) {
          expect(ok(it.id), `${c.id}/${m.id}/${it.id}`).toBe(true)
          expect(`${c.id}:${m.id}:${it.id}`.length, `${c.id}/${m.id}/${it.id}`).toBeLessThanOrEqual(200)
        }
      }
    }
  })

  it('item ids are unique within each module and kind (progress is keyed by them)', () => {
    for (const c of courses)
      for (const m of c.modules)
        for (const list of [m.quiz, m.cards, m.practice])
          expect(new Set(list.map((i) => i.id)).size, `${c.id}/${m.id}`).toBe(list.length)
  })

  it('every module group exists in its course', () => {
    for (const c of courses) {
      const groups = new Set(c.groups.map((g) => g.id))
      for (const m of c.modules) expect(groups.has(m.group ?? c.groups[0]!.id), `${c.id}/${m.id}`).toBe(true)
    }
  })

  it('every quiz answer points at a real option and options are not duplicated', () => {
    for (const c of courses)
      for (const m of c.modules)
        for (const q of m.quiz) {
          expect(q.options[q.answer], `${c.id}/${m.id}/${q.id}`).toBeDefined()
          expect(new Set(q.options).size, `${c.id}/${m.id}/${q.id} dup`).toBe(q.options.length)
        }
  })

  it('every HTML field keeps all its tags (nothing dropped by the allowlist, no raw < in code)', () => {
    for (const c of courses)
      for (const m of c.modules)
        for (const f of fieldsOf(m)) {
          const opening = (f.match(/<[a-z][a-z0-9]*/gi) ?? []).length
          expect(nodes(parseHtml(f)), `${c.id}/${m.id}: ${f.slice(0, 60)}`).toBe(opening)
        }
  })

  it('has no template leftovers (` or ${ outside code courses)', () => {
    for (const c of courses) {
      if (PROFILES[c.id]?.allowTemplateChars) continue
      for (const m of c.modules)
        for (const f of fieldsOf(m))
          expect(/\$\{(?!\{)/.test(f) || f.includes('`'), `${c.id}/${m.id}: ${f.slice(0, 60)}`).toBe(false)
    }
  })
})

describe.each(Object.entries(PROFILES))('%s: its own minimums', (id, p) => {
  const c: Course = courses.find((x) => x.id === id)!

  it(`has ${p.modules} modules${p.groups ? ` in ${p.groups.length} groups` : ''}`, () => {
    expect(c.modules).toHaveLength(p.modules)
    if (p.groups) expect(c.groups.map((g) => g.id)).toEqual(p.groups)
  })

  it('meets the content minimums per module', () => {
    for (const m of c.modules) {
      expect(m.lesson.length, `${m.id} lesson`).toBeGreaterThanOrEqual(p.minLesson)
      expect(m.cards.length, `${m.id} cards`).toBeGreaterThanOrEqual(p.minCards)
      expect(m.practice.length, `${m.id} practice`).toBeGreaterThanOrEqual(p.minPractice)
      if (p.noQuiz?.includes(m.id)) expect(m.quiz, `${m.id} has no quiz`).toHaveLength(0)
      else expect(m.quiz.length, `${m.id} quiz`).toBeGreaterThanOrEqual(p.minQuiz)
      for (const q of m.quiz) {
        expect(p.options, `${m.id}/${q.id} option count`).toContain(q.options.length)
        if (p.minExplanationWords)
          expect(q.explanation.split(/\s+/).length, `${m.id}/${q.id} explanation`).toBeGreaterThanOrEqual(
            p.minExplanationWords,
          )
      }
    }
  })

  it('spreads the right answers over the slots and does not favour the longest option', () => {
    const slots: number[] = []
    let n = 0
    let longest = 0
    for (const m of c.modules)
      for (const q of m.quiz) {
        slots[q.answer] = (slots[q.answer] ?? 0) + 1
        n++
        const len = q.options.map((o) => o.length)
        if (len[q.answer] === Math.max(...len)) longest++
      }
    for (const k of slots) expect((k ?? 0) / n).toBeLessThan(p.maxSlot)
    expect(longest / n, 'right option is the longest').toBeLessThanOrEqual(p.maxLongest)
  })
})

describe('backend-interview-lab: module ids', () => {
  it('Full Stack Interview Lab keeps the original module ids, the hand-written ones and the extension', () => {
    const c = courses.find((x) => x.id === 'backend-interview-lab')!
    expect(c.modules.map((m) => m.id).sort()).toEqual([...IDS, ...EXTENDED_IDS].sort())
    for (const m of c.modules) {
      if (EXTENDED_IDS.includes(m.id)) {
        expect(m.cards.length, m.id).toBeGreaterThanOrEqual(4)
        expect(m.practice.length, m.id).toBeGreaterThanOrEqual(1)
        continue
      }
      expect(m.cards, m.id).toHaveLength(4)
      expect(m.practice.length, m.id).toBeGreaterThanOrEqual(2)
      expect(m.practice.length, m.id).toBeLessThanOrEqual(3)
      if (m.id === 'proj' || m.id === 'col') expect(m.quiz, m.id).toHaveLength(0)
      else expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(4)
    }
    expect(c.modules.find((m) => m.id === 'gcp')?.verify).toBeTruthy()
  })
})

describe('lazy registry', () => {
  it('has a meta for every course, matching the content', async () => {
    const { courseMetas, loadCourse } = await import('./registry')
    const { courses: all } = await import('./index')
    expect(courseMetas.map((m) => m.id)).toEqual(all.map((c) => c.id))
    for (const m of courseMetas) {
      const c = await loadCourse(m.id)
      expect(c, m.id).toBeDefined()
      expect({ title: m.title, emoji: m.emoji, summary: m.summary, moduleCount: m.moduleCount }, m.id).toEqual({
        title: c!.title,
        emoji: c!.emoji,
        summary: c!.summary,
        moduleCount: c!.modules.length,
      })
    }
    expect(await loadCourse('nope')).toBeUndefined()
  })

  it('keeps course ids distinct from the static Learning routes (areas, ripasso, vocabolario)', async () => {
    const { courseMetas, courseGroups } = await import('./registry')
    const reserved = new Set<string>([...courseGroups.map((g) => g.id), 'ripasso', 'vocabolario'])
    for (const m of courseMetas) expect(reserved.has(m.id), m.id).toBe(false)
  })

  it('puts every course in a known group and leaves no group empty', async () => {
    const { courseMetas, courseGroups } = await import('./registry')
    const ids = courseGroups.map((g) => g.id as string)
    for (const m of courseMetas) expect(ids, m.id).toContain(m.group)
    for (const g of courseGroups)
      expect(
        courseMetas.some((m) => m.group === g.id),
        g.id,
      ).toBe(true)
  })
})
