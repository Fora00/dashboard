import type { Habit, HabitDayState } from '../../lib/db'
import { buildRecap, recapPeriod, type MeasuredWeek } from './habitRecapData'
import { shortMinutes, weeklyAllowance, type AppsByWeek } from './habitMeasure'
import { shiftDayKey, weekStart } from './habitStats'
import { limitsSummary } from './habitSummary'

/** Weeks shown: this one and the three before. */
const WEEKS = 4

interface Props {
  habit: Habit
  /** This habit's day states and slips per day (habitDaysMaps). */
  states: ReadonlyMap<string, HabitDayState>
  slips: ReadonlyMap<string, number>
  apps: AppsByWeek
  today: string
}

const fmtWeek = (monday: string) =>
  new Date(`${monday}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })

/** The per-app view of an app-limits habit (Habit.measure 'app-limits'): for
 *  the last weeks, each limited app's minutes against 7 x its daily limit and
 *  the extensions they prove, plus ticked vs verified vs counted slips. Weeks
 *  with no "App più usate" answer are "da verificare". Plain list, mobile-first. */
export function AppLimitsView({ habit, states, slips, apps, today }: Props) {
  const monday = weekStart(today)
  const weeks: MeasuredWeek[] = Array.from({ length: WEEKS }, (_, i) => shiftDayKey(monday, -7 * i)).flatMap((week) => {
    const [row] = buildRecap(
      [habit],
      new Map([[habit.id, states]]),
      new Map(),
      recapPeriod('week', week),
      today,
      undefined,
      new Map([[habit.id, slips]]),
      apps,
    )
    const m = row?.measured?.weeks[0]
    // Weeks before the habit started expect nothing: left out.
    return m && m.manualHit !== null ? [m] : []
  })
  const allowance = weeklyAllowance(habit)

  return (
    <details aria-label="Limiti app" className="group rounded-xl border border-slate-200 dark:border-slate-800">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-sm [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="text-slate-400 transition-transform group-open:rotate-90">
          ›
        </span>
        <span className="font-medium">📱 Limiti app</span>
        <span className="min-w-0 truncate text-slate-500 dark:text-slate-400">
          · {limitsSummary(habit.measureLimits?.length ?? 0, weeks)}
        </span>
      </summary>
      <div className="space-y-3 px-3 pb-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">Verifica dalla domenica (“App più usate”).</p>
        <ul className="space-y-1 text-sm">
          {(habit.measureLimits ?? []).map((l) => (
            <li key={l.app} className="flex min-h-8 items-center justify-between gap-2">
              <span className="truncate">{l.app}</span>
              <span className="shrink-0 text-slate-500 tabular-nums dark:text-slate-400">
                {shortMinutes(l.minutes)}/giorno · {shortMinutes(7 * l.minutes)}/sett.
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ogni 15 min oltre il limite settimanale = almeno un’estensione. Conta il più alto tra le spunte e il minimo
          verificato{allowance ? `; tollerate ${allowance} a settimana` : ''}.
        </p>
        {weeks.length === 0 && <p className="text-sm text-slate-500">Nessuna settimana ancora.</p>}
        <ul className="space-y-2">
          {weeks.map((w) => (
            <li key={w.week} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">
                  Sett. {fmtWeek(w.week)}
                  {w.week === monday && <span className="ml-1 text-xs text-slate-500">(questa)</span>}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    w.hit === null
                      ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      : w.hit
                        ? 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-400/20 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {w.hit === null ? 'da verificare' : w.hit ? 'ok ✓' : 'mancata'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 tabular-nums dark:text-slate-300">
                spuntate {w.manual} · verificate ≥{w.evidence ? w.evidence.verified : '?'} · contate{' '}
                {w.slips ?? `${w.manual} (solo spunte)`}
              </p>
              {w.evidence ? (
                <ul className="mt-2 space-y-0.5 text-xs">
                  {w.evidence.apps.map((a) => (
                    <li key={a.app} className="flex min-h-6 items-center justify-between gap-2">
                      <span className="truncate">{a.app}</span>
                      <span
                        className={`shrink-0 tabular-nums ${a.extensions > 0 ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {a.weekly === null
                          ? 'non inserita: nessun dato'
                          : `${shortMinutes(a.weekly)} / ${shortMinutes(a.allowed)}${a.extensions ? ` → +${a.extensions}` : ' ✓'}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-slate-500">Nessuna “App più usate” inserita: da verificare.</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
