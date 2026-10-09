import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { runSafe } from '../../lib/runSafe'
import { useSyncStatus } from '../../lib/useSyncStatus'
import { watchedEngines, type WatchedEngine } from '../../lib/syncHealth'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { deadEntries, groupOutbox, tableCounts } from './dataStats'

// Settings → "Data on this device": what is in the local db, for the phone
// where DevTools is awkward. Counts only (never row contents), all from
// Dexie, so it works signed out and offline. Dead-lettered changes can be
// recovered per engine (Retry all / Discard all); the buttons only appear
// for an engine that reports dead > 0.

function EngineRecovery({ engine }: { engine: WatchedEngine }) {
  const status = useSyncStatus(engine.sync)
  const [busy, setBusy] = useState(false)
  if (status.dead === 0) return null

  async function run(fn: () => Promise<void>) {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }
  async function discard() {
    const n = status.dead
    const ok = window.confirm(
      `Discard ${n === 1 ? 'this rejected change' : `these ${n} rejected changes`} (${engine.label})? ` +
        "This device will take the server's version instead. This can't be undone.",
    )
    if (ok) await run(engine.sync.discardDead)
  }

  return (
    <li className="space-y-2 py-2">
      <p className="text-rose-600 dark:text-rose-400">
        ⚠️ {engine.label}: {status.dead} rejected change{status.dead === 1 ? '' : 's'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => void runSafe(() => run(engine.sync.retryDead), 'Could not retry')()}
        >
          Retry all
        </Button>
        <Button variant="danger" disabled={busy} onClick={() => void runSafe(discard, 'Could not discard')()}>
          Discard all
        </Button>
      </div>
    </li>
  )
}

function Body() {
  const counts = useLiveQuery(() => tableCounts())
  const outbox = useLiveQuery(() => db.outbox.toArray())
  const groups = groupOutbox(outbox ?? [])
  const dead = deadEntries(outbox ?? [])

  return (
    <Card className="space-y-4 text-sm">
      <div>
        <h3 className="mb-1 font-medium text-slate-700 dark:text-slate-300">Rows per table</h3>
        {counts === undefined ? (
          <p className="text-slate-500 dark:text-slate-400">…</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {counts.map((c) => (
              <li key={c.name} className="flex min-h-8 items-center justify-between gap-3">
                <span className="min-w-0 truncate text-slate-600 dark:text-slate-400">{c.name}</span>
                <span className="tabular-nums text-slate-800 dark:text-slate-200">{c.rows}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-1 font-medium text-slate-700 dark:text-slate-300">Waiting to sync</h3>
        {groups.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Nothing queued.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {groups.map((g) => (
              <li key={g.table} className="flex min-h-8 items-center justify-between gap-3">
                <span className="min-w-0 truncate text-slate-600 dark:text-slate-400">{g.table}</span>
                <span className="shrink-0 tabular-nums text-slate-800 dark:text-slate-200">
                  {g.pending} pending
                  {g.dead > 0 && <span className="text-rose-600 dark:text-rose-400"> · {g.dead} rejected</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {dead.length > 0 && (
        <div>
          <h3 className="mb-1 font-medium text-slate-700 dark:text-slate-300">Rejected changes</h3>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {dead.map((e) => (
              <li key={e.seq} className="flex min-h-8 items-center justify-between gap-3">
                <span className="min-w-0 truncate text-slate-600 dark:text-slate-400">
                  {e.table} · {e.rowId}
                </span>
                <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                  {e.op}, {e.tries ?? 0} tries
                </span>
              </li>
            ))}
          </ul>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {watchedEngines.map((w, i) => (
              <EngineRecovery key={`${w.label}-${i}`} engine={w} />
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

export function DataView() {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-10 items-center gap-1.5"
        >
          <span aria-hidden="true">{open ? '▾' : '▸'}</span> Data on this device
        </button>
      </h2>
      {open && <Body />}
    </section>
  )
}
