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
export { parseWeekJson, parseStreaksJson, parseChoresJson, validatePlan, type ParseResult } from './validate.ts'
export { SCREEN_IDS, SCREEN_QUESTIONS } from './screenTime.ts'
export { MAX_APPS, parseApps, serializeApps, type AppUsage } from './apps.ts'
export { derivedCheckinId, withCheckinIds } from './checkinIds.ts'
export { entryId, isEnergy, validateAnswer } from './entries.ts'
export {
  summarizeWeek,
  nextCheckin,
  type TrackerSummary,
  type PlaybookSummary,
  type CheckinStatus,
  type WeekSummary,
} from './summary.ts'
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
export { dayFocusId, parseFocusLines, freeSlots } from './dayFocus.ts'
export { summarizeUpgrades, upgradesForExport, isUpgrade, type UpgradeSummary } from './upgrades.ts'
export {
  STREAK_STALE_DAYS,
  doneLast7,
  isStaleStreak,
  isMissedStreak,
  isStreak,
  last7,
  planStreakImport,
  sortStreaks,
  streakAge,
  streakEntryId,
  streakRef,
  streaksForExport,
  type StreakDay,
  type StreakImportPlan,
} from './streaks.ts'
export {
  choreEntryId,
  choreRef,
  choresByWeek,
  isChore,
  planChoreImport,
  sortChores,
  summarizeChores,
  visibleChores,
  toggleChoreValue,
  type ChoreImportPlan,
  type ChoresSummary,
} from './chores.ts'
export { fenceFor, extractJsonFence } from './fence.ts'
export { summarizeSavedEvents, type SavedEventsNextWeek } from './events.ts'
export { summarizeMealsWeek, type MealsWeek, type MealsDay } from './meals.ts'
export {
  summarizeLearningWeek,
  describeLearningActivity,
  type LearningWeek,
  type LearningCourseWeek,
} from './learning.ts'
export { LIFE_IMPORT_BASE, encodeImportLink, decodeImportParam } from './importLink.ts'
export { encodeStreaksLink, decodeStreaksParam } from './streaksLink.ts'
export { encodeDayFocusLink, parseDayFocusJson, decodeDayFocusParam, type DayFocusPlan } from './dayFocusLink.ts'
