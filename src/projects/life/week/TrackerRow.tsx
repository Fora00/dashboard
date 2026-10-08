import { useState } from 'react'
import type { LifeTrackerEntry } from '../../../lib/db'
import { logTracker } from '../../../lib/lifeSync'
import { describeEnergy, weekdayShort } from '../format'
import { dayKey, weekDays, type TrackerSummary } from '../model'
import { EnergyPicker } from './EnergyScale'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export interface LastSunday {
  week: string
  trackerId: string
  day: string
  entries: LifeTrackerEntry[]
}

// --- Trackers -------------------------------------------------------------

export function TrackerRow({
  ts,
  week,
  readOnly,
  energyPromptId,
  setEnergyPromptId,
  lastSunday,
  onLogged,
  onRemove,
}: {
  ts: TrackerSummary
  week: string
  readOnly: boolean
  energyPromptId: string | null
  setEnergyPromptId: (id: string | null) => void
  lastSunday: LastSunday | null
  onLogged: (entry: LifeTrackerEntry) => void
  onRemove: (entry: LifeTrackerEntry) => void
}) {
  const { tracker, total, perDay, atMax, entries } = ts
  // The details (day strip, energy, per-entry edit) stay one tap away but are
  // hidden by default: the row itself is a single "done today" toggle.
  const [showDetails, setShowDetails] = useState(false)
  const limit = tracker.target ?? tracker.max
  const goal = limit !== null ? `${total}/${limit}` : total > 0 ? `${total}` : ''
  const activeEntry = energyPromptId ? entries.find((e) => e.id === energyPromptId) : undefined
  const today = dayKey(new Date())
  const doneToday = entries.some((e) => e.day === today)
  const days = weekDays(week)

  // One tap per day: logs the day, or removes its latest entry (with undo).
  // The row toggles today; the hidden day strip toggles any past day this week.
  async function toggleDay(day: string) {
    const dayEntries = entries.filter((e) => e.day === day)
    const last = dayEntries[dayEntries.length - 1]
    if (last) {
      onRemove(last)
      return
    }
    const entry = await logTracker(week, tracker.id, { day })
    onLogged(entry)
  }

  async function toggleLastSunday(ls: LastSunday) {
    const last = ls.entries[ls.entries.length - 1]
    if (last) {
      onRemove(last)
      return
    }
    const entry = await logTracker(ls.week, ls.trackerId, { day: ls.day })
    onLogged(entry)
  }

  return (
    <li>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={readOnly}
          aria-pressed={doneToday}
          onClick={() => void toggleDay(today)}
          className={`flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base font-medium transition-colors ${
            readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
          } ${
            doneToday
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
          }`}
        >
          {!readOnly && (
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                doneToday
                  ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                  : 'border-slate-400 dark:border-slate-500'
              }`}
            >
              {doneToday && '✓'}
            </span>
          )}
          {tracker.emoji && (
            <span className="text-xl" aria-hidden>
              {tracker.emoji}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate">{tracker.label}</span>
          {goal && (
            <span
              className={`shrink-0 text-xs font-normal ${atMax ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {goal}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          aria-label={`${showDetails ? 'Hide' : 'Show'} ${tracker.label} details`}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          {showDetails ? '▾' : '▸'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-2 space-y-2 pl-1">
          <div className="flex gap-1.5">
            {lastSunday && (
              <button
                type="button"
                onClick={() => void toggleLastSunday(lastSunday)}
                aria-pressed={lastSunday.entries.length > 0}
                aria-label={`${tracker.label} last Sunday (${lastSunday.day})`}
                className={`mr-1.5 flex h-10 flex-1 items-center justify-center rounded border border-dashed text-xs font-medium ${
                  lastSunday.entries.length > 0
                    ? 'border-emerald-400/60 bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                {lastSunday.entries.length > 0 ? lastSunday.entries.length : 'S'}
              </button>
            )}
            {DAY_LABELS.map((label, i) => {
              const count = perDay[i] ?? 0
              const day = days[i] ?? ''
              const future = day > today
              return (
                <button
                  key={i}
                  type="button"
                  disabled={readOnly || future}
                  onClick={() => void toggleDay(day)}
                  aria-pressed={count > 0}
                  aria-label={`${tracker.label} on ${day}`}
                  className={`flex h-10 flex-1 items-center justify-center rounded text-xs font-medium ${
                    count > 0
                      ? 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  } ${future ? 'opacity-40' : ''} ${day === today ? 'ring-1 ring-slate-300 dark:ring-slate-600' : ''}`}
                >
                  {count > 0 ? count : label}
                </button>
              )
            })}
          </div>
          {!readOnly && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap a day to mark or unmark it.{lastSunday && ' The dashed one is last Sunday.'}
            </p>
          )}
          {atMax && <p className="text-xs text-amber-700 dark:text-amber-400">⚠️ Reached the max for this week</p>}
          {!readOnly && activeEntry && <EnergyPicker entry={activeEntry} onDone={() => setEnergyPromptId(null)} />}
          {/* Every logged entry stays editable: fix its energy or delete it
              (with undo). Past days are fixed here, not from the row. */}
          {!readOnly && entries.length > 0 && (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {entries.map((e) => (
                <li key={e.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => tracker.energy && setEnergyPromptId(energyPromptId === e.id ? null : e.id)}
                    disabled={!tracker.energy}
                    aria-pressed={tracker.energy ? energyPromptId === e.id : undefined}
                    className="flex min-h-10 min-w-0 flex-1 items-center gap-2 text-left text-sm"
                  >
                    <span className="w-10 shrink-0 font-medium capitalize">{weekdayShort(e.day)}</span>
                    <span className="truncate text-slate-500 dark:text-slate-400">
                      {tracker.energy ? describeEnergy(e) : 'logged'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(e)}
                    aria-label={`Delete ${tracker.label} on ${e.day}`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}
