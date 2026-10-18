import type { LifeQuestion } from '../../../lib/db'

// --- Screen time (a fixed Life section, not part of the plan) ----------------
// Stored as `sunday` entries with these reserved refs, so they sync, export and
// land in the week JSON with no schema change, whatever the imported plan says.

export const SCREEN_QUESTIONS: readonly LifeQuestion[] = [
  { id: 'screen-total', label: 'Tempo totale', type: 'duration' },
  { id: 'screen-avg', label: 'Media giornaliera', type: 'duration' },
  { id: 'screen-social', label: 'Social', type: 'duration' },
  { id: 'screen-other', label: 'Altro', type: 'duration' },
  { id: 'screen-info', label: 'Informazioni e lettura', type: 'duration' },
  { id: 'screen-apps', label: 'App più usate', type: 'apps' },
]

export const SCREEN_IDS: ReadonlySet<string> = new Set(SCREEN_QUESTIONS.map((q) => q.id))
