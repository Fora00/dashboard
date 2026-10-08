// The one list of keyboard shortcuts (Mac / iPad with a keyboard). The help
// sheet renders this list; pages and the palette bind the same combos with
// useHotkey, so the documentation can never drift from the behaviour.
// A page shortcut only fires on its own page (scope = project id or 'lists').

export type ShortcutScope = 'global' | 'lists' | 'events' | 'local-transfer'

export interface Shortcut {
  id: string
  combo: string
  label: string
  scope: ShortcutScope
}

export const shortcuts: Shortcut[] = [
  { id: 'palette', combo: 'mod+k', label: 'Jump to a project or action', scope: 'global' },
  { id: 'help', combo: '?', label: 'Show keyboard shortcuts', scope: 'global' },
  { id: 'sidebar', combo: '[', label: 'Collapse or expand the sidebar', scope: 'global' },
  { id: 'search', combo: '/', label: 'Focus the search field', scope: 'lists' },
  { id: 'new', combo: 'n', label: 'Add a new item', scope: 'lists' },
  { id: 'events-move', combo: 'j', label: 'Next event (k = previous, arrows too)', scope: 'events' },
  { id: 'events-clear', combo: 'escape', label: 'Clear the selection', scope: 'events' },
  { id: 'events-range', combo: 'shift+click', label: 'Select a range of events (in selection mode)', scope: 'events' },
  { id: 'drop', combo: 'drag', label: 'Drop files anywhere on the page to add them', scope: 'local-transfer' },
]

export const scopeTitles: Record<ShortcutScope, string> = {
  global: 'Everywhere',
  lists: 'Lists (Events, Links, Todo, Shop List, Habits)',
  events: 'Events',
  'local-transfer': 'Local Transfer',
}

export function shortcutFor(id: string): Shortcut {
  const s = shortcuts.find((x) => x.id === id)
  if (!s) throw new Error(`Unknown shortcut ${id}`)
  return s
}
