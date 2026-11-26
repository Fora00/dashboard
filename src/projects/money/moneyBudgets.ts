import type { MoneyBudget, MoneyBudgetChoice, MoneyKind } from '../../lib/db'
import { MAX_ABS_CENTS, MAX_CATEGORY_LENGTH, isMonthKey, lineKey, parseCents, splitCsv } from './moneyCsv.ts'
import { addMonths } from './moneyPeriod.ts'

// Soldi (MO8): budgets set from the dashboard on top of the GreenBooks budgets
// that arrive with the CSV (Line.budget). Pure: no React, no Dexie, loadable by
// plain node (scripts/life-money-budgets.ts uses the CSV part).
//
// A dashboard rule is "category, amount per month, from month, optional to
// month" (MoneyBudget; monthly is positive cents). For each (month, category):
//   - only GreenBooks: its budget; only a rule: the rule, signed like the rows
//     (negative for anything but an income category);
//   - both and equal: that value, no conflict;
//   - both and different: a conflict. The owner's pick (MoneyBudgetChoice)
//     decides, as long as both values are still the ones stored with the pick;
//     otherwise (no pick, or a stale one) GreenBooks is used and the month is
//     listed in `conflicts`.
// A rule also applies in a month that has data but no row for the category: a
// zero-amount line carries it, so the budget shows (and counts) there too.

export type BudgetSource = 'greenbooks' | 'dashboard'

/** The minimum a line needs here (moneyStats' Line, or a stored MoneyTotal). */
export interface BudgetLine {
  month: string
  category: string
  kind: MoneyKind
  amount: number
  budget: number | null
}

export type BudgetedLine<T extends BudgetLine = BudgetLine> = T & {
  /** Where the effective budget came from, null when there is none. */
  budgetFrom: BudgetSource | null
  /** GreenBooks and the dashboard disagree and no current pick says which wins (GreenBooks used). */
  conflict: boolean
}

export interface BudgetConflict {
  month: string
  /** The GreenBooks budget, signed as in the CSV. */
  gb: number
  /** The dashboard rule's monthly amount, positive. */
  dash: number
}

/** Budgets are signed like the rows: + for an income category, - for everything else. */
export const budgetSign = (kind: MoneyKind): 1 | -1 => (kind === 'income' ? 1 : -1)

/** The rule of `category` that covers `month` (the newest one if a sync race left two). */
export function ruleAt(rules: readonly MoneyBudget[], category: string, month: string): MoneyBudget | null {
  let best: MoneyBudget | null = null
  for (const r of rules) {
    if (r.category !== category || r.from > month || (r.to !== null && r.to < month)) continue
    if (!best || r.updatedAt > best.updatedAt) best = r
  }
  return best
}

/** A pick still applies only while both values are the ones it was made against. */
export function choiceApplies(c: MoneyBudgetChoice | undefined, gb: number, dash: number): c is MoneyBudgetChoice {
  return c !== undefined && c.gb === gb && c.dash === dash
}

/**
 * Lines with `budget` replaced by the effective one, plus a zero-amount line
 * per (month with data ≤ newestMonth, category with a rule there but no row),
 * and the unresolved conflicts per category (months ascending).
 */
