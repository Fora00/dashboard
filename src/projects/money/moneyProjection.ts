import { MONTHS_IT, addMonths, monthsIn, periodLines } from './moneyPeriod'
import { emptyTotals, keptOf, monthlyTotals, totalsOf, type Line, type Totals } from './moneyStats'

// Soldi (MO11): where the year ends at this pace. Pure, all in cents.
//
// Method (owner, 2026-11-26: moving average + seasonality): each month still to
// come is the same month a year before, scaled by how this year's last `n`
// months compare with the same `n` months a year before (separately for income
// and recurring spend). Without that month a year before, or without a usable
// ratio, the month is the plain mean of the last `n` months. One-offs are not
// projected: the result says "senza nuove una tantum".

export interface YearProjection {
  year: number
  /** Last month with data in the year ('YYYY-MM'). */
  through: string
  /** Months still to project (0 when the year is complete). */
  remaining: number
  done: Totals
  /** The remaining months only. */
  ahead: Totals
  /** done + ahead. */
  total: Totals
  /** 'seasonal' when every remaining month had a year-before month and a ratio, else 'mixed' or 'average'. */
  method: 'seasonal' | 'mixed' | 'average'
}

const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0)

/** this / before, or null when before is not positive. */
const ratio = (now: number, before: number) => (before > 0 ? now / before : null)

/**
 * Projection of `year` to December from the lines up to the newest month in
 * the data. null when the year has no data or is not the newest year.
 */
export function projectYear(lines: readonly Line[], year: number, n: number): YearProjection | null {
  const newest = lines.reduce((m, l) => (l.month > m ? l.month : m), '')
  if (!newest || Number(newest.slice(0, 4)) !== year) return null
  const done = totalsOf(periodLines(lines, { from: `${year}-01`, to: newest }))
  const remaining = 12 - Number(newest.slice(5, 7))
  if (remaining === 0) {
    return { year, through: newest, remaining, done, ahead: emptyTotals(), total: done, method: 'seasonal' }
  }
  const recentP = { from: addMonths(newest, 1 - n), to: newest }
  const recent = monthlyTotals(lines, recentP)
  const before = monthlyTotals(lines, { from: addMonths(recentP.from, -12), to: addMonths(newest, -12) })
  const val = (ts: (Totals | null)[], f: (t: Totals) => number) => sum(ts.map((t) => (t ? f(t) : 0)))
  const incomeR = ratio(
    val(recent, (t) => t.income),
    val(before, (t) => t.income),
  )
  const spendR = ratio(
    val(recent, (t) => t.spend),
    val(before, (t) => t.spend),
  )
  const avgIncome = val(recent, (t) => t.income) / n
  const avgSpend = val(recent, (t) => t.spend) / n

  const ahead = emptyTotals()
  let seasonal = 0
  for (const m of monthsIn({ from: addMonths(newest, 1), to: `${year}-12` })) {
    const last = monthlyTotals(lines, { from: addMonths(m, -12), to: addMonths(m, -12) })[0] ?? null
    if (last && incomeR !== null && spendR !== null) {
      ahead.income += Math.round(last.income * incomeR)
      ahead.spend += Math.round(last.spend * spendR)
      seasonal++
    } else {
      ahead.income += Math.round(avgIncome)
      ahead.spend += Math.round(avgSpend)
    }
  }
  const total = {
    income: done.income + ahead.income,
    spend: done.spend + ahead.spend,
    oneoff: done.oneoff,
    pass: done.pass,
  }
  const method = seasonal === remaining ? 'seasonal' : seasonal === 0 ? 'average' : 'mixed'
  return { year, through: newest, remaining, done, ahead, total, method }
}

export const projectedKept = (p: YearProjection) => keptOf(p.total)

export type BudgetForecast =
  | { state: 'over'; since: string }
  | { state: 'will-go-over'; month: string }
  | { state: 'within'; spent: number; budget: number }

/**
 * For one spend category with a budget this year: when, at this pace, its
 * spending passes the budget summed over the budgeted months. Spend so far
 * counts only the budgeted months (like categoryRows `over`); each month to
 * come gets the latest budget carried forward and a projected spend (same
 * month a year before × the category's recent ratio, else its recent mean).
 * null when the category has no budget in the year or the year is complete.
 */
export function forecastBudget(
  lines: readonly Line[],
  category: string,
  year: number,
  n: number,
): BudgetForecast | null {
  const newest = lines.reduce((m, l) => (l.month > m ? l.month : m), '')
  if (!newest || Number(newest.slice(0, 4)) !== year || newest.endsWith('-12')) return null
  const mine = lines.filter((l) => l.category === category)
  const thisYear = periodLines(mine, { from: `${year}-01`, to: newest }).sort((a, b) => a.month.localeCompare(b.month))
  const budgeted = thisYear.filter((l) => l.budget !== null)
  if (budgeted.length === 0) return null
  const spendAt = (m: string) => -sum(mine.filter((l) => l.month === m).map((l) => l.amount))
  let spent = 0
  let budget = 0
  let since: string | null = null
  for (const l of budgeted) {
    spent += -l.amount
    budget += Math.abs(l.budget!)
    if (since === null && spent > budget) since = l.month
  }
  if (spent > budget) return { state: 'over', since: since ?? budgeted[budgeted.length - 1]!.month }
  const lastBudget = Math.abs(budgeted[budgeted.length - 1]!.budget!)
  const recentMonths = monthsIn({ from: addMonths(newest, 1 - n), to: newest })
  const recent = sum(recentMonths.map(spendAt))
  const before = sum(recentMonths.map((m) => spendAt(addMonths(m, -12))))
  const r = ratio(recent, before)
  for (const m of monthsIn({ from: addMonths(newest, 1), to: `${year}-12` })) {
    const last = mine.some((l) => l.month === addMonths(m, -12))
    spent += last && r !== null ? Math.round(spendAt(addMonths(m, -12)) * r) : Math.round(recent / n)
    budget += lastBudget
    if (spent > budget) return { state: 'will-go-over', month: m }
  }
  return { state: 'within', spent, budget }
}

/** "a ottobre" style label for a forecast. */
export function forecastLabel(f: BudgetForecast, euro: (c: number) => string): string {
  const name = (m: string) => MONTHS_IT[Number(m.slice(5, 7)) - 1]
  if (f.state === 'over') return `fine anno: già sopra il budget da ${name(f.since)}`
  if (f.state === 'will-go-over') return `fine anno: a questo ritmo sfora a ${name(f.month)}`
  return `fine anno: resta nel budget (≈ ${euro(f.spent)} su ${euro(f.budget)})`
}
