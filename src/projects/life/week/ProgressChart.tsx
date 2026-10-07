import { useState } from 'react'
import type { LifeEntry, LifeWeek } from '../../../lib/db'
import { Card } from '../../../components/Card'
import { summarizeWeek } from '../model'

const W = 320
const H = 130
const PAD_L = 30
const PAD_T = 8
const MAX_WEEKS = 12
const SERIES = [
  { key: 'focus', label: 'Focus', stroke: 'stroke-sky-400', fill: 'fill-sky-400', text: 'text-sky-500' },
  {
    key: 'checkins',
    label: 'Check-ins',
    stroke: 'stroke-emerald-400',
    fill: 'fill-emerald-400',
    text: 'text-emerald-500',
  },
  { key: 'tasks', label: 'Things sent', stroke: 'stroke-amber-400', fill: 'fill-amber-400', text: 'text-amber-500' },
] as const
type Key = (typeof SERIES)[number]['key']

const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : null)

/** Percent of focus / check-ins / Things done per week, one line each, oldest to newest. The current week is the hollow dotted end point. Plain SVG. */
export function ProgressChart({
  weeks,
  entries,
  currentWeek,
}: {
  weeks: LifeWeek[]
  entries: LifeEntry[]
  currentWeek: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const points = weeks
    .slice(0, MAX_WEEKS)
    .reverse()
    .map((w) => {
      const s = summarizeWeek(w.plan, entries)
      return {
        week: w.week,
        current: w.week === currentWeek,
        focus: pct(s.focusDone.size, w.plan.focus.length),
        checkins: pct(s.checkins.filter((c) => c.done).length, s.checkins.length),
        tasks: pct(w.plan.tasks.filter((t) => s.sentTaskIds.has(t.id)).length, w.plan.tasks.length),
      } satisfies Record<Key, number | null> & { week: string; current: boolean }
    })
  if (points.length < 2) return null

  const plotW = W - PAD_L - 6
  const plotH = H - PAD_T
  const x = (i: number) => PAD_L + (points.length === 1 ? 0 : (i / (points.length - 1)) * plotW)
  const y = (v: number) => PAD_T + plotH - (v / 100) * plotH
  const shown = active !== null ? points[active] : undefined

  return (
    <Card className="mb-4 space-y-2">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Progress, % done per week</p>
      <svg
        viewBox={`0 0 ${W} ${H + 14}`}
        className="w-full"
        role="img"
        aria-label={`Percent of focus, check-ins and Things done over the last ${points.length} weeks`}
      >
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              x2={W}
              y1={y(v)}
              y2={y(v)}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeDasharray="3 3"
            />
            <text x="0" y={y(v) + 3} className="fill-slate-500 text-[9px]">
              {v}%
            </text>
          </g>
        ))}
        {SERIES.map((s) => {
          const pts = points.map((p, i) => ({ i, v: p[s.key], current: p.current })).filter((p) => p.v !== null)
          return (
            <g key={s.key}>
              {pts.slice(1).map((p, j) => {
                const a = pts[j]!
                return (
                  <line
                    key={p.i}
                    x1={x(a.i)}
                    y1={y(a.v!)}
                    x2={x(p.i)}
                    y2={y(p.v!)}
                    className={s.stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={p.current ? '2 3' : undefined}
                  />
                )
              })}
              {pts.map((p) => (
                <circle
                  key={p.i}
                  cx={x(p.i)}
                  cy={y(p.v!)}
                  r="3"
                  strokeWidth="1.5"
                  className={p.current ? `${s.stroke} fill-white dark:fill-slate-900` : `${s.fill} ${s.stroke}`}
                />
              ))}
            </g>
          )
        })}
        {points.map((p, i) => {
          const slot = plotW / Math.max(points.length - 1, 1)
          return (
            <rect
              key={p.week}
              x={x(i) - slot / 2}
              y={0}
              width={slot}
              height={H}
              className="fill-transparent"
              onPointerEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <title>{p.week}</title>
            </rect>
          )
        })}
        <text x={PAD_L} y={H + 11} className="fill-slate-500 text-[9px]">
          {points[0]!.week.slice(5)}
        </text>
        <text x={W} y={H + 11} textAnchor="end" className="fill-slate-500 text-[9px]">
          {points[points.length - 1]!.week.slice(5)}
        </text>
      </svg>
      <p className="flex min-h-4 flex-wrap gap-x-3 text-xs text-slate-600 dark:text-slate-300">
        {shown ? (
          <>
            <span>
              {shown.week}
              {shown.current ? ' (in progress)' : ''}
            </span>
            {SERIES.map((s) => (
              <span key={s.key}>
                <span className={s.text}>●</span> {s.label} {shown[s.key] === null ? '–' : `${shown[s.key]}%`}
              </span>
            ))}
          </>
        ) : (
          'Hover or tap a week for its numbers'
        )}
      </p>
    </Card>
  )
}
