import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db, type LifeEntry, type LifeWeek } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { useFlash } from '../../../lib/useFlash'
import { Card } from '../../../components/Card'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'
import { addMonths, buildMonthMarkdown, buildMonthReport, monthOf, monthRange, weekKey, parseDayKey } from '../model'
import type { MonthHabit, MonthStreak, MonthTracker, Reading } from '../model'
import { buildChartPoints } from './chartPoints'
import { recapMonths } from './monthRecap'
import { RecapItems } from './RecapSection'
import { HabitRecap } from '../../habits/HabitRecap'
import { buildRecap, recapPeriod } from '../../habits/habitRecapData'
import { reasonLabel } from '../../habits/habitStates'
import { activeDaysOf, habitDayStates, type HabitDays } from '../../habits/habitDayStates'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthName(m: string): string {
  return `${MONTHS[Number(m.slice(5, 7)) - 1] ?? m} ${m.slice(0, 4)}`
}

/** '2026-10-29' → '29 Oct'. */
function shortDay(day: string): string {
  return `${Number(day.slice(8, 10))} ${(MONTHS[Number(day.slice(5, 7)) - 1] ?? '').slice(0, 3)}`
}

const READING: Record<Reading, string> = { kept: 'Kept', half: 'Half', few: 'Few' }

const LINES = [
  { key: 'focus', label: 'Focus' },
  { key: 'habits', label: 'Habits' },
  { key: 'oggi', label: 'Oggi' },
  { key: 'casa', label: 'Casa' },
] as const

/** Mean of a chart line over the weeks starting in the month; null with no value. */
function lineMean(
  points: ReturnType<typeof buildChartPoints>,
  month: string,
  key: (typeof LINES)[number]['key'],
): number | null {
  const vals = points.filter((p) => monthOf(p.week) === month).flatMap((p) => (p[key] === null ? [] : [p[key]!]))
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
}

