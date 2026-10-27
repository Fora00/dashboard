import { useState } from 'react'
import type { LifeTrackerEntry } from '../../../lib/db'
import { logTracker } from '../../../lib/lifeSync'
import { describeEnergy, weekdayShort } from '../format'
import { weekDays, type TrackerSummary } from '../model'
import { useToday } from '../useToday'
import { EnergyPicker } from './EnergyScale'
import { HabitHistoryButton } from './HabitHistory'
import { useWeekStreak } from './useHabitHistory'

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
  // Energy, per-entry edit and last Sunday stay one tap away, hidden by
  // default: the row is a "done today" toggle with the week strip below it.
  const [showDetails, setShowDetails] = useState(false)
  // "2/4" = a target to reach; "4 · max 2" = a cap not to exceed; bare count = no goal.
  const goal =
    tracker.target !== null
      ? `${total}/${tracker.target}${ts.reachedTarget ? ' ✓' : ''}`
      : tracker.max !== null
        ? `${total} · max ${tracker.max}`
        : total > 0
          ? `${total}`
          : ''
  const activeEntry = energyPromptId ? entries.find((e) => e.id === energyPromptId) : undefined
  const today = useToday()
  const streak = useWeekStreak(tracker.id, week)
  const doneToday = entries.some((e) => e.day === today)
  const days = weekDays(week)

  // One tap per day: logs the day, or removes its latest entry (with undo).
  // The row toggles today; the week strip toggles any day up to today.
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
    <li
      className={`rounded-2xl border p-2 transition-colors ${
        doneToday
          ? 'border-emerald-400/60 bg-emerald-400/10'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={readOnly}
          aria-pressed={doneToday}
          onClick={() => void toggleDay(today)}
          className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-left text-base font-medium ${
            readOnly ? '' : 'active:bg-slate-900/5 dark:active:bg-white/5'
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
          <span className="min-w-0 flex-1">
            <span className="break-words">{tracker.label}</span>
            {streak.best > 0 && (
              <span
                className="block text-xs font-normal text-slate-500 dark:text-slate-400"
                title={`Weeks in a row ${tracker.target !== null ? 'reaching the target' : 'under the max'}`}
              >
                🔥 {streak.current} {streak.current === 1 ? 'week' : 'weeks'} · best {streak.best}
              </span>
            )}
          </span>
          {goal && (
            <span
              className={`shrink-0 rounded-full bg-slate-900/5 px-2 py-0.5 text-xs font-medium dark:bg-white/10 ${atMax ? 'text-amber-600 dark:text-amber-400' : ts.reachedTarget ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {goal}
            </span>
          )}
        </button>
        <HabitHistoryButton trackerId={tracker.id} label={tracker.label} week={week} />
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
      {/* The week is always visible: tap a day to mark or unmark it. */}
      <div className="mt-1 flex gap-1 px-1">
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
              className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg ${
                day === today ? 'bg-slate-900/5 dark:bg-white/10' : ''
              } ${future ? 'opacity-40' : ''}`}
            >
              <span
                className={`text-[10px] leading-none ${day === today ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {label}
              </span>
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] font-medium ${
                  count > 0 ? 'bg-emerald-400 text-slate-900' : 'border border-slate-300 dark:border-slate-600'
                }`}
              >
                {count > 0 ? (count > 1 ? count : '✓') : ''}
              </span>
            </button>
          )
        })}
      </div>
      {showDetails && (
        <div className="mt-2 space-y-2 border-t border-slate-200 px-1 pt-2 dark:border-slate-800">
          {lastSunday && (
            <button
              type="button"
              onClick={() => void toggleLastSunday(lastSunday)}
              aria-pressed={lastSunday.entries.length > 0}
              aria-label={`${tracker.label} last Sunday (${lastSunday.day})`}
              className={`flex min-h-10 w-full items-center justify-center rounded-lg border border-dashed text-xs font-medium ${
                lastSunday.entries.length > 0
                  ? 'border-emerald-400/60 bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {lastSunday.entries.length > 0 ? `Last Sunday ✓ ${lastSunday.entries.length}` : 'Mark last Sunday'}
            </button>
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
