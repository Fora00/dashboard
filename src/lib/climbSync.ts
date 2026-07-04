import { db, type Climb, type ClimbSession, type Discipline } from './db'
import { createCloudSync, type TableSync } from './cloudSync'

// Local-first sync for the climbing project, built on the generic engine in
// cloudSync.ts. Copies the todo reference integration (src/lib/todoSync.ts):
//   1. define the remote row type + a TableSync per table (mappers, columns),
//   2. createCloudSync({ projectId, tables }),
//   3. export mutation helpers the UI calls instead of raw Dexie writes,
//   4. export startClimbSync = engine.start and wire it in App.tsx.

interface ClimbSessionRow {
  id: string
  date: string
  location: string
  discipline: Discipline
  notes: string | null
  created_at: number
}

interface ClimbRow {
  id: string
  session_id: string
  date: string
  discipline: Discipline
  grade: string
  sent: boolean
  created_at: number
}

const sessionsTable: TableSync<ClimbSession, ClimbSessionRow> = {
  remote: 'climb_sessions',
  table: () => db.climbSessions,
  columns: 'id, date, location, discipline, notes, created_at',
  realtime: true,
  toRow: (s) => ({
    id: s.id,
    date: s.date,
    location: s.location,
    discipline: s.discipline,
    notes: s.notes ?? null,
    created_at: s.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    date: r.date,
    location: r.location,
    discipline: r.discipline,
    notes: r.notes ?? undefined,
    createdAt: Number(r.created_at),
  }),
}

const climbsTable: TableSync<Climb, ClimbRow> = {
  remote: 'climbs',
  table: () => db.climbs,
  columns: 'id, session_id, date, discipline, grade, sent, created_at',
  realtime: true,
  toRow: (c) => ({
    id: c.id,
    session_id: c.sessionId,
    date: c.date,
    discipline: c.discipline,
    grade: c.grade,
    sent: c.sent === 1,
    created_at: c.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    sessionId: r.session_id,
    date: r.date,
    discipline: r.discipline,
    grade: r.grade,
    sent: r.sent ? 1 : 0,
    createdAt: Number(r.created_at),
  }),
}

const engine = createCloudSync({
  projectId: 'climbing',
  tables: [sessionsTable, climbsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addSession(input: {
  date: string
  location: string
  discipline: Discipline
  notes?: string
}): Promise<ClimbSession> {
  const session: ClimbSession = {
    id: crypto.randomUUID(),
    date: input.date,
    location: input.location,
    discipline: input.discipline,
    notes: input.notes || undefined,
    createdAt: Date.now(),
  }
  await engine.upsert('climb_sessions', session)
  return session
}

export async function deleteSession(id: string): Promise<void> {
  // Server cascades climbs on session delete, so one tombstone is enough —
  // but the local climb rows must go too, in the same transaction.
  await db.transaction('rw', db.climbSessions, db.climbs, db.outbox, async () => {
    await db.climbs.where('sessionId').equals(id).delete()
    await db.climbSessions.delete(id)
    await db.outbox.add({ table: 'climb_sessions', op: 'delete', rowId: id, ts: Date.now() })
  })
  void engine.flush()
}

export async function addClimb(
  session: ClimbSession,
  grade: string,
  sent: boolean,
): Promise<Climb> {
  const climb: Climb = {
    id: crypto.randomUUID(),
    sessionId: session.id,
    date: session.date,
    discipline: session.discipline,
    grade,
    sent: sent ? 1 : 0,
    createdAt: Date.now(),
  }
  await engine.upsert('climbs', climb)
  return climb
}

export async function toggleClimbSent(climb: Climb): Promise<void> {
  const updated: Climb = { ...climb, sent: climb.sent === 1 ? 0 : 1 }
  await engine.upsert('climbs', updated)
}

export async function deleteClimb(id: string): Promise<void> {
  await engine.remove('climbs', id)
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** Start syncing (call when a session exists). Returns a stop function. */
export const startClimbSync = engine.start