export function applyBudgets<T extends BudgetLine>(
  lines: readonly T[],
  rules: readonly MoneyBudget[],
  choices: readonly MoneyBudgetChoice[],
  newestMonth: string,
): { lines: BudgetedLine<BudgetLine>[]; conflicts: Map<string, BudgetConflict[]> } {
  const conflicts = new Map<string, BudgetConflict[]>()
  if (rules.length === 0) {
    return {
      lines: lines.map((l) => ({ ...l, budgetFrom: l.budget === null ? null : 'greenbooks', conflict: false })),
      conflicts,
    }
  }
  const picks = new Map(choices.map((c) => [c.id, c]))
  const kindOf = new Map<string, MoneyKind>()
  const months = new Set<string>()
  const have = new Set<string>()
  for (const l of lines) {
    if (!kindOf.has(l.category)) kindOf.set(l.category, l.kind)
    if (l.month <= newestMonth) months.add(l.month)
    have.add(lineKey(l.month, l.category))
  }
  const out: BudgetedLine<BudgetLine>[] = lines.map((l) => {
    const rule = l.month <= newestMonth ? ruleAt(rules, l.category, l.month) : null
    if (!rule) return { ...l, budgetFrom: l.budget === null ? null : 'greenbooks', conflict: false }
    const dash = budgetSign(l.kind) * rule.monthly
    if (l.budget === null || l.budget === dash) return { ...l, budget: dash, budgetFrom: 'dashboard', conflict: false }
    const pick = picks.get(lineKey(l.month, l.category))
    if (choiceApplies(pick, l.budget, rule.monthly)) {
      return pick.pick === 'dashboard'
        ? { ...l, budget: dash, budgetFrom: 'dashboard', conflict: false }
        : { ...l, budgetFrom: 'greenbooks', conflict: false }
    }
    let list = conflicts.get(l.category)
    if (!list) conflicts.set(l.category, (list = []))
    list.push({ month: l.month, gb: l.budget, dash: rule.monthly })
    return { ...l, budgetFrom: 'greenbooks', conflict: true }
  })
  // Zero rows: a month with data where a rule applies but the category moved no money.
  const categories = new Set(rules.map((r) => r.category))
  for (const month of [...months].sort()) {
    for (const category of categories) {
      if (have.has(lineKey(month, category))) continue
      const rule = ruleAt(rules, category, month)
      if (!rule) continue
      const kind = kindOf.get(category) ?? 'spend'
      out.push({
        month,
        category,
        kind,
        amount: 0,
        budget: budgetSign(kind) * rule.monthly,
        budgetFrom: 'dashboard',
        conflict: false,
      })
    }
  }
  for (const list of conflicts.values()) list.sort((a, b) => (a.month < b.month ? -1 : 1))
  return { lines: out, conflicts }
}

// --- Saving a rule -----------------------------------------------------------------

/**
 * What saving `rule` does to the category's other rules, so that no two
 * overlap: one that starts before it and runs into it ends the month before;
 * one inside it is removed; one that starts inside it and runs past its end
 * starts the month after; one that covers it on both sides is split in two
 * (the part after gets a new id from `newId`). `upserts` holds the new rule
 * too. Everything written gets rule.updatedAt.
 */
export function planRuleSave(
  existing: readonly MoneyBudget[],
  rule: MoneyBudget,
  newId: () => string,
): { upserts: MoneyBudget[]; deletes: string[] } {
  const upserts: MoneyBudget[] = [rule]
  const deletes: string[] = []
  const end = rule.to ?? '9999-12'
  const at = rule.updatedAt
  for (const r of existing) {
    if (r.id === rule.id || r.category !== rule.category) continue
    const rEnd = r.to ?? '9999-12'
    if (rEnd < rule.from || r.from > end) continue // no overlap
    const before = r.from < rule.from
    const after = rEnd > end
    if (before && after) {
      upserts.push({ ...r, to: addMonths(rule.from, -1), updatedAt: at })
      upserts.push({ ...r, id: newId(), from: addMonths(end, 1), updatedAt: at })
    } else if (before) upserts.push({ ...r, to: addMonths(rule.from, -1), updatedAt: at })
    else if (after) upserts.push({ ...r, from: addMonths(end, 1), updatedAt: at })
    else deletes.push(r.id)
  }
  return { upserts, deletes }
}

/**
 * The picks that saving `rule` implies: "dashboard" for every month it covers
 * where GreenBooks has a different budget right now (`gbLines`: the
 * category's stored rows).
 */
export function choicesForSave(
  gbLines: readonly BudgetLine[],
  rule: Pick<MoneyBudget, 'category' | 'monthly' | 'from' | 'to'>,
  updatedAt: number,
): MoneyBudgetChoice[] {
  const out: MoneyBudgetChoice[] = []
  for (const l of gbLines) {
    if (l.category !== rule.category || l.budget === null) continue
    if (l.month < rule.from || (rule.to !== null && l.month > rule.to)) continue
    if (l.budget === budgetSign(l.kind) * rule.monthly) continue
    out.push(choiceFor(l.month, l.category, 'dashboard', l.budget, rule.monthly, updatedAt))
  }
  return out
}

export function choiceFor(
  month: string,
  category: string,
  pick: MoneyBudgetChoice['pick'],
  gb: number,
  dash: number,
  updatedAt: number,
): MoneyBudgetChoice {
  return { id: lineKey(month, category), month, category, pick, gb, dash, updatedAt }
}