function Bars({ bars }: { bars: { key: string; label: string; value: number; shown: string }[] }) {
  return (
    <div className="flex items-end gap-1.5">
      {bars.map((b) => (
        <div key={b.key} className="flex w-9 flex-col items-center text-[10px] text-slate-600 dark:text-slate-300">
          <div className="flex h-8 w-6 items-end overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
            <div className="w-full bg-sky-500 dark:bg-sky-400" style={{ height: `${Math.max(b.value * 100, 4)}%` }} />
          </div>
          <span className="mt-0.5 font-medium">{b.shown}</span>
          <span className="text-slate-500 dark:text-slate-400">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

function HabitRow({
  name,
  reading,
  figure,
  bars,
  note,
}: {
  name: string
  reading: Reading | null
  figure: string
  bars: { key: string; label: string; value: number; shown: string }[]
  note?: string
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-baseline justify-between gap-2 text-sm text-slate-700 dark:text-slate-200">
        <span className="min-w-0 truncate font-medium">{name}</span>
        <span className="shrink-0 text-xs text-slate-600 dark:text-slate-300">
          {reading && <span className="mr-1.5 font-medium">{READING[reading]}</span>}
          {figure}
        </span>
      </p>
      <Bars bars={bars} />
      {note && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{note}</p>}
    </div>
  )
}

const weekLabel = (w: string) => shortDay(w)

function StreakRow({ s, first }: { s: MonthStreak; first: string }) {
  const days = s.done + s.missed
  const notes = [
    s.returns > 0 ? `↩ ${s.returns} return${s.returns === 1 ? '' : 's'} after a miss` : '',
    s.from > first ? `counted from ${shortDay(s.from)}` : '',
  ].filter(Boolean)
  return (
    <HabitRow
      name={`${s.emoji ? `${s.emoji} ` : ''}${s.name}`}
      reading={s.reading}
      figure={`${s.done} of ${days} days`}
      bars={s.weeks.map((w) => ({
        key: w.week,
        label: weekLabel(w.week),
        value: w.of ? w.done / w.of : 0,
        shown: `${w.done}/${w.of}`,
      }))}
      note={notes.join(' · ')}
    />
  )
}

function TrackerRow({ t }: { t: MonthTracker }) {
  return (
    <HabitRow
      name={`${t.emoji} ${t.label}`}
      reading={t.reading}
      figure={
        t.withTarget > 0 ? `target hit ${t.hit} of ${t.withTarget} weeks · ${t.total} in all` : `${t.total} in all`
      }
      bars={t.weeks.map((w) => ({
        key: w.week,
        label: weekLabel(w.week),
        value: w.target ? Math.min(w.total / w.target, 1) : w.total > 0 ? 1 : 0,
        shown: w.target ? `${w.total}/${w.target}` : String(w.total),
      }))}
    />
  )
}

/** The live Habits project for the picked month (read-only): the same month
 *  recap as on the Habits page. Streaks entries are no longer imported. */
function HabitsMonthCard({ month, today }: { month: string; today: string }) {
  const navigate = useNavigate()
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const checks = useLiveQuery(() => db.habitChecks.toArray(), [])
  if (!habits || !checks) return null
  const active = habits.filter((h) => h.archivedAt === undefined)
  if (active.length === 0) return null
  const activeDays = activeDaysOf(checks)
  const days = new Map<string, HabitDays>(active.map((h) => [h.id, habitDayStates(h, checks, activeDays, today)]))
  const states = new Map([...days].map(([id, d]) => [id, d.states]))
  const notes = new Map([...days].map(([id, d]) => [id, d.notes]))
  return (
    <Card>
      <HabitRecap
        kind="month"
        anchor={`${month}-01`}
        habits={active}
        states={states}
        notes={notes}
        counts={new Map([...days].map(([id, d]) => [id, d.counts]))}
        today={today}
        onOpen={() => void navigate('/habits')}
      />
    </Card>
  )
}

/** Read-only month check: what the month said per habit (Streaks + trackers),
 * the progress lines against last month, and the monthly question. Built from
 * the app's own data; nothing is stored here (the decision lives in Notion and
 * Things, taken with `/month`). */
export function MonthView({
  weeks,
  today,
  onBack,
}: {
  weeks: LifeWeek[] | undefined
  today: string
  onBack: () => void
}) {
  const entries = useLiveQuery<LifeEntry[]>(() => db.lifeEntries.toArray(), [])
  const dayFocus = useLiveQuery(() => db.lifeDayFocus.toArray(), [])
  const habitRows = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const habitChecks = useLiveQuery(() => db.habitChecks.toArray(), [])
  const liveHabits = habitRows?.filter((h) => h.archivedAt === undefined).length ?? 0
  const [picked, setPicked] = useState<string | null>(null)
  const [copied, flashCopied] = useFlash(2000)

  const loading = weeks === undefined || entries === undefined
  const thisMonth = monthOf(today)
  const months = loading
    ? []
    : [...new Set([thisMonth, ...weeks.map((w) => monthOf(w.week)), ...recapMonths(weeks).map((m) => m.month)])]
        .filter((m) => m <= thisMonth)
        .sort()
  const month = picked && months.includes(picked) ? picked : thisMonth
  const at = months.indexOf(month)

  const report = loading
    ? null
    : buildMonthReport(
        month,
        weeks.map((w) => w.plan),
        entries,
        today,
      )
  const points = loading ? [] : buildChartPoints(weeks, entries, weekKey(parseDayKey(today)), 60, dayFocus ?? [])
  const prev = addMonths(month, -1)
  const recap = loading ? undefined : recapMonths(weeks).find((m) => m.month === month)
  const criteria = (recap?.items ?? []).filter((i) => i.criterion && !i.closed)
  const hasHabits = !!report && report.streaks.length + report.trackers.length > 0
  const hasLines = LINES.some((l) => lineMean(points, month, l.key) !== null)

  async function exportMonth() {
    if (!report) return
    const lines = LINES.map((l) => ({
      label: l.label,
      now: lineMean(points, month, l.key),
      before: lineMean(points, prev, l.key),
    }))
    const live = (habitRows ?? []).filter((h) => h.archivedAt === undefined)
    const activeDays = activeDaysOf(habitChecks ?? [])
    const dayStates = new Map(live.map((h) => [h.id, habitDayStates(h, habitChecks ?? [], activeDays, today)]))
    const habits: MonthHabit[] = buildRecap(
      live,
      new Map([...dayStates].map(([id, d]) => [id, d.states])),
      new Map([...dayStates].map(([id, d]) => [id, d.notes])),
      recapPeriod('month', `${month}-01`),
      today,
      new Map([...dayStates].map(([id, d]) => [id, d.counts])),
    ).map((r) => ({
      emoji: r.habit.emoji,
      name: r.habit.name,
      avoid: r.habit.direction === 'avoid',
      done: r.done,
      floor: r.floor,
      skip: r.skip,
      fail: r.fail,
      empty: r.empty,
      expected: r.expected,
      hit: r.hit,
      graceUsed: r.graceUsed,
      extra: r.extra,
      reasons: Object.fromEntries(Object.entries(r.reasons).map(([k, n]) => [reasonLabel(k), n])),
    }))
    try {
      await navigator.clipboard.writeText(buildMonthMarkdown(report, lines, habits))
      flashCopied()
    } catch {
      // clipboard unavailable: nothing to fall back to here
    }
  }

  return (
    <div>
      <PageHeader emoji="🧭" title="Month" subtitle="How the month went, to decide go up, stay or go down.">
        <Button variant="ghost" onClick={onBack}>
          ← This week
        </Button>
      </PageHeader>
      {loading || !report ? (
        <SkeletonList rows={3} rowClassName="h-24" />
      ) : (
        <div className="max-w-xl space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" disabled={at <= 0} onClick={() => setPicked(months[at - 1]!)}>
              ‹
            </Button>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{monthName(month)}</p>
            <Button variant="ghost" disabled={at >= months.length - 1} onClick={() => setPicked(months[at + 1]!)}>
              ›
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {report.partial ? `1–${shortDay(report.upTo)}, month not over yet.` : `All of ${monthName(month)}.`} Streaks
            count the days with a verdict (rest days are skipped); weeks start in the month.
          </p>

          {hasLines && (
            <Card className="space-y-2">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">At a glance</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {LINES.map((l) => {
                  const now = lineMean(points, month, l.key)
                  const before = lineMean(points, prev, l.key)
                  const delta = now !== null && before !== null ? now - before : null
                  return (
                    <div key={l.key}>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {now === null ? '–' : `${now}%`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{l.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {delta === null
                          ? ''
                          : delta === 0
                            ? 'as ' + shortDay(`${prev}-01`).slice(-3)
                            : `${delta > 0 ? '+' : ''}${delta} vs ${shortDay(`${prev}-01`).slice(-3)}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          <HabitsMonthCard month={month} today={today} />

          {hasHabits ? (
            <Card className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-800 dark:text-slate-100">Habits</span> · {report.counts.kept}{' '}
                kept · {report.counts.half} half · {report.counts.few} few
              </p>
              {report.streaks.map((s) => (
                <StreakRow key={s.name} s={s} first={monthRange(month).first} />
              ))}
              {report.trackers.map((t) => (
                <TrackerRow key={`${t.emoji}${t.label}`} t={t} />
              ))}
            </Card>
          ) : liveHabits ? null : (
            <EmptyState
              emoji="🔎"
              title="No habit data this month"
              hint="Streaks (/streaks) and the week's trackers fill this in."
            />
          )}

          {criteria.length > 0 && <RecapItems week={recap!.week} items={criteria} />}

          <Card className="space-y-1 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-100">Go up, stay, or go down?</p>
            <p className="text-slate-600 dark:text-slate-300">
              {criteria.length > 0 ? 'Look at the criteria above, then decide.' : 'No written criteria this month.'} Run{' '}
              <span className="font-medium">/month</span> in Claude Code to go through each habit with the numbers.
              Nothing is saved here.
            </p>
            <Button variant="ghost" onClick={exportMonth}>
              {copied ? 'Copied ✓' : 'Export month for /month'}
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
