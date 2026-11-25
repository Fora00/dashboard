import { confirm } from '../../lib/confirm'
import { SectionTitle } from '../../components/SectionTitle'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { Habit } from '../../lib/db'
import { Button } from '../../components/Button'
import { SkeletonList } from '../../components/Skeleton'
import { deleteHabit, setArchived, setDayCount, setDayState, setSlipCount } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { usePersistedState } from '../../lib/safeStorage'
import { displayCell, habitBounds } from './habitDayStates'
import type { HabitDaysData } from './habitDaysData'
import { HabitLegend } from './HabitLegend'
import { HabitRecap } from './HabitRecap'
import { HabitSheets } from './HabitSheets'
import { habitPath } from './habitRoute'
import { useHabitSheets } from './useHabitSheets'
import { daysBetween, habitStats, shiftDayKey, weekStart } from './habitStats'
import { MAX_OPEN } from './habitStates'
import { tapHabit } from './habitTap'
import { HabitTile } from './HabitTile'
import { Lifeboard } from './Lifeboard'
import { evidenceLine, latestEvidence } from './habitMeasure'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { HabitExpiring } from './HabitExpiring'
import { HabitCategories } from './HabitCategories'
import { expiringHabits } from './habitExpiry'

const HABIT_VIEWS = ['today', 'week', 'month', 'board', 'expiring', 'categories'] as const
const VIEW_LABEL: Record<HabitView, string> = {
  today: 'Today',
  week: 'Week',
  month: 'Month',
  board: 'Board',
  expiring: 'Scadenze',
  categories: 'Categorie',
}
export type HabitView = (typeof HABIT_VIEWS)[number]

const isView = (v: unknown): v is HabitView => HABIT_VIEWS.includes(v as HabitView)

interface Props {
  /** From useHabitDays(today); undefined while loading. */
  data: HabitDaysData | undefined
  today: string
  /** safeStorage key remembering the tab, one per place ('habits:view', 'life:habits-view'). */
  viewKey: string
  defaultView?: HabitView
  /** Shown instead of the tiles when there is no habit at all. */
  empty?: ReactNode
  /** What the Week / Month recap's “Open” does: go to the habit page (/habits) or open the quick sheet in place (Life). */
  recapOpens?: 'page' | 'sheet'
}

/** The Habits project's body: today / week / month / board tabs, the tiles,
 *  the legend, old habits and every sheet. Rendered as is on the Habits page
 *  and inside Life, so both look and behave the same. */
