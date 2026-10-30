import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Habit, type HabitDayState } from '../../lib/db'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { SkeletonList } from '../../components/Skeleton'
import { addHabit, deleteHabit, setArchived, sync, setDayState, setSlipCount } from '../../lib/habitSync'
import { dayKey } from './habitStore'
import { daysBetween, habitStats, restWarnings, shiftDayKey, weekStart } from './habitStats'
import { tapHabit } from './habitTap'
import { activeDaysOf, habitDayStates } from './habitDayStates'
import { HabitTile } from './HabitTile'
import { HabitLegend } from './HabitLegend'
import { resetDemoHabits } from './demoHabits'
import { MISS_REASONS, REST_REASONS, STATE_ICON } from './habitStates'
import { HabitRecap } from './HabitRecap'
import { HabitRules } from './HabitRules'
import { Lifeboard } from './Lifeboard'
import { buildLifeboard, type DayData } from './lifeboardData'
import { Sheet } from '../../components/Sheet'
import { HabitDetail } from './HabitDetail'
import { HabitForm } from './HabitForm'
import { newForm } from './habitFormDefaults'
import { Kbd } from '../../components/Kbd'
import { useListHotkeys } from '../../lib/useListHotkeys'
import { runSafe } from '../../lib/runSafe'

const MAX_OPEN = 3 // more open cycles than this and none gets finished

