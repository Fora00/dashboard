// The one list of keyboard shortcuts (Mac / iPad with a keyboard), touch
// gestures and layout tips. The help sheet renders these lists; pages and the
// palette bind the same combos with useHotkey, so the documentation can never
// drift from the behaviour.
// A page shortcut only fires on its own page (scope = project id or 'lists').

export type ShortcutScope = 'global' | 'lists' | 'events' | 'local-transfer'

export interface Shortcut {
  id: string
  combo: string
  label: string
  /** One friendly sentence for the help sheet. */
  description: string
  scope: ShortcutScope
}

export const shortcuts: Shortcut[] = [
  {
    id: 'palette',
    combo: 'mod+k',
    label: 'Jump to a project or action',
    description:
      'Open the command palette: jump to any project (shown with its icon and area), Home, toggle the sidebar or show this help.',
    scope: 'global',
  },
  {
    id: 'help',
    combo: '?',
    label: 'Show keyboard shortcuts',
    description: 'Open this help.',
    scope: 'global',
  },
  {
    id: 'sidebar',
    combo: '[',
    label: 'Collapse or expand the sidebar',
    description: 'Collapse or expand the sidebar (it appears from 1024px wide).',
    scope: 'global',
  },
  {
    id: 'search',
    combo: '/',
    label: 'Focus the search field',
    description: 'Focus the search or add field on Events, Links, Todo, Shop List and Habits.',
    scope: 'lists',
  },
  {
    id: 'new',
    combo: 'n',
    label: 'Add a new item',
    description: 'Add a new item on those same pages.',
    scope: 'lists',
  },
  {
    id: 'events-move',
    combo: 'j',
    label: 'Next event (k = previous, arrows too)',
    description: 'Move through the list: J for next, K for previous (the arrow keys work too).',
    scope: 'events',
  },
  {
    id: 'events-clear',
    combo: 'escape',
    label: 'Clear the selection',
    description: 'Clear the current selection.',
    scope: 'events',
  },
  {
    id: 'events-range',
    combo: 'shift+click',
    label: 'Select a range of events (in selection mode)',
    description: 'While selecting, click an event with Shift held to select everything in between.',
    scope: 'events',
  },
  {
    id: 'drop',
    combo: 'drag',
    label: 'Drop files anywhere on the page to add them',
    description: 'Drag files from Finder anywhere on the page to add them.',
    scope: 'local-transfer',
  },
]

export const scopeTitles: Record<ShortcutScope, string> = {
  global: 'Everywhere',
  lists: 'Lists (Events, Links, Todo, Shop List, Habits)',
  events: 'Events',
  'local-transfer': 'Local Transfer',
}

export interface Gesture {
  id: string
  /** Short name, shown as the chip. */
  gesture: string
  description: string
}

// Touch (iPhone and iPad). Not bound through useHotkey: SwipeableRow & co.
export const gestures: Gesture[] = [
  {
    id: 'swipe-right',
    gesture: 'Swipe right',
    description: 'Swipe a row to the right to mark it done.',
  },
  {
    id: 'swipe-left',
    gesture: 'Swipe left',
    description: 'Swipe a row to the left to delete it. An Undo appears.',
  },
  { id: 'tap', gesture: 'Tap a card', description: 'Tap a card to expand it.' },
  {
    id: 'search-button',
    gesture: 'Search button',
    description: 'The search button in the header opens the same palette as the keyboard shortcut.',
  },
  {
    id: 'wide',
    gesture: 'Go wider',
    description: 'From 1024px wide (iPad landscape, Mac) a sidebar appears.',
  },
]

export const layoutTips: string[] = [
  'The sidebar groups projects by area.',
  'A hidden project you open still shows in the sidebar while you are on it.',
  'On Home, "Group by area" arranges the cards the same way.',
]

export const typingNote = 'Shortcuts never fire while you are typing in a field or while a dialog is open.'

export function shortcutFor(id: string): Shortcut {
  const s = shortcuts.find((x) => x.id === id)
  if (!s) throw new Error(`Unknown shortcut ${id}`)
  return s
}
