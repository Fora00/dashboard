import type { Habit } from '../../lib/db'

/** "🔬 complessa": a habit checked against data (Habit.measure set). Same chip style as the engine tag. */
export function MeasureBadge({ habit, className = '' }: { habit: Pick<Habit, 'measure'>; className?: string }) {
  if (!habit.measure) return null
  return (
    <span
      data-testid="habit-measure"
      title="Abitudine complessa: verificata dai dati (limiti app)"
      className={`inline-flex items-center gap-1 rounded-full border border-violet-300 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:border-violet-700 dark:text-violet-300 ${className}`}
    >
      <span aria-hidden>🔬</span>complessa
    </span>
  )
}
