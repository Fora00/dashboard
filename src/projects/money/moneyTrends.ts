import { periodLines, type Period } from './moneyPeriod'
import { autoKind, autoNets, keptOf, monthlyTotals, totalsOf, type Line, type Totals } from './moneyStats'

// Soldi (MO7): how spending moves over the whole history. Pure, all in cents.
// Spend here is the recurring spend (one-offs are spikes that hide the trend),
// plus the one-offs when the page's toggle says so. A month with no rows inside
// the history counts as 0 (nothing was booked).

export const WINDOWS = [3, 6, 12] as const
export type Window = (typeof WINDOWS)[number]

export const spendOf = (t: Totals | null, withOneoff: boolean) => (t ? t.spend + (withOneoff ? t.oneoff : 0) : 0)

/** Spend per month of `months` (contiguous, oldest first). */
export function spendSeries(lines: readonly Line[], months: readonly string[], withOneoff: boolean): number[] {
  if (months.length === 0) return []
  return monthlyTotals(lines, { from: months[0]!, to: months[months.length - 1]! }).map((t) => spendOf(t, withOneoff))
}

/** Trailing mean over `n` values; null until there are `n` of them. Rounded to the cent. */
export function movingAverage(values: readonly number[], n: number): (number | null)[] {
  let sum = 0
  return values.map((v, i) => {
    sum += v
    if (i >= n) sum -= values[i - n]!
    return i >= n - 1 ? Math.round(sum / n) : null
  })
}

/** Percent change (one decimal) of each value against the one 12 places before; null without both or when that one is 0. */
export function yearOnYear(values: readonly (number | null)[]): (number | null)[] {
  return values.map((v, i) => {
    const b = i >= 12 ? values[i - 12] : null
    if (v === null || b === null || b === undefined || b === 0) return null
    return Math.round(((v - b) / Math.abs(b)) * 1000) / 10
  })
}

/** "+3,4%", "-12%", "0%". */
export function pctLabel(p: number): string {
  const t = (Math.abs(p) >= 10 ? Math.round(p) : p).toLocaleString('it-IT', { maximumFractionDigits: 1 })
  return `${p > 0 ? '+' : ''}${t}%`
}

/** Messo da parte added up month after month (null months add 0). */
export function cumulativeKept(series: readonly (Totals | null)[]): number[] {
  let run = 0
  return series.map((t) => (run += t ? keptOf(t) : 0))
}

export interface Mover {
  category: string
  /** Spend over the last `n` months. */
  recent: number
  /** Spend over the `n` months before those. */
  before: number
  delta: number
  /** Percent change, null when `before` is 0. */
  pct: number | null
}

/**
 * Categories whose spend changed most: the last `n` months against the `n`
 * before. Only spend categories count (one-offs too with `withOneoff`); an
 * auto category counts when its total over the whole history is spend. null
 * when the history is shorter than 2n months.
 */
export function categoryMovers(
  lines: readonly Line[],
  months: readonly string[],
  n: number,
  withOneoff: boolean,
): { rising: Mover[]; falling: Mover[]; recent: Period; before: Period } | null {
  if (months.length < 2 * n) return null
  const end = months.length
  const recent = { from: months[end - n]!, to: months[end - 1]! }
  const before = { from: months[end - 2 * n]!, to: months[end - n - 1]! }
  const nets = autoNets(lines)
  const counts = (l: Line) => {
    const k = l.kind === 'auto' ? autoKind(nets.get(l.category)!) : l.kind
    return k === 'spend' || (withOneoff && k === 'oneoff')
  }
  const acc = new Map<string, { recent: number; before: number }>()
  const add = (ls: Line[], key: 'recent' | 'before') => {
    for (const l of ls) {
      if (!counts(l)) continue
      const r = acc.get(l.category) ?? { recent: 0, before: 0 }
      r[key] -= l.amount
      acc.set(l.category, r)
    }
  }
  add(periodLines(lines, recent), 'recent')
  add(periodLines(lines, before), 'before')
  const all: Mover[] = [...acc].map(([category, r]) => ({
    category,
    recent: r.recent,
    before: r.before,
    delta: r.recent - r.before,
    pct: r.before === 0 ? null : Math.round(((r.recent - r.before) / Math.abs(r.before)) * 100),
  }))
  const byName = (a: Mover, b: Mover) => a.category.localeCompare(b.category)
  return {
    rising: all.filter((m) => m.delta > 0).sort((a, b) => b.delta - a.delta || byName(a, b)),
    falling: all.filter((m) => m.delta < 0).sort((a, b) => a.delta - b.delta || byName(a, b)),
    recent,
    before,
  }
}

/** Totals over the whole history plus the monthly means. */
export function superTotal(lines: readonly Line[], monthCount: number): { total: Totals; perMonth: Totals } {
  const total = totalsOf(lines)
  const k = monthCount === 0 ? 0 : 1 / monthCount
  const r = (v: number) => Math.round(v * k)
  return {
    total,
    perMonth: { income: r(total.income), spend: r(total.spend), oneoff: r(total.oneoff), pass: r(total.pass) },
  }
}
