import { db, type MealEntry, type MealKind } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { NO_NUTRITION, sanitizeNutrition, type Nutrition } from '../projects/meal-diary/nutrition'
import { useSyncStatus } from './useSyncStatus'

// Local-first sync for the Meal Diary (owner-only), built on the generic
// engine in cloudSync.ts. Copied from src/lib/todoSync.ts — see
// docs/NEW_PROJECT.md. Remote access is is_owner() only (see the migration,
// same model as Life): on a guest's device every push is rejected with 42501
// and dead-lettered by the engine, which keeps the local row.

// Length cap for the free text. MUST match the CHECK constraint in
// supabase/migrations/20261005140000_meal_diary.sql and the input's maxLength.
export const MAX_TEXT_LENGTH = 300

interface MealRow {
  id: string
  day: string
  meal: MealKind
  text: string
  weighed: boolean
  grams: number | null
  kcal: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  estimated: boolean
  created_at: number
  updated_at: number
}

const mealsTable: TableSync<MealEntry, MealRow> = {
  remote: 'meal_entries',
  table: () => db.meals,
  columns: 'id, day, meal, text, weighed, grams, kcal, protein_g, carbs_g, fat_g, estimated, created_at, updated_at',
  realtime: true,
  updatedAt: (m) => m.updatedAt,
  toRow: (m) => ({
    id: m.id,
    day: m.day,
    meal: m.meal,
    text: m.text,
    // Rows saved before the flag existed have no value: they count as by eye.
    weighed: m.weighed === true,
    grams: m.grams,
    kcal: m.kcal,
    protein_g: m.proteinG,
    carbs_g: m.carbsG,
    fat_g: m.fatG,
    estimated: m.estimated,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    day: r.day,
    meal: r.meal,
    text: r.text,
    weighed: Boolean(r.weighed),
    grams: r.grams ?? null,
    kcal: r.kcal ?? null,
    proteinG: r.protein_g ?? null,
    carbsG: r.carbs_g ?? null,
    fatG: r.fat_g ?? null,
    estimated: Boolean(r.estimated),
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'meal-diary',
  tables: [mealsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/** Add an entry; blank text is ignored. Returns whether one was added. */
export async function addMeal(
  day: string,
  meal: MealKind,
  text: string,
  options: { weighed?: boolean; nutrition?: Partial<Nutrition> } = {},
): Promise<boolean> {
  const trimmed = text.trim().slice(0, MAX_TEXT_LENGTH)
  if (!trimmed) return false
  const now = Date.now()
  await engine.upsert('meal_entries', {
    id: crypto.randomUUID(),
    day,
    meal,
    text: trimmed,
    weighed: options.weighed === true,
    ...(options.nutrition ? sanitizeNutrition(options.nutrition) : NO_NUTRITION),
    createdAt: now,
    updatedAt: now,
  })
  return true
}

export async function updateMeal(
  entry: MealEntry,
  changes: { text?: string; meal?: MealKind; day?: string; weighed?: boolean; nutrition?: Partial<Nutrition> },
): Promise<void> {
  const text = changes.text === undefined ? entry.text : changes.text.trim().slice(0, MAX_TEXT_LENGTH)
  if (!text) return
  await engine.upsert('meal_entries', {
    ...entry,
    ...(changes.nutrition ? sanitizeNutrition(changes.nutrition) : {}),
    text,
    weighed: changes.weighed ?? entry.weighed === true,
    meal: changes.meal ?? entry.meal,
    day: changes.day ?? entry.day,
    updatedAt: Date.now(),
  })
}

export async function deleteMeal(id: string): Promise<void> {
  await engine.remove('meal_entries', id)
}

/** Undo of a delete: the same row again, with a fresh updatedAt so it wins last-writer-wins. */
export async function restoreMeal(entry: MealEntry): Promise<void> {
  await engine.upsert('meal_entries', { ...entry, updatedAt: Date.now() })
}

// --- Sync engine ------------------------------------------------------------
export const flush = engine.flush
export const syncNow = engine.syncNow

/** The engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine
/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)
/** Start syncing (call when a session exists). Returns a stop function. */
export const startMealDiarySync = engine.start
