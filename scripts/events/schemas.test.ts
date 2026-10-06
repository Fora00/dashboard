import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { SpotFileSchema, parseList, parseOrThrow } from './schemas.ts'

const entry = {
  id: 'x-2026',
  title: 'X',
  start: '2026-10-10',
  end: '2026-10-10',
  city: 'Desenzano',
  url: 'https://example.com',
  summary: 's',
}

describe('SpotFileSchema', () => {
  it('accepts a valid entry and defaults verified to true', () => {
    expect(SpotFileSchema.parse({ events: [entry] }).events[0]?.verified).toBe(true)
    expect(SpotFileSchema.parse({ events: [{ ...entry, verified: false }] }).events[0]?.verified).toBe(false)
  })
  it('names the entry and field of a bad one', () => {
    expect(() => parseOrThrow(SpotFileSchema, { events: [{ ...entry, start: '10/10/2026' }] }, 'spot.json')).toThrow(
      /events\.0\.start/,
    )
    expect(() => parseOrThrow(SpotFileSchema, { events: [{ ...entry, end: '2026-10-09' }] }, 'spot.json')).toThrow(
      /end is before start/,
    )
    expect(() => parseOrThrow(SpotFileSchema, { events: [{ ...entry, id: 'Not Kebab' }] }, 'spot.json')).toThrow(
      /kebab/,
    )
  })
})

describe('parseList', () => {
  const S = z.object({ id: z.string() })
  it('skips a few bad records', () => {
    expect(parseList(S, [{ id: 'a' }, { id: 'b' }, { id: 1 }], 't')).toEqual([{ id: 'a' }, { id: 'b' }])
  })
  it('throws when most records do not fit (format changed)', () => {
    expect(() => parseList(S, [{ id: 1 }, { x: 1 }, { id: 'a' }], 'src')).toThrow(/src: 2\/3/)
  })
  it('throws on a non-list', () => {
    expect(() => parseList(S, { a: 1 }, 'src')).toThrow(/expected a list/)
  })
})
