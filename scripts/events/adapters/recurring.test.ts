import { describe, expect, it } from 'vitest'
import { RecurringEntrySchema, RecurringFileSchema } from '../schemas.ts'
import { expand, meetingDates } from './recurring.ts'

const NOW = Date.parse('2026-10-14T10:00:00Z') // a Wednesday

const entry = (over: Record<string, unknown> = {}) =>
  RecurringEntrySchema.parse({
    id: 'serata-giochi',
    title: 'Serata giochi',
    city: 'Rovereto',
    url: 'https://example.org/giochi',
    summary: 'Ogni giovedì sera.',
    weekdays: ['thu'],
    time: '21:00',
    from: '2026-09-01',
    until: '2026-12-31',
    ...over,
  })

describe('meetingDates', () => {
  it('lists the weekday inside the run, from today on', () => {
    expect(meetingDates(entry(), '2026-10-14', '2026-11-05')).toEqual([
      '2026-10-15',
      '2026-10-22',
      '2026-10-29',
      '2026-11-05',
    ])
  })
  it('stops at the end of the run and skips the given days', () => {
    expect(meetingDates(entry({ until: '2026-10-22', skip: ['2026-10-15'] }), '2026-10-14', '2026-12-01')).toEqual([
      '2026-10-22',
    ])
  })
  it('every 2 weeks stays on the same weeks of the run', () => {
    const a = entry({ everyWeeks: 2, from: '2026-10-01' })
    expect(meetingDates(a, '2026-10-02', '2026-11-12')).toEqual(['2026-10-15', '2026-10-29', '2026-11-12'])
  })
  it('several weekdays', () => {
    const a = entry({ weekdays: ['tue', 'thu'] })
    expect(meetingDates(a, '2026-10-14', '2026-10-22')).toEqual(['2026-10-15', '2026-10-20', '2026-10-22'])
  })
})

describe('expand', () => {
  it('makes one timed event per meeting with a Rome offset and an end', () => {
    const out = expand(entry({ durationMin: 150 }), NOW, 8)
    expect(out.map((e) => e.start)).toEqual(['2026-10-15T21:00:00+02:00', '2026-10-22T21:00:00+02:00'])
    expect(out[0]).toMatchObject({
      nativeId: 'serata-giochi@2026-10-15',
      allDay: false,
      city: 'Rovereto',
      end: '2026-10-15T23:30:00+02:00',
    })
    expect(out[0]?.datesTentative).toBeUndefined()
  })
  it('unverified entries are tentative and no duration gives no end', () => {
    const [e] = expand(entry({ verified: false }), NOW, 3)
    expect(e?.datesTentative).toBe(true)
    expect(e?.end).toBeNull()
  })
})

describe('RecurringFileSchema', () => {
  it('rejects duplicate ids, unknown categories, a run that ends before it starts', () => {
    const a = {
      id: 'x',
      title: 'X',
      city: 'Trento',
      url: 'https://example.org',
      summary: 's',
      weekdays: ['mon'],
      time: '20:00',
      from: '2026-10-01',
      until: '2026-12-01',
    }
    expect(RecurringFileSchema.safeParse({ activities: [a, a] }).success).toBe(false)
    expect(RecurringFileSchema.safeParse({ activities: [{ ...a, category: 'nope' }] }).success).toBe(false)
    expect(RecurringFileSchema.safeParse({ activities: [{ ...a, until: '2026-09-01' }] }).success).toBe(false)
    expect(RecurringFileSchema.safeParse({ activities: [a] }).success).toBe(true)
  })
})
