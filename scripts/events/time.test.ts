import { describe, expect, it } from 'vitest'
import {
  addDays,
  dateToIso,
  instantToIso,
  localToIso,
  normalizeIso,
  offsetMinutes,
  parseYmd,
  romeDate,
  wallToIso,
} from './time.ts'

describe('Rome offsets (DST comes from Intl)', () => {
  it('+01:00 in winter, +02:00 in summer', () => {
    expect(offsetMinutes(Date.parse('2026-01-15T12:00:00Z'))).toBe(60)
    expect(offsetMinutes(Date.parse('2026-07-15T12:00:00Z'))).toBe(120)
  })

  it('wallToIso attaches the right offset on either side of the switch', () => {
    expect(wallToIso(2026, 10, 24, 20, 30)).toBe('2026-10-24T20:30:00+02:00')
    expect(wallToIso(2026, 10, 25, 20, 30)).toBe('2026-10-25T20:30:00+01:00')
    expect(wallToIso(2026, 3, 28, 20, 30)).toBe('2026-03-28T20:30:00+01:00')
    expect(wallToIso(2026, 3, 29, 20, 30)).toBe('2026-03-29T20:30:00+02:00')
  })

  it('a wall time inside the spring-forward gap comes out as a real local time', () => {
    // 2026-03-29 02:30 does not exist in Rome.
    const iso = wallToIso(2026, 3, 29, 2, 30)
    expect(iso).toMatch(/^2026-03-29T0[34]:30:00\+02:00$/)
  })

  it('the repeated autumn hour resolves to one of its two instants', () => {
    const iso = wallToIso(2026, 10, 25, 2, 30)
    expect(iso === '2026-10-25T02:30:00+02:00' || iso === '2026-10-25T02:30:00+01:00').toBe(true)
  })

  it('instantToIso converts UTC to Rome wall time', () => {
    expect(instantToIso(Date.parse('2026-10-04T18:30:00Z'))).toBe('2026-10-04T20:30:00+02:00')
    expect(instantToIso(Date.parse('2026-12-31T23:30:00Z'))).toBe('2027-01-01T00:30:00+01:00')
  })

  it('supports other zones', () => {
    expect(instantToIso(Date.parse('2026-07-01T12:00:00Z'), 'America/New_York')).toBe('2026-07-01T08:00:00-04:00')
    expect(offsetMinutes(Date.parse('2026-01-01T00:00:00Z'), 'Asia/Kolkata')).toBe(330)
  })
})

describe('date helpers', () => {
  it('dateToIso is Rome midnight', () => {
    expect(dateToIso('2026-07-01')).toBe('2026-07-01T00:00:00+02:00')
    expect(dateToIso('2026-12-01')).toBe('2026-12-01T00:00:00+01:00')
  })

  it('parseYmd accepts a date prefix and rejects garbage', () => {
    expect(parseYmd('2026-10-04T20:30:00+02:00')).toEqual([2026, 10, 4])
    expect(() => parseYmd('04/10/2026')).toThrow(/bad date/)
  })

  it('addDays is calendar arithmetic across months, years and leap days', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30') // across the DST switch
  })

  it('romeDate is the Rome calendar day, not the UTC one', () => {
    expect(romeDate(Date.parse('2026-10-04T22:30:00Z'))).toBe('2026-10-05')
    expect(romeDate(Date.parse('2026-10-04T21:30:00Z'))).toBe('2026-10-04')
  })
})

describe('normalizeIso', () => {
  it('re-expresses an instant in Rome time', () => {
    expect(normalizeIso('2026-10-04T18:30:00Z')).toBe('2026-10-04T20:30:00+02:00')
    expect(normalizeIso('2026-10-04T20:30:00+02:00')).toBe('2026-10-04T20:30:00+02:00')
    expect(normalizeIso('2026-10-04T14:30:00-04:00')).toBe('2026-10-04T20:30:00+02:00')
  })
  it('a bare date is Rome midnight', () => {
    expect(normalizeIso('2026-10-04')).toBe('2026-10-04T00:00:00+02:00')
  })
  it('null for empty or unparseable input', () => {
    expect(normalizeIso(null)).toBeNull()
    expect(normalizeIso(undefined)).toBeNull()
    expect(normalizeIso('')).toBeNull()
    expect(normalizeIso('not a date')).toBeNull()
  })
})

describe('localToIso', () => {
  it('interprets wall time as Rome', () => {
    expect(localToIso('2026-10-04', '20:30')).toBe('2026-10-04T20:30:00+02:00')
    expect(localToIso('2026-11-04', '9:05:07')).toBe('2026-11-04T09:05:07+01:00')
  })
  it('defaults to midnight', () => {
    expect(localToIso('2026-10-04')).toBe('2026-10-04T00:00:00+02:00')
  })
})
