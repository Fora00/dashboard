import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeChoreEntry } from '../../../lib/db'
import { toggleChore } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { sortChores, summarizeChores } from '../model'

// "Casa": the household chores of the Things project "Casa catia", imported by
// /oggi and tickable here. A recurring chore shows how many times it was done.
// Local-first via Dexie; writes go through lifeSync.ts.

function Row({ entry }: { entry: LifeChoreEntry }) {
  const { done, name, repeat, count, last } = entry.value
  return (
    <li>
      <button
        type="button"
        aria-pressed={done}
        onClick={() => void runSafe(toggleChore, 'Could not save')(entry.id)}
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-2 text-left text-base transition-colors ${
          done
            ? 'border-emerald-400 bg-emerald-300/20 dark:bg-emerald-400/10'
            : 'border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800/50'
        }`}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
            done ? 'border-emerald-500 bg-emerald-400 text-slate-900' : 'border-slate-400 dark:border-slate-500'
          }`}
        >
          {done && '✓'}
        </span>
        <span className={`min-w-0 flex-1 break-words ${done ? 'text-slate-500 line-through' : ''}`}>{name}</span>
        {repeat && (
          <span
            className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300"
            title={last ? `Ultima volta: ${last}` : 'Mai fatta'}
          >
            🔁 {count}×
          </span>
        )}
      </button>
    </li>
  )
}

export function ChoresSection() {
  const chores = useLiveQuery(
    async () => sortChores(await db.lifeEntries.filter((e) => e.kind === 'chore').toArray()),
    [],
  )
  if (chores === undefined || chores.length === 0) return null
  const s = summarizeChores(chores)
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
            <Row key={`${c.id}:${c.updatedAt}`} entry={c} />
          ))}
        </ul>
      </div>
    </section>
  )
}
