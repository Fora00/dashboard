import { db, type Site, type SiteNote, type SiteNoteKind, type SitePagesStatus, type SiteStatus } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { normalizeUrl } from './normalizeUrl'
import { pagesStatusFrom, type SitesPayload } from '../projects/siti/sitesLink'
import { planSitesImport, type SitesImportPlan } from '../projects/siti/sitesMerge'

// Local-first sync for Siti (/siti, SI1), built on the generic engine in
// cloudSync.ts; two-table shape like habitSync.ts. Owner-only tables:
//   sites       every website the owner publishes. Repo rows are written by the
//               import link (applySitesImport: GitHub fields only, see
//               src/projects/siti/sitesMerge.ts); the owner fields and the
//               manual sites (no repo) by the page.
//   site_notes  SI3: changes and ideas per site, logged on /siti (the
//               floating + sheet or the site's list). site_id → sites on
//               delete cascade: deleteSite removes them locally too.
// Remote access is is_owner() only (20261126180000_sites.sql): on a guest's
// device every push is rejected and dead-lettered by the engine, which keeps
// the local row.

// Caps — MUST match supabase/migrations/20261126180000_sites.sql and the
// inputs' maxLength.
export const MAX_NAME_LENGTH = 300
export const MAX_NOTES_LENGTH = 2000
export const MAX_URL_LENGTH = 2000
// MUST match supabase/migrations/20261126200000_site_notes.sql.
export const MAX_NOTE_TEXT_LENGTH = 2000
export const MAX_NOTE_PATH_LENGTH = 500

const STATUSES: readonly SiteStatus[] = ['live', 'preview', 'archived']
const isStatus = (v: unknown): v is SiteStatus => STATUSES.includes(v as SiteStatus)
const num = (v: number | null | undefined): number | null => (v === null || v === undefined ? null : Number(v))

interface SiteRow {
  id: string
  repo: string | null
  url: string
  name: string
  description: string
  private: boolean
  pushed_at: number | null
  pages_status: string | null
  pages_built_at: number | null
  fetched_at: number | null
  notes: string
  pinned: boolean
  status: string
  gone_from_github: boolean
  created_at: number
  updated_at: number
}

