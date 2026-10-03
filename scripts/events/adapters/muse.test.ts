import { describe, expect, it } from 'vitest'
import { parseDates, parsePlace } from './muse.ts'

const TODAY = '2026-10-03'

describe('muse parseDates', () => {
  it('reads a range across two months, with the year only at the end', () => {
    expect(parseDates('Dal 22 ottobre all&#8217;1 novembre 2026', TODAY)).toEqual(['2026-10-22', '2026-11-01'])
  })
  it('reads a range that shares the month', () => {
    expect(parseDates('Dal 22 al 25 ottobre 2026', TODAY)).toEqual(['2026-10-22', '2026-10-25'])
  })
  it('reads a single day, with a weekday and no year', () => {
    expect(parseDates('Sabato 10 ottobre', TODAY)).toEqual(['2026-10-10', '2026-10-10'])
  })
  it('puts a date without a year in the next year once it went by, and handles a New Year range', () => {
    expect(parseDates('15 gennaio', TODAY)).toEqual(['2027-01-15', '2027-01-15'])
    expect(parseDates('Dal 20 dicembre al 6 gennaio 2027', TODAY)).toEqual(['2026-12-20', '2027-01-06'])
  })
  it('returns null when there is no date', () => {
    expect(parseDates('Tutti i giorni di apertura del museo', TODAY)).toBeNull()
  })
})

describe('muse parsePlace', () => {
  it('knows the museum, a comma-separated town, and a town after "a" / "di"', () => {
    expect(parsePlace('MUSE')).toEqual({ venue: 'MUSE', city: 'Trento' })
    expect(parsePlace(null)).toEqual({ venue: 'MUSE', city: 'Trento' })
    expect(parsePlace('Palazzo Reale, Genova').city).toBe('Genova')
    expect(parsePlace('Museo Geologico delle Dolomiti a Predazzo').city).toBe('Predazzo')
    expect(parsePlace('Castello San Giovanni di Bondone').city).toBe('Bondone')
    expect(parsePlace('Palazzo delle Albere').city).toBe('Trento')
  })
})
