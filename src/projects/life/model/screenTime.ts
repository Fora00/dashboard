import type { LifeQuestion } from '../../../lib/db'

// --- Screen time (a fixed Life section, not part of the plan) ----------------
// Stored as `sunday` entries with these reserved refs, so they sync, export and
// land in the week JSON with no schema change, whatever the imported plan says.

export const SCREEN_QUESTIONS: readonly LifeQuestion[] = [
  { id: 'screen-total', label: 'Tempo totale', type: 'duration' },
  { id: 'screen-avg', label: 'Media giornaliera', type: 'duration' },
  // iOS Screen Time categories, in the iPhone's order. Ids never change (they are stored refs).
  { id: 'screen-social', label: 'Social', type: 'duration' },
  { id: 'screen-entertainment', label: 'Intrattenimento', type: 'duration' },
  { id: 'screen-productivity', label: 'Produttività e finanza', type: 'duration' },
  { id: 'screen-creativity', label: 'Creatività', type: 'duration' },
  { id: 'screen-games', label: 'Giochi', type: 'duration' },
  { id: 'screen-info', label: 'Informazioni e lettura', type: 'duration' },
  { id: 'screen-education', label: 'Istruzione', type: 'duration' },
  { id: 'screen-health', label: 'Salute e fitness', type: 'duration' },
  { id: 'screen-utilities', label: 'Utilità', type: 'duration' },
  { id: 'screen-travel', label: 'Viaggi', type: 'duration' },
  { id: 'screen-shopping', label: 'Shopping e cibo', type: 'duration' },
  { id: 'screen-other', label: 'Altro', type: 'duration' },
  { id: 'screen-apps', label: 'App più usate', type: 'apps' },
]

export const SCREEN_IDS: ReadonlySet<string> = new Set(SCREEN_QUESTIONS.map((q) => q.id))
