import { Stat } from '../../components/Stat'
import { MONTHS_IT } from './moneyPeriod'
import { projectedKept, type YearProjection } from './moneyProjection'
import { euro, keptOf, outOf } from './moneyStats'
import { goalProjectionText, type YearGoal } from './moneyGoals'

// MO11: the year-end projection as three tiles (≈ entrate, uscite, messo da
// parte a dicembre) and one line on how it was made. `compact` = one line, for
// under the tiles on Grafici. With a savings goal (MO13), one more line: the
// projected rate in December against it.

function GoalLine({ p, goal }: { p: YearProjection; goal: YearGoal | null | undefined }) {
  if (!goal) return null
  return (
    <span className="block text-sm text-slate-600 dark:text-slate-300" data-testid="money-projection-goal">
      {goalProjectionText(p, goal)}
    </span>
  )
}

const METHOD: Record<YearProjection['method'], string> = {
  seasonal: 'stessi mesi dell’anno scorso, corretti per il ritmo degli ultimi mesi',
  mixed: 'stessi mesi dell’anno scorso dove ci sono, altrimenti media degli ultimi mesi',
  average: 'media degli ultimi mesi',
}

export function ProjectionCard({
  p,
  window,
  compact = false,
  goal,
}: {
  p: YearProjection
  window: number
  compact?: boolean
  /** The savings goal that applies to the projected year (MO13). */
  goal?: YearGoal | null
}) {
  const through = MONTHS_IT[Number(p.through.slice(5, 7)) - 1]
  const how = `Dati fino a ${through}, ${p.remaining} ${p.remaining === 1 ? 'mese stimato' : 'mesi stimati'} (${METHOD[p.method]}, finestra ${window} mesi), senza nuove una tantum.`
  if (compact) {
    return (
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" data-testid="money-projection">
        A dicembre, a questo ritmo: messo da parte ≈ <strong className="tabular-nums">{euro(projectedKept(p))}</strong>{' '}
        <span className="text-xs text-slate-500 dark:text-slate-400">
          (entrate ≈ {euro(p.total.income)}, uscite ≈ {euro(outOf(p.total))}). {how}
        </span>
        <GoalLine p={p} goal={goal} />
      </p>
    )
  }
  const rate = p.total.income > 0 ? Math.round((keptOf(p.total) / p.total.income) * 100) : null
  return (
    <div data-testid="money-projection">
      <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
        <Stat label="entrate a dicembre" value={`≈ ${euro(p.total.income)}`} sub={`finora ${euro(p.done.income)}`} />
        <Stat label="uscite a dicembre" value={`≈ ${euro(outOf(p.total))}`} sub={`finora ${euro(outOf(p.done))}`} />
        <Stat
          label={`messo da parte${rate !== null ? ` · ${rate}%` : ''}`}
          value={`≈ ${euro(projectedKept(p))}`}
          sub={`finora ${euro(keptOf(p.done))}`}
        />
      </div>
      {goal && (
        <p className="mt-2">
          <GoalLine p={p} goal={goal} />
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{how}</p>
    </div>
  )
}
