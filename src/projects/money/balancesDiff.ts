import type { MoneyBalance } from '../../lib/db'
import { balanceKey, type BalanceLine } from './balancesCsv.ts'
import type { BalancesPayload } from './balancesLink.ts'
import { monthsBetween } from './moneyLink.ts'

// Soldi Patrimonio (MO17) import preview and write plan. Pure: compares a link
// payload with the balances on the device and says, per month of the payload's
// range, what an import would do. Same rules as moneyDiff.ts: the CSV is the
// source of truth, every month in from..to is replaced wholesale (accounts
// missing from the payload are deleted), months outside the range are never
// touched, and re-importing the same payload plans nothing (idempotent).

export type BalanceMonthStatus = 'added' | 'changed' | 'unchanged' | 'removed'

export interface BalanceMonthDiff {
  month: string
  status: BalanceMonthStatus
  /** Sum of all balances that month (cents), before and after; null when the month has no rows. */
  before: number | null
  after: number | null
  /** Account rows that would be added / changed / deleted in this month. */
  added: number
  changed: number
  removed: number
}

export interface BalancesImportPlan {
  from: string
  to: string
  /** Only months with rows before or after; empty months on both sides are left out. */
  months: BalanceMonthDiff[]
  upserts: MoneyBalance[]
  deletes: string[]
}

const same = (a: MoneyBalance, b: BalanceLine) =>
  a.group === b.group && a.balance === b.balance && a.account === b.account
const sum = (rows: readonly { balance: number }[]) => rows.reduce((s, r) => s + r.balance, 0)

/** Plan an import. `now` stamps the rows that change (last-writer-wins). Never writes. */
export function planBalancesImport(
  payload: BalancesPayload,
  existing: readonly MoneyBalance[],
  now: number,
): BalancesImportPlan {
  const { from, to } = payload
  const stored = existing.filter((r) => r.month >= from && r.month <= to)
  const storedById = new Map(stored.map((r) => [r.id, r]))
  const incomingIds = new Set<string>()
  const upserts: MoneyBalance[] = []
  const perMonth = new Map<string, { added: number; changed: number; removed: number }>()
  const count = (m: string) => {
    let c = perMonth.get(m)
    if (!c) perMonth.set(m, (c = { added: 0, changed: 0, removed: 0 }))
    return c
  }

  for (const l of payload.lines) {
    const id = balanceKey(l.month, l.account)
    incomingIds.add(id)
    const old = storedById.get(id)
    if (old && same(old, l)) continue
    count(l.month)[old ? 'changed' : 'added']++
    upserts.push({ id, ...l, updatedAt: now })
  }
  const deletes: string[] = []
  for (const r of stored)
    if (!incomingIds.has(r.id)) {
      deletes.push(r.id)
      count(r.month).removed++
    }

  const months: BalanceMonthDiff[] = []
  for (const month of monthsBetween(from, to)) {
    const b = stored.filter((r) => r.month === month)
    const a = payload.lines.filter((l) => l.month === month)
    if (b.length === 0 && a.length === 0) continue
    const c = perMonth.get(month) ?? { added: 0, changed: 0, removed: 0 }
    const status: BalanceMonthStatus =
      b.length === 0
        ? 'added'
        : a.length === 0
          ? 'removed'
          : c.added + c.changed + c.removed > 0
            ? 'changed'
            : 'unchanged'
    months.push({ month, status, before: b.length ? sum(b) : null, after: a.length ? sum(a) : null, ...c })
  }
  return { from, to, months, upserts, deletes }
}
