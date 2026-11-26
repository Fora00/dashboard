import { autoKind, autoNets, totalsOf, type Line } from './moneyStats'

// Soldi (MO14): one category over the whole history, for /soldi/categoria/:name.
// Pure, all in cents. Values are "how much": money out for a spend category
// (refunds lower it), money in for an income one; an auto category is placed
// by its total over the whole history.

export interface CategoryHistory {
  category: string
  /** 'in' for income categories, 'out' otherwise. */
  direction: 'in' | 'out'
  months: string[]
  /** One per month (0 when the category moved nothing that month). */
  values: number[]
  /** The effective budget per month (positive), null when none. */
  budgets: (number | null)[]
  /** Months whose value passed that month's budget. */
  overMonths: string[]
  years: CategoryYear[]
}

export interface CategoryYear {
  year: number
  total: number
  /** Months of the year inside the history. */
  months: number
  perMonth: number
  /** Percent change of the monthly mean against the year before, null without it or when it was 0. */
  change: number | null
  /** Share of the year's recurring spend (out categories) or income (in), percent, null when that total is 0. */
  share: number | null
}

/** null when the category has no rows. `months` = availableMonths of all lines. */
export function categoryHistory(
  lines: readonly Line[],
  category: string,
  months: readonly string[],
): CategoryHistory | null {
  const mine = lines.filter((l) => l.category === category)
  if (mine.length === 0 || months.length === 0) return null
  const first = mine[0]!
  const kind = first.kind === 'auto' ? autoKind(autoNets(mine).get(category)!) : first.kind
  const direction = kind === 'income' ? 'in' : 'out'
  const sign = direction === 'in' ? 1 : -1
  const at = new Map(months.map((m, i) => [m, i]))
  const values = months.map(() => 0)
  const budgets: (number | null)[] = months.map(() => null)
  for (const l of mine) {
    const i = at.get(l.month)
    if (i === undefined) continue
    values[i] = values[i]! + sign * l.amount
    if (l.budget !== null) budgets[i] = (budgets[i] ?? 0) + Math.abs(l.budget)
  }
  const overMonths = months.filter((_, i) => budgets[i] !== null && values[i]! > budgets[i]!)

  const years: CategoryYear[] = []
  const ys = [...new Set(months.map((m) => Number(m.slice(0, 4))))].sort((a, b) => a - b)
  for (const y of ys) {
    const idx = months.map((m, i) => (m.startsWith(`${y}-`) ? i : -1)).filter((i) => i >= 0)
    const total = idx.reduce((s, i) => s + values[i]!, 0)
    const perMonth = Math.round(total / idx.length)
    const prev = years[years.length - 1]
    const change =
      prev && prev.year === y - 1 && prev.perMonth !== 0
        ? Math.round(((perMonth - prev.perMonth) / Math.abs(prev.perMonth)) * 100)
        : null
    const yearLines = lines.filter((l) => l.month.startsWith(`${y}-`))
    const t = totalsOf(yearLines)
    const base = direction === 'in' ? t.income : t.spend
    years.push({
      year: y,
      total,
      months: idx.length,
      perMonth,
      change,
      share: base > 0 ? Math.round((total / base) * 1000) / 10 : null,
    })
  }
  return { category, direction, months: [...months], values, budgets, overMonths, years }
}
