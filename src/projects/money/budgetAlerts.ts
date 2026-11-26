import type { MoneyBudget, MoneyBudgetChoice, MoneyTotal } from '../../lib/db'
import { applyBudgets } from './moneyBudgets'

// Soldi (MO12): this month's budget alerts, for the home, Life → Oggi and the
// top of /soldi. Pure, all in cents.
//
// Rule (owner, 2026-11-26: "al ritmo del mese"): a category with a budget this
// month alerts when it is already over, or when it spent more than its budget
// × days passed / days in the month. Days passed are counted at the data's
// date (the newest import of this month's rows), not today: the totals come
// in once a week, and comparing a week-old total with today's pace would hide
// fast months. Only money going out counts.

export interface BudgetAlert {
  category: string
  spent: number
  budget: number
  state: 'over' | 'fast'
  /** Budget × day / days: what the pace allowed by the data's date. */
  allowed: number
  /** Day of the month the data is from, and the month's length. */
  day: number
  days: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Alerts for the calendar month of `now`, over-budget first then by how far
 * past the pace. Empty when the month has no rows.
 */
export function budgetAlerts(
  totals: readonly MoneyTotal[],
  rules: readonly MoneyBudget[],
  choices: readonly MoneyBudgetChoice[],
  now: Date,
): BudgetAlert[] {
  const month = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
  const mine = totals.filter((t) => t.month === month)
  if (mine.length === 0) return []
  const asOf = new Date(Math.min(now.getTime(), Math.max(...mine.map((t) => t.updatedAt))))
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  // An import from before this month started (not expected) counts as day 1.
  const day = asOf.getFullYear() === now.getFullYear() && asOf.getMonth() === now.getMonth() ? asOf.getDate() : 1
  const { lines } = applyBudgets(mine, rules, choices, month)
  const out: BudgetAlert[] = []
  for (const l of lines) {
    if (l.budget === null || l.budget >= 0 || l.kind === 'income' || l.kind === 'pass') continue
    const budget = -l.budget
    const spent = Math.max(0, -l.amount)
    const allowed = Math.round((budget * day) / days)
    if (spent > budget) out.push({ category: l.category, spent, budget, state: 'over', allowed, day, days })
    else if (spent > allowed) out.push({ category: l.category, spent, budget, state: 'fast', allowed, day, days })
  }
  return out.sort(
    (a, b) =>
      (a.state === 'over' ? 0 : 1) - (b.state === 'over' ? 0 : 1) ||
      b.spent / b.budget - a.spent / a.budget ||
      a.category.localeCompare(b.category),
  )
}

/** "Ristoranti: 120 € su 100 € · sopra di 20 €" / "Spesa: 200 € su 300 € al giorno 12 su 30 · troppo veloce". */
export function alertText(a: BudgetAlert, euro: (c: number) => string): string {
  if (a.state === 'over')
    return `${a.category}: ${euro(a.spent)} su ${euro(a.budget)} · sopra di ${euro(a.spent - a.budget)}`
  return `${a.category}: ${euro(a.spent)} su ${euro(a.budget)} al giorno ${a.day} su ${a.days} · troppo veloce (ritmo ${euro(a.allowed)})`
}
