import Dexie, { type Table } from 'dexie'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { db, type OutboxEntry, type OutboxMap, type OutboxPayload, type OutboxTable } from './db'
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
//     from pull() deletion, instead of being silently dropped. The user can
//     Retry or Discard dead-letters explicitly (retryDead / discardDead).
//   * Errors are classified explicitly (unreachable/auth → wait, RLS/constraint
//     → poison, other server errors → counted retry). Only a refusal the SERVER
//     actually answered counts towards the retry cap: offline edits are never
//     dead-lettered, however many pile up.
//   * Flush and pull are mutually exclusive (one lock per engine), so a row
//     pushed mid-pull can never be deleted/clobbered by that pull's stale view.
//   * Realtime is last-writer-wins by updated_at and skips rows with pending
//     outbox entries.
//   * Malformed remote rows are skipped and counted, never crash a pull.
//   * Pull pages every table past PostgREST's 1000-row cap (keyset paging by
//     id, so a row deleted between pages can't shift another out of view) and
//     aborts if the session ended or changed user while its selects ran.
//   * Realtime events apply under the same lock, never inside a pull.

/** Remote tables whose outbox payload is exactly L. Falls back to every table
 *  for a row type not in OutboxMap yet (a freshly generated scaffold before its
 *  db.ts edit — see docs/NEW_PROJECT.md), so scaffolds still compile. */
type RemoteMatching<L> = {
  [K in OutboxTable]: [L] extends [OutboxMap[K]] ? ([OutboxMap[K]] extends [L] ? K : never) : never
}[OutboxTable]
type RemoteFor<L> = [RemoteMatching<L>] extends [never] ? OutboxTable : RemoteMatching<L>

/** One local table ↔ one remote table, with row mappers. */
export interface TableSync<L extends { id: string } = { id: string }, R = unknown> {
  /** Remote (Supabase) table name; also the outbox discriminator. Must be the
   *  OutboxMap key whose row type is L. */
  remote: RemoteFor<L>
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
  /** A unique violation (23505) on push means another device already created
   *  the same logical row (e.g. one habit check per habit and day): drop the
   *  outbox entry as delivered instead of dead-lettering it. The next pull
   *  brings the server's copy and removes the local duplicate. */
  uniqueViolationIsDone?: boolean
}

// Erased variant for heterogeneous config lists (each entry keeps its own L/R
// internally; the engine only relies on rows having an `id`). Stays `any`:
// Dexie's Table is invariant in its row type, so no TableSync<Todo, …> is
// assignable to a TableSync<{ id: string }, unknown> without casting every
// project's table() — more churn than the lint is worth.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTableSync = TableSync<any, any>

export interface SyncConfig {
  /** Project id (matches src/lib/projects.ts and is_member('<id>')). */
  projectId: string
  tables: AnyTableSync[]
  /** Runs inside the engine lock after every complete pull (e.g. a local
   *  dedupe). Must only touch Dexie; an error is logged, never fatal. */
  afterPull?: () => Promise<void>
}

/** Live, observable sync state for one engine instance (one project). */
export interface SyncStatus {
  /** Live outbox entries for this project's tables not yet pushed. */
  pending: number
  /** Dead-lettered entries — permanently rejected, kept local-only. */
  dead: number
  /** ms epoch of the last successful flush + pull cycle, or null. */
  lastSyncedAt: number | null
  /** Human-readable last error (dead-letter), or null when all is well. */
  lastError: string | null
  /** True while a flush is in progress. */
  syncing: boolean
  /** Remote rows the last pull skipped because they were malformed. */
  skipped: number
}

/** A local-only child delete that rides along a parent's cascade delete: every
 *  row of `remote`'s local table whose `key` field equals the parent id. */
export type CascadeChild = {
  [C in OutboxTable]: { remote: C; key: keyof OutboxMap[C] & string }
}[OutboxTable]

