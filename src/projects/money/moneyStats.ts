import type { MoneyKind } from '../../lib/db'
import { MONTHS_IT, monthsIn, type Period } from './moneyPeriod'

export { MONTHS_IT }

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

/** Every field times `k`, rounded to the cent (the historic average scaled to a period). */
export function scaleTotals(t: Totals, k: number): Totals {
  return {
    income: Math.round(t.income * k),
    spend: Math.round(t.spend * k),
    oneoff: Math.round(t.oneoff * k),
    pass: Math.round(t.pass * k),
  }
}

/**
 * When a budget covered only some of the months a category has rows in:
 * "ott–nov", "nov", or "gen–set, nov" for gaps ("dic 25–gen 26" with
 * `withYear`, for a period across a year end). null when it covered all of
 * them (or none). A month with no row at all is not "without budget": the CSV
 * writes no row for a category that moved no money that month.
 */
export function budgetMonthsLabel(r: Pick<CategoryRow, 'budgetMonths' | 'rowMonths'>, withYear = false): string | null {
  const months = r.budgetMonths
  if (months.length === 0 || months.length >= r.rowMonths) return null
  const idx = (m: string) => Number(m.slice(0, 4)) * 12 + Number(m.slice(5, 7))
  const runs: [string, string][] = []
  for (const m of months) {
    const r = runs[runs.length - 1]
    if (r && idx(m) === idx(r[1]) + 1) r[1] = m
    else runs.push([m, m])
  }
  const nm = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]}${withYear ? ` ${m.slice(2, 4)}` : ''}`
  return runs.map(([a, b]) => (a === b ? nm(a) : `${nm(a)}–${nm(b)}`)).join(', ')
}

/** One entry per month of the period: the month's totals (auto decided per month), or null when it has no rows. */
export function monthlyTotals(lines: readonly Line[], period: Period): (Totals | null)[] {
  const months = monthsIn(period)
  const at = new Map(months.map((m, i) => [m, i]))
  const byMonth: Line[][] = months.map(() => [])
  for (const l of lines) {
    const i = at.get(l.month)
    if (i !== undefined) byMonth[i]!.push(l)
  }
  return byMonth.map((ls) => (ls.length ? totalsOf(ls) : null))
}

export interface CategoryRow {
  category: string
  /** Money out in the period (positive), or in for income rows. */
  value: number
  /** Summed limit over the months that had one (positive), null when none. */
  budget: number | null
  /** Months of the period that had a budget ('YYYY-MM', ascending); empty when none. */
  budgetMonths: string[]
  /** How many months of the period the category has a row in. */
  rowMonths: number
  /**
   * Spend/oneoff only: money out in the budget months minus the budget, when
   * positive, else 0. Only the months that had a budget count, so a budget
   * set (or dropped) mid-year never flags the months without one.
   */
  over: number
  /** Same category over the comparison (scaled for an average); null without one. */
  compare: number | null
}

/** The comparison side of categoryRows: its lines and the factor to apply (1, or the average's scale). */
export interface CompareLines {
  lines: readonly Line[]
  scale: number
}

/**
 * Per category for one block over `current` (the period's lines). spend/oneoff:
 * money out and the limit; income: money in; pass: signed net. Sorted biggest
 * first. An auto category goes to income or spend by its total over the
 * period (or, when it has no rows in it, over the comparison), and its compare
 * value is signed for the block it landed in.
 */
export function categoryRows(
  current: readonly Line[],
  kind: Exclude<MoneyKind, 'auto'>,
  cmp: CompareLines | null,
): CategoryRow[] {
  const sign = kind === 'spend' || kind === 'oneoff' ? -1 : 1
  const nets = autoNets(current)
  const compareNets = cmp === null ? new Map<string, number>() : autoNets(cmp.lines)
  const kindOf = (l: Line) =>
    l.kind !== 'auto' ? l.kind : autoKind(nets.get(l.category) ?? compareNets.get(l.category) ?? 0)
  const acc = new Map<
    string,
    {
      value: number
      budget: number | null
      inBudget: number
      budgetMonths: string[]
      rowMonths: number
      compare: number
    }
  >()
  // A category that has rows in the period (or comparison) stays listed even when it nets to 0 (a loan repaid).
  const get = (c: string) => {
    let r = acc.get(c)
    if (!r) acc.set(c, (r = { value: 0, budget: null, inBudget: 0, budgetMonths: [], rowMonths: 0, compare: 0 }))
    return r
  }
  for (const l of current) {
    if (kindOf(l) !== kind) continue
    const r = get(l.category)
    r.value += sign * l.amount
    r.rowMonths++
    if (l.budget !== null) {
      r.budget = (r.budget ?? 0) + sign * l.budget
      r.inBudget += sign * l.amount
      r.budgetMonths.push(l.month)
    }
  }
  if (cmp !== null) {
    // Same placement rule as the period: the period's total first, the comparison's when absent.
    for (const l of cmp.lines) {
      const k = l.kind !== 'auto' ? l.kind : autoKind(nets.get(l.category) ?? compareNets.get(l.category)!)
      if (k === kind) get(l.category).compare += sign * l.amount
    }
  }
  return [...acc]
    .map(([category, r]) => ({
      category,
      value: r.value,
      budget: r.budget,
      budgetMonths: r.budgetMonths.sort(),
      rowMonths: r.rowMonths,
      over: sign < 0 && r.budget !== null && r.inBudget > r.budget ? r.inBudget - r.budget : 0,
      compare: cmp === null ? null : Math.round(r.compare * cmp.scale),
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
