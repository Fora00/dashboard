import { describe, expect, it } from 'vitest'
import { seasonality } from './moneySeason'

describe('seasonality (MO15)', () => {
  it('mean per calendar month over the years it appears, against the mean month', () => {
    // Nov 2024 .. Jan 2026: December twice (300, 500), the rest 100.
    const months = [
      '2024-11',
      '2024-12',
      '2025-01',
      '2025-02',
      '2025-03',
      '2025-04',
      '2025-05',
      '2025-06',
      '2025-07',
      '2025-08',
      '2025-09',
      '2025-10',
      '2025-11',
      '2025-12',
      '2026-01',
    ]
    const values = months.map((m) => (m === '2024-12' ? 300 : m === '2025-12' ? 500 : 100))
    const s = seasonality(months, values)
    expect(s[11]).toEqual({ month: 12, name: 'dic', mean: 400, years: 2, index: 220 })
    // Mean month = (11 × 100 + 400) / 12 = 125: the other months are 20% below.
    expect(s[0]).toMatchObject({ name: 'gen', mean: 100, years: 2, index: -20 })
    expect(s[10]).toMatchObject({ years: 2 })
  })

  it('months never in the history have no mean', () => {
    const s = seasonality(['2026-01', '2026-02'], [100, 300])
    expect(s[0]!.index).toBe(-50)
    expect(s[1]!.index).toBe(50)
    expect(s[5]).toMatchObject({ mean: null, years: 0, index: null })
  })
})
