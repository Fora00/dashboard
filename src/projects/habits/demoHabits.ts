// Dev-only: fills this browser's Dexie with a few demo habits so the page can
// be tried signed out. Writes straight to Dexie (no outbox), so nothing syncs.
import { db, type Habit, type HabitCheck, type HabitDayState, type LifeEntry, type LifePlan } from '../../lib/db'
import { serializeApps } from '../life/model/apps'
import { dayKey } from './habitStore'
import { shiftDayKey, weekStart } from './habitStats'

type Days = Record<number, HabitDayState | `fail:${string}` | `skip:${string}`>
const run = (from: number, to: number): Days =>
  Object.fromEntries(Array.from({ length: to - from + 1 }, (_, i) => [from + i, 'done']))

const DEMOS: {
  habit: Omit<Habit, 'id' | 'createdAt'>
  days: Days
  /** Slips placed by week (this Monday in, day keys out), for the measured demo. */
  slipsOn?: (monday: string) => string[]
}[] = [
  {
    habit: {
      name: '🧪 Two empty days',
      emoji: '🧪',
      why: 'shows "Reset the setup"',
      social: 'alone',
      anchor: 'after dinner',
      floor: 'date + one line',
      kind: 'forever',
      target: 7,
    },
    days: { ...run(3, 19), 8: 'floor', 12: 'skip:sick', 15: 'fail:energy', 16: 'fail:anchor' },
  },
  {
    habit: {
      name: '🧪 One empty day',
      emoji: '🧪',
      why: 'shows "Floor is enough"',
      social: 'person',
      anchor: 'after lunch',
      floor: 'one message to one person',
      kind: 'forever',
      target: 7,
    },
    days: { ...run(2, 13), 5: 'floor', 9: 'skip:planned' },
  },
  {
    habit: {
      name: '🧪 3 a week',
      emoji: '🧪',
      why: 'weekly ring and hit weeks',
      social: 'alone',
      anchor: 'slots set on Sunday',
      floor: '10 minutes on foot',
      kind: 'forever',
      target: 3,
    },
    days: {
      1: 'done',
      3: 'floor',
      4: 'done',
      8: 'done',
      10: 'done',
      11: 'done',
      15: 'done',
      17: 'floor',
      22: 'done',
      24: 'done',
      25: 'done',
      29: 'done',
    },
  },
  {
    habit: {
      name: '🧪 Water 4×',
      emoji: '💧',
      why: 'several taps a day',
      social: 'alone',
      kind: 'experiment',
      target: 7,
      perDay: 4,
      floor: 'two glasses',
    },
    days: { 3: 'floor' },
  },
  {
    habit: {
      name: '🧪 No phone in the bathroom',
      emoji: '📵',
      direction: 'avoid',
      grace: 2,
      graceScope: 'day',
      why: "a don't habit: kept unless a slip",
      social: 'alone',
      anchor: 'phone charges in the hall',
      kind: 'experiment',
      target: 7,
    },
    days: { 6: 'fail:forgot', 2: 'fail:anchor' },
  },
  {
    habit: {
      name: '🧪 A year of it',
      emoji: '🌳',
      why: 'to see an old tree',
      social: 'person',
      anchor: 'after lunch',
      floor: 'one message',
      kind: 'forever',
      target: 5,
    },
    days: Object.fromEntries(
      Array.from({ length: 300 }, (_, i) => [
        i + 1,
        i % 9 === 0 ? 'floor' : i % 17 === 0 ? 'skip' : i % 7 === 5 || i % 7 === 6 ? 'fail' : 'done',
      ]),
    ) as Days,
  },
  {
    // M1/M2: a measured "don't" habit, checked against the Sunday "App più usate"
    // answers seeded by seedDemoScreenApps (one week each: hit, proven > ticked,
    // at the limit, none).
    habit: {
      name: '🧪 Non estendere telefono',
      emoji: '📱',
      direction: 'avoid',
      grace: 1,
      graceScope: 'week',
      why: 'a complex habit: verified from the Sunday apps answer',
      social: 'alone',
      anchor: 'when the limit pops up, close the app',
      kind: 'forever',
      target: 7,
      measure: 'app-limits',
      measureLimits: [
        { app: 'YouTube', minutes: 40 },
        { app: 'Instagram', minutes: 15 },
        { app: 'Reddit', minutes: 20 },
        { app: 'Tinder', minutes: 10 },
      ],
    },
    days: {},
    slipsOn: (monday) => [shiftDayKey(monday, -12), shiftDayKey(monday, -4), monday],
  },
  {
    habit: {
      name: '🧪 Done today',
      emoji: '🧪',
      why: 'a completed tile',
      social: 'alone',
      kind: 'experiment',
      target: 7,
    },
    days: { ...run(0, 9), 10: 'fail:plan' },
  },
]

