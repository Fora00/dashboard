import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeDayFocus } from '../../../lib/db'
import { AddLine } from './AddLine'
import { addDayFocus, toggleDayFocus, toggleDayFocusCancelled } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { LIFE_CAPS, daysBetween, isLateSlot, isUrgentSlot } from '../model'

// "Oggi": the current day's lines (up to 3), filled by the /oggi command, here
// only ticked or cancelled (Things-style: kept, struck through, restorable). Shows only `day`'s list; yesterday's lines are never
// carried over. Amber, so it reads apart from the weekly Focus.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ item, age }: { item: LifeDayFocus; age?: number | undefined }) {
  const { done, title, cancelled } = item

  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={done}
        disabled={cancelled}
        onClick={() => void runSafe(toggleDayFocus, 'Could not save')(item.id)}
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors active:bg-amber-100 dark:active:bg-amber-400/20 ${
          cancelled
            ? 'border-slate-300/60 bg-transparent opacity-60 dark:border-slate-700'
            : done
              ? 'border-amber-400 bg-amber-300/25 dark:bg-amber-400/15'
              : 'border-amber-300/70 bg-white hover:border-amber-400 dark:border-amber-400/30 dark:bg-slate-800/50 dark:hover:border-amber-400/60'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            cancelled
              ? 'border-slate-400 text-slate-500 dark:border-slate-600'
              : done
                ? 'border-amber-500 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900'
                : 'border-amber-400 dark:border-amber-400/70'
          }`}
        >
          {cancelled ? '✕' : done && '✓'}
        </span>
        <span className={`min-w-0 flex-1 break-words ${done || cancelled ? 'text-slate-500 line-through' : ''}`}>
          {title}
        </span>
        {age !== undefined && age >= 2 && !done && !cancelled && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-normal ${
              age >= 5
                ? 'bg-rose-200/70 text-rose-900 dark:bg-rose-400/20 dark:text-rose-200'
                : age >= 3
                  ? 'bg-orange-200/70 text-orange-900 dark:bg-orange-400/20 dark:text-orange-200'
                  : 'bg-amber-200/60 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200'
            }`}
          >
            {age >= 5 ? '🔥' : age >= 3 ? '⚠️' : '⏳'} da {age} gg
          </span>
        )}
      </button>
      <button
        type="button"
        aria-label={cancelled ? `Ripristina: ${title}` : `Annulla: ${title}`}
        onClick={() => void runSafe(toggleDayFocusCancelled, 'Could not save')(item.id)}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        {cancelled ? '↺' : '✕'}
      </button>
    </li>
  )
}

export function DayFocusSection({ day }: { day: string }) {
  const items = useLiveQuery(() => db.lifeDayFocus.where('day').equals(day).sortBy('slot'), [day])

  // Days on the board: how many days (counting today) a line with the same title
  // has been in the daily focus, from its first appearance.
  const ages = useLiveQuery(async () => {
    const older = await db.lifeDayFocus.where('day').below(day).toArray()
    const first = new Map<string, string>()
    for (const r of older) {
      const f = first.get(r.title)
      if (f === undefined || r.day < f) first.set(r.title, r.day)
    }
    return first
  }, [day])

  if (items === undefined) return null
  const ageOf = (i: LifeDayFocus) => {
    const f = ages?.get(i.title)
    return f === undefined ? undefined : daysBetween(f, day) + 1
  }
  const urgent = items.filter((i) => isUrgentSlot(i.slot))
  const late = items.filter((i) => isLateSlot(i.slot))
  const focus = items.filter((i) => !isUrgentSlot(i.slot) && !isLateSlot(i.slot))

  return (
    <section className="mb-6" aria-label="Oggi">
      <div className="rounded-xl border border-amber-300/70 bg-amber-50/60 dark:border-amber-400/30 dark:bg-amber-400/5">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium text-amber-800 dark:text-amber-300">
          <h2>🎯 Daily focus</h2>
          {focus.length > 0 && (
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {focus.filter((i) => i.done && !i.cancelled).length}/{focus.filter((i) => !i.cancelled).length}
            </span>
          )}
        </div>
        <div className="space-y-2 border-t border-amber-300/70 px-4 py-3 dark:border-amber-400/30">
          {focus.length > 0 ? (
            <ul className="space-y-2">
              {focus.map((i) => (
                <Row key={`${i.id}:${i.updatedAt}`} item={i} age={ageOf(i)} />
              ))}
            </ul>
          ) : (
            urgent.length === 0 &&
            late.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Niente per oggi. Aggiungi qui sotto o lancia <code>/oggi</code>.
              </p>
            )
          )}
          {urgent.length > 0 && (
            <div className={focus.length > 0 ? 'border-t border-amber-300/70 pt-3 dark:border-amber-400/30' : ''}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-rose-700 dark:text-rose-300">
                🚨 Urgenze
              </h3>
              <ul className="space-y-2">
                {urgent.map((i) => (
                  <Row key={`${i.id}:${i.updatedAt}`} item={i} age={ageOf(i)} />
                ))}
              </ul>
            </div>
          )}
          {late.length > 0 && (
            <div
              className={
                focus.length > 0 || urgent.length > 0
                  ? 'border-t border-amber-300/70 pt-3 dark:border-amber-400/30'
                  : ''
              }
            >
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                🐌 In ritardo
              </h3>
              <ul className="space-y-2">
                {late.map((i) => (
                  <Row key={`${i.id}:${i.updatedAt}`} item={i} age={ageOf(i)} />
                ))}
              </ul>
            </div>
          )}
          <AddLine
            onAdd={(t) => addDayFocus(day, [t])}
            placeholder="Aggiungi (! = urgente, ~ = in ritardo)"
            maxLength={LIFE_CAPS.dayFocusTitle + 1}
          />
        </div>
      </div>
    </section>
  )
}