const sitesTable: TableSync<Site, SiteRow> = {
  remote: 'sites',
  table: () => db.sites,
  columns:
    'id, repo, url, name, description, private, pushed_at, pages_status, pages_built_at, fetched_at, notes, pinned, status, gone_from_github, created_at, updated_at',
  realtime: true,
  updatedAt: (s) => s.updatedAt,
  // Same repo adopted on one device and imported on another: one server row
  // wins (sites_repo_key), the next pull drops the local duplicate.
  uniqueViolationIsDone: true,
  toRow: (s) => ({
    id: s.id,
    repo: s.repo,
    url: s.url,
    name: s.name,
    description: s.description,
    private: s.private,
    pushed_at: s.pushedAt,
    pages_status: s.pagesStatus,
    pages_built_at: s.pagesBuiltAt,
    fetched_at: s.fetchedAt,
    notes: s.notes,
    pinned: s.pinned,
    status: s.status,
    gone_from_github: s.goneFromGithub,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }),
  fromRow: (r) => {
    if (typeof r.url !== 'string' || !isStatus(r.status)) throw new Error('sites: bad row')
    return {
      id: r.id,
      repo: r.repo ?? null,
      url: r.url,
      name: r.name ?? '',
      description: r.description ?? '',
      private: Boolean(r.private),
      pushedAt: num(r.pushed_at),
      pagesStatus: pagesStatusFrom(r.pages_status) as SitePagesStatus | null,
      pagesBuiltAt: num(r.pages_built_at),
      fetchedAt: num(r.fetched_at),
      notes: r.notes ?? '',
      pinned: Boolean(r.pinned),
      status: r.status,
      goneFromGithub: Boolean(r.gone_from_github),
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

interface SiteNoteRow {
  id: string
  site_id: string
  kind: string
  text: string
  path: string
  done: boolean
  created_at: number
  updated_at: number
}

const siteNotesTable: TableSync<SiteNote, SiteNoteRow> = {
  remote: 'site_notes',
  table: () => db.siteNotes,
  columns: 'id, site_id, kind, text, path, done, created_at, updated_at',
  realtime: true,
  updatedAt: (n) => n.updatedAt,
  toRow: (n) => ({
    id: n.id,
    site_id: n.siteId,
    kind: n.kind,
    text: n.text,
    path: n.path,
    done: n.done,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
  }),
  fromRow: (r) => {
    if (r.kind !== 'change' && r.kind !== 'idea') throw new Error('site_notes: bad row')
    return {
      id: r.id,
      siteId: r.site_id,
      kind: r.kind,
      text: r.text,
      path: r.path ?? '',
      done: Boolean(r.done),
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'siti',
  // Parent first, like habitSync (pull order).
  tables: [sitesTable, siteNotesTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/**
 * Apply an import link on an explicit tap: re-plans against Dexie right now
 * (never from a stale preview) and writes the plan in one transaction.
 * Idempotent: the same link twice plans nothing.
 */
export async function applySitesImport(payload: SitesPayload): Promise<SitesImportPlan> {
  return db.transaction('rw', db.sites, db.outbox, async () => {
    const plan = planSitesImport(payload, await db.sites.toArray(), Date.now())
    await engine.upsertMany('sites', plan.upserts)
    return plan
  })
}

/** Add a site by hand (no repo). Returns its id, or null when the url is not http(s). */
export async function addManualSite(rawUrl: string, name: string): Promise<string | null> {
  const url = normalizeUrl(rawUrl)
  if (!url || url.length > MAX_URL_LENGTH) return null
  const now = Date.now()
  const id = crypto.randomUUID()
  await engine.upsert('sites', {
    id,
    repo: null,
    url,
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    description: '',
    private: false,
    pushedAt: null,
    pagesStatus: null,
    pagesBuiltAt: null,
    fetchedAt: null,
    notes: '',
    pinned: false,
    status: 'live',
    goneFromGithub: false,
    createdAt: now,
    updatedAt: now,
  })
  return id
}

/**
 * Edit the owner fields (and the url of a manual site). Merges into the row as
 * stored right now, not the caller's copy: two quick edits (a note saved on
 * blur by the same tap that changes the status) must not undo each other.
 */
export async function updateSite(
  site: Site,
  patch: Partial<Pick<Site, 'name' | 'notes' | 'pinned' | 'status' | 'url'>>,
): Promise<void> {
  await db.transaction('rw', db.sites, db.outbox, async () => {
    const current = (await db.sites.get(site.id)) ?? site
    const next: Site = { ...current, ...patch, updatedAt: Date.now() }
    next.name = next.name.trim().slice(0, MAX_NAME_LENGTH)
    next.notes = next.notes.slice(0, MAX_NOTES_LENGTH)
    // A repo row's url belongs to GitHub; only a manual site's url is editable.
    if (current.repo) next.url = current.url
    else if (patch.url !== undefined) {
      const url = normalizeUrl(patch.url)
      next.url = url && url.length <= MAX_URL_LENGTH ? url : current.url
    }
    await engine.upsert('sites', next)
  })
}

/** Delete a site and its notes (one tombstone; the server cascades). Returns the notes, for Undo. */
export async function deleteSite(id: string): Promise<SiteNote[]> {
  return db.transaction('rw', db.sites, db.siteNotes, db.outbox, async () => {
    const notes = await db.siteNotes.where('siteId').equals(id).toArray()
    await engine.removeCascade('sites', id, [{ remote: 'site_notes', key: 'siteId' }])
    return notes
  })
}

/** Undo a delete: the exact row back (then its notes), with a fresh updatedAt so it wins. */
export async function restoreSite(site: Site, notes: readonly SiteNote[] = []): Promise<void> {
  const now = Date.now()
  await db.transaction('rw', db.sites, db.siteNotes, db.outbox, async () => {
    await engine.upsert('sites', { ...site, updatedAt: now })
    await engine.upsertMany(
      'site_notes',
      notes.map((n) => ({ ...n, updatedAt: now })),
    )
  })
}

// --- Changes and ideas (SI3) ------------------------------------------------

/** Log a change or idea for a site. Returns the new note, or null for empty text. */
export async function addSiteNote(
  siteId: string,
  kind: SiteNoteKind,
  text: string,
  path = '',
): Promise<SiteNote | null> {
  const clean = text.trim().slice(0, MAX_NOTE_TEXT_LENGTH)
  if (!clean) return null
  const now = Date.now()
  const note: SiteNote = {
    id: crypto.randomUUID(),
    siteId,
    kind,
    text: clean,
    path: path.slice(0, MAX_NOTE_PATH_LENGTH),
    done: false,
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('site_notes', note)
  return note
}

/** Tick a note done (or open again), merged into the stored row. */
export async function setSiteNoteDone(id: string, done: boolean): Promise<void> {
  await db.transaction('rw', db.siteNotes, db.outbox, async () => {
    const current = await db.siteNotes.get(id)
    if (!current || current.done === done) return
    await engine.upsert('site_notes', { ...current, done, updatedAt: Date.now() })
  })
}

export async function deleteSiteNote(id: string): Promise<void> {
  await engine.remove('site_notes', id)
}

/** Undo a note delete. */
export async function restoreSiteNote(note: SiteNote): Promise<void> {
  await engine.upsert('site_notes', { ...note, updatedAt: Date.now() })
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startSitiSync = engine.start
