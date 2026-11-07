import { describe, expect, it } from 'vitest'
import { courseById } from '../index'
import { expected, pairs } from './respell'

const c = courseById('spagnolo')!
const fields = c.modules.flatMap((m) =>
  [
    m.lesson,
    ...m.cards.flatMap((x) => [x.front, x.back]),
    ...m.practice.flatMap((x) => [x.question, x.answer]),
    ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
  ].map((f) => [m.id, f] as const),
)

describe('spagnolo respelling is uniform across the A, B and C halves', () => {
  it('converts spelling to the legend', () => {
    expect(expected('cuenta')).toBe('kuenta')
    expect(expected('guerra')).toBe('gherra')
    expect(expected('chaqueta')).toBe('ciakketa'.replace('kk', 'k'))
    expect(expected('rosa')).toBe('rrosa')
    expect(expected('hielo')).toBe('ielo')
  })
  it('never writes the k sound as "c" before u (c = ch in this notation)', () => {
    for (const [id, f] of fields)
      for (const p of pairs(f)) expect(/(^|[ -])[Cc][uU]/.test(p.pron), `${id}: ${p.word} [${p.pron}]`).toBe(false)
  })
  it('writes the initial rolled r as rr', () => {
    for (const [id, f] of fields)
      for (const p of pairs(f))
        if (/^r[aeiouáéíóú]/i.test(p.word) && /^r[aeiou]/i.test(p.pron))
          expect(false, `${id}: ${p.word} [${p.pron}]`).toBe(true)
  })
})
