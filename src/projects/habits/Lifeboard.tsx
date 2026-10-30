import type { Habit } from '../../lib/db'
import { boxSpan, buildLifeboard, byMonth, type DayData } from './lifeboardData'

interface Props {
  /** Every habit, archived ones too: their boxes stay in the book. */
  habits: readonly Habit[]
  data: ReadonlyMap<string, DayData>
}

const monthLabel = (m: string) =>
  new Date(`${m}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

/** SpoonFed's lifeboard of forever wins: one coloured box for every time a
 *  habit was done, each with its lifetime count. It only goes up. */
export function Lifeboard({ habits, data }: Props) {
  const board = buildLifeboard(habits, data)
  const color = new Map(board.legend.map((l) => [l.habit.id, l.color]))
  const name = new Map(habits.map((h) => [h.id, h.name]))

  return (
    <div className="space-y-5">
      <section aria-label="Legend" className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">📒 Lifeboard of forever wins</h2>
          <span className="text-sm font-semibold">{board.total}</span>
        </div>
        <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {board.legend.map((l) => (
            <li key={l.habit.id} className="flex items-center gap-2 text-sm">
              <span className="size-4 shrink-0 rounded-sm" style={{ backgroundColor: l.color }} />
              <span className="min-w-0 flex-1 truncate">
                {l.habit.emoji} {l.habit.name}
              </span>
              <span className="text-slate-500">{l.total}</span>
            </li>
          ))}
        </ul>
        <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-xs text-slate-500 dark:text-slate-400">
          <li>Everything counts: even one push-up fills a box.</li>
          <li>One box each time you do it, with the habit&apos;s lifetime count written in.</li>
          <li>
            The board only goes up. No black boxes, nothing is taken away: a miss costs nothing, tomorrow just fills
            another.
          </li>
          <li>Fill the book with as many colours as you can. The bigger the number, the bigger the box.</li>
        </ol>
      </section>

      {board.total === 0 ? (
        <p className="text-sm text-slate-500">Nothing on the board yet. The first box is waiting.</p>
      ) : (
        byMonth(board.boxes).map(([month, boxes]) => (
          <section key={month} aria-label={monthLabel(month)}>
            <h3 className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
              {monthLabel(month)}
              <span className="text-xs">{boxes.length} wins</span>
            </h3>
            <ul
              className="grid gap-px rounded-md bg-slate-200 p-px dark:bg-slate-700"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, 16px)',
                gridAutoRows: '16px',
                gridAutoFlow: 'dense',
                lineHeight: 0,
              }}
            >
              {boxes.map((b, i) => {
                const span = boxSpan(b.n)
                return (
                  <li
                    key={`${b.habitId}-${b.n}-${i}`}
                    title={`${name.get(b.habitId) ?? ''} · ${b.day} · #${b.n}`}
                    className="flex items-center justify-center font-semibold text-white/95"
                    style={{
                      backgroundColor: color.get(b.habitId),
                      lineHeight: 1,
                      fontSize: `${9 + (span - 1) * 3}px`,
                      ...(span > 1 ? { gridColumn: `span ${span}`, gridRow: `span ${span}` } : {}),
                    }}
                  >
                    {b.n}
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
