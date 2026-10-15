import type { LifeRecapItem, LifeWeek } from '../../../lib/db'

export interface RecapMonth {
  /** 'YYYY-MM' of the Monday of the week that carries the recap. */
  month: string
  /** The latest week of that month with a recap: its lines end the month. */
  week: string
  items: LifeRecapItem[]
}

/** One entry per month that has a recap, oldest to newest. The month is taken
 * from each week's Monday; the latest week with a recap speaks for the month. */
export function recapMonths(weeks: readonly LifeWeek[]): RecapMonth[] {
  const byMonth = new Map<string, RecapMonth>()
  for (const w of weeks) {
    const items = w.plan.recap
    if (!items?.length) continue
    const month = w.week.slice(0, 7)
    const cur = byMonth.get(month)
    if (!cur || w.week > cur.week) byMonth.set(month, { month, week: w.week, items })
  }
  return [...byMonth.values()].sort((a, b) => (a.month < b.month ? -1 : 1))
}
