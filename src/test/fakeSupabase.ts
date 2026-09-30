// A scriptable stand-in for the slice of the Supabase client that
// src/lib/cloudSync.ts uses (auth.getSession, from().upsert/delete/select,
// channel()/removeChannel). Not a general mock: extend it when the engine
// starts using more of the client.
//
//   const fake = createFakeSupabase()
//   vi.mock('../lib/sync', () => ({ get supabase() { return fake.client } }))
//   fake.failNext('upsert', { code: '42501', message: 'rls' })   // one failure
//   fake.remote.links = [{ id: 'a', ... }]                        // pull() data
//   expect(fake.calls).toEqual([...])
//
// Transport/engine scenarios (cloudSync.test.ts):
//   fake.setNetwork('down')              // every request fails like a fetch failure (status 0, no code)
//   fake.rejectWith((t, op, id) => ...)  // persistent per-call rejection (returns a FakeError or null)
//   const release = fake.holdSelects()   // selects snapshot NOW, deliver on release() (pull race)
//   fake.selectOverride.todos = [...]    // raw rows select() returns, malformed ones included
//   fake.emit('todos', { eventType: 'UPDATE', new: row, old: null })  // a realtime event
// Responses carry `status` like supabase-js (201/204/200; errors default to 400).
export interface FakeError {
  code?: string
  message: string
  /** HTTP status the server answered with (default 400). */
  status?: number
}

const NETWORK_ERROR: FakeError = { message: 'TypeError: Failed to fetch', code: '', status: 0 }

export type FakeOp = 'upsert' | 'delete' | 'select'

export interface FakeCall {
  table: string
  op: FakeOp
  /** upsert: the row; delete: the id; select: the column list. */
  arg: unknown
}

export function createFakeSupabase() {
  const calls: FakeCall[] = []
  /** What select() returns, per remote table. Upserts/deletes also apply to it. */
  const remote: Record<string, { id: string }[]> = {}
  const failures: { op: FakeOp; error: FakeError; table?: string }[] = []
  let session: { user: { id: string } } | null = { user: { id: 'test-user' } }
  let sessionThrows = false
  const channels: string[] = []
  let network: 'up' | 'down' = 'up'
  let rejecter: ((table: string, op: FakeOp, id: string) => FakeError | null) | null = null
  let selectGate: Promise<void> | null = null
  const selectOverride: Record<string, unknown[]> = {}
  const handlers: Record<string, ((payload: unknown) => void)[]> = {}

  function failure(op: FakeOp, table: string, id: string): FakeError | null {
    if (network === 'down') return NETWORK_ERROR
    return takeFailure(op, table) ?? rejecter?.(table, op, id) ?? null
  }
  const fail = (e: FakeError) => ({ error: { message: e.message, code: e.code ?? '' }, status: e.status ?? 400 })

  function takeFailure(op: FakeOp, table: string): FakeError | null {
    const i = failures.findIndex((f) => f.op === op && (!f.table || f.table === table))
    if (i < 0) return null
    return failures.splice(i, 1)[0]!.error
  }

  const client = {
    auth: {
      getSession: async () => {
        if (sessionThrows) throw new Error('getSession failed')
        return { data: { session } }
      },
    },
    from(table: string) {
      return {
        upsert: async (row: { id: string }) => {
          calls.push({ table, op: 'upsert', arg: row })
          const error = failure('upsert', table, row.id)
          if (error) return fail(error)
          const rows = (remote[table] ??= [])
          const i = rows.findIndex((r) => r.id === row.id)
          if (i >= 0) rows[i] = row
          else rows.push(row)
          return { error: null, status: 201 }
        },
        delete: () => ({
          eq: async (_col: string, id: string) => {
            calls.push({ table, op: 'delete', arg: id })
            const error = failure('delete', table, id)
            if (error) return fail(error)
            remote[table] = (remote[table] ?? []).filter((r) => r.id !== id)
            return { error: null, status: 204 }
          },
        }),
        select: async (columns: string) => {
          calls.push({ table, op: 'select', arg: columns })
          const error = failure('select', table, '')
          if (error) return { data: null, ...fail(error) }
          // Snapshot at request time, deliver after the gate (like a real round trip).
          const snapshot = selectOverride[table] ?? (remote[table] ?? []).map((r) => ({ ...r }))
          if (selectGate) await selectGate
          return { data: [...snapshot], error: null, status: 200 }
        },
      }
    },
    channel(name: string) {
      channels.push(name)
      const ch = {
        on: (_type: string, filter: { table: string }, cb: (payload: unknown) => void) => {
          ;(handlers[filter.table] ??= []).push(cb)
          return ch
        },
        subscribe: () => ch,
      }
      return ch
    },
    removeChannel: async () => 'ok',
  }

  return {
    client,
    calls,
    remote,
    channels,
    selectOverride,
    /** Deliver a realtime postgres_changes payload to the engine's handler(s) for `table`. */
    emit(table: string, payload: { eventType: string; new: unknown; old: unknown }) {
      for (const cb of handlers[table] ?? []) cb(payload)
    },
    setNetwork(n: 'up' | 'down') {
      network = n
    },
    /** Persistent rejection rule, evaluated for every call (after failNext entries). */
    rejectWith(fn: ((table: string, op: FakeOp, id: string) => FakeError | null) | null) {
      rejecter = fn
    },
    /** Hold every select's delivery until the returned release() is called. */
    holdSelects(): () => void {
      let open!: () => void
      selectGate = new Promise<void>((r) => (open = r))
      return () => {
        selectGate = null
        open()
      }
    },
    /** The next matching call fails once with `error` (optionally only for `table`). */
    failNext(op: FakeOp, error: FakeError, table?: string) {
      failures.push(table ? { op, error, table } : { op, error })
    },
    signOut() {
      session = null
    },
    signIn() {
      session = { user: { id: 'test-user' } }
    },
    /** getSession() throws (the engine must still release its lock). */
    setSessionThrows(v: boolean) {
      sessionThrows = v
    },
    reset() {
      calls.length = 0
      failures.length = 0
      for (const k of Object.keys(remote)) delete remote[k]
      for (const k of Object.keys(selectOverride)) delete selectOverride[k]
      for (const k of Object.keys(handlers)) delete handlers[k]
      channels.length = 0
      network = 'up'
      rejecter = null
      selectGate = null
      session = { user: { id: 'test-user' } }
      sessionThrows = false
    },
  }
}

export type FakeSupabase = ReturnType<typeof createFakeSupabase>
