import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { readFileSync } from 'node:fs'
import { SpotFileSchema, parseList, parseOrThrow, validPreviousEvents } from './schemas.ts'

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

describe('SpotFileSchema file-level checks (E9)', () => {
  it('rejects duplicate ids, naming both entries', () => {
    expect(() => parseOrThrow(SpotFileSchema, { events: [entry, { ...entry, title: 'Y' }] }, 'spot.json')).toThrow(
      /events\.1\.id: duplicate id "x-2026" \(also events\.0\)/,
    )
  })
  it('rejects an unknown category and accepts a known one', () => {
    expect(() => parseOrThrow(SpotFileSchema, { events: [{ ...entry, category: 'party' }] }, 'spot.json')).toThrow(
      /events\.0\.category: unknown category "party"/,
    )
    expect(SpotFileSchema.parse({ events: [{ ...entry, category: 'nerd' }] }).events).toHaveLength(1)
  })
  it('the real spot.json passes', () => {
    const file = JSON.parse(readFileSync(new URL('./spot.json', import.meta.url), 'utf8'))
    expect(SpotFileSchema.safeParse(file).success).toBe(true)
  })
})

describe('validPreviousEvents (E6)', () => {
  const good = { id: 'i1', title: 'T', start: '2026-10-20T20:30:00+02:00', source: 'mart', city: 'Rovereto', extra: 1 }
  it('keeps good records as-is, filling safe defaults', () => {
    const { events, dropped } = validPreviousEvents([good])
    expect(dropped).toBe(0)
    expect(events[0]).toMatchObject({ ...good, sources: ['mart'], tags: [], allDay: false, end: null })
  })
  it('drops and counts records without id/title/start/source instead of throwing', () => {
    const res = validPreviousEvents([
      good,
      null,
      { ...good, title: undefined },
      { ...good, title: '  ' },
      { ...good, start: 'soon' },
      { ...good, source: 3 },
    ])
    expect(res.events).toHaveLength(1)
    expect(res.dropped).toBe(5)
    expect(res.firstBad).toMatch(/^events\.1:/)
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
