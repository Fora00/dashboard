// SpoonFed's "lifeboard of forever wins": a graph-paper book where every time
// you do a habit, however small, you colour one box with the habit's colour and
// write its lifetime count. It only goes up: failures, rest days and empty days
// are never drawn, so a miss costs nothing and the book just keeps filling.
// Pure: the page feeds it the per-habit day data.

import type { Habit, HabitDayState, HabitKind } from '../../lib/db'
import { ENGINES, type EngineKey } from '../life/model/engines'

export const PALETTE = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#a855f7', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#f43f5e', // rose
] as const

/** The bigger the lifetime number, the bigger the box, in grid cells per side:
 *  1 up to 8, 2 from 9, 3 from 36, 4 from 81, 5 from 144, 6 from 225 (capped). */
export function boxSpan(n: number): number {
  return Math.min(6, 1 + Math.floor(Math.sqrt(Math.max(0, n)) / 3))
}

export interface Box {
  day: string
  habitId: string
  /** The habit's lifetime count once this box is filled. */
  n: number
}

export interface LegendRow {
  habit: Habit
  color: string
  total: number
}

export interface Lifeboard {
  boxes: Box[]
  legend: LegendRow[]
  total: number
}

export interface DayData {
  states: ReadonlyMap<string, HabitDayState>
  counts: ReadonlyMap<string, number>
}

/** Wins on one day: a done or floor day is one (or its taps on a multi-tap
 *  habit); partial taps count too. Nothing else is a win. */
export function winsOn(state: HabitDayState | undefined, taps: number | undefined): number {
  if (state === 'done' || state === 'floor') return Math.max(1, taps ?? 1)
  return taps && taps > 0 ? taps : 0
}

/** A stable colour per habit: its place among all habits (archived too) by
 *  creation, so adding a habit never recolours the others. */
export function colorsFor(habits: readonly Habit[]): Map<string, string> {
  const order = [...habits].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
  return new Map(order.map((h, i) => [h.id, PALETTE[i % PALETTE.length]!]))
}

/** `colors` defaults to colorsFor(habits); pass the colours of ALL habits when
 *  `habits` is a subset (one board) so a habit keeps its colour everywhere. */
export function buildLifeboard(
  habits: readonly Habit[],
  data: ReadonlyMap<string, DayData>,
  colors: ReadonlyMap<string, string> = colorsFor(habits),
): Lifeboard {
  const rank = new Map(
    [...habits].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)).map((h, i) => [h.id, i]),
  )
  const boxes: Box[] = []
  const legend: LegendRow[] = []
  for (const habit of habits) {
    const d = data.get(habit.id)
    const days = new Set([...(d?.states.keys() ?? []), ...(d?.counts.keys() ?? [])])
    let n = 0
    for (const day of [...days].sort()) {
      const wins = winsOn(d?.states.get(day), d?.counts.get(day))
      for (let i = 0; i < wins; i++) boxes.push({ day, habitId: habit.id, n: ++n })
    }
    legend.push({ habit, color: colors.get(habit.id)!, total: n })
  }
  boxes.sort((a, b) => a.day.localeCompare(b.day) || rank.get(a.habitId)! - rank.get(b.habitId)! || a.n - b.n)
  legend.sort((a, b) => b.total - a.total)
  return { boxes, legend, total: boxes.length }
}

/** Boxes grouped by month 'YYYY-MM', newest month first, boxes oldest first inside. */
export function byMonth(boxes: readonly Box[]): [string, Box[]][] {
  const m = new Map<string, Box[]>()
  for (const b of boxes) {
    const k = b.day.slice(0, 7)
    const list = m.get(k)
    if (list) list.push(b)
    else m.set(k, [b])
  }
  return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}

// EN3: two boards on the Board tab, one per habit kind, each with its legend
// grouped by Life Engine. Boxes stay one strip per board (engines interleaved,
// coloured per habit); counts stay lifetime per habit.

/** A habit's kind; legacy rows without one are 'forever' (as in the form). */
export function habitKind(h: Pick<Habit, 'kind'>): HabitKind {
  return h.kind ?? 'forever'
}

export function splitByKind(habits: readonly Habit[]): Record<HabitKind, Habit[]> {
  const out: Record<HabitKind, Habit[]> = { forever: [], experiment: [] }
  for (const h of habits) out[habitKind(h)].push(h)
  return out
}

export interface EngineGroup {
  /** null = the habits without an engine tag. */
  engine: EngineKey | null
  label: string
  rows: LegendRow[]
  total: number
}

export const NO_ENGINE_LABEL = 'No engine'

/** Legend rows grouped by engine, in the engines' order, untagged last; empty
 *  groups are left out. Rows keep their order (most wins first). */
export function groupByEngine(legend: readonly LegendRow[]): EngineGroup[] {
  const groups: EngineGroup[] = [
    ...ENGINES.map((e) => ({
      engine: e.key as EngineKey | null,
      label: e.label as string,
      rows: [] as LegendRow[],
      total: 0,
    })),
    { engine: null, label: NO_ENGINE_LABEL, rows: [], total: 0 },
  ]
  for (const row of legend) {
    const g = groups.find((x) => x.engine === (row.habit.engine ?? null)) ?? groups[groups.length - 1]!
    g.rows.push(row)
    g.total += row.total
  }
  return groups.filter((g) => g.rows.length > 0)
}

export interface KindBoard extends Lifeboard {
  kind: HabitKind
  habitCount: number
  groups: EngineGroup[]
}

/** The forever board and the experiments board, colours shared across both. */
export function buildKindBoards(
  habits: readonly Habit[],
  data: ReadonlyMap<string, DayData>,
): Record<HabitKind, KindBoard> {
  const colors = colorsFor(habits)
  const split = splitByKind(habits)
  const one = (kind: HabitKind): KindBoard => {
    const board = buildLifeboard(split[kind], data, colors)
    return {
      ...board,
      kind,
      habitCount: split[kind].length,
      groups: groupByEngine(board.legend),
    }
  }
  return { forever: one('forever'), experiment: one('experiment') }
}
