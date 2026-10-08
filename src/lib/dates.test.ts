import { describe, expect, it } from 'vitest'
import { formatDate } from './dates'

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
