import type { Habit } from '../../lib/db'
import { boxSpan, buildKindBoards, byMonth, type DayData, type KindBoard } from './lifeboardData'

interface Props {
  /** Every habit, archived ones too: their boxes stay in the book. */
  habits: readonly Habit[]
  data: ReadonlyMap<string, DayData>
}

const monthLabel = (m: string) =>
  new Date(`${m}-01T12:00:00`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

/** SpoonFed's lifeboard of forever wins, twice: one book for the forever
 *  habits and one for the experiments. One coloured box for every time a habit
 *  was done, each with its lifetime count; the legend is grouped by engine. */
export function Lifeboard({ habits, data }: Props) {
  const boards = buildKindBoards(habits, data)
  const name = new Map(habits.map((h) => [h.id, h.name]))

  return (
    <div className="space-y-8 pb-[env(safe-area-inset-bottom)]">
      <Board
        title="📒 Lifeboard of forever wins"
        board={boards.forever}
        names={name}
        empty="Nothing on the board yet. The first box is waiting."
        rules
      />
      {boards.experiment.habitCount > 0 ? (
        <Board
          title="🧪 Lifeboard of experiments"
          board={boards.experiment}
          names={name}
          empty="No experiment wins yet. The first box is waiting."
        />
      ) : (
        <p className="text-sm text-slate-500" data-testid="no-experiments">
          🧪 No experiments yet. Make a habit an experiment and it gets its own board here.
        </p>
      )}
    </div>
  )
}

function Board({
  title,
  board,
  names,
  empty,
  rules = false,
}: {
  title: string
  board: KindBoard
  names: ReadonlyMap<string, string>
  empty: string
  rules?: boolean
}) {
  const color = new Map(board.legend.map((l) => [l.habit.id, l.color]))
  const slug = board.kind

  return (
    <section aria-label={title.replace(/^\S+\s/, '')} data-testid={`lifeboard-${slug}`} className="space-y-5">
      <section aria-label="Legend" className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">{title}</h2>
          <span className="text-sm font-semibold" data-testid={`lifeboard-${slug}-total`}>
            {board.total}
          </span>
        </div>
        <div className="mt-2 space-y-2">
          {board.groups.map((g) => (
            <div key={g.engine ?? 'none'} data-testid={`lifeboard-${slug}-group`}>
              <h3 className="flex items-baseline justify-between text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                <span>{g.label}</span>
                <span>{g.total}</span>
              </h3>
              <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {g.rows.map((l) => (
                  <li key={l.habit.id} className="flex items-center gap-2 text-sm">
                    <span className="size-4 shrink-0 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span className="min-w-0 flex-1 truncate">
                      {l.habit.emoji} {l.habit.name}
                    </span>
                    <span className="text-slate-500">{l.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {rules && (
          <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-xs text-slate-500 dark:text-slate-400">
            <li>Everything counts: even one push-up fills a box.</li>
            <li>One box each time you do it, with the habit&apos;s lifetime count written in.</li>
            <li>
              The board only goes up. No black boxes, nothing is taken away: a miss costs nothing, tomorrow just fills
              another.
            </li>
            <li>Fill the book with as many colours as you can. The bigger the number, the bigger the box.</li>
          </ol>
        )}
      </section>

      {board.total === 0 ? (
        <p className="text-sm text-slate-500">{empty}</p>
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
                    title={`${names.get(b.habitId) ?? ''} · ${b.day} · #${b.n}`}
                    className="flex items-center justify-center font-semibold text-white/95"
                    style={{
                      backgroundColor: color.get(b.habitId),
                      lineHeight: 1,
                      fontSize: `${9 + (span - 1) * 3}px`,
                      ...(span > 1
                        ? {
                            gridColumn: `span ${span}`,
                            gridRow: `span ${span}`,
                          }
                        : {}),
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
    </section>
  )
}
