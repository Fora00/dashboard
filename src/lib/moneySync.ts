import { db, type MoneyBudget, type MoneyBudgetChoice, type MoneyBudgetPick, type MoneyTotal } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { isMoneyKind, isMonthKey } from '../projects/money/moneyCsv'
import type { MoneyPayload } from '../projects/money/moneyLink'
import { planMoneyImport, type MoneyImportPlan } from '../projects/money/moneyDiff'
import { choiceFor, choicesForSave, planRuleSave, type BudgetConflict } from '../projects/money/moneyBudgets'

// Local-first sync for Soldi (owner-only), built on the generic engine in
// cloudSync.ts. Copied from src/lib/mealDiarySync.ts — see docs/NEW_PROJECT.md.
//
//   money_totals  one row per month and GreenBooks category, id
//                 `${YYYY-MM}:${category}`, amounts in integer cents. A mirror
//                 of ~/life/money/data/monthly-totals.csv: written only by the
//                 import link (applyMoneyImport), never edited by hand.
//   money_budgets         MO8: budget rules set on /soldi (category, cents per
//                         month, from/to month). Never touched by the import.
//   money_budget_choices  MO8: per `${YYYY-MM}:${category}`, which budget wins
//                         when GreenBooks and a rule disagree, with both values
//                         at pick time (see moneyBudgets.ts).
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

interface MoneyBudgetRow {
  id: string
  category: string
  monthly_cents: number
  from_month: string
  to_month: string | null
  updated_at: number
}

const budgetsTable: TableSync<MoneyBudget, MoneyBudgetRow> = {
  remote: 'money_budgets',
  table: () => db.moneyBudgets,
  columns: 'id, category, monthly_cents, from_month, to_month, updated_at',
  realtime: true,
  updatedAt: (b) => b.updatedAt,
  toRow: (b) => ({
    id: b.id,
    category: b.category,
    monthly_cents: b.monthly,
    from_month: b.from,
    to_month: b.to,
    updated_at: b.updatedAt,
  }),
  fromRow: (r) => {
    const to = r.to_month ?? null
    if (typeof r.category !== 'string' || !isMonthKey(r.from_month) || (to !== null && !isMonthKey(to)))
      throw new Error('money_budgets: bad row')
    return {
      id: r.id,
      category: r.category,
      monthly: Number(r.monthly_cents),
      from: r.from_month,
      to,
      updatedAt: Number(r.updated_at),
    }
  },
}

interface MoneyBudgetChoiceRow {
  id: string
  month: string
  category: string
  pick: string
  gb_cents: number
  dash_cents: number
  updated_at: number
}

const isPick = (v: unknown): v is MoneyBudgetPick => v === 'greenbooks' || v === 'dashboard'

const choicesTable: TableSync<MoneyBudgetChoice, MoneyBudgetChoiceRow> = {
  remote: 'money_budget_choices',
  table: () => db.moneyBudgetChoices,
  columns: 'id, month, category, pick, gb_cents, dash_cents, updated_at',
  realtime: true,
  updatedAt: (c) => c.updatedAt,
  toRow: (c) => ({
    id: c.id,
    month: c.month,
    category: c.category,
    pick: c.pick,
    gb_cents: c.gb,
    dash_cents: c.dash,
    updated_at: c.updatedAt,
  }),
  fromRow: (r) => {
    if (!isMonthKey(r.month) || typeof r.category !== 'string' || !isPick(r.pick))
      throw new Error('money_budget_choices: bad row')
    return {
      id: r.id,
      month: r.month,
      category: r.category,
      pick: r.pick,
      gb: Number(r.gb_cents),
      dash: Number(r.dash_cents),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'money',
  tables: [totalsTable, budgetsTable, choicesTable],
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

/**
 * Save a dashboard budget rule (MO8), offline or not: the category's other
 * rules are truncated, split or removed so none overlaps it (planRuleSave), and
 * the months it covers where GreenBooks has a different budget right now are
 * picked "dashboard" (saving from the sheet is that choice).
 */
export async function saveMoneyBudget(input: {
  category: string
  monthly: number
  from: string
  to: string | null
}): Promise<MoneyBudget> {
  const now = Date.now()
  const rule: MoneyBudget = { id: crypto.randomUUID(), ...input, updatedAt: now }
  return db.transaction('rw', [db.moneyBudgets, db.moneyBudgetChoices, db.moneyTotals, db.outbox], async () => {
    const existing = await db.moneyBudgets.where('category').equals(rule.category).toArray()
    const plan = planRuleSave(existing, rule, () => crypto.randomUUID())
    const rows = (await db.moneyTotals.toArray()).filter((t) => t.category === rule.category)
    await engine.upsertMany('money_budgets', plan.upserts)
    await engine.removeMany('money_budgets', plan.deletes)
    await engine.upsertMany('money_budget_choices', choicesForSave(rows, rule, now))
    return rule
  })
}

/** Remove a dashboard budget rule (its months fall back to GreenBooks or to no budget). */
export async function removeMoneyBudget(id: string): Promise<void> {
  await engine.remove('money_budgets', id)
}

/** Pick which budget wins for these conflicting months of one category, remembered with both values. */
export async function pickMoneyBudget(
  category: string,
  conflicts: readonly BudgetConflict[],
  pick: MoneyBudgetPick,
): Promise<void> {
  const now = Date.now()
  await engine.upsertMany(
    'money_budget_choices',
    conflicts.map((c) => choiceFor(c.month, category, pick, c.gb, c.dash, now)),
  )
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
