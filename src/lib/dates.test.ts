import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  addDaysUtc,
  daysBetween,
  daysBetweenUtc,
  formatDate,
  isDateKey,
  isMondayKey,
  monthKey,
  romeDayKey,
  shiftMonth,
  weekDays,
  weekKey,
  weekStart,
  weekStartUtc,
} from './dates'

describe('formatDate', () => {
  it('reads day and month strings as local time', () => {
    expect(formatDate('2026-03-01', { day: 'numeric', month: 'numeric' }, 'en-GB')).toBe('01/03')
    expect(formatDate('2026-03', { month: 'numeric', year: 'numeric' }, 'en-GB')).toBe('03/2026')
  })
  it('matches toLocaleDateString for epochs', () => {
    const t = new Date(2026, 9, 7, 12).getTime()
    expect(formatDate(t, undefined, 'it-IT')).toBe(new Date(t).toLocaleDateString('it-IT'))
    expect(formatDate(t, undefined, 'it-IT')).toMatch(/10\/2026$/)
  })
})

describe('date keys', () => {
  it('isDateKey accepts real dates only', () => {
    expect(isDateKey('2026-09-28')).toBe(true)
    expect(isDateKey('2028-02-29')).toBe(true)
    expect(isDateKey('2026-02-29')).toBe(false)
    expect(isDateKey('2026-02-30')).toBe(false)
    expect(isDateKey('2026-13-01')).toBe(false)
    expect(isDateKey('2026-9-28')).toBe(false)
    expect(isDateKey(20260928)).toBe(false)
    expect(isDateKey(null)).toBe(false)
  })

  it('isMondayKey', () => {
    expect(isMondayKey('2026-09-28')).toBe(true)
    expect(isMondayKey('2026-09-27')).toBe(false)
    expect(isMondayKey('nonsense')).toBe(false)
  })

  it('addDays / weekDays cross month and year ends', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(weekDays('2026-12-28')).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])
  })

  it('weekKey is the Monday; Sunday belongs to the week that started six days earlier', () => {
    expect(weekKey(new Date(2026, 8, 28))).toBe('2026-09-28') // Monday
    expect(weekKey(new Date(2026, 9, 4, 23, 59))).toBe('2026-09-28') // Sunday night
    expect(weekKey(new Date(2026, 9, 5, 0, 1))).toBe('2026-10-05')
    expect(weekKey(new Date(2027, 0, 1))).toBe('2026-12-28')
  })

  it('daysBetween is whole days, signed', () => {
    expect(daysBetween('2026-09-28', '2026-10-04')).toBe(6)
    expect(daysBetween('2026-10-04', '2026-09-28')).toBe(-6)
    expect(daysBetween('2026-09-28', '2026-09-28')).toBe(0)
  })

  describe('across a DST change (the local calendar must not drift)', () => {
    afterEach(() => vi.unstubAllEnvs())

    it.each([
      ['Europe/Rome', -120],
      ['America/Los_Angeles', 420],
      ['Pacific/Auckland', -720],
    ])('%s', (tz, julyOffset) => {
      vi.stubEnv('TZ', tz) // Node re-reads TZ on assignment
      expect(new Date(2026, 6, 1, 12).getTimezoneOffset()).toBe(julyOffset) // the zone really changed
      // Rome: 25 Oct 2026 (25 h day); LA: 1 Nov 2026; Auckland: 27 Sep 2026.
      for (const start of ['2026-03-28', '2026-09-26', '2026-10-24', '2026-10-31']) {
        expect(daysBetween(start, addDays(start, 3))).toBe(3)
        expect(weekDays(weekKey(new Date(`${start}T12:00:00`)))).toHaveLength(7)
      }
      expect(addDays('2026-10-24', 2)).toBe('2026-10-26')
      expect(weekKey(new Date(2026, 9, 25, 12))).toBe('2026-10-19')
    })
  })
})

describe('weekStart / monthKey / shiftMonth', () => {
  it('weekStart is the Monday of a day key', () => {
    expect(weekStart('2026-09-28')).toBe('2026-09-28')
    expect(weekStart('2026-10-04')).toBe('2026-09-28')
    expect(weekStart('2027-01-01')).toBe('2026-12-28')
  })
  it('monthKey is YYYY-MM in local time', () => {
    expect(monthKey(new Date(2026, 0, 31, 23, 59))).toBe('2026-01')
    expect(monthKey(new Date(2026, 11, 1))).toBe('2026-12')
  })
  it('shiftMonth crosses year ends both ways', () => {
    expect(shiftMonth('2026-11', 1)).toBe('2026-12')
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
    expect(shiftMonth('2026-03', 14)).toBe('2027-05')
    expect(shiftMonth('2026-03', 0)).toBe('2026-03')
  })
})

describe('Rome / UTC-noon variants', () => {
  it('romeDayKey follows the Rome calendar day across both DST changes', () => {
    // CET (UTC+1) before spring forward: 23:00Z is already the next Rome day
    expect(romeDayKey(Date.UTC(2026, 2, 28, 22, 59))).toBe('2026-03-28')
    expect(romeDayKey(Date.UTC(2026, 2, 28, 23, 0))).toBe('2026-03-29')
    // CEST (UTC+2): 22:00Z is already the next Rome day
    expect(romeDayKey(Date.UTC(2026, 6, 1, 21, 59))).toBe('2026-07-01')
    expect(romeDayKey(Date.UTC(2026, 6, 1, 22, 0))).toBe('2026-07-02')
    // fall back on 25 Oct 2026: the offset is still +2 until 01:00Z, then +1
    expect(romeDayKey(Date.UTC(2026, 9, 24, 21, 59))).toBe('2026-10-24')
    expect(romeDayKey(Date.UTC(2026, 9, 24, 22, 0))).toBe('2026-10-25')
    expect(romeDayKey(Date.UTC(2026, 9, 25, 22, 59))).toBe('2026-10-25')
    expect(romeDayKey(Date.UTC(2026, 9, 25, 23, 0))).toBe('2026-10-26')
  })
  it('addDaysUtc / daysBetweenUtc ignore DST and the device zone', () => {
    expect(addDaysUtc('2026-03-28', 2)).toBe('2026-03-30')
    expect(addDaysUtc('2026-10-24', 2)).toBe('2026-10-26')
    expect(addDaysUtc('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDaysUtc('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDaysUtc('2026-03-28T10:00:00+01:00', 1)).toBe('2026-03-29')
    expect(daysBetweenUtc('2026-03-28', '2026-03-30')).toBe(2)
    expect(daysBetweenUtc('2026-10-24', '2026-10-26')).toBe(2)
    expect(daysBetweenUtc('2026-10-26', '2026-10-24')).toBe(-2)
  })
  it('weekStartUtc is the Monday', () => {
    expect(weekStartUtc('2026-10-25')).toBe('2026-10-19') // the 25 h Sunday
    expect(weekStartUtc('2026-10-26')).toBe('2026-10-26')
    expect(weekStartUtc('2026-03-29')).toBe('2026-03-23') // the 23 h Sunday
  })
})
