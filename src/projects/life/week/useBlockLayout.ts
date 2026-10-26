import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { setLayoutPref } from '../../../lib/projectPrefsSync'
import { DEFAULT_LAYOUT, sanitizeLayout, type BlockLayout } from './blockLayout'

// Life's block layout lives in project_prefs (row 'life', column layout), so
// every device of the account shows the same arrangement. Local Dexie first:
// works signed out; the sync engine carries it across devices.
const PREF_ID = 'life'

/** The saved layout (the default while loading or when none was saved), live. */
export function useBlockLayout(): BlockLayout {
  const saved = useLiveQuery(() => db.projectPrefs.get(PREF_ID).then((p) => p?.layout ?? null))
  return saved ? sanitizeLayout(saved) : DEFAULT_LAYOUT
}

export function saveLayout(layout: BlockLayout): Promise<void> {
  return setLayoutPref(PREF_ID, layout)
}

export function clearLayout(): Promise<void> {
  return setLayoutPref(PREF_ID, null)
}
