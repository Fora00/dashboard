import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeChoreEntry } from '../../../lib/db'
import { toggleChore, toggleChoreCancelled } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { useToday } from '../useToday'
import { cancelledLast, isCancelled, sortChores, summarizeChores, visibleChores } from '../model'

// "Casa": the household chores of the Things project "Casa catia", imported by
// /oggi and tickable here. A recurring chore shows how many times it was done.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ entry, today }: { entry: LifeChoreEntry; today: string }) {
  const { done, name, repeat, count, last } = entry.value
  const cancelled = isCancelled(entry.value, today)
  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={done}
        disabled={cancelled}
        onClick={() => void runSafe(toggleChore, 'Could not save')(entry.id)}
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-2 text-left text-base transition-colors ${
          cancelled
            ? 'border-slate-300/60 bg-transparent opacity-60 dark:border-slate-700'
            : done
              ? 'border-emerald-400 bg-emerald-300/20 dark:bg-emerald-400/10'
              : 'border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800/50'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            cancelled
              ? 'border-slate-400 text-slate-500 dark:border-slate-600'
              : done
                ? 'border-emerald-500 bg-emerald-400 text-slate-900'
                : 'border-slate-400 dark:border-slate-500'
          }`}
        >
          {cancelled ? '✕' : done && '✓'}
        </span>
        <span className={`min-w-0 flex-1 break-words ${done || cancelled ? 'text-slate-500 line-through' : ''}`}>
          {name}
        </span>
        {repeat && !cancelled && (
          <span
            className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300"
            title={last ? `Ultima volta: ${last}` : 'Mai fatta'}
          >
            🔁 {count}×
          </span>
        )}
      </button>
      {(!done || cancelled) && (
        <button
          type="button"
          aria-label={cancelled ? `Ripristina: ${name}` : `Annulla: ${name}`}
          onClick={() => void runSafe(toggleChoreCancelled, 'Could not save')(entry.id)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {cancelled ? '↺' : '✕'}
        </button>
      )}
    </li>
  )
}

export function ChoresSection() {
  const today = useToday()
  const chores = useLiveQuery(
    async () =>
      cancelledLast(
        visibleChores(sortChores(await db.lifeEntries.filter((e) => e.kind === 'chore').toArray()), today),
        today,
      ),
    [today],
  )
  if (chores === undefined || chores.length === 0) return null
  const s = summarizeChores(chores, today)
  return (
    <section className="mb-6" aria-label="Casa">
      <div className="rounded-xl border border-slate-300 bg-white/60 dark:border-slate-700 dark:bg-slate-800/30">
        <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium">
          <h2>🏠 Casa</h2>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            {s.done}/{s.total}
          </span>
        </div>
        <ul className="space-y-2 border-t border-slate-300 px-4 py-3 dark:border-slate-700">
          {chores.map((c) => (
            <Row key={`${c.id}:${c.updatedAt}`} entry={c} today={today} />
          ))}
        </ul>
      </div>
    </section>
  )
}
