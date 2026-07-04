import type { Table } from 'dexie'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { db, type OutboxEntry, type OutboxPayload, type OutboxTable } from './db'
import { supabase } from './sync'

// Generic, table-config-driven local-first cloud sync.
//
// The UI only ever talks to Dexie. Every local mutation also appends to
// db.outbox (in the same transaction, via this engine's helpers). While signed
// in, an engine instance flushes its outbox entries to Supabase, pulls the
// remote tables as source of truth, and subscribes to realtime changes.
//
// One instance drives one project (shop-list, todo, climbing, habits…). Create
// it with createCloudSync(config); the project's *Sync.ts wrapper re-exports the
// returned helpers so the UI stays local-first and unchanged.
//
// The audited sync bugs are fixed here, once, for every project:
//   * Guest sign-in never wipes local data — a permanently-rejected push is
//     kept as a dead-lettered outbox tombstone that still shields its local row
//     from pull() deletion, instead of being silently dropped.
//   * Errors are classified explicitly (transient → retry, RLS/constraint →
//     poison) with a per-entry retry cap, not a code-length heuristic.
//   * Realtime is last-writer-wins by updated_at and skips rows with pending
//     outbox entries.
//   * The whole flush+pull cycle is guarded against reentrant/overlapping runs.

/** One local table ↔ one remote table, with row mappers. */
export interface TableSync<L extends { id: string } = { id: string }, R = unknown> {
  /** Remote (Supabase) table name; also the outbox discriminator. */
  remote: OutboxTable
  /** The local Dexie table. Lazily resolved so db is fully constructed first.
   *  (Insert type is erased — EntityTable's InsertType isn't otherwise
   *  assignable across the generic boundary.) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: () => Table<L, string, any>
  /** Local row → remote row. */
  toRow: (local: L) => R
  /** Remote row → local row. */
  fromRow: (row: R) => L
  /** Explicit column list for pull selects (never select('*') — avoids leaking
   *  capability columns like share_token). */
  columns: string
  /** Subscribe to realtime changes on this table. */
  realtime?: boolean
  /** Extract the row's updated_at (ms) for last-writer-wins. Omit for
   *  insert/delete-only tables that have no updated_at column. */
  updatedAt?: (local: L) => number
}

// Erased variant for heterogeneous config lists (each entry keeps its own L/R
// internally; the engine only relies on rows having an `id`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTableSync = TableSync<any, any>

export interface SyncConfig {
  /** Project id (matches src/lib/projects.ts and is_member('<id>')). */
  projectId: string
  tables: AnyTableSync[]
}

export interface CloudSync {
  /** Push this project's queued mutations. No-op when signed out/offline. */
  flush: () => Promise<void>
  /** Guarded flush + pull cycle. */
  syncNow: () => Promise<void>
  /** Start syncing (call when a session exists). Returns a stop function. */
  start: () => () => void
  /** Write a local upsert + queue it, in one transaction. */
  upsert: (remote: OutboxTable, row: OutboxPayload) => Promise<void>
  /** Delete a local row + queue the delete, in one transaction. */
  remove: (remote: OutboxTable, id: string) => Promise<void>
  /** Delete many local rows + queue their deletes, in one transaction. */
  removeMany: (remote: OutboxTable, ids: string[]) => Promise<void>
}

// After this many failed attempts a transient error is treated as poison and
// dead-lettered, so a permanently-broken entry can never block the queue
// forever (and its row stays shielded from pull deletion).
const MAX_TRIES = 8

/** Classify a push error: retry later, or poison (will never be accepted). */
function classify(err: unknown): 'retry' | 'poison' {
  const code = (err as { code?: unknown })?.code
  // No code = network/transport failure (or a thrown non-PostgREST error).
  if (typeof code !== 'string' || code === '') return 'retry'
  // Auth/transient: expired or missing JWT — succeeds again after re-auth.
  if (code === 'PGRST301') return 'retry'
  // True denials that a retry can never fix:
  //   42501 = RLS / insufficient privilege (guest pushing data she can't write)
  //   23xxx = integrity constraint (unique, FK, not-null, check) violations
  if (code === '42501') return 'poison'
  if (code.startsWith('23')) return 'poison'
  // Anything else: retry, but the MAX_TRIES cap will eventually dead-letter it
  // rather than loop forever or silently drop it.
  return 'retry'
}

