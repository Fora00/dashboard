import { describe, expect, it } from 'vitest'
import { MAX_SNAPSHOT_BYTES, isPastEvent, isValidMarkId, sanitizeFavourites, sanitizeSnapshot } from './marks'

const base = {
  id: 'abcdef0123456789',
  title: 'Concerto',
  start: '2026-10-09T20:30:00+02:00',
}

describe('sanitizeSnapshot', () => {
  it('rejects values without the essentials', () => {
    expect(sanitizeSnapshot(null)).toBeNull()
    expect(sanitizeSnapshot('unchanged_toast')).toBeNull()
    expect(sanitizeSnapshot([base])).toBeNull()
    expect(sanitizeSnapshot({ ...base, title: '' })).toBeNull()
    expect(sanitizeSnapshot({ ...base, start: 3 })).toBeNull()
    expect(sanitizeSnapshot({ ...base, id: 'bad id' })).toBeNull()
  })

  it('fills defaults for a minimal record', () => {
    expect(sanitizeSnapshot(base)).toEqual({
      ...base,
      end: null,
      allDay: false,
      ongoing: false,
      venue: null,
      city: '',
      url: '',
      source: '',
      sources: [],
      category: 'other',
      tags: [],
      description: '',
      summary: '',
      image: null,
      occurrences: 1,
      fetchedAt: '',
    })
  })

  it('keeps only http(s) links and drops data URLs', () => {
    const s = sanitizeSnapshot({ ...base, url: 'javascript:alert(1)', image: 'data:image/png;base64,AAAA' })!
    expect(s.url).toBe('')
    expect(s.image).toBeNull()
    expect(sanitizeSnapshot({ ...base, image: 'https://x.org/a.jpg' })!.image).toBe('https://x.org/a.jpg')
  })

  it('strips control characters but keeps newlines and tabs', () => {
    expect(sanitizeSnapshot({ ...base, description: 'a\u0000b\nc\td\u001b' })!.description).toBe('ab\nc\td')
  })

  it('stays under the server size cap in the worst case', () => {
    const fat = '🎭'.repeat(10_000)
    const s = sanitizeSnapshot({
      ...base,
      title: fat,
      venue: fat,
      city: fat,
      description: fat,
      summary: fat,
      tags: Array.from({ length: 100 }, (_, i) => `${i}${fat}`),
      sources: Array.from({ length: 100 }, (_, i) => `${i}${fat}`),
      area: fat,
      ring: fat,
      source: fat,
      category: fat,
      fetchedAt: fat,
      end: fat,
    })!
    expect(new TextEncoder().encode(JSON.stringify(s)).length).toBeLessThan(MAX_SNAPSHOT_BYTES)
  })
})

describe('isValidMarkId', () => {
  it('accepts crawler ids, uuids and spot slugs', () => {
    expect(isValidMarkId('abcdef0123456789')).toBe(true)
    expect(isValidMarkId('11111111-1111-4111-8111-111111111111')).toBe(true)
    expect(isValidMarkId('lucca-comics-games-2026')).toBe(true)
    expect(isValidMarkId('')).toBe(false)
    expect(isValidMarkId('a'.repeat(101))).toBe(false)
  })
})

describe('sanitizeFavourites', () => {
  it('keeps well-formed unique ids, capped', () => {
    expect(sanitizeFavourites(['theatre', 'theatre', 'Bad', 3, 'social-girl'])).toEqual(['theatre', 'social-girl'])
    expect(sanitizeFavourites('theatre')).toEqual([])
    expect(sanitizeFavourites(Array.from({ length: 80 }, (_, i) => `c${i}`))).toHaveLength(50)
  })
})

describe('isPastEvent (Rome day)', () => {
  // 2026-11-18T23:30Z is already 00:30 on the 19th in Rome (UTC+1), whatever the device zone.
  const lateEvening = Date.parse('2026-11-18T23:30:00Z')
  it('an event of the 18th is over once Rome is on the 19th', () => {
    expect(isPastEvent({ start: '2026-11-18T20:00:00+01:00', end: null }, lateEvening)).toBe(true)
  })
  it('an event of the 19th is not over', () => {
    expect(isPastEvent({ start: '2026-11-19T20:00:00+01:00', end: null }, lateEvening)).toBe(false)
  })
  it('uses the end day when there is one', () => {
    expect(isPastEvent({ start: '2026-11-10T20:00:00+01:00', end: '2026-11-19T22:00:00+01:00' }, lateEvening)).toBe(
      false,
    )
  })
})
