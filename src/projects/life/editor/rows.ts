import type { LifeQuestion, LifeQuestionType, LifeTask, LifeTracker } from '../../../lib/db'
import { THINGS_WHEN_KEYWORDS } from '../model'

// Form row shapes of the plan editor, converters from the stored plan, and
// the shared input styles.

export type WhenMode = 'none' | 'date' | 'keyword'
export type CapMode = 'target' | 'max'

export interface FocusRow {
  id: string
  title: string
}
export interface RuleRow {
  key: string
  text: string
}
export interface TaskRow {
  id: string
  title: string
  whenMode: WhenMode
  whenDate: string
  whenKeyword: string
  deadline: string
  area: string
  project: string
  /** Things id resolved by /settimana ('' = none); dropped on a manual edit. */
  listId: string
  tags: string
  notes: string
}
export interface TrackerRow {
  id: string
  emoji: string
  label: string
  capMode: CapMode
  capValue: string
  energy: boolean
}
export interface QuestionRow {
  id: string
  label: string
  type: LifeQuestionType
  /** Linked tracker id ('' = answered by hand). */
  tracker: string
}
export interface CheckinRow {
  // The check-in's stable id (entries link to it); also the React key.
  id: string
  date: string
  label: string
}

export function newId(): string {
  return crypto.randomUUID().slice(0, 8)
}
export function newKey(): string {
  return crypto.randomUUID()
}

export function taskToRow(t: LifeTask): TaskRow {
  const isKeyword = t.when !== null && (THINGS_WHEN_KEYWORDS as readonly string[]).includes(t.when)
  return {
    id: t.id,
    title: t.title,
    whenMode: t.when === null ? 'none' : isKeyword ? 'keyword' : 'date',
    whenDate: t.when !== null && !isKeyword ? t.when : '',
    whenKeyword: isKeyword ? (t.when as string) : THINGS_WHEN_KEYWORDS[0],
    deadline: t.deadline ?? '',
    area: t.area ?? '',
    project: t.project ?? '',
    listId: t.listId ?? '',
    tags: t.tags.join(', '),
    notes: t.notes,
  }
}

export function trackerToRow(t: LifeTracker): TrackerRow {
  const capMode: CapMode = t.max !== null ? 'max' : 'target'
  const capValue = t.max !== null ? String(t.max) : t.target !== null ? String(t.target) : ''
  return { id: t.id, emoji: t.emoji, label: t.label, capMode, capValue, energy: t.energy }
}

export function questionToRow(q: LifeQuestion): QuestionRow {
  return { id: q.id, label: q.label, type: q.type, tracker: q.tracker ?? '' }
}

export function updateAt<T>(list: T[], i: number, patch: Partial<T>): T[] {
  return list.map((item, idx) => (idx === i ? { ...item, ...patch } : item))
}
export function removeAt<T>(list: T[], i: number): T[] {
  return list.filter((_, idx) => idx !== i)
}

export const inputClass =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
export const textareaClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
export const removeBtnClass =
  'flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400'
