import type { Site, SiteStatus } from '../../lib/db.ts'
import { uuidV5 } from '../../lib/uuidV5.ts'
import { repoShortName, type SiteFromGithub, type SitesPayload } from './sitesLink.ts'

// The Siti import plan (SI1), pure: what an import link does to the sites on
// this device. Rules:
//   - merge by repo (case-insensitive, GitHub names are): only the GitHub
//     fields are refreshed; the owner fields (name, notes, pinned, status)
//     are never touched;
//   - a repo the device does not know yet: a site added by hand (no repo)
//     with the same url adopts it, otherwise a new row whose status is
//     'preview' when the repo name ends in -preview, else 'live';
//   - a repo missing from the link is flagged goneFromGithub (never deleted);
//     a repo that comes back clears the flag;
//   - a row whose only change is fetchedAt is still written (it records when
//     GitHub was last read) but counts as unchanged; the same link twice
//     writes nothing.

/** Namespace for repo-derived ids: the same repo gets the same id on every device. */
const SITE_NAMESPACE = 'b3f6c1a2-5d4e-4f7a-9b8c-2e1d0a3f6b5c'

/** The id of the row for `repo` when the import creates it. */
export function siteIdForRepo(repo: string): string {
  return uuidV5(repo.toLowerCase(), SITE_NAMESPACE)
}

/** Status a new repo starts with. */
export function defaultStatusForRepo(repo: string): SiteStatus {
  return repoShortName(repo).toLowerCase().endsWith('-preview') ? 'preview' : 'live'
}

export interface SitesImportPlan {
  /** Repos new on this device (incl. a manual site adopting one). */
  added: Site[]
  /** Known repos whose GitHub fields changed (incl. one coming back). */
  updated: Site[]
  /** Known repos no longer on GitHub (newly flagged). */
  gone: Site[]
  /** Known repos with nothing new. */
  unchanged: number
  /** Every row to write: added + updated + gone + the fetchedAt-only refreshes. */
  upserts: Site[]
}

function githubFields(g: SiteFromGithub, fetchedAt: number) {
  return {
    repo: g.repo,
    url: g.url,
    description: g.description,
    private: g.private,
    pushedAt: g.pushedAt,
    pagesStatus: g.pagesStatus,
    pagesBuiltAt: g.pagesBuiltAt,
    fetchedAt,
    goneFromGithub: false,
  }
}

function sameGithub(a: Site, b: Site): boolean {
  return (
    a.repo === b.repo &&
    a.url === b.url &&
    a.description === b.description &&
    a.private === b.private &&
    a.pushedAt === b.pushedAt &&
    a.pagesStatus === b.pagesStatus &&
    a.pagesBuiltAt === b.pagesBuiltAt &&
    a.goneFromGithub === b.goneFromGithub
  )
}

export function planSitesImport(payload: SitesPayload, stored: readonly Site[], now: number): SitesImportPlan {
  const byRepo = new Map<string, Site>()
  const manualByUrl = new Map<string, Site>()
  for (const s of stored) {
    if (s.repo) byRepo.set(s.repo.toLowerCase(), s)
    else if (!manualByUrl.has(s.url)) manualByUrl.set(s.url, s)
  }
  const plan: SitesImportPlan = { added: [], updated: [], gone: [], unchanged: 0, upserts: [] }
  const listed = new Set<string>()

  for (const g of payload.sites) {
    const key = g.repo.toLowerCase()
    listed.add(key)
    const known = byRepo.get(key)
    if (known) {
      const next: Site = { ...known, ...githubFields(g, payload.fetchedAt) }
      if (!sameGithub(known, next)) {
        next.updatedAt = now
        plan.updated.push(next)
        plan.upserts.push(next)
      } else {
        plan.unchanged++
        if (known.fetchedAt !== payload.fetchedAt) plan.upserts.push({ ...next, updatedAt: now })
      }
      continue
    }
    const manual = manualByUrl.get(g.url)
    if (manual) {
      manualByUrl.delete(g.url)
      const next: Site = { ...manual, ...githubFields(g, payload.fetchedAt), updatedAt: now }
      plan.added.push(next)
      plan.upserts.push(next)
      continue
    }
    const site: Site = {
      id: siteIdForRepo(g.repo),
      ...githubFields(g, payload.fetchedAt),
      name: '',
      notes: '',
      pinned: false,
      status: defaultStatusForRepo(g.repo),
      createdAt: now,
      updatedAt: now,
    }
    plan.added.push(site)
    plan.upserts.push(site)
  }

  for (const s of stored) {
    if (!s.repo || listed.has(s.repo.toLowerCase()) || s.goneFromGithub) continue
    const next: Site = { ...s, goneFromGithub: true, updatedAt: now }
    plan.gone.push(next)
    plan.upserts.push(next)
  }
  return plan
}
