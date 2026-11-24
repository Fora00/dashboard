import type { MoneyKind } from '../../lib/db'

// Soldi: totals for the page and the import preview. Pure, all in cents.
//
// Sign conventions: rows carry signed amounts (+ in, - out). The totals here
// are "how much": income is the sum of income rows; spend and oneoff are the
// money that went out (minus refunds booked in those categories), so a
// positive number; kept = income - spend - oneoff. `pass` rows (loans and
// refunds, `*Debiti` in GreenBooks) are never income or spend: they only show
// in their own block, as the net signed sum.
//
// `auto` rows (every category that is not stable: not a salary, one-off or
// loan) are income or spend by the sign of the category's total over the
// period being totalled: a year's tiles look at the year, a month's bar at the
// month. So gifts can be income the year more came in than went out, and spend
// the next. A total of exactly 0 counts as spend. Kept never depends on it.

export interface Line {
  month: string
  category: string
  kind: MoneyKind
  amount: number
  budget: number | null
}

export interface Totals {
  income: number
  /** Recurring spend (kind spend, and auto categories that net out), positive = money out. */
  spend: number
  /** One-off spend (kind oneoff), positive = money out. */
  oneoff: number
  /** Net of the pass rows (loans/refunds), signed. Not in kept. */
  pass: number
}

export const MONTHS_IT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'] as const

export const emptyTotals = (): Totals => ({ income: 0, spend: 0, oneoff: 0, pass: 0 })

/** Net signed total per auto category over `lines`. */
export function autoNets(lines: readonly Line[]): Map<string, number> {
  const nets = new Map<string, number>()
  for (const l of lines) if (l.kind === 'auto') nets.set(l.category, (nets.get(l.category) ?? 0) + l.amount)
  return nets
}

/** income or spend for an auto category with this net total over the period. */
export const autoKind = (net: number): 'income' | 'spend' => (net > 0 ? 'income' : 'spend')

/** Totals of `lines`, auto categories decided by their total over these same lines. */
export function totalsOf(lines: readonly Line[]): Totals {
  const nets = autoNets(lines)
  const t = emptyTotals()
  for (const l of lines) {
    const kind = l.kind === 'auto' ? autoKind(nets.get(l.category)!) : l.kind
    if (kind === 'income') t.income += l.amount
    else if (kind === 'spend') t.spend -= l.amount
    else if (kind === 'oneoff') t.oneoff -= l.amount
    else t.pass += l.amount
  }
  return t
}

/** All money out (recurring + one-off). */
export const outOf = (t: Totals) => t.spend + t.oneoff
/** Messo da parte: income minus all money out. */
export const keptOf = (t: Totals) => t.income - outOf(t)

/** Years with data, newest first. */
export function yearsOf(lines: readonly Line[]): number[] {
  return [...new Set(lines.map((l) => Number(l.month.slice(0, 4))))].sort((a, b) => b - a)
}

/**
 * The months of `year` the page counts: 1..12, except for the newest year in
 * the data, which stops at its newest month (year to date). A compare year is
 * cut at the same month, so two years are always compared like for like.
 */
export function lastMonthOf(lines: readonly Line[], year: number): number {
  const newest = lines.reduce((m, l) => (l.month > m ? l.month : m), '')
  return Number(newest.slice(0, 4)) === year ? Number(newest.slice(5, 7)) : 12
}

const inPeriod = (l: Line, year: number, last: number) =>
  Number(l.month.slice(0, 4)) === year && Number(l.month.slice(5, 7)) <= last

export function periodLines(lines: readonly Line[], year: number, last: number): Line[] {
  return lines.filter((l) => inPeriod(l, year, last))
}

/**
 * When a budget covered only some of the months a category has rows in:
 * "ott–nov", "nov", or "gen–set, nov" for gaps. null when it covered all of
 * them (or none). A month with no row at all is not "without budget": the CSV
 * writes no row for a category that moved no money that month.
 */
export function budgetMonthsLabel(r: Pick<CategoryRow, 'budgetMonths' | 'rowMonths'>): string | null {
  const months = r.budgetMonths
  if (months.length === 0 || months.length >= r.rowMonths) return null
  const runs: [number, number][] = []
  for (const m of months) {
    const r = runs[runs.length - 1]
    if (r && m === r[1] + 1) r[1] = m
    else runs.push([m, m])
  }
  return runs.map(([a, b]) => (a === b ? MONTHS_IT[a - 1] : `${MONTHS_IT[a - 1]}–${MONTHS_IT[b - 1]}`)).join(', ')
}