export interface CloudSync {
  /** Push this project's queued mutations. No-op when signed out/offline. */
  flush: () => Promise<void>
  /** Guarded flush + pull cycle. */
  syncNow: () => Promise<void>
  /** Start syncing (call when a session exists). Returns a stop function. */
  start: () => () => void
  /** Write a local upsert + queue it, in one transaction. */
  upsert: <K extends OutboxTable>(remote: K, row: NoInfer<OutboxMap[K]>) => Promise<void>
  /** Write many local upserts + queue them, in one transaction. */
  upsertMany: <K extends OutboxTable>(remote: K, rows: NoInfer<OutboxMap[K]>[]) => Promise<void>
  /** Delete a local row + queue the delete, in one transaction. */
  remove: (remote: OutboxTable, id: string) => Promise<void>
  /** Delete many local rows + queue their deletes, in one transaction. */
  removeMany: (remote: OutboxTable, ids: string[]) => Promise<void>
  /** Delete a parent row whose server-side FK is `on delete cascade`: ONE
   *  outbox tombstone for the parent, plus a local-only delete of its children
   *  (the server removes those itself), all in one transaction. */
  removeCascade: (remote: OutboxTable, id: string, children: CascadeChild[]) => Promise<void>
  /** Requeue every dead-lettered entry of this project (user tapped Retry).
   *  Each row is requeued ONCE, carrying its current local state. */
  retryDead: () => Promise<void>
  /** Drop every dead-lettered entry of this project (user tapped Discard):
   *  the rows lose their shield, so the next pull replaces them with the
   *  server's version (or removes them if the server has none). */
  discardDead: () => Promise<void>
  /** Current status snapshot (stable identity until it changes). */
  getStatus: () => SyncStatus
  /** Subscribe to status changes. Returns an unsubscribe function.
   *  Shaped for React's useSyncExternalStore (see useSyncStatus.ts). */
  subscribe: (listener: () => void) => () => void
}

// After this many SERVER-ANSWERED failures a retryable error is treated as
// poison and dead-lettered, so a permanently-broken entry can never block the
// queue forever (and its row stays shielded from pull deletion).
const MAX_TRIES = 8

// Page size for pull selects. Must not exceed PostgREST's max_rows
// (supabase/config.toml, 1000): a page shorter than this ends the table.
const PULL_PAGE = 1000

/** A push the server (or the transport) refused. `status` 0 = no response. */
class PushError extends Error {
  code: string
  status: number
  constructor(err: { message?: string; code?: string }, status: number) {
    super(err.message ?? 'push failed')
    this.code = typeof err.code === 'string' ? err.code : ''
    this.status = status
  }
}

type ErrorClass =
  /** No server answer (offline, DNS, timeout): stop, don't count a try. */
  | 'unreachable'
  /** Missing/expired JWT: fixed by re-auth, never poison, don't count. */
  | 'auth'
  /** The server will never accept it: dead-letter now. */
  | 'poison'
  /** Anything else: count a try, dead-letter at MAX_TRIES. */
  | 'retry'

/** Classify a push error. Only errors the server actually answered (a
 *  PostgREST code or an HTTP status) may ever count towards the cap. */
function classify(err: unknown): ErrorClass {
  // Not a PushError: a local exception (e.g. a mapper bug). Deterministic, so
  // it counts — it must not block the queue forever.
  if (!(err instanceof PushError)) return 'retry'
  const { code, status } = err
  // supabase-js maps every fetch failure to status 0 with an empty code.
  if (status === 0 && code === '') return 'unreachable'
  // True denials that a retry can never fix:
  //   42501 = RLS / insufficient privilege (guest pushing data she can't write)
  //   23xxx = integrity constraint (unique, FK, not-null, check) violations
  //   22xxx = data exception (bad date/uuid/number format, value too long…)
  //   42703 / PGRST204 = column the server doesn't have (client ahead of the
  //   schema): only a migration fixes it, retrying 8x just delays the signal
  if (code === '42501') return 'poison'
  if (code.startsWith('23')) return 'poison'
  if (code.startsWith('22')) return 'poison'
  if (code === '42703' || code === 'PGRST204') return 'poison'
  // PGRST30x = JWT missing/expired/invalid; 401 without a code is the same.
  if (code.startsWith('PGRST30') || (status === 401 && code === '')) return 'auth'
  return 'retry'
}

/** navigator.onLine === false is a reliable "definitely offline" (true is not
 *  a reliable "online" — that case is handled by 'unreachable' above). */
