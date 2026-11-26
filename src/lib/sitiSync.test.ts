import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import {
  addManualSite,
  addSiteNote,
  applySitesImport,
  deleteSite,
  deleteSiteNote,
  restoreSite,
  restoreSiteNote,
  setSiteNoteDone,
  updateSite,
} from './sitiSync'

// Siti writers: local-first (Dexie + outbox, no session needed). Invented repos.

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const ops = async () => (await db.outbox.toArray()).filter((o) => o.table === 'sites').map((o) => `${o.op} ${o.rowId}`)

const payload = (fetchedAt: number, built: number) => ({
  fetchedAt,
  sites: [
    {
      repo: 'example-user/demo',
      url: 'https://example-user.github.io/demo/',
      description: '',
      private: false,
      pushedAt: built,
      pagesStatus: 'built' as const,
      pagesBuiltAt: built,
    },
  ],
})

describe('sitiSync', () => {
  it('imports and queues; the same link twice writes nothing', async () => {
    const plan = await applySitesImport(payload(10, 5))
    expect(plan.added).toHaveLength(1)
    const id = plan.added[0]!.id
    expect(await ops()).toEqual([`upsert ${id}`])
    const again = await applySitesImport(payload(10, 5))
    expect(again.upserts).toEqual([])
    expect(await ops()).toHaveLength(1)
  })

  it('merges edits into the stored row, never a stale copy, and keeps a repo url', async () => {
    const [site] = (await applySitesImport(payload(10, 5))).added
    await updateSite(site!, { notes: 'nota' })
    // Same stale object (as a blur + tap in one gesture would pass it).
    await updateSite(site!, { status: 'archived', url: 'https://other.example.org/' })
    expect(await db.sites.get(site!.id)).toMatchObject({
      notes: 'nota',
      status: 'archived',
      url: 'https://example-user.github.io/demo/',
    })
    // A later import keeps the owner fields.
    await applySitesImport(payload(20, 15))
    expect(await db.sites.get(site!.id)).toMatchObject({ notes: 'nota', status: 'archived', pagesBuiltAt: 15 })
  })

  it('adds a manual site (http(s) only), edits its url, deletes and restores it', async () => {
    expect(await addManualSite('javascript:alert(1)', 'x')).toBeNull()
    expect(await addManualSite('example.org', ' Prova ')).toMatch(/^[0-9a-f-]{36}$/)
    const [site] = await db.sites.toArray()
    expect(site).toMatchObject({ repo: null, url: 'https://example.org/', name: 'Prova', status: 'live' })
    await updateSite(site!, { url: 'example.net/x' })
    expect((await db.sites.get(site!.id))?.url).toBe('https://example.net/x')
    const stored = (await db.sites.get(site!.id))!
    await deleteSite(site!.id)
    expect(await db.sites.count()).toBe(0)
    await restoreSite(stored)
    expect(await db.sites.get(site!.id)).toMatchObject({ url: 'https://example.net/x' })
    expect((await ops()).at(-2)).toBe(`delete ${site!.id}`)
  })

  it('logs, ticks, deletes and restores a note; deleting a site cascades locally and Undo brings both back', async () => {
    const siteId = (await addManualSite('example.org', 'Prova'))!
    expect(await addSiteNote(siteId, 'idea', '   ')).toBeNull()
    const note = (await addSiteNote(siteId, 'change', '  Titolo più grande  ', '/chi.html'))!
    expect(note).toMatchObject({ siteId, kind: 'change', text: 'Titolo più grande', path: '/chi.html', done: false })
    await setSiteNoteDone(note.id, true)
    expect((await db.siteNotes.get(note.id))?.done).toBe(true)
    await deleteSiteNote(note.id)
    expect(await db.siteNotes.count()).toBe(0)
    await restoreSiteNote(note)
    expect(await db.siteNotes.get(note.id)).toMatchObject({ text: 'Titolo più grande' })

    const site = (await db.sites.get(siteId))!
    const before = (await db.outbox.toArray()).length
    const removed = await deleteSite(siteId)
    expect(removed.map((n) => n.id)).toEqual([note.id])
    expect(await db.siteNotes.count()).toBe(0)
    // One tombstone for the site; the server cascades the notes.
    const added = (await db.outbox.toArray()).slice(before).map((o) => `${o.table} ${o.op}`)
    expect(added.filter((x) => x.startsWith('site_notes'))).toEqual([])
    expect(added).toContain('sites delete')
    await restoreSite(site, removed)
    expect(await db.sites.get(siteId)).toBeTruthy()
    expect(await db.siteNotes.get(note.id)).toMatchObject({ siteId })
  })
})
