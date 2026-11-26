import { db, type OutboxTable } from './db'

// Owner-only data that stays readable in IndexedDB after the owner signs out
// (local-first: signing out never deletes anything by itself). SyncCard offers
// to remove it from the device right after a sign-out; it is NEVER run
// automatically. Keep in sync with the owner-only synced tables (Life incl. Life Engines, Meal
// Diary, Soldi, Siti, Learning progress, the owner's custom events, event marks/prefs, event interests and the interest profile).
// NOT here on purpose: learningSketches (learningLocal.ts). The photo diary is
// local-only with no cloud copy, so "remove from this device" would destroy it
// for good, and it is written signed out too.

/** Local Dexie tables holding owner-only data. */
const PRIVATE_TABLES = [
  db.lifeWeeks,
  db.lifeEntries,
  db.lifeDayFocus,
  db.lifeEngines,
  db.learningQuiz,
  db.learningCards,
  db.learningPractice,
  db.learningChecks,
  db.learningPosition,
  db.learningReviews,
  db.meals,
  db.moneyTotals,
  db.moneyBudgets,
  db.moneyBudgetChoices,
  db.moneyGoals,
  db.moneyBalances,
  db.sites,
  db.siteNotes,
  db.customEvents,
  db.eventMarks,
  db.eventPrefs,
  db.eventInterest,
  db.eventInterestProfile,
] as const

/** Their remote tables: outbox entries for these carry the same private rows. */
const PRIVATE_REMOTES = new Set<OutboxTable>([
  'life_weeks',
  'life_entries',
  'life_day_focus',
  'life_engines',
  'learning_quiz',
  'learning_cards',
  'learning_practice',
  'learning_checks',
  'learning_position',
  'learning_reviews',
  'meal_entries',
  'money_totals',
  'money_budgets',
  'money_budget_choices',
  'money_goals',
  'money_balances',
  'sites',
  'site_notes',
  'custom_events',
  'event_marks',
  'event_prefs',
  'event_interest',
  'event_interest_profile',
])

/** What the private-data texts (Settings, SyncCard) call it: one place, next
 *  to the table list above, so a new area is not forgotten in the copy. */
export const PRIVATE_DATA_LABEL = 'Life, Learning, Meal Diary, Soldi, Siti and your events'

/** Confirm text for "remove private data from this device" (Settings + SyncCard). */
export function removePrivateDataConfirm(unsynced: number): { title: string; body: string } {
  const lost =
    unsynced > 0
      ? `\n\n${unsynced} change${unsynced === 1 ? ' was' : 's were'} never synced and will be lost for good.`
      : ''
  return {
    title: `Remove ${PRIVATE_DATA_LABEL} data from this device?`,
    body: `The copy in the cloud is kept: sign in again to get it back.${lost}`,
  }
}

export interface PrivateDataSummary {
  /** Private rows stored on this device. */
  rows: number
  /** Outbox entries (pending or rejected) for them: changes the server has
   *  never received, lost for good if the data is removed. */
  unsynced: number
}

export async function privateDataSummary(): Promise<PrivateDataSummary> {
  const counts = await Promise.all(PRIVATE_TABLES.map((t) => t.count()))
  const unsynced = (await db.outbox.toArray()).filter((e) => PRIVATE_REMOTES.has(e.table)).length
  return { rows: counts.reduce((a, b) => a + b, 0), unsynced }
}

/** Delete every owner-only row from this device, plus its outbox entries (they
 *  hold the same data, and would otherwise push it again on the next sign-in).
 *  One transaction: all or nothing. The cloud copy is untouched. */
export async function clearPrivateData(): Promise<void> {
  await db.transaction('rw', [...PRIVATE_TABLES, db.outbox], async () => {
    for (const t of PRIVATE_TABLES) await t.clear()
    const seqs = (await db.outbox.toArray()).filter((e) => PRIVATE_REMOTES.has(e.table)).map((e) => e.seq!)
    await db.outbox.bulkDelete(seqs)
  })
}
