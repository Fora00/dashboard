import { useState } from 'react'
import { MONTHS_IT } from './moneyPeriod'

// One line over the months of the history (2px, sky), optionally over a thin
// grey line of the raw monthly values it summarises. One y scale: from zero,
// or (`fit`) just around the values so a slow trend is visible, with the
// top and bottom of the scale written on the left either way. The SVG stretches to the width (strokes keep their size); month
// names and the tooltip are HTML so they stay readable on a phone. Hover,
// focus or tap a month for its values.

const H = 150
const PAD = 10

export interface TrendRow {
  label: string
  values: readonly (number | null)[]
}

interface Props {
  months: readonly string[]
  line: TrendRow
  bars?: TrendRow
  /** Scale around the values instead of from zero. */
  fit?: boolean
  format: (v: number) => string
  /** Accessible name of the chart. */
  title: string
}

const nameOf = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`

export function MoneyTrendChart({ months, line, bars, fit = false, format, title }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const n = months.length
  const all = [...line.values, ...(bars?.values ?? [])].filter((v): v is number => v !== null)
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const slack = fit ? (hi - lo) * 0.08 || Math.abs(hi) * 0.05 || 1 : 0
  const max = fit ? hi + slack : Math.max(0, hi)
  const min = fit ? lo - slack : Math.min(0, lo)
  const range = max - min || 1
  const y = (v: number) => PAD + ((max - v) / range) * H
  const x = (i: number) => i + 0.5
  // Paths with gaps where there is no value.
  const pathOf = (vs: readonly (number | null)[]) => {
    let d = ''
    let pen = false
    vs.forEach((v, i) => {
      if (v === null) return void (pen = false)
      d += `${pen ? 'L' : 'M'}${x(i)},${y(v)}`
      pen = true
    })
    return d
  }
  const d = pathOf(line.values)
  const every = Math.ceil(n / 8)

  return (
    <div>
      <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        <span>
          <span className="mr-1 inline-block w-4 border-t-2 border-sky-600 align-middle" />
          {line.label}
        </span>
        {bars && (
          <span>
            <span className="mr-1 inline-block w-4 border-t border-slate-400 align-middle dark:border-slate-500" />
            {bars.label}
          </span>
        )}
      </p>
      <div
        className="relative"
        style={{ height: H + 2 * PAD + 18 }}
        role="group"
        aria-label={title}
        onMouseLeave={() => setActive(null)}
      >
        <svg
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: H + 2 * PAD }}
          viewBox={`0 0 ${n || 1} ${H + 2 * PAD}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {min <= 0 && max >= 0 && (
            <line
              x1={0}
              x2={n}
              y1={y(0)}
              y2={y(0)}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          )}
          {bars && (
            <path
              d={pathOf(bars.values)}
              fill="none"
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          )}
          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD}
              y2={PAD + H}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path d={d} fill="none" className="stroke-sky-600" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
          style={{ top: PAD - 12 }}
        >
          {format(Math.round(max))}
        </span>
        <span
          className="pointer-events-none absolute left-0 text-[10px] text-slate-500 tabular-nums dark:text-slate-400"
          style={{ top: PAD + H + 1 }}
        >
          {format(Math.round(min))}
        </span>
        <div className="absolute inset-0 flex">
          {months.map((m, i) => (
            <button
              key={m}
              type="button"
              className="relative h-full min-w-0 flex-1 focus-visible:bg-slate-100/60 focus-visible:outline-none dark:focus-visible:bg-slate-800/60"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={`${nameOf(m)}: ${line.label} ${fmt(line.values[i], format)}${
                bars ? `; ${bars.label} ${fmt(bars.values[i], format)}` : ''
              }`}
            >
              {i % every === 0 && (
                <span className="absolute inset-x-0 bottom-0 text-center text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {nameOf(m)}
                </span>
              )}
            </button>
          ))}
        </div>
        {active !== null && months[active] && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 w-52 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900"
            style={{ left: `clamp(0px, calc(${((active + 0.5) / n) * 100}% - 6.5rem), calc(100% - 13rem))` }}
          >
            <p className="mb-1 font-medium">{nameOf(months[active])}</p>
            <p className="flex justify-between gap-3 tabular-nums">
              <span className="text-slate-500 dark:text-slate-400">{line.label}</span>
              {fmt(line.values[active], format)}
            </p>
            {bars && (
              <p className="flex justify-between gap-3 tabular-nums">
                <span className="text-slate-500 dark:text-slate-400">{bars.label}</span>
                {fmt(bars.values[active], format)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const fmt = (v: number | null | undefined, f: (v: number) => string) => (v === null || v === undefined ? '—' : f(v))
