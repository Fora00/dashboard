import { useRef } from 'react'

export const LONG_PRESS_MS = 500

/**
 * Long-press on a button: spread `bind` on it, and start `onClick` with
 * `if (consumeLongPress()) return` so the click that ends a long press is swallowed.
 * `onLongPress` is read at press time. Pass `enabled: false` to switch it off.
 */
export function useLongPress(onLongPress: () => void, enabled = true) {
  const timer = useRef<number | undefined>(undefined)
  const fired = useRef(false)
  const cancel = () => window.clearTimeout(timer.current)
  const bind = {
    onPointerDown: () => {
      if (!enabled) return
      fired.current = false
      timer.current = window.setTimeout(() => {
        fired.current = true
        onLongPress()
      }, LONG_PRESS_MS)
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: { preventDefault: () => void }) => {
      if (enabled) e.preventDefault()
    },
  }
  return { bind, consumeLongPress: () => fired.current }
}
