import { INPUT } from '../../components/field'
import type { HabitAppLimit } from '../../lib/db'
import { MAX_LIMIT_APP_LENGTH, MAX_LIMIT_MINUTES, MAX_MEASURE_LIMITS } from '../../lib/habitCaps'

/** The app-limits list of a measured habit (HabitForm): one row per app with
 *  its daily limit in minutes, as set in iOS Screen Time. Blank rows are
 *  dropped on save (habitSync cleanLimits). 40px targets. */
export function AppLimitsEditor({
  value,
  onChange,
}: {
  value: readonly HabitAppLimit[]
  onChange: (next: HabitAppLimit[]) => void
}) {
  const rows = value.length ? value : [{ app: '', minutes: 0 }]
  const patch = (i: number, p: Partial<HabitAppLimit>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)))
  return (
    <div className="space-y-2" role="group" aria-label="Limiti app">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <input
            value={r.app}
            onChange={(e) => patch(i, { app: e.target.value })}
            maxLength={MAX_LIMIT_APP_LENGTH}
            placeholder="App"
            autoComplete="off"
            aria-label={`App ${i + 1}`}
            className={`${INPUT} min-w-0 flex-1`}
          />
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_LIMIT_MINUTES}
            value={r.minutes || ''}
            onChange={(e) => patch(i, { minutes: Number(e.target.value) || 0 })}
            aria-label={`App ${i + 1}: minuti al giorno`}
            className={`${INPUT} w-20`}
          />
          <span className="shrink-0">min/g</span>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            aria-label={`Togli app ${i + 1}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
          >
            ✕
          </button>
        </div>
      ))}
      {rows.length < MAX_MEASURE_LIMITS && (
        <button
          type="button"
          onClick={() => onChange([...rows, { app: '', minutes: 0 }])}
          className="min-h-10 text-sm text-slate-500 dark:text-slate-400"
        >
          + Aggiungi app
        </button>
      )}
    </div>
  )
}