export function HabitsPanel({ data, today, viewKey, defaultView = 'today', empty, recapOpens = 'sheet' }: Props) {
  const [view, setView] = usePersistedState<HabitView>(viewKey, defaultView, (raw) => (isView(raw) ? raw : defaultView))
  const [sheet, dispatch] = useHabitSheets()
  const location = useLocation()
  const navigate = useNavigate()

  const tap = (habit: Habit) =>
    void runSafe(async () => {
      if (!data) return
      const next = await tapHabit(habit, {
        state: data.states.get(habit.id)?.get(today) ?? 'open',
        count: data.counts.get(habit.id)?.get(today) ?? 0,
        slips: data.slips.get(habit.id)?.get(today) ?? 0,
        today,
      })
      if (next === 'sheet') dispatch({ kind: 'slip', id: habit.id }) // a slip needs its reason
    }, 'Could not save')()

  async function removeHabit(habit: Habit) {
    const ok = await confirm({
      title: `Delete “${habit.name}”?`,
      body: 'Its whole history is deleted too.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (ok) void runSafe(deleteHabit, 'Could not delete habit')(habit)
  }

  const active = data?.active ?? []
  const archived = data?.archived ?? []
  const expiringCount = expiringHabits(active, today).length
  const openHabit = (id: string) =>
    recapOpens === 'page'
      ? navigate(habitPath(id), { state: { from: `${location.pathname}${location.search}` } })
      : dispatch({ kind: 'detail', id })

  return (
    <div>
      <SegmentedTabs
        label="View"
        options={HABIT_VIEWS.map((v) => ({
          id: v,
          label: (
            <span>
              {VIEW_LABEL[v]}
              {v === 'expiring' && expiringCount > 0 && (
                <span className="ml-1 rounded-full bg-amber-200 px-1.5 text-xs text-amber-900 dark:bg-amber-800 dark:text-amber-100">
                  {expiringCount}
                </span>
              )}
            </span>
          ),
        }))}
        value={view}
        onChange={setView}
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      />

      {data === undefined ? (
        <SkeletonList rows={3} rowClassName="h-16" />
      ) : view === 'board' ? (
        <Lifeboard habits={data.habits} data={data.boardData} />
      ) : view === 'expiring' ? (
        <HabitExpiring habits={active} states={data.states} today={today} onOpen={openHabit} />
      ) : view === 'categories' ? (
        <HabitCategories habits={data.habits} states={data.states} today={today} onOpen={openHabit} />
      ) : view !== 'today' && active.length > 0 ? (
        <HabitRecap
          key={view}
          kind={view === 'month' ? 'month' : 'week'}
          habits={active}
          states={data.states}
          notes={data.notes}
          counts={data.counts}
          slips={data.slips}
          apps={data.appsByWeek}
          today={today}
          onOpen={openHabit}
          onTapToday={tap}
          onSetCount={(habit, day, n) => void runSafe(setDayCount, 'Could not save')(habit.id, day, n)}
          onSetSlips={(habit, day, n) => void runSafe(setSlipCount, 'Could not save')(habit.id, day, n)}
          onSetDay={(habit, day, state, reason) =>
            void runSafe(setDayState, 'Could not save')(habit.id, day, state, reason)
          }
        />
      ) : active.length === 0 && archived.length === 0 ? (
        empty
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <SectionTitle>
                Today · {data.doneToday}/{active.length} done
              </SectionTitle>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {active.map((habit) => {
                  const states = data.states.get(habit.id) ?? new Map()
                  const st = states.get(today)
                  const stats = habitStats(habit, states, today)
                  const bounds = habitBounds(habit, states)
                  const monday = weekStart(today)
                  const measured = habit.measure
                    ? latestEvidence(habit, data.appsByWeek, monday, shiftDayKey(monday, -7))
                    : null
                  const measureLine = !habit.measure
                    ? undefined
                    : measured
                      ? `${measured.week === monday ? '' : 'sett. scorsa: '}${evidenceLine(measured.evidence)}`
                      : 'da verificare domenica'
                  return (
                    <HabitTile
                      key={habit.id}
                      habit={habit}
                      stats={stats}
                      state={st ?? 'open'}
                      today={today}
                      weekCells={
                        stats.target === 7
                          ? Array.from({ length: 7 }, (_, i) => {
                              const day = shiftDayKey(monday, i)
                              return displayCell(habit, day, states.get(day), today, bounds)
                            })
                          : undefined
                      }
                      todayIndex={daysBetween(monday, today)}
                      measureLine={measureLine}
                      count={data.counts.get(habit.id)?.get(today) ?? 0}
                      slips={data.slips.get(habit.id)?.get(today) ?? 0}
                      onToggle={() => tap(habit)}
                      onMore={() => dispatch({ kind: 'pick', id: habit.id, reasonFor: null })}
                      onFloor={() => void runSafe(setDayState, 'Could not save')(habit.id, today, 'floor')}
                      onReset={() => dispatch({ kind: 'reset', id: habit.id })}
                      onRest={() => dispatch({ kind: 'pick', id: habit.id, reasonFor: 'skip' })}
                      onOpen={() => dispatch({ kind: 'detail', id: habit.id })}
                    />
                  )
                })}
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Tap = done today. Hold = floor, rest or missed. ⋯ = scheda rapida e “Apri dettaglio”.
                {active.length > MAX_OPEN && ` ${active.length} open: past ${MAX_OPEN} none gets finished. Close one?`}
              </p>
              <HabitLegend />
            </section>
          )}

          {archived.length > 0 && (
            <details className="rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
              <summary className="cursor-pointer text-sm font-medium text-slate-500 dark:text-slate-400">
                Old habits · {archived.length} (history stays on the Board)
              </summary>
              <ul className="mt-3 space-y-2">
                {archived.map((habit) => (
                  <li
                    key={habit.id}
                    className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <Link
                      to={habitPath(habit.id)}
                      state={{ from: `${location.pathname}${location.search}` }}
                      className="flex min-h-10 min-w-0 flex-1 items-center truncate text-slate-500 hover:underline dark:text-slate-400"
                    >
                      <span className="mr-2">{habit.emoji}</span>
                      {habit.name}
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => void runSafe(setArchived, 'Could not restore')(habit, false)}
                    >
                      Restore
                    </Button>
                    <Button variant="danger" onClick={() => removeHabit(habit)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {data && <HabitSheets data={data} today={today} sheet={sheet} dispatch={dispatch} />}
    </div>
  )
}
