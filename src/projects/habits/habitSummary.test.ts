import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { experimentLines, limitsSummary, measuredOverview, targetLine } from './habitSummary'
import { shiftDayKey } from './habitStats'
import type { MeasuredWeek } from './habitRecapData'

const TODAY = '2026-11-22' // a Sunday
const CREATED = new Date('2026-10-01T12:00:00').getTime()

const measured = (over: Partial<Habit> = {}): Habit => ({
  id: 'm',
  name: 'M',
  emoji: '📱',
  createdAt: CREATED,
  direction: 'avoid',
  measure: 'app-limits',
  measureLimits: [{ app: 'App A', minutes: 40 }],
  ...over,
})

function avoidStates(stored: Record<string, HabitDayState>, today = TODAY): Map<string, HabitDayState> {
  const out = new Map<string, HabitDayState>()
  for (let d = '2026-10-01'; d <= today; d = shiftDayKey(d, 1)) out.set(d, stored[d] ?? 'done')
  return out
}

function doneEvery(from: string, to: string, skipEvery = 0): Map<string, HabitDayState> {
  const out = new Map<string, HabitDayState>()
  let i = 0
  for (let d = from; d <= to; d = shiftDayKey(d, 1), i++) if (!skipEvery || i % skipEvery) out.set(d, 'done')
  return out
}

describe('measuredOverview', () => {
  it('weeks judged on data: hit of verified, unverified apart, no ticks-only success', () => {
    const o = measuredOverview({
      habit: measured(),
      states: avoidStates({ '2026-11-04': 'fail' }),
      apps: new Map([
        ['2026-11-02', [{ app: 'App A', minutes: 100 }]],
        ['2026-11-09', [{ app: 'App A', minutes: 400 }]],
      ]),
      today: TODAY,
    })
    // Weeks from 28 Sep (the habit started 1 Oct) to this one: 9, two of them verified.
    expect(o.weeks.map((w) => w.week).at(-1)).toBe('2026-11-16')
    expect(o.current?.week).toBe('2026-11-16')
    expect(o.current?.hit).toBeNull()
    expect(o).toMatchObject({ hitWeeks: 0, verifiedWeeks: 2, verified: 8, manual: 1 })
    expect(o.unverifiedWeeks).toBe(o.weeks.length - 2)
  })
})

describe('experimentLines', () => {
  const exp = (over: Partial<Habit> = {}): Habit => ({
    id: 'e',
    name: 'E',
    emoji: '🧪',
    createdAt: CREATED,
    kind: 'experiment',
    cycleStart: '2026-10-28',
    cycleEnd: '2026-11-24',
    ...over,
  })

  it('a forever habit shows nothing', () => {
    expect(experimentLines({ habit: exp({ kind: 'forever' }), states: new Map(), today: TODAY })).toEqual([])
  })

  it('a running cycle: day, length, days left; so far done of expected', () => {
    const lines = experimentLines({ habit: exp(), states: doneEvery('2026-10-28', TODAY, 4), today: TODAY })
    expect(lines[0]).toBe('🧪 Esperimento · giorno 26 di 28 · mancano 2 giorni')
    expect(lines[1]).toMatch(/^Finora: 19 fatti su 26 attesi$/)
  })

  it('past the end: to judge, or the verdict', () => {
    const past = { states: new Map<string, HabitDayState>(), today: '2026-11-30' }
    expect(experimentLines({ habit: exp(), ...past })[0]).toMatch(/^🧪 Esperimento · finito il 24 nov.*: da giudicare$/)
    expect(experimentLines({ habit: exp({ verdict: 'up' }), ...past })[0]).toBe('🧪 Esperimento · verdetto: su')
  })

  it('a habit to avoid: slips and the grace', () => {
    const habit = exp({ direction: 'avoid', grace: 1 })
    const states = avoidStates({ '2026-11-03': 'fail', '2026-11-12': 'fail' })
    expect(experimentLines({ habit, states, today: TODAY })[1]).toBe('Finora: 2 sgarri, tolleranza 1/sett.')
  })

  it('a measured experiment: weeks of the verified ones, and the unverified', () => {
    const habit = measured({ kind: 'experiment', cycleStart: '2026-11-02', cycleEnd: '2026-11-29' })
    const lines = experimentLines({
      habit,
      states: avoidStates({}),
      apps: new Map([['2026-11-02', [{ app: 'App A', minutes: 100 }]]]),
      today: TODAY,
    })
    expect(lines[1]).toBe('Finora: 1 settimana su 1 verificate rispettate · 2 da verificare')
  })
})

describe('limitsSummary', () => {
  const w = (hit: boolean | null, slips: number | null = null): MeasuredWeek => ({
    week: '2026-11-16',
    manual: 0,
    evidence: null,
    slips,
    manualHit: true,
    hit,
  })
  it('the newest decided week, else to verify', () => {
    expect(limitsSummary(4, [w(null), w(true)])).toBe('4 app · ultima sett. ok ✓')
    expect(limitsSummary(4, [w(false, 3)])).toBe('4 app · ultima sett. mancata ≥3')
    expect(limitsSummary(2, [w(null)])).toBe('2 app · da verificare')
  })
})

describe('targetLine', () => {
  const h = (over: Partial<Habit>): Habit => ({ id: 'x', name: 'X', emoji: '🙂', createdAt: CREATED, ...over })
  it('target or grace in a few words', () => {
    expect(targetLine(h({}))).toBe('Ogni giorno')
    expect(targetLine(h({ target: 1 }))).toBe('1 volta a settimana')
    expect(targetLine(h({ target: 3, perDay: 4 }))).toBe('3 volte a settimana, 4 al giorno')
    expect(targetLine(h({ direction: 'avoid', grace: 1 }))).toBe('Tolleranza: 1 a settimana')
    expect(targetLine(h({ direction: 'avoid', grace: 2, graceScope: 'day' }))).toBe('Tolleranza: 2 al giorno')
    expect(targetLine(h({ direction: 'avoid' }))).toBe('Nessuna tolleranza')
  })
})
