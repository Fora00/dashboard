import { db, type LinkItem } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'

// Local-first sync for the links project, built on the generic engine in
// cloudSync.ts. Copied from src/lib/todoSync.ts (THE reference integration) —
// see docs/NEW_PROJECT.md.

interface LinkRow {
  id: string
  url: string
  title: string
  notes: string
  read: boolean
  tags: string[]
  created_at: number
  updated_at: number
}

const linksTable: TableSync<LinkItem, LinkRow> = {
  remote: 'links',
  table: () => db.links,
  columns: 'id, url, title, notes, read, tags, created_at, updated_at',
  realtime: true,
  updatedAt: (l) => l.updatedAt,
  toRow: (l) => ({
    id: l.id,
    url: l.url,
    title: l.title,
    notes: l.notes,
    read: l.read === 1,
    // `?? []` guards one real case: a row queued in the outbox under Dexie v8
    // still has no tags (the v9 upgrade rewrites the links table, not queued
    // outbox payloads), and pushing undefined into a NOT NULL column would
    // dead-letter the entry.
    tags: l.tags ?? [],
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    url: r.url,
    title: r.title,
    notes: r.notes,
    read: r.read ? 1 : 0,
    // A row written before the tags column existed (or by an older client)
    // comes back null/absent — never let that reach Dexie's multiEntry index.
    tags: r.tags ?? [],
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'links',
  tables: [linksTable],
})

// --- URL helpers -------------------------------------------------------
// Single source of truth for both addLink() and the page's Add-button
// validation. Never fetches the page for a real title — this must work
// offline, and a cross-origin fetch would be CORS-blocked anyway.

function withScheme(raw: string): string {
  const trimmed = raw.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Trim, add a default scheme, and validate. Returns null if it's not a usable http(s) URL. */
export function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(withScheme(raw))
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

function defaultTitle(url: string): string {
  const parsed = new URL(url)
  const host = parsed.hostname.replace(/^www\./, '')
  const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/$/, '')
  return (host + path).slice(0, 300)
}

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addLink(rawUrl: string): Promise<void> {
  const url = normalizeUrl(rawUrl)
  if (!url) return
  const now = Date.now()
  const link: LinkItem = {
    id: crypto.randomUUID(),
    url,
    title: defaultTitle(url),
    notes: '',
    read: 0,
    tags: [],
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('links', link)
}

// --- Tag helpers -------------------------------------------------------
// normalizeTag is the single source of truth for what a tag looks like: the
// UI and the mutations below both go through it, so "Work", " work " and
// "WORK" can only ever produce the one tag `work`.

/** Max tags per link — mirrored by the links_tags_max_count SQL constraint. */
const MAX_TAGS = 10
/** Max chars per tag — mirrored by the links_tags_max_length SQL constraint. */
const MAX_TAG_LENGTH = 30

/** Trim, lowercase, collapse internal whitespace. Null if empty or too long. */
export function normalizeTag(raw: string): string | null {
  const tag = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!tag || tag.length > MAX_TAG_LENGTH) return null
  return tag
}

/** Add a tag to a link. No-ops if invalid, already present, or the link is full. */
export async function addTag(link: LinkItem, raw: string): Promise<void> {
  const tag = normalizeTag(raw)
  if (!tag) return
  const tags = link.tags ?? []
  if (tags.includes(tag) || tags.length >= MAX_TAGS) return
  await engine.upsert('links', { ...link, tags: [...tags, tag], updatedAt: Date.now() })
}

/** Remove a tag from a link. No-ops if the link doesn't carry it. */
export async function removeTag(link: LinkItem, tag: string): Promise<void> {
  const tags = link.tags ?? []
  if (!tags.includes(tag)) return
  await engine.upsert('links', {
    ...link,
    tags: tags.filter((t) => t !== tag),
    updatedAt: Date.now(),
  })
}

export async function toggleRead(link: LinkItem): Promise<void> {
  await engine.upsert('links', { ...link, read: link.read === 0 ? 1 : 0, updatedAt: Date.now() })
}

export async function updateLink(
  link: LinkItem,
  patch: { title?: string; notes?: string },
): Promise<void> {
  await engine.upsert('links', { ...link, ...patch, updatedAt: Date.now() })
}

export async function deleteLink(id: string): Promise<void> {
  await engine.remove('links', id)
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startLinksSync = engine.start
