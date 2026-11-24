import type { MoneyTotal } from '../../lib/db'
import { lineKey } from './moneyCsv.ts'
import { monthsBetween, type MoneyPayload } from './moneyLink.ts'
import { emptyTotals, totalsOf, type Totals } from './moneyStats.ts'

// Soldi import preview and write plan. Pure: compares a link payload with the
// rows on the device and says, per month of the payload's range, what an
// import would do. The CSV is the source of truth: every month in from..to is
// replaced wholesale, so rows missing from the payload are deleted (a category
// or a whole month removed in GreenBooks). Months outside the range are never
// touched. Re-importing the same payload plans nothing (idempotent).

export type MonthStatus = 'added' | 'changed' | 'unchanged' | 'removed'

export interface MonthDiff {
  month: string
  status: MonthStatus
  before: Totals | null
  after: Totals | null
  /** Category rows that would be added / changed / deleted in this month. */
  added: number
  changed: number
  removed: number
}

export interface MoneyImportPlan {
  from: string
  to: string
  /** Only months with rows before or after; empty months on both sides are left out. */
  months: MonthDiff[]
  upserts: MoneyTotal[]
  deletes: string[]
  /** The whole range, before and after. */
  before: Totals
  after: Totals
}

const same = (a: MoneyTotal, b: Omit<MoneyTotal, 'id' | 'updatedAt'>) =>
  a.kind === b.kind && a.amount === b.amount && a.budget === b.budget && a.category === b.category

/** Plan an import. `now` stamps the rows that change (last-writer-wins). Never writes. */
export function planMoneyImport(payload: MoneyPayload, existing: readonly MoneyTotal[], now: number): MoneyImportPlan {
  const { from, to } = payload
  const stored = existing.filter((r) => r.month >= from && r.month <= to)
  const storedById = new Map(stored.map((r) => [r.id, r]))
  const incomingIds = new Set<string>()
  const upserts: MoneyTotal[] = []
  const perMonth = new Map<string, { added: number; changed: number; removed: number }>()
  const count = (m: string) => {
    let c = perMonth.get(m)
    if (!c) perMonth.set(m, (c = { added: 0, changed: 0, removed: 0 }))
    return c
  }

  for (const l of payload.lines) {
    const id = lineKey(l.month, l.category)
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

  const months: MonthDiff[] = []
  for (const month of monthsBetween(from, to)) {
    const b = stored.filter((r) => r.month === month)
    const a = payload.lines.filter((l) => l.month === month)
    if (b.length === 0 && a.length === 0) continue
    const c = perMonth.get(month) ?? { added: 0, changed: 0, removed: 0 }
    const status: MonthStatus =
      b.length === 0
        ? 'added'
        : a.length === 0
          ? 'removed'
          : c.added + c.changed + c.removed > 0
            ? 'changed'
            : 'unchanged'
    months.push({
      month,
      status,
      before: b.length ? totalsOf(b) : null,
      after: a.length ? totalsOf(a) : null,
      ...c,
    })
  }
  return {
    from,
    to,
    months,
    upserts,
    deletes,
    before: stored.length ? totalsOf(stored) : emptyTotals(),
    after: totalsOf(payload.lines),
  }
}
