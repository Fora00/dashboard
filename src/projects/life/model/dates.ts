// Re-export: the date helpers live in src/lib/dates.ts (one date module).
// Kept so Life's imports and the Node scripts (`.ts` imports) keep working.
export {
  addDays,
  dayKey,
  daysBetween,
  isDateKey,
  isMondayKey,
  parseDayKey,
  weekDays,
  weekKey,
} from '../../../lib/dates.ts'
