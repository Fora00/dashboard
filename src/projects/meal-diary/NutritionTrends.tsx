import { useMemo, useState } from 'react'
import type { MealEntry } from '../../lib/db'
import { dayKey } from '../../lib/dates'
import { Card } from '../../components/Card'
import { MACRO_EMOJI, averageOfLogged, lastDays, macroSplit } from './nutrition'

const RANGES = [7, 14, 30] as const
const W = 320
const H = 120
const SEG = { protein: 'fill-rose-500', carbs: 'fill-amber-400', fat: 'fill-sky-500' } as const

/** Calories per day as stacked bars (protein / carbs / fat by calorie share), plus the average macro split. Plain SVG, no library. */
export function NutritionTrends({ entries, now }: { entries: MealEntry[]; now: Date }) {
  const [open, setOpen] = useState(true)
  const [range, setRange] = useState<(typeof RANGES)[number]>(7)
  const [active, setActive] = useState<string | null>(null)
  const points = useMemo(() => lastDays(entries, now, range, dayKey), [entries, now, range])
  const avg = averageOfLogged(points)
  if (!avg) return null

  const max = Math.max(...points.map((p) => p.kcal), avg.kcal, 1)
  const slot = W / points.length
  const bar = Math.max(2, slot * 0.7)
  const y = (kcal: number) => (kcal / max) * (H - 16)
  const split = macroSplit(avg)
  const showTotals = points.length <= 14
  const detail = (p: (typeof points)[number]) =>
    p.counted === 0
      ? `${p.day}: nothing logged`
      : `${p.day}: ${p.approximate ? '≈ ' : ''}${p.kcal} kcal · ${MACRO_EMOJI.proteinG} ${p.proteinG} g (${Math.round(p.proteinG * 4)} kcal) · ${MACRO_EMOJI.carbsG} ${p.carbsG} g (${Math.round(p.carbsG * 4)} kcal) · ${MACRO_EMOJI.fatG} ${p.fatG} g (${Math.round(p.fatG * 9)} kcal)`
  const activePoint = points.find((p) => p.day === active)

  return (
    <Card className="mb-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            title={open ? 'Hide trends' : 'Show trends'}
            className="flex min-h-10 items-center gap-1.5"
          >
            <span aria-hidden="true" className="text-xs">
              {open ? '▾' : '▸'}
            </span>
            📊 Trends
          </button>
        </h2>
        {open && (
          <div className="flex gap-1" role="group" aria-label="Range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={range === r}
                title={`Last ${r} days`}
                onClick={() => setRange(r)}
                className={`min-h-10 min-w-10 rounded-lg px-2 text-xs ${range === r ? 'bg-(color:--accent-selected) text-(color:--accent-fg)' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {r}d
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <>
          <p
            className="text-xs text-slate-500 dark:text-slate-400"
            title={`Average over the ${avg.days} day(s) with values; empty days are skipped`}
          >
            {MACRO_EMOJI.kcal} avg {avg.kcal} kcal · {MACRO_EMOJI.proteinG} {avg.proteinG} g · {MACRO_EMOJI.carbsG}{' '}
            {avg.carbsG} g · {MACRO_EMOJI.fatG} {avg.fatG} g
          </p>

          <svg
            viewBox={`0 0 ${W} ${H + 14}`}
            className="w-full"
            role="img"
            aria-label={`Calories per day over the last ${range} days, average ${avg.kcal} kcal`}
          >
            <line
              x1="0"
              x2={W}
              y1={H - y(avg.kcal)}
              y2={H - y(avg.kcal)}
              className="stroke-slate-400"
              strokeDasharray="3 3"
              strokeWidth="1"
            >
              <title>{`Average ${avg.kcal} kcal`}</title>
            </line>
            {points.map((p, i) => {
              const x = i * slot + (slot - bar) / 2
              const macroKcal = p.proteinG * 4 + p.carbsG * 4 + p.fatG * 9
              const h = y(p.kcal)
              const parts = [
                ['protein', p.proteinG * 4],
                ['carbs', p.carbsG * 4],
                ['fat', p.fatG * 9],
              ] as const
              let top = H
              return (
                <g key={p.day} onPointerEnter={() => setActive(p.day)} onClick={() => setActive(p.day)}>
                  <title>{detail(p)}</title>
                  {/* hit area so empty/short days are still hoverable */}
                  <rect x={i * slot} y={0} width={slot} height={H} className="fill-transparent" />
                  {p.counted > 0 &&
                    parts.map(([k, kc]) => {
                      const sh = macroKcal > 0 ? h * (kc / macroKcal) : 0
                      top -= sh
                      return sh > 0 ? <rect key={k} x={x} y={top} width={bar} height={sh} className={SEG[k]} /> : null
                    })}
                  {p.counted > 0 && macroKcal === 0 && (
                    <rect x={x} y={H - h} width={bar} height={h} className="fill-slate-400" />
                  )}
                  {showTotals && p.counted > 0 && (
                    <text
                      x={i * slot + slot / 2}
                      y={Math.max(9, H - h - 3)}
                      textAnchor="middle"
                      className="fill-slate-600 text-[9px] dark:fill-slate-300"
                    >
                      {p.kcal}
                    </text>
                  )}
                </g>
              )
            })}
            <line x1="0" x2={W} y1={H} y2={H} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
            <text x="0" y={H + 11} className="fill-slate-500 text-[9px]">
              {points[0]!.day.slice(5)}
            </text>
            <text x={W} y={H + 11} textAnchor="end" className="fill-slate-500 text-[9px]">
              {points[points.length - 1]!.day.slice(5)}
            </text>
          </svg>
          <p className="min-h-4 text-xs text-slate-600 dark:text-slate-300">
            {activePoint ? detail(activePoint) : 'Hover or tap a day for its numbers'}
          </p>

          <div title="Share of calories from protein / carbs / fat in the average day">
            <div
              className="flex h-2.5 overflow-hidden rounded-full"
              role="img"
              aria-label={`Average split: protein ${split.protein}%, carbs ${split.carbs}%, fat ${split.fat}%`}
            >
              <div className="bg-rose-500" style={{ width: `${split.protein}%` }} />
              <div className="bg-amber-400" style={{ width: `${split.carbs}%` }} />
              <div className="bg-sky-500" style={{ width: `${split.fat}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {MACRO_EMOJI.proteinG} Protein {split.protein}% · {MACRO_EMOJI.carbsG} Carbs {split.carbs}% ·{' '}
              {MACRO_EMOJI.fatG} Fat {split.fat}%
            </p>
          </div>
        </>
      )}
    </Card>
  )
}
