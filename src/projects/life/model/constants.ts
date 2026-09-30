import type { LifeQuestionType } from '../../../lib/db'

// Caps and small constant sets, mirrored by CHECKs in the SQL migrations.

// --- Caps -------------------------------------------------------------------
// Mirrored by CHECKs in supabase/migrations/20260928120000_life.sql (and
// 20260928150000_life_checkins.sql for the check-in note). The
// client side is the stricter one: the plan's JSON is capped at 64 KiB here
// and pg_column_size(plan) at 128 KiB there, so anything that passes here is
// always accepted by the server.

export const LIFE_CAPS = {
  /** A Things area/project id (task.listId). */
  thingsIdPattern: /^[A-Za-z0-9-]{1,64}$/,
  /** Plan item ids: 1–40 chars of [A-Za-z0-9_.-] (SQL: life_entries.ref). */
  idPattern: /^[A-Za-z0-9_.-]{1,40}$/,
  /** UTF-8 bytes of the normalized plan's JSON (SQL: pg_column_size ≤ 128 KiB). */
  planBytes: 65536,
  focus: 3,
  focusTitle: 200,
  rules: 20,
  rule: 300,
  tasks: 50,
  taskTitle: 300,
  taskNotes: 2000,
  areaProject: 100,
  tags: 10,
  tag: 50,
  trackers: 20,
  trackerLabel: 100,
  emoji: 16,
  /** target / max are integers in 1..countMax. */
  countMax: 1000,
  questions: 20,
  questionLabel: 300,
  checkins: 20,
  checkinLabel: 200,
  /** Check-in note (SQL: life_entries_checkin_value, char_length ≤ 1000). */
  checkinNote: 1000,
  /** Sunday text answers (SQL: pg_column_size(value) ≤ 16 KiB). */
  answerText: 2000,
  /** |number| answers. */
  answerNumber: 1_000_000_000,
} as const

/** Things `when` keywords accepted besides a 'YYYY-MM-DD' date. */
export const THINGS_WHEN_KEYWORDS = ['today', 'tonight', 'evening', 'anytime', 'someday'] as const

export const QUESTION_TYPES: readonly LifeQuestionType[] = ['number', 'boolean', 'text', 'scale5']
/** Question types that can be answered automatically from a tracker. */
export const AUTO_QUESTION_TYPES: readonly LifeQuestionType[] = ['number', 'boolean']
