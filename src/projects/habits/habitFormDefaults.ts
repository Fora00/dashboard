import type { Habit, HabitDirection, HabitGraceScope, HabitKind, HabitSocial, HabitVerdict } from '../../lib/db'
import { shiftDayKey } from './habitStats'

/** Everything the habit form edits, as plain strings and numbers. */
export interface HabitFormValues {
  name: string
  emoji: string
  why: string
  direction: HabitDirection
  perDay: number
  grace: number
  graceScope: HabitGraceScope
  social: HabitSocial | undefined
  anchor: string
  normal: string
  floor: string
  target: number
  kind: HabitKind
  cycleStart: string
  cycleEnd: string
  verdict: HabitVerdict | undefined
}

export const CYCLE_DAYS = 28

export function toForm(habit: Habit): HabitFormValues {
  return {
    name: habit.name,
    emoji: habit.emoji,
    why: habit.why ?? '',
    direction: habit.direction ?? 'do',
    perDay: habit.perDay ?? 1,
    grace: habit.grace ?? 0,
    graceScope: habit.graceScope ?? 'week',
    social: habit.social,
    anchor: habit.anchor ?? '',
    normal: habit.normal ?? '',
    floor: habit.floor ?? '',
    target: habit.target ?? 7,
    kind: habit.kind ?? 'forever',
    cycleStart: habit.cycleStart ?? '',
    cycleEnd: habit.cycleEnd ?? '',
    verdict: habit.verdict,
  }
}

/** A blank new habit: a 4-week cycle starting today. */
export function newForm(today: string, kind: HabitKind): HabitFormValues {
  return {
    name: '',
    emoji: '',
    why: '',
    direction: 'do',
    perDay: 1,
    grace: 0,
    graceScope: 'week',
    social: undefined,
    anchor: '',
    normal: '',
    floor: '',
    target: 7,
    kind,
    cycleStart: today,
    cycleEnd: shiftDayKey(today, CYCLE_DAYS - 1),
    verdict: undefined,
  }
}

/** Starting points for the cycles chosen for 1 November. Pure fills: the user edits them. */
/** Starting points for the habits to avoid (kept unless a slip is marked). */
export const AVOID_PRESETS: { label: string; values: Partial<HabitFormValues> }[] = [
  {
    label: '📱 Don’t extend phone time',
    values: {
      name: 'Don’t extend phone time',
      emoji: '📱',
      direction: 'avoid',
      why: 'time back for what I choose',
      anchor: 'when the limit pops up: put it down and stand up',
      floor: 'five minutes more',
      normal: 'stop at the limit',
      target: 7,
      perDay: 1,
      grace: 2,
      graceScope: 'day',
    },
  },
  {
    label: '📵 No phone in the bathroom',
    values: {
      name: 'No phone in the bathroom',
      emoji: '📵',
      direction: 'avoid',
      why: 'time back, a quiet minute',
      anchor: 'phone charges in the hall',
      floor: '',
      normal: '',
      target: 7,
      perDay: 1,
    },
  },
  {
    label: '☕ No coffee',
    values: {
      name: 'No coffee',
      emoji: '☕',
      direction: 'avoid',
      why: 'better sleep',
      anchor: 'herbal tea instead',
      floor: '',
      normal: '',
      target: 7,
      perDay: 1,
    },
  },
  {
    label: '🍬 No solitary sweets',
    values: {
      name: 'No solitary sweets',
      emoji: '🍬',
      direction: 'avoid',
      why: 'eat for hunger, not for a feeling',
      anchor: 'when the urge comes: name the feeling, wait 20 minutes',
      floor: '',
      normal: '',
      target: 7,
      perDay: 1,
    },
  },
]

