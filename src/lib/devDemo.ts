// Dev-only (`npm run dev`, never in the built app): demo data for every
// project, written straight to Dexie (no outbox, so nothing ever syncs).
//
// Runs once per browser profile, the first time the dev server opens it, and
// only when sync is off (the default in dev, see sync.ts). Re-fill any time
// from the console: `await resetDemoData()`.
import { seedDemoHabits } from '../projects/habits/demoHabits'
import { dayKey } from './dates'
import { db, DEFAULT_AREA_ID, type LifeEntry, type LifePlan, type MealKind } from './db'
import { syncEnabled } from './sync'

const FLAG = 'dashboard.dev-demo-seeded'
const DAY = 86_400_000

const ago = (days: number) => dayKey(new Date(Date.now() - days * DAY))

function mondayOf(d: Date): string {
  const m = new Date(d)
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7))
  return dayKey(m)
}

export async function resetDemoData(): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) {
      if (t.name !== 'projectPrefs' && t.name !== 'projectStats') await t.clear()
    }
  })
  await seedDemoData()
}

export async function seedDemoData(): Promise<void> {
  const now = Date.now()
  const id = () => crypto.randomUUID()
  const base = (i = 0) => ({ createdAt: now - i * 3_600_000, updatedAt: now - i * 3_600_000 })

  // Shop list
  const fridge = { id: id(), name: 'Pharmacy', createdAt: now }
  await db.shopAreas.bulkPut([{ id: DEFAULT_AREA_ID, name: 'Groceries', createdAt: now }, fridge])
  await db.shopItems.bulkPut(
    [
      ['Oat milk', DEFAULT_AREA_ID, 0],
      ['Spinach', DEFAULT_AREA_ID, 0],
      ['Pasta', DEFAULT_AREA_ID, 1],
      ['Coffee beans', DEFAULT_AREA_ID, 0],
      ['Ibuprofen', fridge.id, 0],
    ].map(([text, areaId, done], i) => ({
      id: id(),
      text: text as string,
      areaId: areaId as string,
      done: done as 0 | 1,
      ...base(i),
    })),
  )

  // Todo, ideas, links
  await db.todos.bulkPut(
    ['Renew passport', 'Book dentist', 'Call the landlord', 'Fix the bike light'].map((text, i) => ({
      id: id(),
      text,
      done: (i === 3 ? 1 : 0) as 0 | 1,
      ...base(i),
    })),
  )
  await db.bookIdeas.bulkPut(
    [
      ['Piranesi', 'Recommended by a friend'],
      ['The Overstory', ''],
      ['Deep Work', 'Re-read the second half'],
    ].map(([text, notes], i) => ({ id: id(), text: text!, notes: notes!, ...base(i) })),
  )
  await db.boardgameIdeas.bulkPut(
    [
      ['Wingspan', 'Calm, nice with 2'],
      ['Azul', ''],
      ['Spirit Island', 'Co-op, long evening'],
    ].map(([text, notes], i) => ({ id: id(), text: text!, notes: notes!, ...base(i) })),
  )
  await db.links.bulkPut([
    {
      id: id(),
      url: 'https://developer.mozilla.org/',
      title: 'MDN Web Docs',
      notes: 'Reference',
      read: 1,
      tags: ['dev'],
      ...base(3),
    },
    {
      id: id(),
      url: 'https://www.dexie.org/docs/',
      title: 'Dexie docs',
      notes: '',
      read: 0,
      tags: ['dev', 'db'],
      ...base(2),
    },
    {
      id: id(),
      url: 'https://example.com/pasta-recipe',
      title: 'Cacio e pepe, the real one',
      notes: 'Try on Sunday',
      read: 0,
      tags: ['food'],
      ...base(1),
    },
  ])

  // Trips
  const ana = { id: id(), name: 'Ana', emoji: '🧗', ...base() }
  const leo = { id: id(), name: 'Leo', emoji: '🚲', ...base() }
  await db.tripCompanions.bulkPut([ana, leo])
  await db.tripIdeas.bulkPut([
    {
      id: id(),
      title: 'Fontainebleau bouldering',
      notes: 'Autumn, sandstone',
      companionIds: [ana.id],
      done: 0,
      ...base(2),
    },
    { id: id(), title: 'Lisbon long weekend', notes: '', companionIds: [ana.id, leo.id], done: 0, ...base(1) },
    { id: id(), title: 'Dolomites hut-to-hut', notes: 'Done in 2025', companionIds: [leo.id], done: 1, ...base(0) },
  ])

  // Climbing
  const sessions = [
    { n: 2, location: 'Block3', discipline: 'boulder' as const, grades: ['6A', '6A+', '6B', '6B+', '6C'] },
    { n: 5, location: 'Block3', discipline: 'boulder' as const, grades: ['6A', '6A', '6B', '6B+'] },
    { n: 9, location: 'Kletterhalle', discipline: 'lead' as const, grades: ['6a', '6a+', '6b'] },
    { n: 13, location: 'Block3', discipline: 'boulder' as const, grades: ['5C', '6A', '6A+', '6B'] },
  ]
  for (const [i, s] of sessions.entries()) {
    const sessionId = id()
    const date = ago(s.n)
    await db.climbSessions.put({
      id: sessionId,
      date,
      location: s.location,
      discipline: s.discipline,
      createdAt: now - i,
    })
    await db.climbs.bulkPut(
      s.grades.map((grade, j) => ({
        id: id(),
        sessionId,
        date,
        discipline: s.discipline,
        grade,
        sent: (j === s.grades.length - 1 && i % 2 === 0 ? 0 : 1) as 0 | 1,
        createdAt: now - i * 100 - j,
      })),
    )
  }

  // Meal diary: three days
  const meal = (
    day: string,
    kind: MealKind,
    text: string,
    kcal: number,
    p: number,
    c: number,
    f: number,
    i: number,
  ) => ({
    id: id(),
    day,
    meal: kind,
    text,
    weighed: false,
    grams: null,
    kcal,
    proteinG: p,
    carbsG: c,
    fatG: f,
    estimated: true,
    ...base(i),
  })
  await db.meals.bulkPut([
    meal(ago(0), 'breakfast', 'Oats with banana and peanut butter', 480, 16, 70, 15, 0),
    meal(ago(0), 'lunch', 'Pasta al pomodoro, parmesan', 720, 24, 105, 20, 1),
    meal(ago(1), 'breakfast', 'Two eggs on toast, coffee', 380, 20, 30, 18, 2),
    meal(ago(1), 'dinner', 'Chicken, rice and broccoli', 650, 45, 70, 18, 3),
    meal(ago(1), 'snack', 'Apple and almonds', 220, 5, 28, 11, 4),
    meal(ago(2), 'lunch', 'Lentil soup with bread', 560, 28, 85, 10, 5),
  ])

  // Habits (the existing demo set)
  await seedDemoHabits()

  // Life: this week's plan, today's focus, Streaks and chores
  const week = mondayOf(new Date())
  const plan: LifePlan = {
    version: 1,
    week,
    focus: [
      { id: 'f1', title: 'Ship the demo-data feature' },
      { id: 'f2', title: 'Climb twice' },
    ],
    rules: ['Phone out of the bedroom', 'One hard thing before noon'],
    tasks: [
      {
        id: 't1',
        title: 'Plan next week',
        when: null,
        deadline: null,
        area: 'Life',
        project: null,
        tags: [],
        notes: '',
      },
      {
        id: 't2',
        title: 'Tax paperwork',
        when: null,
        deadline: ago(-4),
        area: 'Admin',
        project: null,
        tags: [],
        notes: '',
      },
    ],
    trackers: [
      { id: 'tr1', emoji: '🧗', label: 'Climbing', target: 2, max: null, energy: true },
      { id: 'tr2', emoji: '📖', label: 'Reading', target: 5, max: null, energy: false },
    ],
    sundayCheck: [
      { id: 'q1', label: 'Did the week feel good?', type: 'boolean' },
      { id: 'q2', label: 'Energy', type: 'scale5' },
    ],
    checkins: [],
  }
  await db.lifeWeeks.put({ id: id(), week, plan, importedAt: now, updatedAt: now })
  const today = ago(0)
  await db.lifeDayFocus.bulkPut(
    [
      ['Ship the demo-data feature', false],
      ['Climb at Block3', false],
      ['Call the landlord', true],
    ].map(([title, done], slot) => ({
      id: id(),
      day: today,
      slot,
      title: title as string,
      done: done as boolean,
      ...base(),
    })),
  )
  const entry = (kind: string, ref: string, value: object): LifeEntry =>
    ({ id: id(), kind, week, ref, day: today, ...base(), value }) as LifeEntry
  await db.lifeEntries.bulkPut([
    entry('streak', 'demo-streak-1', {
      name: 'Stretch',
      emoji: '🤸',
      days: 'ddddmdddddmdddddddddddddddd',
      streak: 12,
      best: 20,
      asOf: today,
    }),
    entry('streak', 'demo-streak-2', {
      name: 'Read 20 min',
      emoji: '📖',
      days: 'd-d-d-dmd-d-d-dmd-d-d-d-d-d-',
      streak: 4,
      best: 9,
      asOf: today,
    }),
    entry('chore', 'demo-chore-1', {
      name: 'Take out the bins',
      repeat: true,
      done: false,
      count: 14,
      last: ago(3),
      wk: '111011110111',
      asOf: today,
    }),
    entry('chore', 'demo-chore-2', {
      name: 'Clean the bathroom',
      repeat: true,
      done: true,
      count: 6,
      last: today,
      wk: '010101010111',
      asOf: today,
    }),
    entry('idea', 'demo-idea-1', { text: 'Try a no-phone Sunday morning', status: 'open' }),
  ])
}

/** Fill the demo set once per browser profile; a no-op in sync mode, so real data is never touched. */
export async function seedDemoDataOnce(): Promise<void> {
  if (syncEnabled) return
  try {
    if (localStorage.getItem(FLAG)) return
    localStorage.setItem(FLAG, '1')
  } catch {
    return // storage blocked: skip rather than re-seed on every load
  }
  const [habits, todos, meals] = await Promise.all([db.habits.count(), db.todos.count(), db.meals.count()])
  if (habits + todos + meals > 0) return // already has data; leave it alone
  await seedDemoData()
}
