// Habit caps and the emoji clip, free of Dexie/Supabase imports so the
// habits import link (src/projects/habits/habitsPlan.ts) and the script that
// prints it (scripts/life-habits-link.ts, run by plain node) share them with
// habitSync.ts, which re-exports them.

// Caps — MUST match the CHECK constraints in
// supabase/migrations/20260930160100_text_caps.sql and the inputs' maxLength.
export const MAX_NAME_LENGTH = 300
export const MAX_EMOJI_LENGTH = 8
export const MAX_TEXT_LENGTH = 300 // anchor, normal, floor, why
export const MAX_NOTE_LENGTH = 100
export const MAX_PER_DAY = 20
export const MAX_GRACE = 7
export const MAX_TARGET = 7 // times per week

/** Cap an emoji without leaving half a surrogate pair at the cut. */
export function clipEmoji(raw: string): string {
  return Array.from(raw.trim().slice(0, MAX_EMOJI_LENGTH))
    .filter((c) => c.length === 2 || !/[\ud800-\udfff]/.test(c))
    .join('')
}