export function createCloudSync(config: SyncConfig): CloudSync {
  const byRemote = new Map<OutboxTable, AnyTableSync>(
    config.tables.map((t) => [t.remote, t]),
  )
  const remotes = new Set<OutboxTable>(config.tables.map((t) => t.remote))

  let channels: RealtimeChannel[] = []
  let flushing = false
  let running = false

  async function pushEntry(entry: OutboxEntry): Promise<void> {
    if (!supabase) return
    const tc = byRemote.get(entry.table)
    if (!tc) return
    if (entry.op === 'upsert' && entry.payload) {
      const { error } = await supabase
        .from(entry.table)
        .upsert(tc.toRow(entry.payload as { id: string }))
      if (error) throw error
    } else if (entry.op === 'delete') {
      const { error } = await supabase.from(entry.table).delete().eq('id', entry.rowId)
      if (error) throw error
    }
  }

  async function flush(): Promise<void> {
    if (!supabase || flushing) return
    const { data } = await supabase.auth.getSession()
    if (!data.session) return
    flushing = true
    try {
      const entries = await db.outbox.orderBy('seq').toArray()
      for (const entry of entries) {
        // Only this project's live entries; dead-letters are tombstones.
        if (!remotes.has(entry.table) || entry.dead) continue
        try {
          await pushEntry(entry)
        } catch (err) {
          const tries = (entry.tries ?? 0) + 1
          if (classify(err) === 'poison' || tries >= MAX_TRIES) {
            // Dead-letter: keep the entry (never drop it) so its rowId still
            // shields the local row from pull() deletion. Local data survives.
            await db.outbox.update(entry.seq!, { dead: 1, tries })
            continue
          }
          // Transient (offline / expired JWT / 5xx): bump the counter and stop,
          // preserving per-row order. Retried on the next reconnect/foreground.
          await db.outbox.update(entry.seq!, { tries })
          return
        }
        await db.outbox.delete(entry.seq!)
      }
    } finally {
      flushing = false
    }
  }

  async function pull(): Promise<void> {
    if (!supabase) return
    const results = await Promise.all(
      config.tables.map((tc) => supabase!.from(tc.remote).select(tc.columns)),
    )
    // If any table errored, abort the whole pull — never partial-delete based
    // on an incomplete remote view.
    if (results.some((r) => r.error || !r.data)) return

    const dexieTables = config.tables.map((t) => t.table())
    await db.transaction('rw', [...dexieTables, db.outbox], async () => {
      // Rows with any pending or dead-lettered outbox entry are "ours": remote
      // must not overwrite or delete them.
      const pending = new Set(
        (await db.outbox.toArray())
          .filter((e) => remotes.has(e.table))
          .map((e) => e.rowId),
      )
      for (let i = 0; i < config.tables.length; i++) {
        const tc = config.tables[i]
        const rows = (results[i].data as unknown[]).map((r) => tc.fromRow(r))
        const remoteIds = new Set(rows.map((r) => r.id))
        const localIds = (await tc.table().toCollection().primaryKeys()) as string[]
        await tc.table().bulkPut(rows.filter((r) => !pending.has(r.id)))
        await tc
          .table()
          .bulkDelete(localIds.filter((id) => !remoteIds.has(id) && !pending.has(id)))
      }
    })
  }

  async function syncNow(): Promise<void> {
    // Guard the whole cycle: 'online' + 'visibilitychange' can fire together.
    if (running) return
    running = true
    try {
      await flush()
      await pull()
    } finally {
      running = false
    }
  }

  async function onRealtime(
    tc: AnyTableSync,
    payload: { eventType: string; new: unknown; old: unknown },
  ): Promise<void> {
    const id =
      payload.eventType === 'DELETE'
        ? (payload.old as { id?: string }).id
        : (payload.new as { id?: string }).id
    if (!id) return
    // A row we still have queued (or dead-lettered) is ours — ignore realtime
    // until it flushes, so an in-flight edit isn't clobbered and a locally
    // deleted-then-requeued row isn't resurrected.
    if ((await db.outbox.where('rowId').equals(id).count()) > 0) return

    if (payload.eventType === 'DELETE') {
      await tc.table().delete(id)
      return
    }
    const incoming = tc.fromRow(payload.new)
    if (tc.updatedAt) {
      const existing = await tc.table().get(id)
      // Last-writer-wins: drop a stale event whose row we already have newer.
      if (existing && tc.updatedAt(existing) > tc.updatedAt(incoming)) return
    }
    await tc.table().put(incoming)
  }

  const onOnline = () => void syncNow()
  const onVisible = () => {
    if (document.visibilityState === 'visible') void syncNow()
  }

  function start(): () => void {
    const client = supabase
    if (!client) return () => {}

    void syncNow()

    channels = config.tables
      .filter((tc) => tc.realtime)
      .map((tc) =>
        client
          .channel(`${config.projectId}:${tc.remote}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: tc.remote },
            (payload) =>
              void onRealtime(tc, payload as unknown as {
                eventType: string
                new: unknown
                old: unknown
              }),
          )
          .subscribe(),
      )

    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisible)
      for (const ch of channels) void client.removeChannel(ch)
      channels = []
    }
  }

  async function upsert(remote: OutboxTable, row: OutboxPayload): Promise<void> {
    const tc = byRemote.get(remote)
    if (!tc) throw new Error(`cloudSync: unknown table ${remote}`)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().put(row)
      await db.outbox.add({ table: remote, op: 'upsert', rowId: row.id, payload: row, ts: Date.now() })
    })
    void flush()
  }

  async function remove(remote: OutboxTable, id: string): Promise<void> {
    const tc = byRemote.get(remote)
    if (!tc) throw new Error(`cloudSync: unknown table ${remote}`)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().delete(id)
      await db.outbox.add({ table: remote, op: 'delete', rowId: id, ts: Date.now() })
    })
    void flush()
  }

  async function removeMany(remote: OutboxTable, ids: string[]): Promise<void> {
    if (ids.length === 0) return
    const tc = byRemote.get(remote)
    if (!tc) throw new Error(`cloudSync: unknown table ${remote}`)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().bulkDelete(ids)
      await db.outbox.bulkAdd(
        ids.map((id) => ({ table: remote, op: 'delete' as const, rowId: id, ts: Date.now() })),
      )
    })
    void flush()
  }

  return { flush, syncNow, start, upsert, remove, removeMany }
}
