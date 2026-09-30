import { db, type TripCompanion, type TripIdea } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'

// Local-first sync for the trips project (two tables: ideas + companions),
// built on the generic engine in cloudSync.ts. See docs/NEW_PROJECT.md.

// Caps — each MUST match the CHECK constraints in
// supabase/migrations/20260930120000_trips.sql and the inputs' maxLength.
export const MAX_TITLE_LENGTH = 300
export const MAX_NOTES_LENGTH = 2000
export const MAX_NAME_LENGTH = 40
export const MAX_EMOJI_LENGTH = 8
export const MAX_COMPANIONS_PER_IDEA = 20
export const DEFAULT_EMOJI = '🙂'

interface IdeaRow {
  id: string
  title: string
  notes: string
  companion_ids: string[]
  done: boolean
  created_at: number
  updated_at: number
}

interface CompanionRow {
  id: string
  name: string
  emoji: string
  created_at: number
  updated_at: number
}

const ideasTable: TableSync<TripIdea, IdeaRow> = {
  remote: 'trip_ideas',
  table: () => db.tripIdeas,
  columns: 'id, title, notes, companion_ids, done, created_at, updated_at',
  realtime: true,
  updatedAt: (i) => i.updatedAt,
  toRow: (i) => ({
    id: i.id,
    title: i.title,
    notes: i.notes,
    // `?? []` guards an outbox payload with no companionIds (data-loss guard,
    // see the links tags note in linksSync.ts).
    companion_ids: i.companionIds ?? [],
    done: i.done === 1,
    created_at: i.createdAt,
    updated_at: i.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    title: r.title,
    notes: r.notes,
    // A null from the server must never reach the multiEntry index.
    companionIds: r.companion_ids ?? [],
    done: r.done ? 1 : 0,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const companionsTable: TableSync<TripCompanion, CompanionRow> = {
  remote: 'trip_companions',
  table: () => db.tripCompanions,
  columns: 'id, name, emoji, created_at, updated_at',
  realtime: true,
  updatedAt: (c) => c.updatedAt,
  toRow: (c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji || DEFAULT_EMOJI,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji || DEFAULT_EMOJI,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'trips',
  tables: [ideasTable, companionsTable],
})

// --- Pure helpers ---------------------------------------------------------

/** Trim and collapse whitespace. Null if empty or over the cap. */
export function normalizeName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, ' ')
  if (!name || name.length > MAX_NAME_LENGTH) return null
  return name
}

/** Empty companionIds means Solo; anything else is a group trip. */
export function ideaKind(idea: Pick<TripIdea, 'companionIds'>): 'solo' | 'group' {
  return (idea.companionIds ?? []).length === 0 ? 'solo' : 'group'
}

function normalizeEmoji(raw: string | undefined): string {
  const e = (raw ?? '').trim()
  return e && e.length <= MAX_EMOJI_LENGTH ? e : DEFAULT_EMOJI
}

function nameTaken(all: TripCompanion[], name: string, exceptId?: string): boolean {
  const key = name.toLowerCase()
  return all.some((c) => c.id !== exceptId && c.name.toLowerCase() === key)
}

// --- Local mutations (used by the UI; safe with or without sync) -----------

export type CompanionResult =
  | { ok: true; companion: TripCompanion }
  | { ok: false; reason: 'invalid' | 'duplicate' }

/** Create a person. Rejects empty/too-long names and case-insensitive duplicates. */
export async function addCompanion(rawName: string, emoji?: string): Promise<CompanionResult> {
  const name = normalizeName(rawName)
  if (!name) return { ok: false, reason: 'invalid' }
  return db.transaction('rw', db.tripCompanions, db.outbox, async (): Promise<CompanionResult> => {
    if (nameTaken(await db.tripCompanions.toArray(), name)) return { ok: false, reason: 'duplicate' }
    const now = Date.now()
    const companion: TripCompanion = {
      id: crypto.randomUUID(),
      name,
      emoji: normalizeEmoji(emoji),
      createdAt: now,
      updatedAt: now,
    }
    await engine.upsert('trip_companions', companion)
    return { ok: true, companion }
  })
}

export async function renameCompanion(
  companion: TripCompanion,
  rawName: string,
): Promise<CompanionResult> {
  const name = normalizeName(rawName)
  if (!name) return { ok: false, reason: 'invalid' }
  return db.transaction('rw', db.tripCompanions, db.outbox, async (): Promise<CompanionResult> => {
    if (nameTaken(await db.tripCompanions.toArray(), name, companion.id)) {
      return { ok: false, reason: 'duplicate' }
    }
    const next = { ...companion, name, updatedAt: Date.now() }
    await engine.upsert('trip_companions', next)
    return { ok: true, companion: next }
  })
}

export async function setCompanionEmoji(companion: TripCompanion, raw: string): Promise<void> {
  const emoji = normalizeEmoji(raw)
  if (emoji === companion.emoji) return
  await engine.upsert('trip_companions', { ...companion, emoji, updatedAt: Date.now() })
}

/**
 * Delete a person and strip their id from every idea that carries it, in ONE
 * transaction (ideas first in the outbox, so the server never holds a dangling
 * id after the companion delete). Returns the snapshot Undo needs: the
 * companion and the ideas as they were before.
 */
export async function deleteCompanion(
  id: string,
): Promise<{ companion: TripCompanion; ideas: TripIdea[] } | null> {
  return db.transaction('rw', db.tripIdeas, db.tripCompanions, db.outbox, async () => {
    const companion = await db.tripCompanions.get(id)
    if (!companion) return null
    const ideas = await db.tripIdeas.where('companionIds').equals(id).toArray()
    const now = Date.now()
    await engine.upsertMany(
      'trip_ideas',
      ideas.map((i) => ({
        ...i,
        companionIds: (i.companionIds ?? []).filter((c) => c !== id),
        updatedAt: now,
      })),
    )
    await engine.remove('trip_companions', id)
    return { companion, ideas }
  })
}

/** Undo of deleteCompanion: re-insert the person and the original ideas. */
export async function restoreCompanion(snapshot: {
  companion: TripCompanion
  ideas: TripIdea[]
}): Promise<void> {
  const now = Date.now()
  await db.transaction('rw', db.tripIdeas, db.tripCompanions, db.outbox, async () => {
    await engine.upsert('trip_companions', { ...snapshot.companion, updatedAt: now })
    await engine.upsertMany(
      'trip_ideas',
      snapshot.ideas.map((i) => ({ ...i, updatedAt: now })),
    )
  })
}

function cleanIds(ids: string[]): string[] {
  return [...new Set(ids)].slice(0, MAX_COMPANIONS_PER_IDEA)
}

export async function addIdea(rawTitle: string, companionIds: string[]): Promise<void> {
  const title = rawTitle.trim().slice(0, MAX_TITLE_LENGTH)
  if (!title) return
  const now = Date.now()
  await engine.upsert('trip_ideas', {
    id: crypto.randomUUID(),
    title,
    notes: '',
    companionIds: cleanIds(companionIds),
    done: 0,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateIdea(
  idea: TripIdea,
  patch: { title?: string; notes?: string; companionIds?: string[] },
): Promise<void> {
  const next = { ...idea, ...patch, updatedAt: Date.now() }
  if (patch.companionIds) next.companionIds = cleanIds(patch.companionIds)
  await engine.upsert('trip_ideas', next)
}

export async function toggleDone(idea: TripIdea): Promise<void> {
  await engine.upsert('trip_ideas', { ...idea, done: idea.done === 0 ? 1 : 0, updatedAt: Date.now() })
}

export async function deleteIdea(id: string): Promise<void> {
  await engine.remove('trip_ideas', id)
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startTripsSync = engine.start
