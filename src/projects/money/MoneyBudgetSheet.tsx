import { useId, useState } from 'react'
import type { MoneyBudget } from '../../lib/db'
import { pickMoneyBudget, removeMoneyBudget, saveMoneyBudget } from '../../lib/moneySync'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { INPUT, SELECT } from '../../components/field'
import { MAX_ABS_CENTS, parseCents } from './moneyCsv'
import { addMonths, monthLabel } from './moneyPeriod'
import { centsText, type BudgetConflict } from './moneyBudgets'
import { euro, type Line } from './moneyStats'

// Soldi (MO8): the budget sheet of one category, opened by a tap on its row in
// "Uscite per categoria" or "Una tantum". Shows the GreenBooks budget over the
// shown period, the category's dashboard rules (Rimuovi each), a form for a new
// rule (Salva truncates an earlier overlapping rule and counts as "Usa
// dashboard" for the months it covers), and, when GreenBooks and the dashboard
// disagree in the period, those months with both values and the two picks.

interface Props {
  /** The category whose sheet is open, null when closed. */
  category: string | null
  onClose: () => void
  /** The shown period's label ("gen–nov 2026"). */
  periodLabel: string
  /** The category's rows in the shown period as imported (GreenBooks budgets untouched). */
  gbLines: readonly Line[]
  /** The category's dashboard rules. */
  rules: readonly MoneyBudget[]
  /** Unresolved conflicts of the category inside the shown period. */
  conflicts: readonly BudgetConflict[]
  /** Months with data, oldest first: the form offers these plus a year ahead. */
  months: readonly string[]
}

const NOTE = 'text-xs text-slate-500 dark:text-slate-400'
const H3 = 'mb-1 text-sm font-semibold'

/** Consecutive months with the same value as one run: "gen–mar 2026: 120 €". */
function runs(items: { month: string; value: number }[]): { from: string; to: string; value: number }[] {
  const out: { from: string; to: string; value: number }[] = []
  for (const it of items) {
    const last = out[out.length - 1]
    if (last && last.value === it.value && addMonths(last.to, 1) === it.month) last.to = it.month
    else out.push({ from: it.month, to: it.month, value: it.value })
  }
  return out
}

const range = (from: string, to: string) => (from === to ? monthLabel(from) : `${monthLabel(from)} – ${monthLabel(to)}`)

export function MoneyBudgetSheet(props: Props) {
  const { category, onClose } = props
  return (
    <Sheet open={category !== null} onClose={onClose} title={category ? `Budget · ${category}` : 'Budget'}>
      {category !== null && <SheetBody key={category} {...props} category={category} />}
    </Sheet>
  )
}

function SheetBody({ category, periodLabel, gbLines, rules, conflicts, months }: Props & { category: string }) {
  const newest = months[months.length - 1]!
  const options = [...months, ...Array.from({ length: 12 }, (_, i) => addMonths(newest, i + 1))]
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState(newest)
  const [to, setTo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const ids = { amount: useId(), from: useId(), to: useId() }

  const gb = runs(
    gbLines
      .filter((l) => l.budget !== null)
      .sort((a, b) => (a.month < b.month ? -1 : 1))
      .map((l) => ({ month: l.month, value: Math.abs(l.budget!) })),
  )
  const sorted = [...rules].sort((a, b) => (a.from < b.from ? -1 : 1))

  async function save() {
    const cents = parseCents(amount.replace(',', '.'))
    if (cents === null || cents <= 0 || cents > MAX_ABS_CENTS) {
      setError('Scrivi un importo in euro maggiore di zero (es. 120 o 85,50).')
      return
    }
    if (to !== '' && to < from) {
      setError('"Fino a" non può essere prima di "da".')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await saveMoneyBudget({ category, monthly: cents, from, to: to || null })
      setAmount('')
      setTo('')
    } finally {
      setBusy(false)
    }
  }

  async function pick(which: 'greenbooks' | 'dashboard') {
    setBusy(true)
    try {
      await pickMoneyBudget(category, conflicts, which)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5 text-sm">
      {conflicts.length > 0 && (
        <section aria-label="Conflitti" className="rounded-lg border border-orange-300 p-3 dark:border-orange-700">
          <h3 className={H3}>
            <span aria-hidden="true">⚠ </span>Conflitto: GreenBooks e dashboard non coincidono
          </h3>
          <p className={`${NOTE} mb-2`}>Finché non scegli si usa il budget di GreenBooks.</p>
          <ul className="mb-3 space-y-1" data-testid="money-budget-conflicts">
            {conflicts.map((c) => (
              <li key={c.month} className="flex flex-wrap justify-between gap-x-3 tabular-nums">
                <span>{monthLabel(c.month)}</span>
                <span>
                  GreenBooks {euro(Math.abs(c.gb))} · dashboard {euro(c.dash)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" disabled={busy} onClick={() => void pick('greenbooks')}>
              Usa GreenBooks
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => void pick('dashboard')}>
              Usa dashboard
            </Button>
          </div>
        </section>
      )}

      <section aria-label="Budget GreenBooks">
        <h3 className={H3}>GreenBooks · {periodLabel}</h3>
        {gb.length === 0 ? (
          <p className={NOTE}>Nessun budget GreenBooks nel periodo.</p>
        ) : (
          <ul className="space-y-0.5 tabular-nums">
            {gb.map((r) => (
              <li key={r.from} className="flex justify-between gap-3">
                <span>{range(r.from, r.to)}</span>
                <span>{euro(r.value)} al mese</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Budget dashboard">
        <h3 className={H3}>Budget dashboard</h3>
        {sorted.length === 0 ? (
          <p className={NOTE}>Nessun budget impostato qui.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800" data-testid="money-budget-rules">
            {sorted.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-1">
                <span className="tabular-nums">
                  {euro(r.monthly)}/mese · da {monthLabel(r.from)}
                  {r.to ? ` fino a ${monthLabel(r.to)}` : ''}
                </span>
                <Button
                  variant="danger"
                  disabled={busy}
                  aria-label={`Rimuovi ${centsText(r.monthly)} € da ${monthLabel(r.from)}`}
                  onClick={() => void removeMoneyBudget(r.id)}
                >
                  Rimuovi
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        aria-label="Nuovo budget"
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <h3 className={H3}>Nuovo budget dashboard</h3>
        <div>
          <label htmlFor={ids.amount} className={NOTE}>
            Importo al mese (€)
          </label>
          <input
            id={ids.amount}
            className={`${INPUT} mt-1`}
            inputMode="decimal"
            autoComplete="off"
            placeholder="120"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label htmlFor={ids.from} className={NOTE}>
              Da mese
            </label>
            <select
              id={ids.from}
              className={`${SELECT} mt-1 block w-40`}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {[...options].reverse().map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={ids.to} className={NOTE}>
              Fino a (facoltativo)
            </label>
            <select
              id={ids.to}
              className={`${SELECT} mt-1 block w-40`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">nessun limite</option>
              {[...options]
                .reverse()
                .filter((m) => m >= from)
                .map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <p className={NOTE}>
          Un budget che inizia dentro uno precedente lo chiude al mese prima. Salvare vale come "Usa dashboard" per i
          mesi coperti.
        </p>
        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">
          Salva
        </Button>
      </form>
      <div className="pb-1" />
    </div>
  )
}
