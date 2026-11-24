import { db, type MoneyTotal } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { isMoneyKind, isMonthKey } from '../projects/money/moneyCsv'
import type { MoneyPayload } from '../projects/money/moneyLink'
import { planMoneyImport, type MoneyImportPlan } from '../projects/money/moneyDiff'

// Local-first sync for Soldi (owner-only), built on the generic engine in
// cloudSync.ts. Copied from src/lib/mealDiarySync.ts — see docs/NEW_PROJECT.md.
//
//   money_totals  one row per month and GreenBooks category, id
//                 `${YYYY-MM}:${category}`, amounts in integer cents. A mirror
//                 of ~/life/money/data/monthly-totals.csv: written only by the
//                 import link (applyMoneyImport), never edited by hand.
//
// Remote access is is_owner() only (see the migration, same model as Life): on
// a guest's device every push is rejected with 42501 and dead-lettered by the
// engine, which keeps the local row.

interface MoneyTotalRow {
  id: string
  month: string
  category: string
  kind: string
  amount_cents: number
  budget_cents: number | null
  updated_at: number
}

const totalsTable: TableSync<MoneyTotal, MoneyTotalRow> = {
  remote: 'money_totals',
  table: () => db.moneyTotals,
  columns: 'id, month, category, kind, amount_cents, budget_cents, updated_at',
  realtime: true,
  updatedAt: (t) => t.updatedAt,
  toRow: (t) => ({
    id: t.id,
    month: t.month,
    category: t.category,
    kind: t.kind,
    amount_cents: t.amount,
    budget_cents: t.budget,
    updated_at: t.updatedAt,
  }),
  fromRow: (r) => {
    if (!isMonthKey(r.month) || !isMoneyKind(r.kind) || typeof r.category !== 'string')
      throw new Error('money_totals: bad row')
    return {
      id: r.id,
      month: r.month,
      category: r.category,
      kind: r.kind,
      amount: Number(r.amount_cents),
      budget: r.budget_cents === null || r.budget_cents === undefined ? null : Number(r.budget_cents),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'money',
  tables: [totalsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/**
 * Apply an import link on an explicit tap: re-plans against Dexie right now
 * (never from a stale preview) and, in one transaction, upserts the rows that
 * are new or changed and deletes the rows of the covered months that the
 * payload no longer has. Idempotent: a second run plans nothing.
 */
export async function applyMoneyImport(payload: MoneyPayload): Promise<MoneyImportPlan> {
  return db.transaction('rw', db.moneyTotals, db.outbox, async () => {
    const plan = planMoneyImport(payload, await db.moneyTotals.toArray(), Date.now())
    await engine.upsertMany('money_totals', plan.upserts)
    await engine.removeMany('money_totals', plan.deletes)
    return plan
  })
}

// --- Sync engine ------------------------------------------------------------
export const flush = engine.flush
export const syncNow = engine.syncNow

/** The engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine
/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)
/** Start syncing (call when a session exists). Returns a stop function. */
export const startMoneySync = engine.start
