import { deflateRawSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import type { Site } from '../../lib/db'
import {
  SITES_LINK_MAX_PARAM,
  decodeSitesParam,
  encodeSitesLink,
  encodeSitesParam,
  pagesStatusFrom,
  pagesStatusFromDeployment,
  parseSitesPayloadJson,
  type SiteFromGithub,
  type SitesPayload,
} from './sitesLink'
import { defaultStatusForRepo, planSitesImport, siteIdForRepo } from './sitesMerge'
import { agoIt, filterSites, siteName, sortSites } from './sitesView'

// Invented repos and urls only.
const gh = (repo: string, over: Partial<SiteFromGithub> = {}): SiteFromGithub => ({
  repo,
  url: `https://example-user.github.io/${repo.split('/')[1]}/`,
  description: '',
  private: false,
  pushedAt: 1_000,
  pagesStatus: 'built',
  pagesBuiltAt: 2_000,
  ...over,
})

const payload = (sites: SiteFromGithub[], fetchedAt = 10_000): SitesPayload => ({ fetchedAt, sites })

const param = (json: unknown) => deflateRawSync(Buffer.from(JSON.stringify(json), 'utf8')).toString('base64url')

describe('sites link', () => {
  it('round-trips a payload through the d parameter', async () => {
    const p = payload([
      gh('example-user/zeta-site', { private: true, description: 'Una descrizione' }),
      gh('example-user/alpha-preview', { pagesStatus: 'errored', pushedAt: null, pagesBuiltAt: null }),
    ])
    const r = await decodeSitesParam(await encodeSitesParam(p))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.payload.fetchedAt).toBe(10_000)
    // Sorted by repo on the way in.
    expect(r.payload.sites.map((s) => s.repo)).toEqual(['example-user/alpha-preview', 'example-user/zeta-site'])
    expect(r.payload.sites[1]).toEqual(p.sites[0])
    expect(r.payload.sites[0]).toMatchObject({ pagesStatus: 'errored', pushedAt: null, pagesBuiltAt: null })
  })

  it('reads a link made the way the e2e (and the script) make it', async () => {
    const d = param({
      v: 'sites-1',
      fetchedAt: 5,
      rows: [['example-user/demo', 'https://example.org/demo', '', 0, null, null, null]],
    })
    const r = await decodeSitesParam(d)
    expect(r).toEqual({
      ok: true,
      payload: {
        fetchedAt: 5,
        sites: [
          {
            repo: 'example-user/demo',
            url: 'https://example.org/demo',
            description: '',
            private: false,
            pushedAt: null,
            pagesStatus: null,
            pagesBuiltAt: null,
          },
        ],
      },
    })
  })

  it('builds the import url', async () => {
    const url = await encodeSitesLink(payload([gh('example-user/demo')]), 'https://example.org/app/')
    expect(url).toMatch(/^https:\/\/example\.org\/app\/#\/siti\/import\?d=[A-Za-z0-9_-]+$/)
  })

  it('refuses damaged links, other formats and bad rows', async () => {
    expect((await decodeSitesParam('%%%')).ok).toBe(false)
    expect((await decodeSitesParam('AAAA')).ok).toBe(false)
    expect(parseSitesPayloadJson('{')).toEqual({ ok: false, errors: ['The import link is damaged (not JSON)'] })
    expect(parseSitesPayloadJson(JSON.stringify({ v: 'balances-1' })).ok).toBe(false)
    const bad = parseSitesPayloadJson(
      JSON.stringify({
        v: 'sites-1',
        fetchedAt: 1,
        rows: [
          ['not a repo', 'https://example.org', '', 0, null, null, null],
          ['example-user/a', 'javascript:alert(1)', '', 0, null, null, null],
          ['example-user/b', 'https://example.org', '', 2, null, 'weird', -1],
          ['example-user/c', 'https://example.org', '', 0, null, null, null],
          ['Example-User/C', 'https://example.org', '', 0, null, null, null],
          ['example-user/d'],
        ],
      }),
    )
    expect(bad.ok).toBe(false)
    if (bad.ok) return
    expect(bad.errors).toEqual([
      'rows[0]: repo must be owner/name',
      'rows[1]: url must be an http(s) address',
      'rows[2]: private must be 0 or 1',
      'rows[2]: pagesStatus must be built, errored, building or null',
      'rows[2]: pagesBuiltAt must be a time or null',
      'rows[4]: Example-User/C is listed twice',
      'rows[5] must be [repo, url, description, private, pushedAt, pagesStatus, pagesBuiltAt]',
    ])
  })

  it('refuses a link longer than the cap', async () => {
    const many = Array.from({ length: 400 }, (_, i) =>
      gh(`example-user/site-${i}`, { description: Array.from({ length: 40 }, () => crypto.randomUUID()).join('') }),
    )
    await expect(encodeSitesLink(payload(many))).rejects.toThrow(`max ${SITES_LINK_MAX_PARAM}`)
  })

  it('maps GitHub build and deployment states', () => {
    expect(pagesStatusFrom('built')).toBe('built')
    expect(pagesStatusFrom('queued')).toBe('building')
    expect(pagesStatusFrom('errored')).toBe('errored')
    expect(pagesStatusFrom('null')).toBeNull()
    expect(pagesStatusFromDeployment('success')).toBe('built')
    expect(pagesStatusFromDeployment('failure')).toBe('errored')
    expect(pagesStatusFromDeployment('error')).toBe('errored')
    expect(pagesStatusFromDeployment('in_progress')).toBe('building')
    expect(pagesStatusFromDeployment('inactive')).toBeNull()
  })
})

describe('sites import plan', () => {
  const first = payload([gh('example-user/shop'), gh('example-user/client-preview')], 10_000)

  it('adds new repos with the default status and a repo-derived id', () => {
    const plan = planSitesImport(first, [], 50)
    expect(plan.added.map((s) => [s.repo, s.status])).toEqual([
      ['example-user/shop', 'live'],
      ['example-user/client-preview', 'preview'],
    ])
    expect(plan.added[0]).toMatchObject({
      id: siteIdForRepo('example-user/shop'),
      name: '',
      notes: '',
      pinned: false,
      goneFromGithub: false,
      fetchedAt: 10_000,
      createdAt: 50,
      updatedAt: 50,
    })
    expect(siteIdForRepo('Example-User/Shop')).toBe(siteIdForRepo('example-user/shop'))
    expect(defaultStatusForRepo('example-user/Thing-PREVIEW')).toBe('preview')
    expect(plan.upserts).toHaveLength(2)
  })

  it('refreshes GitHub fields only, never the owner fields', () => {
    const stored = planSitesImport(first, [], 50).added.map((s): Site =>
      s.repo === 'example-user/shop'
        ? { ...s, name: 'Il negozio', notes: 'cliente X', pinned: true, status: 'archived' }
        : s,
    )
    const next = payload(
      [
        gh('example-user/shop', { pagesStatus: 'errored', pagesBuiltAt: 3_000, description: 'nuova' }),
        gh('example-user/client-preview'),
      ],
      20_000,
    )
    const plan = planSitesImport(next, stored, 60)
    expect(plan.added).toEqual([])
    expect(plan.gone).toEqual([])
    expect(plan.unchanged).toBe(1)
    expect(plan.updated).toHaveLength(1)
    expect(plan.updated[0]).toMatchObject({
      name: 'Il negozio',
      notes: 'cliente X',
      pinned: true,
      status: 'archived',
      pagesStatus: 'errored',
      pagesBuiltAt: 3_000,
      description: 'nuova',
      fetchedAt: 20_000,
      createdAt: 50,
      updatedAt: 60,
    })
    // The unchanged repo is still written, for its fetchedAt.
    expect(plan.upserts.map((s) => [s.repo, s.fetchedAt])).toEqual([
      ['example-user/shop', 20_000],
      ['example-user/client-preview', 20_000],
    ])
  })

  it('writes nothing for the same link twice', () => {
    const stored = planSitesImport(first, [], 50).upserts
    const plan = planSitesImport(first, stored, 60)
    expect(plan.upserts).toEqual([])
    expect(plan.unchanged).toBe(2)
  })

  it('flags a missing repo as gone (never deletes it) and clears the flag when it returns', () => {
    const stored: Site[] = [
      ...planSitesImport(first, [], 50).upserts,
      {
        ...planSitesImport(payload([gh('example-user/manual')]), [], 1).added[0]!,
        id: 'manual-1',
        repo: null,
        url: 'https://elsewhere.example.org/',
      },
    ]
    const gonePlan = planSitesImport(payload([gh('example-user/shop')], 20_000), stored, 70)
    expect(gonePlan.gone.map((s) => [s.repo, s.goneFromGithub, s.updatedAt])).toEqual([
      ['example-user/client-preview', true, 70],
    ])
    // A manual site (no repo) is never flagged.
    expect(gonePlan.upserts.find((s) => s.id === 'manual-1')).toBeUndefined()

    const afterGone = stored.map((s) => gonePlan.upserts.find((u) => u.id === s.id) ?? s)
    // Still gone on the next import: not flagged again.
    expect(planSitesImport(payload([gh('example-user/shop')], 20_000), afterGone, 80).gone).toEqual([])
    const back = planSitesImport(first, afterGone, 90)
    expect(back.updated.map((s) => [s.repo, s.goneFromGithub])).toEqual([['example-user/client-preview', false]])
  })

  it('a manual site with the same url adopts the repo, keeping its id and owner fields', () => {
    const manual: Site = {
      ...planSitesImport(first, [], 1).added[0]!,
      id: 'manual-1',
      repo: null,
      name: 'Negozio',
      fetchedAt: null,
    }
    const plan = planSitesImport(payload([gh('example-user/shop')]), [manual], 5)
    expect(plan.added).toHaveLength(1)
    expect(plan.added[0]).toMatchObject({
      id: 'manual-1',
      repo: 'example-user/shop',
      name: 'Negozio',
      fetchedAt: 10_000,
    })
  })
})

describe('sites view', () => {
  const base = planSitesImport(
    payload([
      gh('example-user/old', { pagesBuiltAt: 1_000 }),
      gh('example-user/new', { pagesBuiltAt: 5_000 }),
      gh('example-user/never', { pagesBuiltAt: null, pushedAt: null }),
      gh('example-user/pinned-preview', { pagesBuiltAt: 500 }),
    ]),
    [],
    1,
  ).added.map((s) => (s.repo === 'example-user/pinned-preview' ? { ...s, pinned: true } : s))

  it('sorts pinned first, then the most recent deploy', () => {
    expect(sortSites(base).map(siteName)).toEqual(['pinned-preview', 'new', 'old', 'never'])
    expect(filterSites(base, 'preview').map(siteName)).toEqual(['pinned-preview'])
    expect(filterSites(base, 'all')).toHaveLength(4)
  })

  it('names a site by override, repo, then host', () => {
    expect(siteName({ name: ' Mio ', repo: 'a/b', url: 'https://x.org/' })).toBe('Mio')
    expect(siteName({ name: '', repo: 'a/b', url: 'https://x.org/' })).toBe('b')
    expect(siteName({ name: '', repo: null, url: 'https://www.x.org/path/' })).toBe('x.org/path')
  })

  it('says how long ago in Italian', () => {
    const now = 1_000_000_000_000
    expect(agoIt(now - 10_000, now)).toBe('adesso')
    expect(agoIt(now - 5 * 60_000, now)).toBe('5 min fa')
    expect(agoIt(now - 3 * 3_600_000, now)).toBe('3 ore fa')
    expect(agoIt(now - 30 * 3_600_000, now)).toBe('ieri')
    expect(agoIt(now - 4 * 86_400_000, now)).toBe('4 giorni fa')
    expect(agoIt(now - 65 * 86_400_000, now)).toBe('2 mesi fa')
    expect(agoIt(now - 800 * 86_400_000, now)).toBe('2 anni fa')
  })
})
