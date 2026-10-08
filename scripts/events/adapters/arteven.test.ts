import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { arteven, sliceJsonArray } from './arteven.ts'

const ctx = (text: string): AdapterContext =>
  ({
    now: Date.parse('2026-10-08T10:00:00Z'),
    horizonDays: 90,
    fetchText: async (url: string) => ({ status: 200, url, text }),
  }) as unknown as AdapterContext

const rapp = (id: string, date: string, time: string | null, theatre: string, extra: Record<string, unknown> = {}) => ({
  id,
  data_rapp: date,
  orario: time,
  slug: `r${id}`,
  ref_spettacolo: {
    id: `s${id}`,
    name: 'IL GRANDE SHOW',
    slug: 'show',
    descrizione: 'Bello',
    ...extra,
  },
  teatro_id: { name: theatre },
  rassegna_id: { name: 'Stagione di prosa', slug: 'prosa' },
})

const page = (list: unknown[]) =>
  `<html><script>var x = 1;</script><% rappresentazionitotal = ${JSON.stringify(list)}; %><footer>}]</footer></html>`

describe('arteven sliceJsonArray', () => {
  it('stops at the matching bracket, ignoring brackets inside strings and escapes', () => {
    const t = 'x = [{"a":"]\\"}["},[1,2]] tail ]'
    expect(sliceJsonArray(t, 4)).toBe('[{"a":"]\\"}["},[1,2]]')
  })
  it('throws when unterminated', () => {
    expect(() => sliceJsonArray('[1,2', 0)).toThrow(/unterminated/)
  })
})

describe('arteven run', () => {
  it('cuts the JSON out of the page and keeps Vicenza province and Padova theatres', async () => {
    const out = await arteven.run(
      ctx(
        page([
          rapp('1', '2026-10-10', '21.00', 'TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)'),
          rapp('2', '2026-10-10', '21:00', 'TEATRO VERDI - PADOVA (PD)'),
          rapp('3', '2026-10-10', '21:00', 'TEATRO TOTI - MESTRE (VE)'),
        ]),
      ),
    )
    expect(out.map((e) => e.nativeId)).toEqual(['1', '2'])
    expect(out[0]).toMatchObject({
      title: 'Il Grande Show',
      start: '2026-10-10T21:00:00+02:00',
      allDay: false,
      venue: 'Teatro Remondini',
      city: 'Bassano del Grappa',
      url: 'https://www.myarteven.it/rassegne/prosa/show/r1',
    })
    expect(out[1]?.city).toBe('Padova')
  })
  it('drops weekday-morning school matinees but keeps weekend mornings', async () => {
    // 2026-10-09 is a Friday, 2026-10-10 a Saturday.
    const out = await arteven.run(
      ctx(
        page([
          rapp('1', '2026-10-09', '10.00', 'TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)'),
          rapp('2', '2026-10-10', '10.00', 'TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)'),
        ]),
      ),
    )
    expect(out.map((e) => e.nativeId)).toEqual(['2'])
  })
  it('marks a performance with no time as all-day, tags kids rassegne, skips hidden and untitled ones', async () => {
    const kids = rapp('1', '2026-10-11', null, 'TEATRO COMUNALE - SCHIO (VI)')
    kids.rassegna_id = { name: 'Domenica teatro', slug: 'dt' }
    const hidden = {
      ...rapp('2', '2026-10-11', '17.00', 'TEATRO COMUNALE - SCHIO (VI)'),
      stato_web: false,
    }
    const out = await arteven.run(ctx(page([kids, hidden, { id: '3', data_rapp: '2026-10-11' }])))
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      allDay: true,
      start: '2026-10-11T00:00:00+02:00',
    })
    expect(out[0]?.tagText).toContain('teatro ragazzi')
  })
  it('throws when the marker is gone', async () => {
    await expect(arteven.run(ctx('<html></html>'))).rejects.toThrow(/markup changed/)
  })
})
