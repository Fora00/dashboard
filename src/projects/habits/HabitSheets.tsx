import type { Dispatch } from 'react'
import type { HabitDayState } from '../../lib/db'
import { Button } from '../../components/Button'
import { Sheet } from '../../components/Sheet'
import { setArchived, setDayCount, setDayState, setSlipCount } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { HabitDetail } from './HabitDetail'
import { NO_SHEET, type HabitSheet, type HabitSheetAction } from './useHabitSheets'
import type { HabitDaysData } from './habitDaysData'
import { habitStats, restWarnings, shiftDayKey } from './habitStats'
import { MISS_REASONS, NEG_OVERSHOOT_ICON, OVERSHOOT_ICON, REST_REASONS, slipLimit, STATE_ICON } from './habitStates'

const noStates = new Map<string, HabitDayState>()
const noNotes = new Map<string, string>()

interface Props {
  data: HabitDaysData
  today: string
  sheet: HabitSheet
  dispatch: Dispatch<HabitSheetAction>
}

/** The Habits sheets (slip, today's state with its reason, reset, detail),
 *  shared by the Habits page and Life: all open in place. */
export function HabitSheets({ data, today, sheet, dispatch }: Props) {
  const find = (kind: HabitSheet['kind']) =>
    sheet.kind === kind && sheet.kind !== 'none' ? (data.habits.find((h) => h.id === sheet.id) ?? null) : null
  const openHabit = find('detail')
  const slipHabit = find('slip')
  const pickHabit = find('pick')
  const resetHabit = find('reset')
  const reasonFor = sheet.kind === 'pick' ? sheet.reasonFor : null
  const close = () => dispatch(NO_SHEET)
  const save = runSafe(setDayState, 'Could not save')
  const statesOf = (id: string) => data.states.get(id) ?? noStates
  const slipsToday = (id: string) => data.slips.get(id)?.get(today) ?? 0

  return (
    <>
      <Sheet open={slipHabit !== null} onClose={close} title={slipHabit ? `${slipHabit.emoji} ${slipHabit.name}` : ''}>
        {slipHabit && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              A slip is one data point, not a verdict. Never twice in a row is the goal.
            </p>
            {slipHabit.anchor && <p className="text-sm text-slate-500">Instead: {slipHabit.anchor}</p>}
            {(slipHabit.grace ?? 0) > 0 &&
              (() => {
                const st = habitStats(slipHabit, statesOf(slipHabit.id), today)
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
                  void save(slipHabit.id, today, 'floor')
                  close()
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
                    void save(slipHabit.id, today, 'fail', reason)
                    close()
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
                void save(slipHabit.id, today, 'fail', '')
                close()
              }}
            >
              No reason
            </Button>
          </div>
        )}
      </Sheet>

      <HabitDetail
        habit={openHabit}
        states={(openHabit && data.states.get(openHabit.id)) || noStates}
        notes={(openHabit && data.notes.get(openHabit.id)) || noNotes}
        openCount={data.active.length}
        wins={(openHabit && data.wins.get(openHabit.id)) || 0}
        today={today}
        onClose={close}
        onArchive={(habit) => {
          close()
          void runSafe(setArchived, 'Could not archive')(habit, true)
        }}
      />

      <Sheet
        open={resetHabit !== null}
        onClose={close}
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
                    void save(resetHabit.id, shiftDayKey(today, -1), 'fail', reason)
                    close()
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              This is the Spock test: facts, not blame. Now fix the setup within ten minutes:
            </p>
            <Button className="w-full" onClick={() => dispatch({ kind: 'detail', id: resetHabit.id })}>
              Move the anchor or shrink the floor
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                close()
                void runSafe(setArchived, 'Could not archive')(resetHabit, true)
              }}
            >
              🗄 Pause this habit
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet open={pickHabit !== null} onClose={close} title={pickHabit ? `${pickHabit.emoji} ${pickHabit.name}` : ''}>
        {pickHabit && (
          <div className="space-y-2">
            {pickHabit.normal && <p className="text-sm text-slate-500">Normal: {pickHabit.normal}</p>}
            {pickHabit.direction === 'avoid' &&
              slipsToday(pickHabit.id) >= (pickHabit.graceScope === 'day' ? slipLimit(pickHabit) : 1) && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() =>
                    void runSafe(setSlipCount, 'Could not save')(pickHabit.id, today, slipsToday(pickHabit.id) + 1)
                  }
                >
                  {NEG_OVERSHOOT_ICON} {slipsToday(pickHabit.id)}/{slipLimit(pickHabit)}
                </Button>
              )}
            {pickHabit.direction === 'avoid' && pickHabit.graceScope === 'day' && slipsToday(pickHabit.id) > 0 && (
              <Button
                className="w-full"
                onClick={() => {
                  void runSafe(setSlipCount, 'Could not save')(pickHabit.id, today, slipsToday(pickHabit.id) - 1)
                  close()
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
                      dispatch({ kind: 'reason', reasonFor: state })
                      return
                    }
                    void save(pickHabit.id, today, state)
                    close()
                  }}
                >
                  {STATE_ICON[state]} {label}
                </Button>
              ))
            ) : (
              <>
                {reasonFor === 'skip' &&
                  restWarnings(
                    habitStats(pickHabit, statesOf(pickHabit.id), today),
                    statesOf(pickHabit.id).get(today) === 'skip',
                  ).map((w) => (
                    <p key={w} className="rounded-lg bg-amber-300/15 p-2 text-sm text-amber-800 dark:text-amber-200">
                      {w}
                    </p>
                  ))}
                {reasonFor === 'skip' && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      void save(pickHabit.id, today, 'floor')
                      close()
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
                      className="aria-pressed:ring-2 aria-pressed:ring-slate-400"
                      aria-pressed={
                        statesOf(pickHabit.id).get(today) === reasonFor &&
                        data.notes.get(pickHabit.id)?.get(today) === reason
                      }
                      onClick={() => {
                        void save(pickHabit.id, today, reasonFor, reason)
                        close()
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
                    void save(pickHabit.id, today, reasonFor, '')
                    close()
                  }}
                >
                  No reason
                </Button>
              </>
            )}
            {pickHabit.direction !== 'avoid' &&
              reasonFor === null &&
              (() => {
                const n = data.counts.get(pickHabit.id)?.get(today) ?? 0
                if (n < (pickHabit.perDay ?? 1)) return null
                return (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => void runSafe(setDayCount, 'Could not save')(pickHabit.id, today, n + 1)}
                  >
                    {OVERSHOOT_ICON}
                    {n > (pickHabit.perDay ?? 1) ? ` ${n}/${pickHabit.perDay ?? 1}` : ''}
                  </Button>
                )
              })()}
            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                void save(pickHabit.id, today, null)
                close()
              }}
            >
              Clear today
            </Button>
          </div>
        )}
      </Sheet>
    </>
  )
}