/** Replace this browser's local habits with the demo set (signed out only). */
export async function resetDemoHabits(): Promise<void> {
  await db.transaction('rw', db.habits, db.habitChecks, async () => {
    await db.habits.clear()
    await db.habitChecks.clear()
  })
  await seedDemoHabits()
}

export async function seedDemoHabits(): Promise<void> {
  const now = new Date()
  const today = dayKey(now)
  const habits: Habit[] = []
  const checks: HabitCheck[] = []
  for (const { habit, days, slipsOn } of DEMOS) {
    const id = crypto.randomUUID()
    habits.push({
      ...habit,
      id,
      createdAt: now.getTime() - 40 * 86_400_000,
      cycleStart: shiftDayKey(today, -25),
      cycleEnd: shiftDayKey(today, 2),
    })
    for (const [n, value] of Object.entries(days)) {
      const [state, note] = String(value).split(':') as [HabitDayState, string | undefined]
      checks.push({
        id: crypto.randomUUID(),
        habitId: id,
        day: shiftDayKey(today, -Number(n)),
        createdAt: now.getTime(),
        status: state === 'done' ? undefined : state,
        note,
      })
    }
    for (const day of slipsOn?.(weekStart(today)) ?? []) {
      if (day <= today)
        checks.push({
          id: crypto.randomUUID(),
          habitId: id,
          day,
          createdAt: now.getTime(),
          status: 'fail',
          note: 'forgot',
        })
    }
  }
  // Multi-tap demo: full days as perDay taps, today half done.
  for (const h of habits.filter((x) => (x.perDay ?? 1) > 1)) {
    for (const n of [1, 2, 4, 6]) {
      checks.push({
        id: crypto.randomUUID(),
        habitId: h.id,
        day: shiftDayKey(today, -n),
        createdAt: now.getTime(),
        count: h.perDay,
      })
    }
    checks.push({ id: crypto.randomUUID(), habitId: h.id, day: today, createdAt: now.getTime(), count: 2 })
  }
  await db.transaction('rw', db.habits, db.habitChecks, async () => {
    await db.habits.bulkPut(habits)
    await db.habitChecks.bulkPut(checks)
  })
  await seedDemoScreenApps(today)
}

/** Weeks back from this Monday -> the Sunday "App più usate" answer (weekly minutes). */
const DEMO_APPS: [weeksAgo: number, rows: [string, number][]][] = [
  // Verified, hit: every limited app under 7 x its limit.
  [
    3,
    [
      ['YouTube', 200],
      ['Instagram', 90],
      ['Reddit', 100],
      ['Tinder', 50],
      ['Safari', 240],
    ],
  ],
  // Verified, more proven than ticked: YouTube 325 vs 280 = 3 extensions, 1 slip ticked.
  [
    2,
    [
      ['YouTube', 325],
      ['Instagram', 100],
      ['Reddit', 120],
      ['Tinder', 60],
      ['WhatsApp', 180],
    ],
  ],
  // Verified, exactly at the limits: 0 extensions, 1 slip ticked (within the grace).
  [
    1,
    [
      ['YouTube', 280],
      ['Instagram', 105],
      ['Reddit', 140],
      ['Tinder', 70],
      ['Safari', 200],
    ],
  ],
  // This week: no answer, "?" until Sunday.
]

/** Dev only: Life weeks with a Sunday apps answer for the measured demo habit.
 *  Never overwrites: a week that already exists, or already has an apps
 *  answer, is left alone (stable ids, so a reset just re-puts the same rows). */
export async function seedDemoScreenApps(today: string): Promise<void> {
  const monday = weekStart(today)
  const now = Date.now()
  const weeks = await db.lifeWeeks.toArray()
  for (const [ago, rows] of DEMO_APPS) {
    const week = shiftDayKey(monday, -7 * ago)
    if (!weeks.some((w) => w.week === week)) {
      const plan: LifePlan = {
        version: 1,
        week,
        focus: [],
        rules: [],
        tasks: [],
        trackers: [],
        sundayCheck: [],
        checkins: [],
      }
      await db.lifeWeeks.put({ id: `demo-week-${week}`, week, plan, importedAt: now, updatedAt: now })
    }
    const existing = await db.lifeEntries
      .where('[week+kind]')
      .equals([week, 'sunday'])
      .filter((e) => e.ref === 'screen-apps' && !e.id.startsWith('demo-'))
      .count()
    if (existing > 0) continue
    const entry = {
      id: `demo-${week}:sunday:screen-apps`,
      kind: 'sunday',
      week,
      ref: 'screen-apps',
      day: shiftDayKey(week, 6),
      createdAt: now,
      updatedAt: now,
      value: { answer: serializeApps(rows.map(([app, minutes]) => ({ app, minutes }))) },
    } as LifeEntry
    await db.lifeEntries.put(entry)
  }
}
