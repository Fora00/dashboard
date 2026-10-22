import { describe, expect, it } from 'vitest'
import { parseHtml } from '../html'
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

describe('course data', () => {
  it('has unique course ids and unique module ids per course', () => {
    expect(new Set(courses.map((c) => c.id)).size).toBe(courses.length)
    for (const c of courses) expect(new Set(c.modules.map((m) => m.id)).size).toBe(c.modules.length)
  })

  it('every module group exists in its course', () => {
    for (const c of courses) {
      const groups = new Set(c.groups.map((g) => g.id))
      for (const m of c.modules) expect(groups.has(m.group ?? c.groups[0]!.id), `${c.id}/${m.id}`).toBe(true)
    }
  })

  it('item ids are unique within each module (progress is keyed by them)', () => {
    for (const c of courses)
      for (const m of c.modules)
        for (const items of [m.quiz, m.cards, m.practice])
          expect(new Set(items.map((i) => i.id)).size, `${c.id}/${m.id}`).toBe(items.length)
  })

  it('every quiz answer points at a real option', () => {
    for (const c of courses)
      for (const m of c.modules) for (const q of m.quiz) expect(q.options[q.answer], `${m.id}`).toBeDefined()
  })

  it('Backend Interview Lab keeps the 19 original module ids plus the hand-written ones and the prototype counts', () => {
    const c = courses.find((x) => x.id === 'backend-interview-lab')!
    expect(c.modules.map((m) => m.id).sort()).toEqual([...IDS].sort())
    for (const m of c.modules) {
      expect(m.cards, m.id).toHaveLength(4)
      expect(m.practice.length, m.id).toBeGreaterThanOrEqual(2)
      expect(m.practice.length, m.id).toBeLessThanOrEqual(3)
      if (m.id === 'proj' || m.id === 'col') expect(m.quiz, m.id).toHaveLength(0)
      else expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(4)
    }
    expect(c.modules.find((m) => m.id === 'gcp')?.verify).toBeTruthy()
  })

  it('all course HTML survives the allowlist (no dropped tags)', () => {
    const shown = (nodes: ReturnType<typeof parseHtml>): number =>
      nodes.reduce<number>((n, x) => (typeof x === 'string' ? n : n + 1 + shown(x.children)), 0)
    for (const c of courses)
      for (const m of c.modules) {
        const opening = (m.lesson.match(/<[a-z][a-z0-9]*/gi) ?? []).length
        expect(shown(parseHtml(m.lesson)), `${m.id} lesson`).toBe(opening)
      }
  })
})
