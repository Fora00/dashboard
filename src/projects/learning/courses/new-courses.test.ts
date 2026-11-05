import { describe, expect, it } from 'vitest'
import { parseHtml } from '../html'
import { courseById } from './index'

describe.each([
  ['databases-path', 20, 6],
  ['api-path', 20, 6],
])('%s', (id, modules, groups) => {
  const c = courseById(id)!
  it('is registered with its modules and groups', () => {
    expect(c).toBeDefined()
    expect(c.modules).toHaveLength(modules)
    expect(c.groups).toHaveLength(groups)
  })
  it('teaching modules have a quiz, cards and practice; exercise modules have practice', () => {
    for (const m of c.modules) {
      expect(m.cards.length, m.id).toBeGreaterThanOrEqual(4)
      expect(m.practice.length, m.id).toBeGreaterThanOrEqual(2)
      if (m.lesson.length > 1500) expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(4)
    }
  })
  it('quiz answers are spread over the slots', () => {
    const count = [0, 0, 0, 0]
    let n = 0
    for (const m of c.modules)
      for (const x of m.quiz) {
        count[x.answer] = (count[x.answer] ?? 0) + 1
        n++
      }
    for (const k of count) expect(k / n).toBeLessThan(0.45)
  })
})

describe('HTML in every text field of the hand-written courses', () => {
  const nodes = (n: ReturnType<typeof parseHtml>): number =>
    n.reduce<number>((k, x) => (typeof x === 'string' ? k : k + 1 + nodes(x.children)), 0)
  it('keeps every tag (nothing is silently dropped) and has no template leftovers', () => {
    for (const id of ['databases-path', 'api-path', 'python-path']) {
      const c = courseById(id)!
      for (const m of c.modules) {
        const fields = [
          m.lesson,
          ...m.cards.flatMap((x) => [x.front, x.back]),
          ...m.practice.flatMap((x) => [x.question, x.answer]),
          ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
        ]
        for (const f of fields) {
          const opening = (f.match(/<[a-z][a-z0-9]*/gi) ?? []).length
          expect(nodes(parseHtml(f)), `${id}/${m.id}: ${f.slice(0, 60)}`).toBe(opening)
          if (id !== 'python-path')
            expect(/\$\{(?!\{)/.test(f) || f.includes('`'), `${id}/${m.id} leftover`).toBe(false)
        }
      }
    }
  })
})
