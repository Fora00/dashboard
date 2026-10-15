import type { LifeRecapItem } from '../../../lib/db'
import { Card } from '../../../components/Card'
import { CollapsibleSection } from './CollapsibleSection'

// Read-only recap, one calm row per item: bars for "kept the minimum" (done
// of the days, per week, current week outlined), a step line for a metric.
// One hue, no red/green; every mark also has its number, so nothing relies
// on color alone. A miss is a short bar, a return is a count.

const BAR_W = 22
const BAR_GAP = 6
const BAR_H = 36

function MinimumBars({ item, week }: { item: LifeRecapItem; week: string }) {
  const weeks = item.weeks ?? []
  const w = weeks.length * (BAR_W + BAR_GAP) - BAR_GAP
  return (
    <svg
      width={w}
      height={BAR_H + 14}
      viewBox={`0 0 ${w} ${BAR_H + 14}`}
      role="img"
      aria-label={weeks.map((x) => `${x.done} of ${x.of}`).join(', ')}
      className="max-w-full"
    >
      {weeks.map((x, i) => {
        const cx = i * (BAR_W + BAR_GAP)
        const h = Math.max(2, (x.done / x.of) * BAR_H)
        const now = x.week === week
        return (
          <g key={x.week}>
            <rect x={cx} y={0} width={BAR_W} height={BAR_H} rx={4} className="fill-slate-200 dark:fill-slate-700" />
            <rect
              x={cx}
              y={BAR_H - h}
              width={BAR_W}
              height={h}
              rx={4}
              className="fill-sky-500 dark:fill-sky-400"
              stroke={now ? 'currentColor' : 'none'}
              strokeWidth={now ? 2 : 0}
            />
            <text
              x={cx + BAR_W / 2}
              y={BAR_H + 11}
              textAnchor="middle"
              className={`fill-slate-600 text-[10px] dark:fill-slate-300 ${now ? 'font-semibold' : ''}`}
            >
              {x.done}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function StepLine({ item }: { item: LifeRecapItem }) {
  const pts = item.points ?? []
  const W = 160
  const H = 36
  const min = Math.min(...pts.map((p) => p.value))
  const max = Math.max(...pts.map((p) => p.value))
  const y = (v: number) => (max === min ? H / 2 : H - 4 - ((v - min) / (max - min)) * (H - 8))
  const x = (i: number) => (pts.length === 1 ? W / 2 : 4 + (i / (pts.length - 1)) * (W - 8))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ')
  const last = pts.length - 1
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={describePoints(item)}
      className="max-w-full"
    >
      <path d={d} fill="none" strokeWidth={2} strokeLinejoin="round" className="stroke-sky-500 dark:stroke-sky-400" />
      <circle cx={x(last)} cy={y(pts[last]!.value)} r={4} className="fill-sky-500 dark:fill-sky-400" />
    </svg>
  )
}

function describePoints(item: LifeRecapItem): string {
  const pts = item.points ?? []
  if (pts.length === 0) return ''
  const unit = item.unit ? ` ${item.unit}` : ''
  if (pts.length === 1) return `${pts[0]!.value}${unit}`
  return `${pts[0]!.value} → ${pts[pts.length - 1]!.value}${unit}`
}

function Criterion({ c }: { c: NonNullable<LifeRecapItem['criterion']> }) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-600 dark:text-slate-300">
      <span aria-hidden className="flex gap-0.5">
        {Array.from({ length: Math.min(c.of, 12) }, (_, i) => (
          <span
            key={i}
            className={`inline-block size-2.5 rounded-full border border-sky-500 dark:border-sky-400 ${
              i < c.met ? 'bg-sky-500 dark:bg-sky-400' : ''
            }`}
          />
        ))}
      </span>
      <span>
        {c.text} · {c.met} of {c.of}
      </span>
    </p>
  )
}

/** The recap lines themselves (shared by the week card and the month view). */
export function RecapItems({ week, items }: { week: string; items: LifeRecapItem[] }) {
  return (
    <Card className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <p className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span className="min-w-0 truncate">{item.label}</span>
            {item.closed && (
              <span className="shrink-0 text-xs font-normal text-slate-500 dark:text-slate-400">experiment closed</span>
            )}
          </p>
          {item.kind === 'minimum' ? (
            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <MinimumBars item={item} week={week} />
              {item.returns !== undefined && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  ↩ {item.returns} return{item.returns === 1 ? '' : 's'} this month
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <StepLine item={item} />
              <p className="text-sm text-slate-800 dark:text-slate-100">{describePoints(item)}</p>
            </div>
          )}
          {item.criterion && !item.closed && <Criterion c={item.criterion} />}
        </div>
      ))}
    </Card>
  )
}

export function RecapSection({
  week,
  items,
  open,
  onToggle,
  readOnly,
}: {
  week: string
  items: LifeRecapItem[]
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  return (
    <CollapsibleSection
      title="🔎 Recap"
      summary={`${items.length} line${items.length === 1 ? '' : 's'}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <RecapItems week={week} items={items} />
    </CollapsibleSection>
  )
}
