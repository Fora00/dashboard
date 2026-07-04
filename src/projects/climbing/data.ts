import { db, type Climb, type ClimbSession, type Discipline } from '../../lib/db'

// Local-only data helpers for the climbing tracker. No outbox / cloud sync —
// everything stays in IndexedDB on this device.

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
  await db.climbSessions.add(session)
  return session
}

export async function deleteSession(id: string): Promise<void> {
  await db.transaction('rw', db.climbSessions, db.climbs, async () => {
    await db.climbs.where('sessionId').equals(id).delete()
    await db.climbSessions.delete(id)
  })
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
  await db.climbs.add(climb)
  return climb
}

export async function toggleClimbSent(climb: Climb): Promise<void> {
  await db.climbs.update(climb.id, { sent: climb.sent === 1 ? 0 : 1 })
}

export async function deleteClimb(id: string): Promise<void> {
  await db.climbs.delete(id)
}
