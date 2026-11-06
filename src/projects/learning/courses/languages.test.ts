import { describe, expect, it } from 'vitest'
import { parseHtml } from '../html'
import { courseById } from './index'

const nodes = (n: ReturnType<typeof parseHtml>): number =>
  n.reduce<number>((k, x) => (typeof x === 'string' ? k : k + 1 + nodes(x.children)), 0)

describe.each([
  ['spagnolo', 29],
  ['francese', 31],
  ['tedesco', 30],
])('%s', (id, total) => {
  const c = courseById(id)!
  it('is registered with its modules in 6 groups', () => {
    expect(c).toBeDefined()
    expect(c.modules).toHaveLength(total)
    expect(c.groups.map((g) => g.id)).toEqual(['a1', 'a2', 'b1', 'b2', 'voc', 'drill'])
    expect(new Set(c.modules.map((m) => m.id)).size).toBe(total)
    for (const m of c.modules)
      expect(
        c.groups.some((g) => g.id === m.group),
        m.id,
      ).toBe(true)
  })
  it('has the content minimums per module', () => {
    for (const m of c.modules) {
      expect(m.lesson.length, `${m.id} lesson`).toBeGreaterThanOrEqual(2500)
      expect(m.quiz.length, `${m.id} quiz`).toBeGreaterThanOrEqual(6)
      expect(m.cards.length, `${m.id} cards`).toBeGreaterThanOrEqual(8)
      expect(m.practice.length, `${m.id} practice`).toBeGreaterThanOrEqual(4)
      for (const x of m.quiz) {
        expect(x.options, `${m.id}/${x.id}`).toHaveLength(4)
        expect(new Set(x.options).size, `${m.id}/${x.id} dup`).toBe(4)
        expect(x.explanation.split(/\s+/).length, `${m.id}/${x.id} explanation`).toBeGreaterThanOrEqual(8)
      }
      for (const list of [m.quiz, m.cards, m.practice])
        expect(new Set(list.map((i) => i.id)).size, `${m.id} ids`).toBe(list.length)
    }
  })
  it('spreads the right answers and does not always make them the longest', () => {
    const count = [0, 0, 0, 0]
    let n = 0
    let longest = 0
    for (const m of c.modules)
      for (const x of m.quiz) {
        count[x.answer] = (count[x.answer] ?? 0) + 1
        n++
        const len = x.options.map((o) => o.length)
        if (len[x.answer] === Math.max(...len)) longest++
      }
    for (const k of count) expect(k / n).toBeLessThan(0.4)
    expect(longest / n, 'correct option is the longest').toBeLessThan(0.6)
  })
  it('keeps every HTML tag and has no template leftovers', () => {
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
        expect(/\$\{/.test(f) || f.includes('`'), `${id}/${m.id} leftover`).toBe(false)
      }
    }
  })
})
