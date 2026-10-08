import { shortcutFor } from './shortcuts'
import { useHotkey } from './useHotkey'

// The list-page shortcuts ('/' focus the search or main input, 'n' add a new
// item), bound to the combos in shortcuts.ts. They never fire while typing
// (useHotkey) and never while a sheet/dialog is open.

/** True while a modal <dialog> (every Sheet) is open. */
export function dialogOpen(): boolean {
  return typeof document !== 'undefined' && document.querySelector('dialog[open]') !== null
}

export function useListHotkeys({ onSearch, onNew }: { onSearch?: () => void; onNew?: () => void }): void {
  useHotkey(
    shortcutFor('search').combo,
    (e) => {
      if (dialogOpen()) return
      e.preventDefault()
      onSearch?.()
    },
    { enabled: Boolean(onSearch) },
  )
  useHotkey(
    shortcutFor('new').combo,
    (e) => {
      if (dialogOpen()) return
      e.preventDefault()
      onNew?.()
    },
    { enabled: Boolean(onNew) },
  )
}
