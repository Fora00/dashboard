import { afterEach, describe, expect, it, vi } from 'vitest'
import { canEditLate, countsAsExport, exportedAt, lateEditState, markExported } from './lateEdit'

const WEEK = '2026-09-28' // a Monday; its Sunday is 2026-10-04
const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min)

describe('canEditLate', () => {
  it('is open on the following Monday and Tuesday, all day', () => {
    expect(canEditLate(WEEK, at(2026, 10, 5, 0, 0), null)).toBe(true) // Mon 00:00
    expect(canEditLate(WEEK, at(2026, 10, 5, 9), null)).toBe(true)
    expect(canEditLate(WEEK, at(2026, 10, 6, 23, 59), null)).toBe(true) // Tue 23:59
  })

  it('closes at Wednesday 00:00 local time', () => {
    expect(canEditLate(WEEK, at(2026, 10, 7, 0, 0), null)).toBe(false)
    expect(canEditLate(WEEK, at(2026, 10, 11), null)).toBe(false) // following Sunday
  })

  it('never applies to the current week or older weeks', () => {
    expect(canEditLate(WEEK, at(2026, 10, 4), null)).toBe(false) // its own Sunday: current week
    expect(canEditLate('2026-09-21', at(2026, 10, 5), null)).toBe(false) // two weeks back
    expect(canEditLate('2026-10-05', at(2026, 10, 5), null)).toBe(false) // this week
  })

  it('closes once the week was exported on or after its Sunday', () => {
    expect(canEditLate(WEEK, at(2026, 10, 5), at(2026, 10, 4, 21).getTime())).toBe(false) // Sunday evening
    expect(canEditLate(WEEK, at(2026, 10, 6), at(2026, 10, 5, 8).getTime())).toBe(false) // Monday morning
  })

  it('ignores a preview export made before Sunday', () => {
    expect(canEditLate(WEEK, at(2026, 10, 5), at(2026, 10, 2, 18).getTime())).toBe(true) // Friday
  })

  it('handles the DST change (Europe ends DST on the last Sunday of October)', () => {
    // Week of 2026-10-19, Sunday 2026-10-25 is the change day in the EU.
    expect(canEditLate('2026-10-19', at(2026, 10, 27, 23, 30), null)).toBe(true)
    expect(canEditLate('2026-10-19', at(2026, 10, 28, 0, 0), null)).toBe(false)
  })
})

describe('countsAsExport', () => {
  it('needs a finite timestamp on or after the Sunday', () => {
    expect(countsAsExport(WEEK, null)).toBe(false)
    expect(countsAsExport(WEEK, Number.NaN)).toBe(false)
    expect(countsAsExport(WEEK, at(2026, 10, 3, 23, 59).getTime())).toBe(false)
    expect(countsAsExport(WEEK, at(2026, 10, 4, 0, 0).getTime())).toBe(true)
  })
})

describe('lateEditState', () => {
  it('tells exported apart from the window being over', () => {
    expect(lateEditState(WEEK, at(2026, 10, 5), null)).toBe('open')
    expect(lateEditState(WEEK, at(2026, 10, 5), at(2026, 10, 4, 20).getTime())).toBe('exported')
    expect(lateEditState(WEEK, at(2026, 10, 7), null)).toBe('closed')
    expect(lateEditState(WEEK, at(2026, 10, 7), at(2026, 10, 4, 20).getTime())).toBe('closed')
  })
})

describe('export marks', () => {
  afterEach(() => vi.unstubAllGlobals())

  function stubStorage() {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    })
    return store
  }

  it('remembers the export time per week and keeps only the newest marks', () => {
    stubStorage()
    expect(exportedAt(WEEK)).toBeNull()
    markExported(WEEK, 1000)
    expect(exportedAt(WEEK)).toBe(1000)
    for (let i = 1; i <= 14; i++) markExported(`2027-01-${String(i).padStart(2, '0')}`, i)
    expect(exportedAt(WEEK)).toBeNull() // oldest week dropped
    expect(exportedAt('2027-01-14')).toBe(14)
  })

  it('ignores garbage in storage and survives blocked storage', () => {
    const store = stubStorage()
    store.set('dashboard:life-exported', JSON.stringify({ [WEEK]: 'x', nope: 5, '2026-10-05': 7 }))
    expect(exportedAt(WEEK)).toBeNull()
    expect(exportedAt('2026-10-05')).toBe(7)
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(() => markExported(WEEK)).not.toThrow()
    expect(exportedAt(WEEK)).toBeNull()
  })
})
