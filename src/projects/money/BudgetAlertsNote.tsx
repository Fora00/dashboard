import { Link } from 'react-router-dom'
import { alertText, type BudgetAlert } from './budgetAlerts'
import { euro } from './moneyStats'
import { useBudgetAlerts } from './useBudgetAlerts'

// MO12: this month's budget alerts as a short list (▲ over, ⏩ too fast: text
// and symbol, never colour alone). Renders nothing when there is nothing to
// say. `link` adds "Apri Soldi" (for Life → Oggi); /soldi passes its own list.

export function BudgetAlertsList({ alerts, link = false }: { alerts: readonly BudgetAlert[]; link?: boolean }) {
  if (alerts.length === 0) return null
  return (
    <section
      aria-label="Budget del mese"
      className="mb-6 rounded-xl border border-orange-300/70 bg-orange-50/60 px-4 py-3 text-sm dark:border-orange-400/30 dark:bg-orange-400/5"
      data-testid="money-alerts"
    >
      <h2 className="mb-1 font-medium text-orange-800 dark:text-orange-300">💶 Budget del mese</h2>
      <ul className="space-y-0.5 text-slate-700 dark:text-slate-200">
        {alerts.map((a) => (
          <li key={a.category}>
            <span aria-hidden="true">{a.state === 'over' ? '▲ ' : '⏩ '}</span>
            {alertText(a, euro)}
          </li>
        ))}
      </ul>
      {link && (
        <Link to="/soldi" className="mt-1 inline-flex min-h-10 items-center font-medium underline underline-offset-2">
          Apri Soldi
        </Link>
      )}
    </section>
  )
}

/** Self-loading version for pages outside Soldi. */
export function BudgetAlertsNote({ link = true }: { link?: boolean }) {
  const alerts = useBudgetAlerts()
  return alerts ? <BudgetAlertsList alerts={alerts} link={link} /> : null
}
