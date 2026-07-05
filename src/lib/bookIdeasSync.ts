import { db, type BookIdea } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'

// Local-first sync for the book-ideas project, built on the generic engine in
// cloudSync.ts. Copied from src/lib/todoSync.ts (THE reference integration) —
// see docs/NEW_PROJECT.md.

interface BookIdeaRow {
  id: string
  text: string
  notes: string
  created_at: number
  updated_at: number
}

const bookIdeasTable: TableSync<BookIdea, BookIdeaRow> = {
  remote: 'book_ideas',
  table: () => db.bookIdeas,
  columns: 'id, text, notes, created_at, updated_at',
  realtime: true,
  updatedAt: (i) => i.updatedAt,
  toRow: (i) => ({
    id: i.id,
    text: i.text,
    notes: i.notes,
    created_at: i.createdAt,
    updated_at: i.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    text: r.text,
    notes: r.notes,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'book-ideas',
  tables: [bookIdeasTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addBookIdea(text: string): Promise<void> {
  const now = Date.now()
  const idea: BookIdea = {
    id: crypto.randomUUID(),
    text,
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('book_ideas', idea)
}

/** Upsert a bumped-updatedAt copy with new notes. Call sites should skip this
 *  when the notes are unchanged (e.g. on blur with no edit made). */
export async function updateNotes(idea: BookIdea, notes: string): Promise<void> {
  await engine.upsert('book_ideas', { ...idea, notes, updatedAt: Date.now() })
}

export async function deleteBookIdea(id: string): Promise<void> {
  await engine.remove('book_ideas', id)
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startBookIdeasSync = engine.start