/** More ideas by area, one tap to start from. Small on purpose: each has a floor. */
export const IDEAS: { area: string; items: { label: string; values: Partial<HabitFormValues> }[] }[] = [
  {
    area: '🫀 Body',
    items: [
      {
        label: '🧗 Climb',
        values: {
          name: 'Climb',
          emoji: '🧗',
          why: 'what I would miss',
          anchor: 'a slot in the calendar',
          normal: 'a session',
          floor: 'show up and warm up',
          target: 1,
        },
      },
      {
        label: '🧘 Stretch',
        values: {
          name: 'Stretch',
          emoji: '🧘',
          why: 'a body that feels good',
          anchor: 'after brushing teeth',
          normal: '10 minutes',
          floor: 'one stretch',
          target: 7,
        },
      },
      {
        label: '💧 Water',
        values: {
          name: 'Water',
          emoji: '💧',
          why: 'energy and fewer headaches',
          anchor: '1 L bottle on the desk, filled the night before',
          normal: '4 glasses',
          floor: 'two glasses',
          target: 7,
          perDay: 4,
        },
      },
      {
        label: '⚖️ Weigh in',
        values: {
          name: 'Weigh in',
          emoji: '⚖️',
          why: 'a number, no verdict',
          anchor: 'before the shower',
          normal: 'write it down',
          floor: 'step on the scale',
          target: 1,
        },
      },
    ],
  },
  {
    area: '🧠 Mind',
    items: [
      {
        label: '📖 Read',
        values: {
          name: 'Read',
          emoji: '📖',
          why: 'it fills me up',
          social: 'alone',
          anchor: 'book on the pillow',
          normal: '20 pages',
          floor: 'one page',
          target: 7,
        },
      },
      {
        label: '✍️ One true sentence',
        values: {
          name: 'One true sentence',
          emoji: '✍️',
          why: 'thinking by writing',
          anchor: 'after coffee',
          normal: 'a paragraph',
          floor: 'one sentence',
          target: 7,
        },
      },
      {
        label: '🎨 Draw',
        values: {
          name: 'Draw',
          emoji: '🎨',
          why: 'play, no output',
          anchor: 'sketchbook in the bag',
          normal: 'a page',
          floor: 'one line',
          target: 3,
        },
      },
    ],
  },
  {
    area: '👥 People',
    items: [
      {
        label: '📞 Call someone',
        values: {
          name: 'Call someone',
          emoji: '📞',
          why: 'water the trees',
          social: 'person',
          anchor: 'on the walk home',
          normal: 'a real call',
          floor: 'a voice note',
          target: 2,
        },
      },
      {
        label: '🎲 See friends',
        values: {
          name: 'See friends',
          emoji: '🎲',
          why: 'the people who make effort',
          social: 'person',
          anchor: 'a standing evening',
          normal: 'an evening out',
          floor: 'a coffee',
          target: 1,
        },
      },
    ],
  },
  {
    area: '🏡 Home',
    items: [
      {
        label: '🧹 Tidy 10 minutes',
        values: {
          name: 'Tidy 10 minutes',
          emoji: '🧹',
          why: 'a calmer room, a calmer head',
          anchor: 'before dinner',
          normal: '10 minutes',
          floor: 'one surface',
          target: 4,
        },
      },
      {
        label: '🍳 Cook',
        values: {
          name: 'Cook',
          emoji: '🍳',
          why: 'cooking made us human',
          anchor: 'after work',
          normal: 'a real meal',
          floor: 'one fresh thing',
          target: 3,
        },
      },
    ],
  },
]

export const AVOID_IDEAS: { label: string; values: Partial<HabitFormValues> }[] = [
  {
    label: '📱 No scrolling in bed',
    values: {
      name: 'No scrolling in bed',
      emoji: '📱',
      direction: 'avoid',
      why: 'sleep',
      anchor: 'phone charges in the hall; a book instead',
      floor: 'five minutes',
      normal: 'none',
      target: 7,
      perDay: 1,
    },
  },
  {
    label: '🌙 No screens after 22:30',
    values: {
      name: 'No screens after 22:30',
      emoji: '🌙',
      direction: 'avoid',
      why: 'sleep',
      anchor: 'read or journal instead',
      floor: 'a film with someone',
      normal: 'none',
      target: 7,
      perDay: 1,
    },
  },
  {
    label: '🛒 No impulse buying',
    values: {
      name: 'No impulse buying',
      emoji: '🛒',
      direction: 'avoid',
      why: 'money for what I choose',
      anchor: 'wait 24 hours, put it in the list',
      floor: 'one small thing under 10 €',
      normal: 'none',
      target: 7,
      perDay: 1,
    },
  },
]

export const PRESETS: { label: string; values: Partial<HabitFormValues> }[] = [
  {
    label: '💬 Write to people',
    values: {
      name: 'Write to people',
      emoji: '💬',
      why: 'friends are the trees of my garden',
      social: 'person',
      anchor: 'after lunch',
      normal: 'a real message to someone I care about',
      floor: 'one message to one person',
      target: 7,
    },
  },
  {
    label: '🏃 Move',
    values: {
      name: 'Move',
      emoji: '🏃',
      why: 'I move with what I would miss',
      social: undefined,
      anchor: '3 slots set on Sunday in the calendar',
      normal: '2 run/walks + 1 climb a week',
      floor: 'a 10-minute walk',
      target: 3,
    },
  },
  {
    label: '📓 Journal',
    values: {
      name: 'Journal',
      emoji: '📓',
      why: 'it is the habit that faces the feeling',
      social: 'alone',
      anchor: 'after dinner, journal on the table',
      normal: 'a page',
      floor: 'date + one line',
      target: 7,
    },
  },
]
