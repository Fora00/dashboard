import { useState } from 'react'
import { FOCUS_RING } from '../../components/focus'
import { budgetMonthsLabel, euro, type CategoryRow } from './moneyStats'

// Spent vs budget per category over the selected period: a bar for what went
// out, a dark tick at the budget, and the over-budget part in orange with a ▲
// and the amount (never colour alone). A budget that covered only some months
// says which ("budget ott–nov"), and only those months count towards the ▲. One scale per block, so one-offs (big,
// rare) get their own block and don't flatten the recurring spend.
// MO8: with `onOpen`, the row's top line is a button that opens the
// category's budget sheet; `flags` marks "budget dashboard" and "⚠ conflitto"
// (text, never colour alone).

const FIRST = 12

interface Props {
  rows: CategoryRow[]
  /** Short label of the comparison ("2025", "media"), null without one. */
  compareLabel: string | null
  /** The period crosses a year end: budget months carry their year. */
  multiYear?: boolean
  /** Shown when there are no rows. */
  empty: string
  /** Per category: a dashboard budget applies in the period / an unresolved conflict there. */
  flags?: ReadonlyMap<string, { dashboard: boolean; conflict: boolean }>
  /** Tap on a category: open its budget sheet. */
  onOpen?: (category: string) => void
}

export function MoneyCategories({ rows, compareLabel, multiYear = false, empty, flags, onOpen }: Props) {
  const [all, setAll] = useState(false)
  if (rows.length === 0) return <p className="text-sm text-slate-500 dark:text-slate-400">{empty}</p>
  const scale = Math.max(1, ...rows.map((r) => Math.max(r.value, r.budget ?? 0)))
  const shown = all ? rows : rows.slice(0, FIRST)
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / scale) * 100))}%`
  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {shown.map((r) => {
          const within = r.value - r.over
          const partial = budgetMonthsLabel(r, multiYear)
          const f = flags?.get(r.category)
          const head = (
            <>
              <span className="min-w-0 truncate font-medium">{r.category}</span>
              <span className="shrink-0 text-xs text-slate-600 tabular-nums dark:text-slate-300">
                {euro(r.value)}
                {r.budget !== null ? (
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '}
                    / {euro(r.budget)}
                    {partial && ` (budget ${partial})`}
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400"> · senza budget</span>
                )}
                {r.over > 0 && (
                  <span className="ml-1.5 font-semibold text-orange-700 dark:text-orange-400">▲ {euro(r.over)}</span>
                )}
                {f?.dashboard && <span className="text-slate-500 dark:text-slate-400"> · budget dashboard</span>}
                {f?.conflict && (
                  <span className="ml-1.5 font-semibold text-orange-700 dark:text-orange-400">⚠ conflitto</span>
                )}
              </span>
            </>
          )
          return (
            <li key={r.category} className="text-sm">
              {onOpen ? (
                <button
                  type="button"
                  onClick={() => onOpen(r.category)}
                  className={`-mx-1 flex min-h-10 w-[calc(100%+0.5rem)] flex-wrap items-center justify-between gap-x-3 rounded-md px-1 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 ${FOCUS_RING}`}
                >
                  {head}
                </button>
              ) : (
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">{head}</div>
              )}
              <div className="relative mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-y-0 left-0 rounded-l-full bg-sky-600" style={{ width: pct(within) }} />
                {r.over > 0 && (
                  <div
                    className="absolute inset-y-0 rounded-r-full bg-orange-600"
                    style={{ left: `calc(${pct(within)} + 2px)`, width: `calc(${pct(r.over)} - 2px)` }}
                  />
                )}
                {r.budget !== null && (
                  <div
                    className="absolute -top-1 -bottom-1 w-0.5 rounded bg-slate-900 dark:bg-slate-100"
                    style={{ left: pct(r.budget) }}
                    title={`budget ${euro(r.budget)}`}
                  />
                )}
              </div>
              {compareLabel !== null && r.compare !== null && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {compareLabel}: {euro(r.compare)}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {rows.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll(!all)}
          className="min-h-10 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          {all ? 'Mostra meno' : `Mostra tutte (${rows.length})`}
        </button>
      )}
    </div>
  )
}
