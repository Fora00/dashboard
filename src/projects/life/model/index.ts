// Pure logic for the Life project (spec: docs/HANDOFF-life.md). No React, no
// Dexie: validation/normalization of the imported week, the import-preview
// diff, week/day keys, the Things URL, the Markdown export and the import
// link codec. Mutations live in src/lib/lifeSync.ts.
//
// One file per concern; this barrel is the public API (import from
// './model' / '../life/model'). Relative imports inside carry `.ts` so
// scripts/life-link.ts runs under native Node without a resolver hook.

export { LIFE_CAPS, THINGS_WHEN_KEYWORDS, AUTO_QUESTION_TYPES } from './constants.ts'
export { dayKey, isDateKey, parseDayKey, isMondayKey, addDays, weekKey, weekDays, daysBetween } from './dates.ts'
export { parseWeekJson, validatePlan, type ParseResult } from './validate.ts'
export { derivedCheckinId, withCheckinIds } from './checkinIds.ts'
export { entryId, isEnergy, validateAnswer } from './entries.ts'
export { summarizeWeek, nextCheckin, type TrackerSummary, type CheckinStatus, type WeekSummary } from './summary.ts'
export { diffPlans, hiddenTrackerEntries, type ListDiff, type PlanDiff } from './diff.ts'
export {
  thingsItems,
  buildThingsUrl,
  isIosLike,
  canReturnFromThings,
  lifeReturnUrl,
  type ThingsTodo,
  type ThingsUrlOptions,
} from './things.ts'
export { buildExportMarkdown } from './export.ts'
export { fenceFor, extractJsonFence } from './fence.ts'
export { summarizeMealsWeek, type MealsWeek, type MealsDay } from './meals.ts'
export { LIFE_IMPORT_BASE, encodeImportLink, decodeImportParam } from './importLink.ts'
