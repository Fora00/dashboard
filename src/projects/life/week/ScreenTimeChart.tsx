import { Card } from '../../../components/Card'
import type { LifeEntry, LifeWeek } from '../../../lib/db'
import { formatDuration } from '../format'
import { buildScreenTime } from './screenTime'

const W = 320
const H = 120
const PAD_L = 34
const PAD_T = 8
const MAX_WEEKS = 12
type Color = { stroke: string; fill: string; text: string }
// One fixed colour per question id, so a category keeps its colour whatever else was filled in.
const COLORS: Record<string, Color> = {
  'screen-total': { stroke: 'stroke-sky-400', fill: 'fill-sky-400', text: 'text-sky-500' },
  'screen-avg': { stroke: 'stroke-violet-400', fill: 'fill-violet-400', text: 'text-violet-500' },
  'screen-social': { stroke: 'stroke-amber-400', fill: 'fill-amber-400', text: 'text-amber-500' },
  'screen-entertainment': { stroke: 'stroke-red-400', fill: 'fill-red-400', text: 'text-red-500' },
  'screen-productivity': { stroke: 'stroke-blue-500', fill: 'fill-blue-500', text: 'text-blue-600' },
  'screen-creativity': { stroke: 'stroke-fuchsia-400', fill: 'fill-fuchsia-400', text: 'text-fuchsia-500' },
  'screen-games': { stroke: 'stroke-orange-400', fill: 'fill-orange-400', text: 'text-orange-500' },
  'screen-info': { stroke: 'stroke-rose-400', fill: 'fill-rose-400', text: 'text-rose-500' },
  'screen-education': { stroke: 'stroke-indigo-400', fill: 'fill-indigo-400', text: 'text-indigo-500' },
  'screen-health': { stroke: 'stroke-lime-500', fill: 'fill-lime-500', text: 'text-lime-600' },
  'screen-utilities': { stroke: 'stroke-slate-400', fill: 'fill-slate-400', text: 'text-slate-500' },
  'screen-travel': { stroke: 'stroke-cyan-400', fill: 'fill-cyan-400', text: 'text-cyan-500' },
  'screen-shopping': { stroke: 'stroke-pink-400', fill: 'fill-pink-400', text: 'text-pink-500' },
  'screen-other': { stroke: 'stroke-emerald-400', fill: 'fill-emerald-400', text: 'text-emerald-500' },
}
const FALLBACK: Color = { stroke: 'stroke-slate-300', fill: 'fill-slate-300', text: 'text-slate-400' }
const colorOf = (id: string): Color => COLORS[id] ?? FALLBACK

/** Phone screen time from the Sunday check: daily-average duration questions as lines per label, plus the latest top-apps list. Plain SVG; renders nothing without data. */
export function ScreenTimeChart({
  weeks,
  entries,
  currentWeek,
}: {
  weeks: LifeWeek[]
  entries: LifeEntry[]
  currentWeek: string
}) {
  const data = buildScreenTime(weeks, entries, currentWeek, MAX_WEEKS)
  if (data.series.length === 0 && !data.apps) return null

  const n = data.weeks.length
  const maxMin = Math.max(60, ...data.series.flatMap((s) => s.values.filter((v): v is number => v !== null)))
  const top = Math.ceil(maxMin / 60) * 60
  const plotW = W - PAD_L - 6
  const plotH = H - PAD_T
  const x = (i: number) => PAD_L + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2)
  const y = (v: number) => PAD_T + plotH - (v / top) * plotH
  const appMax = Math.max(1, ...(data.apps?.rows.map((r) => r.minutes) ?? [1]))

  return (
    <Card className="mb-4 space-y-3">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">📱 Screen time</p>
      {data.series.length > 0 && (
        <>
          <p className="flex flex-wrap gap-x-3 text-xs text-slate-600 dark:text-slate-300">
            {data.series.map((s) => (
              <span key={s.label}>
                <span className={colorOf(s.id).text}>●</span> {s.label}
              </span>
            ))}
          </p>
          <svg
            viewBox={`0 0 ${W} ${H + 14}`}
            className="w-full"
            role="img"
            aria-label={`Screen time per week over the last ${n} weeks`}
          >
            {[0, top / 2, top].map((v) => (
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
                  {formatDuration(v)}
                </text>
              </g>
            ))}
            {data.series.map((s) => {
              const c = colorOf(s.id)
              const pts = s.values.map((v, i) => ({ v, i })).filter((p) => p.v !== null)
              return (
                <g key={s.label}>
                  {pts.slice(1).map((p, j) => (
                    <line
                      key={p.i}
                      x1={x(pts[j]!.i)}
                      y1={y(pts[j]!.v!)}
                      x2={x(p.i)}
                      y2={y(p.v!)}
                      className={c.stroke}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ))}
                  {pts.map((p) => (
                    <circle key={p.i} cx={x(p.i)} cy={y(p.v!)} r="3" className={`${c.fill} ${c.stroke}`}>
                      <title>{`${s.label} ${formatDuration(p.v!)} · ${data.weeks[p.i]}`}</title>
                    </circle>
                  ))}
                </g>
              )
            })}
            <text x={PAD_L} y={H + 11} className="fill-slate-500 text-[9px]">
              {data.weeks[0]?.slice(5)}
            </text>
            <text x={W} y={H + 11} textAnchor="end" className="fill-slate-500 text-[9px]">
              {data.weeks[n - 1]?.slice(5)}
            </text>
          </svg>
        </>
      )}
      {data.apps && (
        <div className="space-y-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Top apps · week of {data.apps.week}</p>
          {data.apps.rows.map((r) => {
            const prev = data.apps!.previous.get(r.app.toLowerCase())
            const delta = prev === undefined ? null : r.minutes - prev
            return (
              <div key={r.app} className="text-xs">
                <div className="flex justify-between gap-2 text-slate-700 dark:text-slate-200">
                  <span className="truncate">{r.app}</span>
                  <span className="shrink-0">
                    {formatDuration(r.minutes)}
                    {delta !== null && delta !== 0 && (
                      <span
                        className={delta > 0 ? 'text-rose-500' : 'text-emerald-500'}
                      >{` ${delta > 0 ? '+' : '−'}${formatDuration(Math.abs(delta))}`}</span>
                    )}
                  </span>
                </div>
                <div className="mt-0.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-sky-400"
                    style={{ width: `${Math.max(2, (r.minutes / appMax) * 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
