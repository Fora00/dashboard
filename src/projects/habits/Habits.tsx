import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Habit } from '../../lib/db'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { addHabit, deleteHabit, setArchived, toggleCheck } from '../../lib/habitSync'
import { dayKey, lastDays, streak } from './habitStore'

const DOT_DAYS = 14

export function Habits() {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')

  const today = dayKey(new Date())
  const dotDays = lastDays(DOT_DAYS)

  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray())
  const checks = useLiveQuery(() => db.habitChecks.toArray())

  // habitId -> set of done day-keys, for streaks and the dot rows.
  const doneByHabit = new Map<string, Set<string>>()
  for (const check of checks ?? []) {
    let days = doneByHabit.get(check.habitId)
    if (!days) doneByHabit.set(check.habitId, (days = new Set()))
    days.add(check.day)
  }
  const emptySet = new Set<string>()

  const active = habits?.filter((h) => h.archivedAt === undefined) ?? []
  const archived = habits?.filter((h) => h.archivedAt !== undefined) ?? []
  const doneToday = active.filter((h) => doneByHabit.get(h.id)?.has(today)).length

  async function createHabit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await addHabit(trimmed, emoji.trim())
    setName('')
    setEmoji('')
  }

  function removeHabit(habit: Habit) {
    if (window.confirm(`Delete “${habit.name}” and its whole history?`)) {
      void deleteHabit(habit)
    }
  }

  const renderHabit = (habit: Habit) => {
    const days = doneByHabit.get(habit.id) ?? emptySet
    const done = days.has(today)
    const run = streak(days)
    return (
      <li key={habit.id} className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => void toggleCheck(habit.id, today)}
          aria-pressed={done}
          className={`min-h-16 w-full min-w-0 flex-1 rounded-xl border px-4 py-3 text-left transition-colors active:bg-slate-800 ${
            done
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : 'border-slate-800 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                done ? 'border-emerald-400 bg-emerald-400 text-slate-900' : 'border-slate-500'
              }`}
            >
              {done && '✓'}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">
              <span className="mr-2">{habit.emoji}</span>
              {habit.name}
            </span>
            <span className={`shrink-0 text-sm ${run > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
              🔥 {run}
            </span>
          </div>
          <div className="mt-2.5 flex gap-1.5 pl-10">
            {dotDays.map((day) => (
              <span
                key={day}
                className={`size-2 rounded-full ${
                  days.has(day)
                    ? 'bg-emerald-400'
                    : day === today
                      ? 'bg-slate-600 ring-1 ring-slate-400'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </button>
        <Button
          variant="ghost"
          onClick={() => void setArchived(habit, true)}
          title={`Archive ${habit.name}`}
          aria-label={`Archive ${habit.name}`}
          className="min-w-10"
        >
          🗄
        </Button>
      </li>
    )
  }

  return (
    <div>
      <PageHeader
        emoji="✅"
        title="Habits"
        subtitle="Tap a habit to check it off for today. Saved on this device."
      />

      <SyncCard />

      <form onSubmit={createHabit} className="mb-6 flex gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="✅"
          autoComplete="off"
          aria-label="Habit emoji"
          className="min-h-10 w-14 shrink-0 rounded-lg border border-slate-700 bg-slate-800 text-center text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit, e.g. Stretch"
          autoComplete="off"
          enterKeyHint="done"
          aria-label="Habit name"
          className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <Button type="submit" disabled={!name.trim()}>
          Add
        </Button>
      </form>

      {habits === undefined ? null : active.length === 0 && archived.length === 0 ? (
        <EmptyState
          emoji="🌱"
          title="No habits yet"
          hint="Add a habit above — check it off each day to grow a streak."
        />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-slate-400">
                Today · {doneToday}/{active.length} done
              </h2>
              <ul className="space-y-2">{active.map(renderHabit)}</ul>
            </section>
          )}

          {archived.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-slate-400">
                Archived · {archived.length}
              </h2>
              <ul className="space-y-2">
                {archived.map((habit) => (
                  <li
                    key={habit.id}
                    className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-slate-400">
                      <span className="mr-2">{habit.emoji}</span>
                      {habit.name}
                    </span>
                    <Button variant="ghost" onClick={() => void setArchived(habit, false)}>
                      Restore
                    </Button>
                    <Button variant="danger" onClick={() => removeHabit(habit)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