// --- Export to ~/life (CSV) ----------------------------------------------------------

export const BUDGETS_HEADER = ['category', 'monthly', 'from', 'to', 'updated'] as const

/** One exported rule: monthly in cents, updated as an ISO date (YYYY-MM-DD). */
export interface BudgetCsvRow {
  category: string
  monthly: number
  from: string
  to: string | null
  updated: string
}

/** 12345 → "123.45" (positive cents, string arithmetic). */
export function centsText(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const a = Math.abs(cents)
  return `${sign}${Math.floor(a / 100)}.${String(a % 100).padStart(2, '0')}`
}

const csvField = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

function sortRows<T extends { category: string; from: string }>(rows: T[]): T[] {
  return rows.sort((a, b) =>
    a.category === b.category ? (a.from < b.from ? -1 : 1) : a.category < b.category ? -1 : 1,
  )
}

/** The CSV text of these rows, sorted by category then from, newline-terminated. */
export function budgetsCsvText(rows: readonly BudgetCsvRow[]): string {
  const lines = sortRows([...rows]).map((r) =>
    [csvField(r.category), centsText(r.monthly), r.from, r.to ?? '', r.updated].join(','),
  )
  return [BUDGETS_HEADER.join(','), ...lines].join('\n') + '\n'
}

/** The CSV the "Copia budget per ~/life" button copies. */
export function budgetsCsv(rules: readonly MoneyBudget[]): string {
  return budgetsCsvText(
    rules.map((r) => ({
      category: r.category,
      monthly: r.monthly,
      from: r.from,
      to: r.to,
      updated: new Date(r.updatedAt).toISOString().slice(0, 10),
    })),
  )
}

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

export type BudgetsParse = { ok: true; rows: BudgetCsvRow[] } | { ok: false; errors: string[] }

/** Parse and validate the copied budgets CSV (the reverse of budgetsCsvText). Errors are reported, never skipped. */
export function parseBudgetsCsv(text: string): BudgetsParse {
  const rows = splitCsv(text.replace(/^﻿/, ''))
  const header = rows[0]?.map((h) => h.trim())
  if (!header || header.join(',') !== BUDGETS_HEADER.join(','))
    return { ok: false, errors: [`The first line must be: ${BUDGETS_HEADER.join(',')}`] }
  const errors: string[] = []
  const out: BudgetCsvRow[] = []
  rows.slice(1).forEach((cells, i) => {
    const p = `line ${i + 2}`
    if (cells.length !== BUDGETS_HEADER.length) {
      errors.push(`${p}: ${cells.length} columns, expected ${BUDGETS_HEADER.length}`)
      return
    }
    const [category, monthly, from, to, updated] = cells.map((c) => c.trim()) as [
      string,
      string,
      string,
      string,
      string,
    ]
    const before = errors.length
    if (!category) errors.push(`${p}: category is empty`)
    else if (category.length > MAX_CATEGORY_LENGTH) errors.push(`${p}: category is too long`)
    const cents = parseCents(monthly)
    if (cents === null || cents <= 0 || cents > MAX_ABS_CENTS)
      errors.push(`${p}: monthly "${monthly}" must be a positive amount in euros with at most 2 decimals`)
    if (!isMonthKey(from)) errors.push(`${p}: from "${cells[2]!.trim()}" must be YYYY-MM`)
    if (to !== '' && !isMonthKey(to)) errors.push(`${p}: to "${cells[3]!.trim()}" must be empty or YYYY-MM`)
    else if (to !== '' && isMonthKey(from) && to < from) errors.push(`${p}: to ${to} is before from ${from}`)
    if (!DATE_RE.test(updated)) errors.push(`${p}: updated "${updated}" must be YYYY-MM-DD`)
    if (errors.length === before) out.push({ category, monthly: cents!, from, to: to || null, updated })
  })
  if (errors.length === 0) {
    const sorted = sortRows(out)
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1]!
      const b = sorted[i]!
      if (a.category === b.category && (a.to === null || a.to >= b.from))
        errors.push(`"${b.category}": the rule from ${b.from} overlaps the one from ${a.from}`)
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, rows: sortRows(out) }
}
