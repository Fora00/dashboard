import type { BalanceGroup } from '../../lib/db'
import { BALANCE_GROUPS } from './balancesCsv'
import { addMonths, monthsIn } from './moneyPeriod'
import { euro } from './moneyStats'

// Soldi Patrimonio (MO17): what /soldi/patrimonio shows, from the month-end
// balances on the device. Pure. Closed or zero accounts stay in every sum
// (they add 0, and they had a balance in the months they were open); only the
// per-account table hides an account whose balance is 0 in the month shown.

export interface BalanceRow {
  month: string
  account: string
  group: BalanceGroup
  balance: number // cents
}

export const GROUP_LABEL: Record<BalanceGroup, string> = {
  liquidita: 'liquidità',
  risparmi: 'risparmi',
  investimenti: 'investimenti',
}

/** Group colours (Tailwind classes): the dataviz skill's validated blue / aqua / violet, see BalancesChart.tsx. */
export const GROUP_FILL: Record<BalanceGroup, string> = {
  liquidita: 'fill-[#257de0] dark:fill-[#338ced]',
  risparmi: 'fill-[#00b894] dark:fill-[#00a888]',
  investimenti: 'fill-[#6a4ce2] dark:fill-[#9887ef]',
}
export const GROUP_BG: Record<BalanceGroup, string> = {
  liquidita: 'bg-[#257de0] dark:bg-[#338ced]',
  risparmi: 'bg-[#00b894] dark:bg-[#00a888]',
  investimenti: 'bg-[#6a4ce2] dark:bg-[#9887ef]',
}

export type GroupTotals = Record<BalanceGroup, number> & { total: number }

export function groupTotals(rows: readonly BalanceRow[]): GroupTotals {
  const t: GroupTotals = { liquidita: 0, risparmi: 0, investimenti: 0, total: 0 }
  for (const r of rows) {
    t[r.group] += r.balance
    t.total += r.balance
  }
  return t
}

/** Every month from the oldest to the newest with balances, gaps included, oldest first. */
export function balanceMonths(rows: readonly BalanceRow[]): string[] {
  if (rows.length === 0) return []
  let lo = rows[0]!.month
  let hi = lo
  for (const r of rows) {
    if (r.month < lo) lo = r.month
    if (r.month > hi) hi = r.month
  }
  return monthsIn({ from: lo, to: hi })
}

/** Per month: the group totals, or null for a month with no rows at all (a gap in the CSV). */
export function balanceHistory(rows: readonly BalanceRow[]): { month: string; totals: GroupTotals | null }[] {
  const byMonth = new Map<string, BalanceRow[]>()
  for (const r of rows) {
    const list = byMonth.get(r.month) ?? []
    list.push(r)
    byMonth.set(r.month, list)
  }
  return balanceMonths(rows).map((month) => {
    const list = byMonth.get(month)
    return { month, totals: list ? groupTotals(list) : null }
  })
}

export interface MonthSummary {
  now: GroupTotals
  /** The month before and 12 months before; null when that month has no rows. */
  prev: GroupTotals | null
  yearAgo: GroupTotals | null
}

export function monthSummary(rows: readonly BalanceRow[], month: string): MonthSummary {
  const of = (m: string) => {
    const list = rows.filter((r) => r.month === m)
    return list.length ? groupTotals(list) : null
  }
  return {
    now: of(month) ?? groupTotals([]),
    prev: of(addMonths(month, -1)),
    yearAgo: of(addMonths(month, -12)),
  }
}

export interface AccountRow {
  account: string
  group: BalanceGroup
  balance: number
  /** Change since the month before; null when the account had no row then (new account or a gap). */
  change: number | null
}

/** The accounts of `month`, by group (liquidità, risparmi, investimenti), then by balance, largest first. */
export function accountRows(rows: readonly BalanceRow[], month: string): AccountRow[] {
  const prevMonth = addMonths(month, -1)
  const prev = new Map(rows.filter((r) => r.month === prevMonth).map((r) => [r.account, r.balance]))
  const order = (g: BalanceGroup) => BALANCE_GROUPS.indexOf(g)
  return rows
    .filter((r) => r.month === month)
    .map((r) => {
      const before = prev.get(r.account)
      return {
        account: r.account,
        group: r.group,
        balance: r.balance,
        change: before === undefined ? null : r.balance - before,
      }
    })
    .sort((a, b) =>
      a.group !== b.group
        ? order(a.group) - order(b.group)
        : b.balance !== a.balance
          ? b.balance - a.balance
          : a.account < b.account
            ? -1
            : 1,
    )
}

/** "+1.234 €" / "−56 €" / "0 €", rounded to the euro, always signed. */
export function signedEuro(cents: number): string {
  const e = Math.round(cents / 100)
  if (e === 0) return euro(0)
  return `${e > 0 ? '+' : '−'}${euro(Math.abs(cents))}`
}
