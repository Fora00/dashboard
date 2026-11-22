import type { Habit, HabitDayState } from '../../lib/db'
import { SectionTitle } from '../../components/SectionTitle'
import { Stat } from '../../components/Stat'
import { habitStats } from './habitStats'
import { HabitCalendar } from './HabitCalendar'
import { chipText, weekChip } from './habitCalendarData'
import { isAppLimits, type AppsByWeek } from './habitMeasure'
import { measuredOverview, type SummaryInput } from './habitSummary'

interface Props {
  habit: Habit
  states: ReadonlyMap<string, HabitDayState>
  /** Days with a stored check (habitRoute storedDaysOf). */
  storedDays: ReadonlySet<string>
  slips?: ReadonlyMap<string, number> | undefined
  apps?: AppsByWeek | undefined
  /** Lifetime wins of this habit: its boxes on the lifeboard. */
  wins: number
  today: string
}

/** The habit's overview block, the same in the quick sheet and on the page:
 *  the numbers, the last weeks' bars and the month calendar. A measured habit
 *  shows its measured weeks instead of tick-only numbers (habitSummary.ts). */
export function HabitOverview(props: Props) {
  const { habit, states, storedDays, slips, apps, today } = props
  return (
    <div className="space-y-6">
      {isAppLimits(habit) ? (
        <MeasuredNumbers habit={habit} states={states} slips={slips} apps={apps} today={today} />
      ) : (
        <PlainNumbers {...props} />
      )}
      <HabitCalendar habit={habit} states={states} storedDays={storedDays} slips={slips} apps={apps} today={today} />
    </div>
  )
}

function PlainNumbers({ habit, states, wins, today }: Props) {
  const s = habitStats(habit, states, today)
  const unit = s.streakUnit === 'weeks' ? 'w' : 'd'
  return (
    <>
      <section aria-label="Numeri" className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
        <Stat label="vittorie per sempre" value={String(wins)} sub="caselle sulla Board" />
        <Stat
          label="giorni fatti"
          value={String(s.doneTotal)}
          sub={s.floor30 ? `${s.floor30} minimo negli ultimi 30` : undefined}
        />
        <Stat label="questa settimana" value={`${s.week.done}/${s.week.expected || s.target}`} />
        <Stat label="serie attuale" value={`${s.streak}${unit}`} />
        <Stat label="serie più lunga" value={`${s.bestStreak}${unit}`} />
        <Stat label="ripartenze" value={String(s.returns)} sub="dopo un mancato" />
        {s.cycle && <Stat label="giorno del ciclo" value={`${s.cycle.day}/${s.cycle.length}`} />}
      </section>

      {s.lastWeeks.length > 0 && (
        <section aria-label="Settimane">
          <SectionTitle as="h3">Ultime settimane (obiettivo {s.target}/sett.)</SectionTitle>
          <div className="flex items-end gap-1.5">
            {[...s.lastWeeks, s.week].map((w) => (
              <div
                key={w.start}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${w.start}: ${w.done}/${w.expected}`}
              >
                <div className="flex h-14 w-full items-end rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`w-full rounded ${w.hit ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ height: `${Math.min(100, (w.done / Math.max(1, s.target)) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">{w.start.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/** A measured habit: weeks judged on the Sunday apps answer. No day streak,
 *  no lifeboard wins, no "came back": those count ticks alone. */
function MeasuredNumbers(input: SummaryInput) {
  const o = measuredOverview(input)
  const cycle = habitStats(input.habit, input.states, input.today).cycle
  const chip = weekChip(o.current)
  return (
    <>
      <section aria-label="Numeri" className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
        <Stat
          label="sett. rispettate"
          value={`${o.hitWeeks}/${o.verifiedWeeks}`}
          sub={`delle verificate, ultime ${o.weeks.length}`}
        />
        <Stat label="da verificare" value={String(o.unverifiedWeeks)} sub="senza “App più usate”" />
        <Stat label="questa settimana" value={chip ? chipText(chip) : '—'} sub="verifica domenica" />
        <Stat label="estensioni dimostrate" value={`≥${o.verified}`} sub={`spuntate ${o.manual}`} />
        {cycle && <Stat label="giorno del ciclo" value={`${cycle.day}/${cycle.length}`} />}
      </section>

      {o.weeks.length > 0 && (
        <section aria-label="Settimane">
          <SectionTitle as="h3">Ultime settimane (verificate dai dati)</SectionTitle>
          <div className="flex items-end gap-1.5">
            {o.weeks.map((w) => {
              const c = weekChip(w)
              return (
                <div
                  key={w.week}
                  className="flex flex-1 flex-col items-center gap-1"
                  title={`${w.week}: ${c ? chipText(c) : ''}`}
                >
                  <div
                    className={`flex h-14 w-full items-center justify-center rounded text-xs font-medium ${
                      w.hit === null
                        ? 'border border-dashed border-slate-400 text-slate-500 dark:border-slate-500 dark:text-slate-400'
                        : w.hit
                          ? 'bg-emerald-400 text-slate-900'
                          : 'bg-rose-400/60 text-rose-900 dark:text-rose-100'
                    }`}
                  >
                    {w.hit === null ? '?' : w.hit ? '✓' : '✕'}
                  </div>
                  <span className="text-[10px] text-slate-500">{w.week.slice(8)}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
