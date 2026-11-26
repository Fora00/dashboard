import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { useToday } from '../../lib/useToday'
import { budgetAlerts, type BudgetAlert } from './budgetAlerts'

/** This month's budget alerts from Dexie (local-first); undefined while loading. */
export function useBudgetAlerts(): BudgetAlert[] | undefined {
  const today = useToday()
  return useLiveQuery(async () => {
    const [totals, rules, choices] = await Promise.all([
      db.moneyTotals.where('month').equals(today.slice(0, 7)).toArray(),
      db.moneyBudgets.toArray(),
      db.moneyBudgetChoices.toArray(),
    ])
    return budgetAlerts(totals, rules, choices, new Date())
  }, [today])
}
