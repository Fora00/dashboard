import { describe, expect, it } from 'vitest'
import { courseById } from '../index'

describe('python path', () => {
  const c = courseById('python-path')!
  it('is registered with its 47 modules in 6 groups', () => {
    expect(c.modules).toHaveLength(47)
    expect(c.groups.map((g) => g.id)).toEqual(['base', 'oop', 'pythonic', 'backend', 'master', 'finale'])
  })
  it('every teaching module has a quiz, 4+ cards and practice', () => {
    for (const m of c.modules) {
      expect(m.cards.length, m.id).toBeGreaterThanOrEqual(4)
      expect(m.practice.length, m.id).toBeGreaterThanOrEqual(2)
      if (!['drills', 'drills2', 'capstone', 'interview'].includes(m.id))
        expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(4)
    }
  })
  it('quiz answers are spread over the option slots', () => {
    const count = [0, 0, 0, 0]
    let n = 0
    for (const m of c.modules)
      for (const x of m.quiz) {
        count[x.answer] = (count[x.answer] ?? 0) + 1
        n++
      }
    for (const k of count) expect(k / n).toBeLessThan(0.4)
    expect(count[3] ?? 0).toBeGreaterThan(0)
  })
})
