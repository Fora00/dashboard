import { useMemo, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type MealEntry, type MealKind } from '../../lib/db'
import { dayKey } from '../../lib/dates'
import { addMeal, deleteMeal, MAX_TEXT_LENGTH, restoreMeal, sync, updateMeal } from '../../lib/mealDiarySync'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { Snackbar } from '../../components/Snackbar'
import { SkeletonList } from '../../components/Skeleton'
import { SyncCard } from '../../components/SyncCard'
import { MEALS, dayLabel, defaultMeal, groupByDay, mealMeta } from './model'
import type { NutritionForm } from './nutrition'
import { NutritionFields } from './NutritionFields'
import { NutritionTrends } from './NutritionTrends'

import { DayTotalsLine, WeighedToggle } from './MealParts'
import { macros, toForm, toNutrition } from './mealFormat'

const INPUT =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800'

export function MealDiary() {
  // oxlint-disable-next-line react/purity -- the day must follow the wall clock across midnight
  const now = new Date()
  const today = dayKey(now)
  const entries = useLiveQuery(() => db.meals.toArray())
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  const [day, setDay] = useState(today)
  const [meal, setMeal] = useState<MealKind>(() => defaultMeal(now.getHours()))
  const [text, setText] = useState('')
  // Sticky across entries: you tend to weigh (or not) a whole cooking session.
  const [weighed, setWeighed] = useState(false)
  const [editing, setEditing] = useState<{
    id: string
    text: string
    weighed: boolean
    nutrition: NutritionForm
  } | null>(null)

  // Days the user folded away (all open by default).
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set())
  const toggleDay = (d: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (!next.delete(d)) next.add(d)
      return next
    })

  const groups = useMemo(() => groupByDay(entries ?? []), [entries])

  async function add(e: FormEvent) {
    e.preventDefault()
    if (await addMeal(day, meal, text, { weighed })) setText('')
  }

  async function saveEdit(entry: MealEntry) {
    if (!editing) return
    await updateMeal(entry, { text: editing.text, weighed: editing.weighed, nutrition: toNutrition(editing.nutrition) })
    setEditing(null)
  }

  async function remove(entry: MealEntry) {
    await deleteMeal(entry.id)
    trigger(`Deleted "${entry.text}" · Undo`, () => restoreMeal(entry))
  }

  return (
    <div>
      <PageHeader
        emoji="🍽️"
        title="Meal Diary"
        subtitle={
          'What you ate, day by day: just write it, e.g. "100g pasta al pesto rosso". Calories and macros are added later by the AI. Synced across your devices, only yours.'
        }
      />

      <SyncCard sync={sync} />

      <form onSubmit={add} className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Meal">
          {MEALS.map((m) => (
            <Button
              key={m.id}
              type="button"
              variant={meal === m.id ? 'primary' : 'ghost'}
              aria-pressed={meal === m.id}
              title={m.label}
              onClick={() => setMeal(m.id)}
            >
              {m.emoji} {m.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="What did you eat"
            placeholder="e.g. 100g pasta al pesto rosso"
            maxLength={MAX_TEXT_LENGTH}
            autoComplete="off"
            enterKeyHint="done"
            className={INPUT}
          />
          <WeighedToggle weighed={weighed} onChange={setWeighed} />
          <Button type="submit" disabled={!text.trim()} title="Add to the diary">
            Add
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          Day
          <input
            type="date"
            value={day}
            max={today}
            onChange={(e) => setDay(e.target.value || today)}
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          {day !== today && (
            <button
              type="button"
              className="text-indigo-600 underline dark:text-indigo-300"
              onClick={() => setDay(today)}
            >
              today
            </button>
          )}
        </label>
      </form>

      {entries === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : groups.length === 0 ? (
        <EmptyState emoji="🍽️" title="Nothing logged yet" hint="Pick a meal, write what you ate and tap Add." />
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.day} aria-label={dayLabel(g.day, now)}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => toggleDay(g.day)}
                    aria-expanded={!collapsed.has(g.day)}
                    title={collapsed.has(g.day) ? 'Show this day' : 'Hide this day'}
                    className="flex min-h-10 items-center gap-1.5"
                  >
                    <span aria-hidden="true" className="text-xs">
                      {collapsed.has(g.day) ? '▸' : '▾'}
                    </span>
                    {dayLabel(g.day, now)}
                    {collapsed.has(g.day) && <span className="text-xs">({g.entries.length})</span>}
                  </button>
                </h2>
                <DayTotalsLine entries={g.entries} />
              </div>
              {!collapsed.has(g.day) && (
                <Card className="divide-y divide-slate-100 p-0 dark:divide-slate-800">
                  <ul>
                    {g.entries.map((entry) => (
                      <li key={entry.id} className="flex items-start gap-3 px-4 py-2.5">
                        <span
                          className="mt-0.5 shrink-0 text-lg"
                          title={mealMeta(entry.meal).label}
                          aria-label={mealMeta(entry.meal).label}
                        >
                          {mealMeta(entry.meal).emoji}
                        </span>
                        {editing?.id === entry.id ? (
                          <form
                            className="min-w-0 flex-1 space-y-2"
                            onSubmit={(ev) => {
                              ev.preventDefault()
                              void saveEdit(entry)
                            }}
                          >
                            <div className="flex gap-2">
                              <input
                                autoFocus
                                value={editing.text}
                                onChange={(ev) => setEditing({ ...editing, text: ev.target.value })}
                                aria-label={`Edit ${entry.text}`}
                                maxLength={MAX_TEXT_LENGTH}
                                className={INPUT}
                              />
                              <WeighedToggle
                                weighed={editing.weighed}
                                onChange={(w) => setEditing({ ...editing, weighed: w })}
                              />
                              <Button type="submit" disabled={!editing.text.trim()}>
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                aria-label="Cancel"
                                title="Cancel"
                                onClick={() => setEditing(null)}
                              >
                                ✕
                              </Button>
                            </div>
                            <NutritionFields
                              value={editing.nutrition}
                              onChange={(n) => setEditing({ ...editing, nutrition: n })}
                            />
                          </form>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setEditing({
                                  id: entry.id,
                                  text: entry.text,
                                  weighed: entry.weighed === true,
                                  nutrition: toForm(entry),
                                })
                              }
                              aria-label={`Edit ${entry.text}`}
                              className="min-h-10 min-w-0 flex-1 break-words text-left text-sm"
                            >
                              {entry.text}
                              <span className="block text-xs text-slate-500 dark:text-slate-400">
                                <span
                                  title={entry.weighed ? 'Weighed' : 'By eye'}
                                  aria-label={entry.weighed ? 'Weighed' : 'By eye'}
                                >
                                  {entry.weighed ? '⚖️' : '👁️'}
                                </span>
                                {macros(entry).text && (
                                  <span title={macros(entry).hint} aria-label={macros(entry).hint}>
                                    {` ${macros(entry).text}`}
                                  </span>
                                )}
                              </span>
                            </button>
                            <Button
                              variant="danger"
                              onClick={() => void remove(entry)}
                              aria-label={`Delete ${entry.text}`}
                              title="Delete"
                              className="min-w-10"
                            >
                              ✕
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>
          ))}
        </div>
      )}

      {entries !== undefined && (
        <div className="mt-6">
          <NutritionTrends entries={entries} now={now} />
        </div>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
