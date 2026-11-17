import { describe, expect, it } from 'vitest'
import { q } from './kit'

describe('q(): seeded option shuffle', () => {
  const opts = ['giusta', 'sbagliata 1', 'sbagliata 2', 'sbagliata 3']

  it('is deterministic: same id and text give the same order (stored answers keep their meaning)', () => {
    expect(q('a', 'Domanda?', opts, 0, 'x')).toEqual(q('a', 'Domanda?', opts, 0, 'x'))
  })

  it('remaps the answer to the slot where the right option landed, keeping every option', () => {
    for (let i = 0; i < 40; i++) {
      const x = q(`id${i}`, `Domanda ${i}?`, opts, 0, 'x')
      expect(x.options[x.answer]).toBe('giusta')
      expect([...x.options].sort()).toEqual([...opts].sort())
    }
  })

  it('actually moves the right answer around', () => {
    const slots = new Set(Array.from({ length: 40 }, (_, i) => q(`id${i}`, `Domanda ${i}?`, opts, 0, 'x').answer))
    expect(slots.size).toBeGreaterThan(2)
  })
})
