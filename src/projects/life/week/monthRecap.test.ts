import { describe, expect, it } from 'vitest'
import type { LifeRecapItem, LifeWeek } from '../../../lib/db'
import { recapMonths } from './monthRecap'

const item: LifeRecapItem = {
  id: 'r1',
  kind: 'minimum',
  label: 'Habit A',
  weeks: [{ week: '2026-10-05', done: 4, of: 7 }],
}
const week = (w: string, recap?: LifeRecapItem[]): LifeWeek => ({
  id: w,
  week: w,
  plan: {
    version: 1,
    week: w,
    focus: [],
    rules: [],
    tasks: [],
    trackers: [],
    sundayCheck: [],
    checkins: [],
    ...(recap ? { recap } : {}),
  },
  importedAt: 0,
  updatedAt: 0,
})

describe('recapMonths', () => {
  it('is empty without any recap', () => {
    expect(recapMonths([week('2026-10-05'), week('2026-10-12', [])])).toEqual([])
  })

  it('takes the latest recap week of each month, oldest month first', () => {
    const months = recapMonths([
      week('2026-10-19', [item]),
      week('2026-10-05', [item]),
      week('2026-09-28', [item]),
      week('2026-10-12'),
    ])
    expect(months.map((m) => [m.month, m.week])).toEqual([
      ['2026-09', '2026-09-28'],
      ['2026-10', '2026-10-19'],
    ])
  })
})