function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/** Run side effects (count refresh, flush) OUTSIDE any Dexie transaction the
 *  caller may be in — e.g. a wrapper that nests engine.upsert inside its own
 *  db.transaction. Their reads then queue behind that transaction's commit
 *  instead of reusing it after it has finished. */
function detached(fn: () => void): void {
  Dexie.ignoreTransaction(fn)
}

export function createCloudSync(config: SyncConfig): CloudSync {
  const byRemote = new Map<OutboxTable, AnyTableSync>(config.tables.map((t) => [t.remote as OutboxTable, t]))
  const remotes = new Set<OutboxTable>(byRemote.keys())

  function tableFor(remote: OutboxTable): AnyTableSync {
    const tc = byRemote.get(remote)
    if (!tc) throw new Error(`cloudSync(${config.projectId}): unknown table ${remote}`)
    return tc
  }

  let channels: RealtimeChannel[] = []
  let running = false

  // --- One lock per engine: flush passes and pulls never overlap ------------
  // Why this makes pull() safe: pull reads its outbox shield inside the same
  // lock that covers its remote select. So no outbox entry can be pushed AND
  // deleted between the select and the shield read — every local change is
  // either (a) already on the server before the select was issued (so the
  // select sees it) or (b) still in the outbox when the shield is read (so the
  // row is neither overwritten nor deleted). Mutations committed after the
  // pull's Dexie transaction are serialized after it by IndexedDB and win.
  let lock: Promise<unknown> = Promise.resolve()
  function exclusive<T>(fn: () => Promise<T>): Promise<T> {
    const run = lock.then(fn, fn)
    lock = run.catch(() => {})
    return run
  }

  let flushing = false // a flush holds the lock right now
  let flushQueued: Promise<void> | null = null // a flush waits for the lock
  // Set when flush() is called while a flush runs; triggers one more pass.
  let rerun = false

  // --- Observable status ----------------------------------------------------
  let status: SyncStatus = {
    pending: 0,
    dead: 0,
    lastSyncedAt: null,
    lastError: null,
    syncing: false,
    skipped: 0,
  }
  const listeners = new Set<() => void>()

  function setStatus(patch: Partial<SyncStatus>): void {
    const next = { ...status, ...patch }
    // Skip the emit when nothing actually changed (avoids render churn).
    if ((Object.keys(next) as (keyof SyncStatus)[]).every((k) => next[k] === status[k])) {
      return
    }
    status = next
    for (const l of listeners) l()
  }

  function deadMessage(n: number): string {
    return n === 1
      ? '1 change was rejected by the server and kept on this device only'
      : `${n} changes were rejected by the server and kept on this device only`
  }

  // Recount live/dead outbox entries for this project's tables and derive the
  // error line from the dead-letter count: it persists exactly as long as a
  // dead-letter exists (until the user retries or discards it).
  async function refreshCounts(): Promise<void> {
    let pending = 0
    let dead = 0
    // Badge count is best-effort: a closed db mid-flight must not reject.
    const rows = await db.outbox.toArray().catch(() => null)
    if (!rows) return
    for (const e of rows) {
      if (!remotes.has(e.table)) continue
      if (e.dead) dead++
      else pending++
    }
    setStatus({ pending, dead, lastError: dead > 0 ? deadMessage(dead) : null })
  }

  /** The signed-in user's id, or null when signed out. */
  async function sessionUserId(): Promise<string | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.user.id ?? null
  }

  async function pushEntry(entry: OutboxEntry): Promise<void> {
    if (!supabase) return
    const tc = byRemote.get(entry.table)
    if (!tc) return
    if (entry.op === 'upsert' && entry.payload) {
      const { error, status: http } = await supabase.from(entry.table).upsert(tc.toRow(entry.payload))
      if (error) throw new PushError(error, http)
    } else if (entry.op === 'delete') {
      const { error, status: http } = await supabase.from(entry.table).delete().eq('id', entry.rowId)
      if (error) throw new PushError(error, http)
    }
  }

  /** One ordered pass over the outbox. Returns false if it stopped on a
   *  failure that must wait for a trigger (so the caller must not spin). */
  async function flushPass(): Promise<boolean> {
    const entries = await db.outbox.orderBy('seq').toArray()
    for (const entry of entries) {
      // Only this project's live entries; dead-letters are tombstones.
      if (!remotes.has(entry.table) || entry.dead) continue
      try {
        await pushEntry(entry)
      } catch (err) {
        // Same logical row already on the server (see uniqueViolationIsDone).
        if (err instanceof PushError && err.code === '23505' && byRemote.get(entry.table)?.uniqueViolationIsDone) {
          await db.outbox.delete(entry.seq!)
          continue
        }
        const kind = classify(err)
        // No server answer / needs re-auth: stop WITHOUT counting a try, so
        // any number of offline edits can queue up and none is ever falsely
        // dead-lettered. Order is preserved; retried on the next trigger.
        if (kind === 'unreachable' || kind === 'auth') return false
        const tries = (entry.tries ?? 0) + 1
        if (kind === 'poison' || tries >= MAX_TRIES) {
          // Dead-letter: keep the entry (never drop it) so its rowId still
          // shields the local row from pull() deletion. Local data survives.
          await db.outbox.update(entry.seq!, { dead: 1, tries })
          // Surface the rejection — otherwise the failure is invisible.
          await refreshCounts()
          continue
        }
        // Server answered with a transient error (5xx, 429…): count it and
        // stop, preserving per-row order.
        await db.outbox.update(entry.seq!, { tries })
        return false
      }
      await db.outbox.delete(entry.seq!)
    }
    return true
  }

  function flush(): Promise<void> {
    if (!supabase) return Promise.resolve()
    // Reflect a just-enqueued mutation even when signed out (pending count).
    void refreshCounts()
    // Definitely offline: don't even try; 'online' triggers the next attempt.
    if (isOffline()) return Promise.resolve()
    // A flush is already running: ask it for one more pass so entries queued
    // after it read the outbox go out now, not on the next online/visibility
    // trigger. Never run two passes concurrently — that pushes entries twice
    // and can land an upsert after its delete (resurrecting the row).
    if (flushing) {
      rerun = true
      return Promise.resolve()
    }
    // One is already waiting for the lock: it reads the outbox when it runs,
    // so it will include this entry too.
    if (flushQueued) return flushQueued
    const run = exclusive(async () => {
      flushQueued = null
      flushing = true
      try {
        if (!(await sessionUserId())) return
        setStatus({ syncing: true })
        do {
          rerun = false
          // Stopped on a failure that must wait: don't spin.
          if (!(await flushPass())) break
        } while (rerun)
      } finally {
        flushing = false
        rerun = false
        setStatus({ syncing: false })
        await refreshCounts()
      }
    })
    flushQueued = run
    return run
  }

  /** Map one remote row, or null if it's malformed (never throws). */
  function mapRow(tc: AnyTableSync, raw: unknown): { id: string } | null {
    if (!raw || typeof raw !== 'object') return null
    if (typeof (raw as { id?: unknown }).id !== 'string') return null
    try {
      const row = tc.fromRow(raw) as { id?: unknown } | null
      if (!row || typeof row !== 'object' || row.id !== (raw as { id: string }).id) return null
      return row as { id: string }
    } catch {
      return null
    }
  }

  /** Every row of one remote table, fetched in pages of PULL_PAGE ordered by
   *  id (PostgREST silently caps a select at max_rows = 1000, so an unpaged
   *  select would look like "the server lost every row past 1000" and pull
   *  would delete them locally). Keyset paging (id > last id seen), not
   *  offsets: a row deleted between two pages would shift the next page by
   *  one and skip a row that still exists. null if ANY page fails: the caller
   *  must then abort, never act on a partial view. */
  async function selectAll(tc: AnyTableSync): Promise<unknown[] | null> {
    const all: unknown[] = []
    let lastId: string | null = null
    for (;;) {
      const base = supabase!.from(tc.remote).select(tc.columns)
      const page: { data: unknown; error: unknown } = await (lastId === null ? base : base.gt('id', lastId))
        .order('id')
        .limit(PULL_PAGE)
      const data = page.data
      if (page.error || !Array.isArray(data)) return null
      for (const raw of data as unknown[]) all.push(raw)
      if (data.length < PULL_PAGE) return all
      const last: unknown = (data[data.length - 1] as { id?: unknown } | null)?.id
      // No usable id to continue from: refuse a view we can't complete.
      if (typeof last !== 'string') return null
      lastId = last
    }
  }

  function pull(): Promise<boolean> {
    return exclusive(async () => {
      if (!supabase || isOffline()) return false
      // Signed out, RLS answers every select with zero rows — treating that
      // as "the server has nothing" would wipe local data. Never pull then.
      const userId = await sessionUserId()
      if (!userId) return false
      const results = await Promise.all(config.tables.map(selectAll))
      // If any table (or any page of it) errored, abort the whole pull — never
      // partial-delete based on an incomplete remote view.
      if (results.some((r) => r === null)) return false
      // The session may have ended or switched user while the selects were in
      // flight (sign-out mid-pull): the rows then belong to another view of
      // RLS, possibly empty. Abort without touching Dexie.
      if ((await sessionUserId()) !== userId) return false

      let skipped = 0
      const dexieTables = config.tables.map((t) => t.table())
      await db.transaction('rw', [...dexieTables, db.outbox], async () => {
        // Rows with any pending or dead-lettered outbox entry are "ours":
        // remote must not overwrite or delete them.
        const pending = new Set((await db.outbox.toArray()).filter((e) => remotes.has(e.table)).map((e) => e.rowId))
        for (let i = 0; i < config.tables.length; i++) {
          const tc = config.tables[i]
          const result = results[i]
          if (!tc || !result) continue
          const rows: { id: string }[] = []
          // Every id the server reported, malformed or not: a local row whose
          // remote copy is merely unreadable must not be deleted.
          const remoteIds = new Set<string>()
          for (const raw of result) {
            const rawId = (raw as { id?: unknown } | null)?.id
            if (typeof rawId === 'string') remoteIds.add(rawId)
            const row = mapRow(tc, raw)
            if (row) rows.push(row)
            else skipped++
          }
          const localIds = (await tc.table().toCollection().primaryKeys()) as string[]
          await tc.table().bulkPut(rows.filter((r) => !pending.has(r.id)))
          await tc.table().bulkDelete(localIds.filter((id) => !remoteIds.has(id) && !pending.has(id)))
        }
      })
      if (skipped > 0) {
        console.warn(`cloudSync(${config.projectId}): skipped ${skipped} malformed remote row(s)`)
      }
      setStatus({ skipped })
      if (config.afterPull) {
        try {
          await config.afterPull()
        } catch (err) {
          console.warn(`cloudSync(${config.projectId}): afterPull failed`, err)
        }
        // It may have dropped outbox entries (e.g. a duplicate's dead-letter).
        await refreshCounts()
      }
      return true
    })
  }

  async function syncNow(): Promise<void> {
    // Guard the whole cycle: 'online' + 'visibilitychange' can fire together.
    if (running) return
    running = true
    try {
      await flush()
      // Only stamp lastSyncedAt on a real, complete pull (signed in + online).
      if (await pull()) setStatus({ lastSyncedAt: Date.now() })
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
        ? (payload.old as { id?: string } | null)?.id
        : (payload.new as { id?: string } | null)?.id
    if (typeof id !== 'string') return
    // A row we still have queued (or dead-lettered) is ours — ignore realtime
    // until it flushes, so an in-flight edit isn't clobbered and a locally
    // deleted-then-requeued row isn't resurrected.
    if ((await db.outbox.where('rowId').equals(id).count()) > 0) return

    if (payload.eventType === 'DELETE') {
      await tc.table().delete(id)
      return
    }
    const incoming = mapRow(tc, payload.new)
    if (!incoming) return // malformed: ignore; the next pull reconciles
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
            // Under the engine lock: an event applied while a pull is between
            // its select and its write would be overwritten by that pull's
            // older snapshot. Queued behind it, the event lands last and wins.
            (payload) =>
              void exclusive(() =>
                onRealtime(
                  tc,
                  payload as unknown as {
                    eventType: string
                    new: unknown
                    old: unknown
                  },
                ),
              ).catch((err: unknown) => console.warn(`cloudSync(${config.projectId}): realtime event failed`, err)),
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

  /** After every local mutation: recount (UI badge) and try to push. */
  function afterMutation(): void {
    detached(() => {
      void refreshCounts()
      void flush()
    })
  }

  async function upsert<K extends OutboxTable>(remote: K, row: OutboxMap[K]): Promise<void> {
    const tc = tableFor(remote)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().put(row)
      await db.outbox.add({ table: remote, op: 'upsert', rowId: row.id, payload: row, ts: Date.now() })
    })
    afterMutation()
  }

  async function upsertMany<K extends OutboxTable>(remote: K, rows: OutboxMap[K][]): Promise<void> {
    if (rows.length === 0) return
    const tc = tableFor(remote)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().bulkPut(rows)
      const ts = Date.now()
      await db.outbox.bulkAdd(
        rows.map((row) => ({ table: remote, op: 'upsert' as const, rowId: row.id, payload: row, ts })),
      )
    })
    afterMutation()
  }

  async function remove(remote: OutboxTable, id: string): Promise<void> {
    const tc = tableFor(remote)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().delete(id)
      await db.outbox.add({ table: remote, op: 'delete', rowId: id, ts: Date.now() })
    })
    afterMutation()
  }

  async function removeMany(remote: OutboxTable, ids: string[]): Promise<void> {
    if (ids.length === 0) return
    const tc = tableFor(remote)
    await db.transaction('rw', tc.table(), db.outbox, async () => {
      await tc.table().bulkDelete(ids)
      const ts = Date.now()
      await db.outbox.bulkAdd(ids.map((id) => ({ table: remote, op: 'delete' as const, rowId: id, ts })))
    })
    afterMutation()
  }

  async function removeCascade(remote: OutboxTable, id: string, children: CascadeChild[]): Promise<void> {
    const tc = tableFor(remote)
    const kids = children.map((c) => ({ tc: tableFor(c.remote), key: c.key }))
    await db.transaction('rw', [tc.table(), ...kids.map((k) => k.tc.table()), db.outbox], async () => {
      // Children first (local only — the server's FK cascade removes them),
      // then the parent, then its single tombstone.
      for (const k of kids) await k.tc.table().where(k.key).equals(id).delete()
      await tc.table().delete(id)
      await db.outbox.add({ table: remote, op: 'delete', rowId: id, ts: Date.now() })
    })
    afterMutation()
  }

  async function retryDead(): Promise<void> {
    const tables = config.tables.map((t) => t.table())
    await db.transaction('rw', [...tables, db.outbox], async () => {
      const dead = (await db.outbox.orderBy('seq').toArray()).filter((e) => e.dead && remotes.has(e.table))
      if (dead.length === 0) return
      // A dead entry's payload may be stale: later edits of the same row may
      // have been pushed since (the queue skips dead entries). Re-pushing the
      // old payload would roll the server back. So requeue each row ONCE, at
      // the end of the queue, as its CURRENT local state: present → upsert of
      // the local row, absent → delete. Original relative order is kept, so a
      // parent still goes before its children.
      const latest = new Map<string, OutboxEntry>()
      for (const e of dead) latest.set(`${e.table}\u0000${e.rowId}`, e)
      await db.outbox.bulkDelete(dead.map((e) => e.seq!))
      const ts = Date.now()
      for (const e of latest.values()) {
        const local = (await tableFor(e.table).table().get(e.rowId)) as OutboxPayload | undefined
        await db.outbox.add(
          local
            ? { table: e.table, op: 'upsert', rowId: e.rowId, payload: local, ts, tries: 0, dead: 0 }
            : { table: e.table, op: 'delete', rowId: e.rowId, ts, tries: 0, dead: 0 },
        )
      }
    })
    afterMutation()
  }

  async function discardDead(): Promise<void> {
    const dead = (await db.outbox.toArray()).filter((e) => e.dead && remotes.has(e.table))
    if (dead.length > 0) await db.outbox.bulkDelete(dead.map((e) => e.seq!))
    await refreshCounts()
    // Reconcile with the server right away when possible (no-op signed out:
    // the rows then just wait, unshielded, for the next signed-in pull).
    detached(() => void syncNow())
  }

  function getStatus(): SyncStatus {
    return status
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  // Seed the initial counts (fire-and-forget; UI updates when it resolves).
  void refreshCounts()

  return {
    flush,
    syncNow,
    start,
    upsert,
    upsertMany,
    remove,
    removeMany,
    removeCascade,
    retryDead,
    discardDead,
    getStatus,
    subscribe,
  }
}