/** "gen–nov 2026", or "2026" for a full year. */
export function periodLabel(year: number, last: number): string {
  return last === 12 ? String(year) : last === 1 ? `gen ${year}` : `gen–${MONTHS_IT[last - 1]} ${year}`
}

/** 12 entries for `year`: the month's totals (auto decided per month), or null when it has no rows. */
export function monthlyTotals(lines: readonly Line[], year: number): (Totals | null)[] {
  const byMonth: Line[][] = Array.from({ length: 12 }, () => [])
  for (const l of lines) if (Number(l.month.slice(0, 4)) === year) byMonth[Number(l.month.slice(5, 7)) - 1]!.push(l)
  return byMonth.map((ls) => (ls.length ? totalsOf(ls) : null))
}

export interface CategoryRow {
  category: string
  /** Money out in the period (positive), or in for income rows. */
  value: number
  /** Summed limit over the months that had one (positive), null when none. */
  budget: number | null
  /** Months of the period that had a budget (1-12, ascending); empty when none. */
  budgetMonths: number[]
  /** How many months of the period the category has a row in. */
  rowMonths: number
  /**
   * Spend/oneoff only: money out in the budget months minus the budget, when
   * positive, else 0. Only the months that had a budget count, so a budget
   * set (or dropped) mid-year never flags the months without one.
   */
  over: number
  /** Same category, same months of the compare year; null without a compare year. */
  compare: number | null
}

/**
 * Per category for one block over the period. spend/oneoff: money out and the
 * limit; income: money in; pass: signed net. Sorted biggest first. An auto
 * category goes to income or spend by its total over the period (or, when it
 * has no rows in the period, over the compare period), and its compare value
 * is signed for the block it landed in.
 */
export function categoryRows(
  lines: readonly Line[],
  kind: Exclude<MoneyKind, 'auto'>,
  year: number,
  last: number,
  compareYear: number | null,
): CategoryRow[] {
  const sign = kind === 'spend' || kind === 'oneoff' ? -1 : 1
  const nets = autoNets(lines.filter((l) => inPeriod(l, year, last)))
  const compareNets = compareYear === null ? new Map<string, number>() : autoNets(periodLines(lines, compareYear, last))
  const kindOf = (l: Line) =>
    l.kind !== 'auto' ? l.kind : autoKind(nets.get(l.category) ?? compareNets.get(l.category) ?? 0)
  const acc = new Map<
    string,
    {
      value: number
      budget: number | null
      inBudget: number
      budgetMonths: number[]
      rowMonths: number
      compare: number
    }
  >()
  // A category that has rows in the period (or compare period) stays listed even when it nets to 0 (a loan repaid).
  const get = (c: string) => {
    let r = acc.get(c)
    if (!r) acc.set(c, (r = { value: 0, budget: null, inBudget: 0, budgetMonths: [], rowMonths: 0, compare: 0 }))
    return r
  }
  for (const l of lines) {
    if (kindOf(l) !== kind) continue
    if (inPeriod(l, year, last)) {
      const r = get(l.category)
      r.value += sign * l.amount
      r.rowMonths++
      if (l.budget !== null) {
        r.budget = (r.budget ?? 0) + sign * l.budget
        r.inBudget += sign * l.amount
        r.budgetMonths.push(Number(l.month.slice(5, 7)))
      }
    } else if (compareYear !== null && inPeriod(l, compareYear, last)) {
      get(l.category).compare += sign * l.amount
    }
  }
  return [...acc]
    .map(([category, r]) => ({
      category,
      value: r.value,
      budget: r.budget,
      budgetMonths: r.budgetMonths.sort((a, b) => a - b),
      rowMonths: r.rowMonths,
      over: sign < 0 && r.budget !== null && r.inBudget > r.budget ? r.inBudget - r.budget : 0,
      compare: compareYear === null ? null : r.compare,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || a.category.localeCompare(b.category))
}

// --- Formatting -----------------------------------------------------------------

const EUR = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

/** "1.234 €" (rounded to the euro). */
export function euro(cents: number): string {
  return EUR.format(Math.round(cents / 100))
}

/** Short bar label: "850", "1,2k", "-3,4k" (euros). */
export function euroShort(cents: number): string {
  const e = Math.round(cents / 100)
  if (Math.abs(e) < 1000) return String(e)
  return `${(e / 1000).toFixed(1).replace('.', ',').replace(',0', '')}k`
}

/** "+12%" / "-5%" change from `before` to `now`; null when before is 0. */
export function pctChange(now: number, before: number): string | null {
  if (before === 0) return null
  const p = Math.round(((now - before) / Math.abs(before)) * 100)
  return `${p > 0 ? '+' : ''}${p}%`
}
