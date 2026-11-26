import {
  db,
  type MoneyBalance,
  type MoneyBudget,
  type MoneyBudgetChoice,
  type MoneyBudgetPick,
  type MoneyGoal,
  type MoneyTotal,
} from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { isMoneyKind, isMonthKey } from '../projects/money/moneyCsv'
import type { MoneyPayload } from '../projects/money/moneyLink'
import { planMoneyImport, type MoneyImportPlan } from '../projects/money/moneyDiff'
import { choiceFor, choicesForSave, planRuleSave, type BudgetConflict } from '../projects/money/moneyBudgets'
import { MAX_RATE_BP } from '../projects/money/moneyGoals'
import { isBalanceGroup } from '../projects/money/balancesCsv'
import type { BalancesPayload } from '../projects/money/balancesLink'
import { planBalancesImport, type BalancesImportPlan } from '../projects/money/balancesDiff'

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
//   money_goals           MO13: the savings goal per year, id 'YYYY', a rate of
//                         income kept in basis points. A year without a row
//                         inherits the latest earlier one (moneyGoals.ts).
//   money_balances        MO17: one row per month and GreenBooks account, id
//                         `${YYYY-MM}:${account}`, the month-end balance in
//                         cents and the account's group. A mirror of
//                         ~/life/money/data/account-balances.csv: written only
//                         by the import link (applyBalancesImport).
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

interface MoneyGoalRow {
  id: string
  rate_bp: number
  updated_at: number
}

const isYearKey = (v: unknown): v is string => typeof v === 'string' && /^[0-9]{4}$/.test(v)
const isRateBp = (v: number) => Number.isInteger(v) && v >= 0 && v <= MAX_RATE_BP

const goalsTable: TableSync<MoneyGoal, MoneyGoalRow> = {
  remote: 'money_goals',
  table: () => db.moneyGoals,
  columns: 'id, rate_bp, updated_at',
  realtime: true,
  updatedAt: (g) => g.updatedAt,
  toRow: (g) => ({ id: g.id, rate_bp: g.rateBp, updated_at: g.updatedAt }),
  fromRow: (r) => {
    const rateBp = Number(r.rate_bp)
    if (!isYearKey(r.id) || !isRateBp(rateBp)) throw new Error('money_goals: bad row')
    return { id: r.id, rateBp, updatedAt: Number(r.updated_at) }
  },
}

interface MoneyBalanceRow {
  id: string
  month: string
  account: string
  grp: string
  balance_cents: number
  updated_at: number
}

const balancesTable: TableSync<MoneyBalance, MoneyBalanceRow> = {
  remote: 'money_balances',
  table: () => db.moneyBalances,
  columns: 'id, month, account, grp, balance_cents, updated_at',
  realtime: true,
  updatedAt: (b) => b.updatedAt,
  toRow: (b) => ({
    id: b.id,
    month: b.month,
    account: b.account,
    grp: b.group,
    balance_cents: b.balance,
    updated_at: b.updatedAt,
  }),
  fromRow: (r) => {
    if (!isMonthKey(r.month) || !isBalanceGroup(r.grp) || typeof r.account !== 'string')
      throw new Error('money_balances: bad row')
    return {
      id: r.id,
      month: r.month,
      account: r.account,
      group: r.grp,
      balance: Number(r.balance_cents),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'money',
  tables: [totalsTable, budgetsTable, choicesTable, goalsTable, balancesTable],
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
 * Apply a Patrimonio import link (MO17) on an explicit tap, exactly like
 * applyMoneyImport: re-plans against Dexie now, then in one transaction
 * upserts the new or changed balances and deletes the covered months' rows
 * the payload no longer has. Idempotent: a second run plans nothing.
 */
export async function applyBalancesImport(payload: BalancesPayload): Promise<BalancesImportPlan> {
  return db.transaction('rw', db.moneyBalances, db.outbox, async () => {
    const plan = planBalancesImport(payload, await db.moneyBalances.toArray(), Date.now())
    await engine.upsertMany('money_balances', plan.upserts)
    await engine.removeMany('money_balances', plan.deletes)
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

/**
 * Set the savings goal of `year` (MO13), offline or not: a rate of income kept,
 * in basis points (3000 = 30%). Later years without their own goal inherit it.
 */
export async function setMoneyGoal(year: number, rateBp: number): Promise<MoneyGoal> {
  const id = String(year)
  if (!isYearKey(id) || !isRateBp(rateBp)) throw new Error('setMoneyGoal: bad year or rate')
  const goal: MoneyGoal = { id, rateBp, updatedAt: Date.now() }
  await engine.upsert('money_goals', goal)
  return goal
}

/** Remove the goal of `year`: it falls back to the latest earlier year's goal, or none. */
export async function clearMoneyGoal(year: number): Promise<void> {
  await engine.remove('money_goals', String(year))
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
