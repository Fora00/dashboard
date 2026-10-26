import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeDayFocus } from '../../../lib/db'
import { removeDayFocus, toggleDayFocus } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'

// "Oggi": the current day's lines (up to 3), filled by the /oggi command, here
// only ticked or removed. Shows only `day`'s list; yesterday's lines are never
// carried over. Amber, so it reads apart from the weekly Focus.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ item }: { item: LifeDayFocus }) {
  const { done, title } = item

  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={done}
        onClick={() => void runSafe(toggleDayFocus, 'Could not save')(item.id)}
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors active:bg-amber-100 dark:active:bg-amber-400/20 ${
          done
            ? 'border-amber-400 bg-amber-300/25 dark:bg-amber-400/15'
            : 'border-amber-300/70 bg-white hover:border-amber-400 dark:border-amber-400/30 dark:bg-slate-800/50 dark:hover:border-amber-400/60'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            done
              ? 'border-amber-500 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900'
              : 'border-amber-400 dark:border-amber-400/70'
          }`}
        >
          {done && '✓'}
        </span>
        <span className={`min-w-0 flex-1 break-words ${done ? 'text-slate-500 line-through' : ''}`}>{title}</span>
      </button>
      <button
        type="button"
        aria-label={`Elimina: ${title}`}
        onClick={() => {
          if (window.confirm(`Eliminare "${title}" da oggi?`)) void runSafe(removeDayFocus, 'Could not remove')(item.id)
        }}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        ✕
      </button>
    </li>
  )
}

export function DayFocusSection({ day }: { day: string }) {
  const items = useLiveQuery(() => db.lifeDayFocus.where('day').equals(day).sortBy('slot'), [day])

  if (items === undefined) return null

  return (
    <section className="mb-6" aria-label="Oggi">
      <div className="rounded-xl border border-amber-300/70 bg-amber-50/60 dark:border-amber-400/30 dark:bg-amber-400/5">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium text-amber-800 dark:text-amber-300">
          <h2>☀️ Oggi</h2>
          {items.length > 0 && (
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {items.filter((i) => i.done).length}/{items.length}
            </span>
          )}
        </div>
        <div className="space-y-2 border-t border-amber-300/70 px-4 py-3 dark:border-amber-400/30">
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((i) => (
                <Row key={`${i.id}:${i.updatedAt}`} item={i} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Niente per oggi. Lancia <code>/oggi</code> per impostarlo.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
