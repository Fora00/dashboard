import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { saveEngineIceberg, setEngineLead, setEngineScore } from './lifeSync'

// Life Engines writers: local-first (Dexie + outbox, no session needed).

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const MONTH = '2026-11'
const engineOps = async () => (await db.outbox.toArray()).filter((o) => o.table === 'life_engines')
const blank = { event: '', pattern: '', system: '', belief: '', whys: [], lever: '', link: '' }

describe('Life Engines writers', () => {
  it('a score creates the row keyed month:engine and queues one upsert; a repeat writes nothing', async () => {
    await setEngineScore(MONTH, 'mind', 6)
    expect(await db.lifeEngines.get('2026-11:mind')).toMatchObject({
      month: MONTH,
      engine: 'mind',
      score: 6,
      lead: false,
    })
    await setEngineScore(MONTH, 'mind', 6)
    expect(await engineOps()).toHaveLength(1)
    await setEngineScore(MONTH, 'mind', null)
    expect((await db.lifeEngines.get('2026-11:mind'))?.score).toBeNull()
  })

  it('rejects out-of-range scores, unknown engines and bad months without writing', async () => {
    await expect(setEngineScore(MONTH, 'mind', 11)).rejects.toThrow()
    await expect(setEngineScore(MONTH, 'mind', 2.5)).rejects.toThrow()
    await expect(setEngineScore('2026-13', 'mind', 5)).rejects.toThrow()
    await expect(setEngineScore(MONTH, 'nope' as never, 5)).rejects.toThrow()
    expect(await db.lifeEngines.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
  })

  it('at most one lead per month: a new lead clears the old one, other months untouched', async () => {
    await setEngineLead('2026-10', 'career', true)
    await setEngineScore(MONTH, 'mind', 4)
    await setEngineLead(MONTH, 'mind', true)
    await setEngineLead(MONTH, 'money', true)
    const leads = (await db.lifeEngines.toArray()).filter((r) => r.lead).map((r) => r.id)
    expect(leads.sort()).toEqual(['2026-10:career', '2026-11:money'])
    // The old lead keeps its score.
    expect(await db.lifeEngines.get('2026-11:mind')).toMatchObject({ lead: false, score: 4 })
    await setEngineLead(MONTH, 'money', false)
    expect((await db.lifeEngines.where('month').equals(MONTH).toArray()).some((r) => r.lead)).toBe(false)
  })

  it('the iceberg is trimmed and capped, keeps score and lead, and a no-op writes nothing', async () => {
    await setEngineScore(MONTH, 'emotions', 8)
    await setEngineLead(MONTH, 'emotions', true)
    await saveEngineIceberg(MONTH, 'emotions', {
      ...blank,
      event: ' Engine test ',
      whys: ['a', '', 'b', 'c', 'd'],
      lever: 'Engine test lever',
    })
    const r = await db.lifeEngines.get('2026-11:emotions')
    expect(r).toMatchObject({ score: 8, lead: true, event: 'Engine test', whys: ['a', 'b', 'c'] })
    const before = (await engineOps()).length
    await saveEngineIceberg(MONTH, 'emotions', {
      ...blank,
      event: 'Engine test',
      whys: ['a', 'b', 'c'],
      lever: 'Engine test lever',
    })
    expect(await engineOps()).toHaveLength(before)
    // Opening and closing an empty sheet on an engine with no row writes nothing.
    await saveEngineIceberg(MONTH, 'money', { ...blank, whys: ['', '', ''] })
    expect(await db.lifeEngines.get('2026-11:money')).toBeUndefined()
  })
})
