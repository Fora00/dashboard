import type { Site, SiteNote, SiteNoteKind, SiteStatus } from '../../lib/db.ts'
import { displayHost } from '../../lib/idn.ts'
import { repoShortName } from './sitesLink.ts'

// Pure view helpers for /siti (SI1): the name a card shows, the order, the
// status filter and an Italian "3 giorni fa".

export type SiteFilter = 'all' | SiteStatus

export const FILTERS: { id: SiteFilter; label: string }[] = [
  { id: 'all', label: 'tutti' },
  { id: 'live', label: 'live' },
  { id: 'preview', label: 'preview' },
  { id: 'archived', label: 'archiviati' },
]

export const STATUS_LABEL: Record<SiteStatus, string> = {
  live: 'live',
  preview: 'preview',
  archived: 'archiviato',
}

export function hostOf(url: string): string {
  try {
    const u = new URL(url)
    const path = u.pathname === '/' ? '' : u.pathname.replace(/\/$/, '')
    return displayHost(u.hostname).replace(/^www\./, '') + path
  } catch {
    return url
  }
}

/** Owner's name, else the repo's short name, else the url's host. */
export function siteName(s: Pick<Site, 'name' | 'repo' | 'url'>): string {
  return s.name.trim() || (s.repo ? repoShortName(s.repo) : hostOf(s.url))
}

/** The last deploy: the Pages build time, else the last push. */
export function lastDeployAt(s: Site): number | null {
  return s.pagesBuiltAt ?? s.pushedAt
}

/** Pinned first, then the most recent deploy (never deployed last), then by name. */
export function sortSites(sites: readonly Site[]): Site[] {
  return [...sites].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      (lastDeployAt(b) ?? -1) - (lastDeployAt(a) ?? -1) ||
      siteName(a).localeCompare(siteName(b)),
  )
}

export function filterSites(sites: readonly Site[], filter: SiteFilter): Site[] {
  return filter === 'all' ? [...sites] : sites.filter((s) => s.status === filter)
}

/** "adesso", "5 min fa", "3 ore fa", "ieri", "4 giorni fa", "2 mesi fa", "1 anno fa". */
export function agoIt(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 60) return 'adesso'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min fa`
  const h = Math.floor(m / 60)
  if (h < 24) return h === 1 ? '1 ora fa' : `${h} ore fa`
  const d = Math.floor(h / 24)
  if (d === 1) return 'ieri'
  if (d < 30) return `${d} giorni fa`
  const mo = Math.floor(d / 30)
  if (mo < 12) return mo === 1 ? '1 mese fa' : `${mo} mesi fa`
  const y = Math.floor(d / 365)
  return y <= 1 ? '1 anno fa' : `${y} anni fa`
}

export const KIND_LABEL: Record<SiteNoteKind, string> = { change: 'Modifica', idea: 'Idea' }

/** Open (not done) notes per site id. */
export function openNoteCounts(notes: readonly SiteNote[]): Map<string, number> {
  const out = new Map<string, number>()
  for (const n of notes) if (!n.done) out.set(n.siteId, (out.get(n.siteId) ?? 0) + 1)
  return out
}
