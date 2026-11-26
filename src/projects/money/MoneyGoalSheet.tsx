import { useId, useState } from 'react'
import { confirm } from '../../lib/confirm'
import { clearMoneyGoal, setMoneyGoal } from '../../lib/moneySync'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { INPUT } from '../../components/field'
import { goalFor, parseRatePct, pctText, type GoalRow } from './moneyGoals'

// Soldi (MO13): the savings goal of one year, opened from the "messo da parte"
// tile on Grafici / Tabella when the period is a year. A rate of income kept;
// a year without its own goal inherits the latest earlier one, so the sheet
// says where an inherited goal comes from. Salva / Rimuovi work offline and
// signed out (Dexie first, the outbox syncs later).

interface Props {
  /** The year whose sheet is open, null when closed. */
  year: number | null
  onClose: () => void
  goals: readonly GoalRow[]
}

const NOTE = 'text-xs text-slate-500 dark:text-slate-400'

export function MoneyGoalSheet({ year, onClose, goals }: Props) {
  return (
    <Sheet open={year !== null} onClose={onClose} title={year !== null ? `Obiettivo ${year}` : 'Obiettivo'}>
      {year !== null && <SheetBody key={year} year={year} onClose={onClose} goals={goals} />}
    </Sheet>
  )
}

function SheetBody({ year, onClose, goals }: { year: number; onClose: () => void; goals: readonly GoalRow[] }) {
  const goal = goalFor(goals, year)
  const own = goal !== null && !goal.inherited
  const [value, setValue] = useState(goal ? pctText(goal.rateBp).replace('%', '') : '')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const id = useId()

  async function save() {
    const bp = parseRatePct(value)
    if (bp === null) {
      setError('Scrivi una percentuale da 0 a 100 (es. 30 o 27,5).')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await setMoneyGoal(year, bp)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!goal || goal.inherited) return
    const fallback = goalFor(
      goals.filter((g) => g.id !== String(year)),
      year,
    )
    const ok = await confirm({
      title: 'Rimuovere questo obiettivo?',
      body: `${pctText(goal.rateBp)} per il ${year}. ${
        fallback
          ? `Il ${year} userà quello del ${fallback.fromYear} (${pctText(fallback.rateBp)}).`
          : `Il ${year} resterà senza obiettivo.`
      }`,
      confirmLabel: 'Rimuovi',
      danger: true,
    })
    if (!ok) return
    setBusy(true)
    try {
      await clearMoneyGoal(year)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      aria-label={`Obiettivo ${year}`}
      className="space-y-4 pb-1 text-sm"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
    >
      <p className={NOTE} data-testid="money-goal-note">
        {goal?.inherited
          ? `Ereditato dal ${goal.fromYear}: ${pctText(goal.rateBp)}. Salvando, il ${year} avrà un obiettivo suo.`
          : own
            ? `Obiettivo del ${year}: ${pctText(goal.rateBp)}.`
            : `Nessun obiettivo per il ${year}.`}{' '}
        Vale anche per gli anni dopo finché non lo cambi.
      </p>
      <div>
        <label htmlFor={id} className={NOTE}>
          Messo da parte, in % delle entrate
        </label>
        <div className="mt-1 flex items-center gap-2">
          <div className="w-28">
            <input
              id={id}
              className={INPUT}
              inputMode="decimal"
              autoComplete="off"
              placeholder="30"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <span aria-hidden="true">%</span>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy}>
          Salva
        </Button>
        {own && (
          <Button type="button" variant="danger" disabled={busy} onClick={() => void remove()}>
            Rimuovi
          </Button>
        )}
      </div>
    </form>
  )
}
