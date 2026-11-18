import { describe, expect, it } from 'vitest'
import { fnv1a, fnv1aHex } from './hash'

// Values computed with the three old copies (kit.ts, review.ts, chores.ts): seeded shuffles and ids depend on them.
describe('fnv1a', () => {
  it('keeps the exact outputs', () => {
    expect(fnv1a('')).toBe(2166136261)
    expect(fnv1a('a')).toBe(3826002220)
    expect(fnv1a('foo')).toBe(2851307223)
    expect(fnv1a('ciao mondo')).toBe(4052525394)
    expect(fnv1a('日本語 ☕')).toBe(1158205229)
  })
  it('hex form is padded to 8 digits', () => {
    expect(fnv1aHex('')).toBe('811c9dc5')
    expect(fnv1aHex('a')).toBe('e40c292c')
    expect(fnv1aHex('foo')).toBe('a9f37ed7')
    expect(fnv1aHex('日本語 ☕')).toBe('4508cf2d')
  })
})