export function Habits() {
  const [adding, setAdding] = useState(false)
  // No search here: '/' and 'n' both open the new-habit sheet.
  useListHotkeys({ onSearch: () => setAdding(true), onNew: () => setAdding(true) })
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false

  // oxlint-disable-next-line react/purity -- the day must follow the wall clock across midnight
  const today = dayKey(new Date())
  // oxlint-disable-next-line react/purity -- follows the wall clock like `today`
  const yesterday = shiftDayKey(today, -1)
  const [openId, setOpenId] = useState<string | null>(null)

  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray())
  const checks = useLiveQuery(() => db.habitChecks.toArray())

  // Per habit: day -> state, day -> reason, day -> taps (see habitDayStates).
  const allChecks = checks ?? []
  const activeDays = activeDaysOf(allChecks)
  const statesByHabit = new Map<string, Map<string, HabitDayState>>()
  const notesByHabit = new Map<string, Map<string, string>>()
  const countsByHabit = new Map<string, Map<string, number>>()
  const slipsByHabit = new Map<string, Map<string, number>>()
  for (const h of habits ?? []) {
    const d = habitDayStates(h, allChecks, activeDays, today)
    statesByHabit.set(h.id, d.states)
    notesByHabit.set(h.id, d.notes)
    countsByHabit.set(h.id, d.counts)
    slipsByHabit.set(h.id, d.slips)
  }
  const boardData = new Map<string, DayData>()
  for (const h of habits ?? []) {
    boardData.set(h.id, { states: statesByHabit.get(h.id)!, counts: countsByHabit.get(h.id)! })
  }
  const wins = new Map(buildLifeboard(habits ?? [], boardData).legend.map((l) => [l.habit.id, l.total]))
  const noStates = new Map<string, HabitDayState>()
  const noNotes = new Map<string, string>()
  const [view, setView] = useState<'today' | 'week' | 'month' | 'board'>('today')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [slipId, setSlipId] = useState<string | null>(null)
  const [reasonFor, setReasonFor] = useState<'skip' | 'fail' | null>(null)
  const [pickId, setPickId] = useState<string | null>(null)
  const [resetId, setResetId] = useState<string | null>(null)

  const active = habits?.filter((h) => h.archivedAt === undefined) ?? []
  const archived = habits?.filter((h) => h.archivedAt !== undefined) ?? []
  const isDone = (h: Habit) => {
    const st = statesByHabit.get(h.id)?.get(today)
    return st === 'done' || st === 'floor'
  }
  const doneToday = active.filter(isDone).length
  const openHabit = habits?.find((h) => h.id === openId) ?? null
  const resetHabit = habits?.find((h) => h.id === resetId) ?? null
  const slipHabit = habits?.find((h) => h.id === slipId) ?? null
  const pickHabit = habits?.find((h) => h.id === pickId) ?? null

  function removeHabit(habit: Habit) {
    if (window.confirm(`Delete “${habit.name}” and its whole history?`)) {
      void runSafe(deleteHabit, 'Could not delete habit')(habit)
    }
  }

  return (
    <div>
      <PageHeader emoji="✅" title="Habits" subtitle="Tap a tile to check it off for today. Saved on this device." />

      {import.meta.env.DEV && !session && habits !== undefined && (
        <Button variant="ghost" className="mb-4" onClick={() => void runSafe(resetDemoHabits, 'Could not fill')()}>
          🧪 {habits.length === 0 ? 'Fill with' : 'Reset to'} demo data (dev only, this browser only)
        </Button>
      )}

      <SyncCard sync={sync} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={() => setAdding(true)}>
          + New habit <Kbd>n</Kbd>
        </Button>
        <Button variant="ghost" onClick={() => setRulesOpen(true)}>
          ℹ️ How it works
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="View"
        className="mb-6 grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      >
        {(['today', 'week', 'month', 'board'] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`min-h-10 rounded-lg text-sm font-medium capitalize ${view === v ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'board' && habits !== undefined ? (
        <Lifeboard habits={habits} data={boardData} />
      ) : view !== 'today' && habits !== undefined && active.length > 0 ? (
        <HabitRecap
          key={view}
          kind={view === 'month' ? 'month' : 'week'}
          habits={active}
          states={statesByHabit}
          notes={notesByHabit}
          today={today}
          onOpen={setOpenId}
        />
      ) : habits === undefined ? (
        <SkeletonList rows={3} rowClassName="h-16" />
      ) : active.length === 0 && archived.length === 0 ? (
        <EmptyState
          emoji="🌱"
          title="No habits yet"
          hint={
            isGuestViewer
              ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
              : 'Add a habit above — check it off each day to grow a streak.'
          }
        />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Today · {doneToday}/{active.length} done
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {active.map((habit) => {
                  const states = statesByHabit.get(habit.id) ?? noStates
                  const st = states.get(today)
                  return (
                    <HabitTile
                      key={habit.id}
                      habit={habit}
                      stats={habitStats(habit, states, today)}
                      state={st ?? 'open'}
                      today={today}
                      weekCells={
                        habitStats(habit, states, today).target === 7
                          ? Array.from({ length: 7 }, (_, i) => {
                              const day = shiftDayKey(weekStart(today), i)
                              return states.get(day) ?? (day > today ? 'future' : 'empty')
                            })
                          : undefined
                      }
                      todayIndex={daysBetween(weekStart(today), today)}
                      count={countsByHabit.get(habit.id)?.get(today) ?? 0}
                      slips={slipsByHabit.get(habit.id)?.get(today) ?? 0}
                      onToggle={() =>
                        void runSafe(async () => {
                          const next = await tapHabit(habit, {
                            state: st ?? 'open',
                            count: countsByHabit.get(habit.id)?.get(today) ?? 0,
                            slips: slipsByHabit.get(habit.id)?.get(today) ?? 0,
                            today,
                          })
                          if (next === 'sheet') setSlipId(habit.id)
                        }, 'Could not save')()
                      }
                      onMore={() => setPickId(habit.id)}
                      onFloor={() => void runSafe(setDayState, 'Could not save')(habit.id, today, 'floor')}
                      onReset={() => setResetId(habit.id)}
                      onRest={() => {
                        setPickId(habit.id)
                        setReasonFor('skip')
                      }}
                      onOpen={() => setOpenId(habit.id)}
                    />
                  )
                })}
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Tap = done today. Hold = floor, rest or missed. ⋯ = stats and cycle.
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
              <div className="mt-3">
                <ul className="space-y-2">
                  {archived.map((habit) => (
                    <li
                      key={habit.id}
                      className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/30"
                    >
                      <span className="min-w-0 flex-1 truncate text-slate-500 dark:text-slate-400">
                        <span className="mr-2">{habit.emoji}</span>
                        {habit.name}
                      </span>
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
              </div>
            </details>
          )}
        </div>
      )}

      <Sheet open={adding} onClose={() => setAdding(false)} title="New habit">
        {adding && (
          <HabitForm
            initial={newForm(
              today,
              active.filter((h) => h.kind === 'forever').length < MAX_OPEN ? 'forever' : 'experiment',
            )}
            submitLabel="Create habit"
            presets
            onSubmit={async (v) => {
              await addHabit(v.name, v.emoji, v)
              setAdding(false)
            }}
          />
        )}
        {adding && active.length >= MAX_OPEN && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
            {active.length} habits are open already: past {MAX_OPEN} none gets finished. Make this one an experiment, or
            close one.
          </p>
        )}
      </Sheet>

      <Sheet
        open={slipHabit !== null}
        onClose={() => setSlipId(null)}
        title={slipHabit ? `${slipHabit.emoji} ${slipHabit.name}` : ''}
      >
        {slipHabit && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              A slip is one data point, not a verdict. Never twice in a row is the goal.
            </p>
            {slipHabit.anchor && <p className="text-sm text-slate-500">Instead: {slipHabit.anchor}</p>}
            {(slipHabit.grace ?? 0) > 0 &&
              (() => {
                const st = habitStats(slipHabit, statesByHabit.get(slipHabit.id) ?? noStates, today)
                const left = Math.max(0, st.grace - st.graceUsedWeek)
                return (
                  <p className="rounded-lg bg-amber-300/15 p-2 text-sm text-amber-800 dark:text-amber-200">
                    {left > 0
                      ? `Grace left this week: ${left} of ${st.grace}. This slip uses one and does not break the streak.`
                      : `No grace left this week (${st.grace} used). This slip counts and breaks the streak.`}
                  </p>
                )
              })()}
            {slipHabit.floor && (
              <Button
                className="w-full"
                onClick={() => {
                  void runSafe(setDayState, 'Could not save')(slipHabit.id, today, 'floor')
                  setSlipId(null)
                }}
              >
                ◐ Within my limit: {slipHabit.floor}
              </Button>
            )}
            <p className="text-sm text-slate-500">Or, if I went past it, what was it?</p>
            <div className="grid grid-cols-2 gap-2">
              {MISS_REASONS.map(([reason, label]) => (
                <Button
                  key={reason}
                  variant="ghost"
                  onClick={() => {
                    void runSafe(setDayState, 'Could not save')(slipHabit.id, today, 'fail', reason)
                    setSlipId(null)
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                void runSafe(setDayState, 'Could not save')(slipHabit.id, today, 'fail')
                setSlipId(null)
              }}
            >
              No reason
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet open={rulesOpen} onClose={() => setRulesOpen(false)} title="How it works">
        {rulesOpen && <HabitRules />}
      </Sheet>

      <HabitDetail
        habit={openHabit}
        states={(openHabit && statesByHabit.get(openHabit.id)) || noStates}
        notes={(openHabit && notesByHabit.get(openHabit.id)) || noNotes}
        openCount={active.length}
        wins={(openHabit && wins.get(openHabit.id)) || 0}
        today={today}
        onClose={() => setOpenId(null)}
        onArchive={(habit) => {
          setOpenId(null)
          void runSafe(setArchived, 'Could not archive')(habit, true)
        }}
      />

      <Sheet
        open={resetHabit !== null}
        onClose={() => setResetId(null)}
        title={resetHabit ? `${resetHabit.emoji} ${resetHabit.name}` : ''}
      >
        {resetHabit && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              A gap is data about the setup, not about you. What got in the way? One tap, it only feeds Sunday.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MISS_REASONS.map(([reason, label]) => (
                <Button
                  key={reason}
                  variant="ghost"
                  onClick={() => {
                    void runSafe(setDayState, 'Could not save')(resetHabit.id, yesterday, 'fail', reason)
                    setResetId(null)
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              This is the Spock test: facts, not blame. Now fix the setup within ten minutes:
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setOpenId(resetHabit.id)
                setResetId(null)
              }}
            >
              Move the anchor or shrink the floor
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setResetId(null)
                void runSafe(setArchived, 'Could not archive')(resetHabit, true)
              }}
            >
              🗄 Pause this habit
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet
        open={pickHabit !== null}
        onClose={() => {
          setPickId(null)
          setReasonFor(null)
        }}
        title={pickHabit ? `${pickHabit.emoji} ${pickHabit.name}` : ''}
      >
        {pickHabit && (
          <div className="space-y-2">
            {pickHabit.normal && <p className="text-sm text-slate-500">Normal: {pickHabit.normal}</p>}
            {pickHabit.direction === 'avoid' &&
              pickHabit.graceScope === 'day' &&
              (slipsByHabit.get(pickHabit.id)?.get(today) ?? 0) > 0 && (
                <Button
                  className="w-full"
                  onClick={() => {
                    const n = slipsByHabit.get(pickHabit.id)?.get(today) ?? 0
                    void runSafe(setSlipCount, 'Could not save')(pickHabit.id, today, n - 1)
                    setPickId(null)
                  }}
                >
                  ↩ Undo one slip
                </Button>
              )}
            {pickHabit.floor && <p className="text-sm text-slate-500">Floor: {pickHabit.floor}</p>}
            {reasonFor === null ? (
              (
                [
                  ['done', 'Normal: done as usual'],
                  ['floor', 'Floor: only the minimum'],
                  ['skip', 'Rest day'],
                  ['fail', 'Missed'],
                ] as const
              ).map(([state, label]) => (
                <Button
                  key={state}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    if (state === 'skip' || state === 'fail') {
                      setReasonFor(state)
                      return
                    }
                    void runSafe(setDayState, 'Could not save')(pickHabit.id, today, state)
                    setPickId(null)
                  }}
                >
                  {STATE_ICON[state]} {label}
                </Button>
              ))
            ) : (
              <>
                {reasonFor === 'skip' &&
                  restWarnings(
                    habitStats(pickHabit, statesByHabit.get(pickHabit.id) ?? noStates, today),
                    statesByHabit.get(pickHabit.id)?.get(today) === 'skip',
                  ).map((w) => (
                    <p key={w} className="rounded-lg bg-amber-300/15 p-2 text-sm text-amber-800 dark:text-amber-200">
                      {w}
                    </p>
                  ))}
                {reasonFor === 'skip' && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      void runSafe(setDayState, 'Could not save')(pickHabit.id, today, 'floor')
                      setPickId(null)
                      setReasonFor(null)
                    }}
                  >
                    ◐ Do the floor instead
                  </Button>
                )}
                <p className="text-sm text-slate-500">
                  {reasonFor === 'skip'
                    ? 'A rest day is fine. What was it?'
                    : 'A systems problem, not a flaw. What got in the way?'}{' '}
                  One tap.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(reasonFor === 'skip' ? REST_REASONS : MISS_REASONS).map(([reason, label]) => (
                    <Button
                      key={reason}
                      variant="ghost"
                      onClick={() => {
                        void runSafe(setDayState, 'Could not save')(pickHabit.id, today, reasonFor, reason)
                        setPickId(null)
                        setReasonFor(null)
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    void runSafe(setDayState, 'Could not save')(pickHabit.id, today, reasonFor)
                    setPickId(null)
                    setReasonFor(null)
                  }}
                >
                  No reason
                </Button>
              </>
            )}
            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                void runSafe(setDayState, 'Could not save')(pickHabit.id, today, null)
                setPickId(null)
              }}
            >
              Clear today
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
