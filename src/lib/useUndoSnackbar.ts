import { useCallback, useEffect, useRef, useState } from 'react'

// Shared "destructive action, then Undo" pattern for pages with deletes/clears
// (todo, shop-list, local-transfer). The semantics are fixed on purpose:
//   1. the caller performs the destructive write immediately, through the
//      exact same code path it always used (outbox flow untouched) —
//      this hook never defers or debounces the delete itself;
//   2. before that write, the caller snapshots whatever it's about to lose;
//   3. the caller calls `trigger(label, undo)`; Undo re-runs the snapshot
//      back through the project's engine (`sync.upsert`), which is a normal
//      write since the id is unchanged.
// Only one snackbar is live at a time — a new trigger() replaces whatever
// was still showing, cancelling its auto-dismiss timer.

const AUTO_DISMISS_MS = 6000

export interface PendingUndo {
  label: string
  undo: () => void | Promise<void>
}

export function useUndoSnackbar() {
  const [pending, setPending] = useState<PendingUndo | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Dismiss without undoing (auto-timeout or the snackbar being replaced).
  const dismiss = useCallback(() => {
    clearTimer()
    setPending(null)
  }, [clearTimer])

  const trigger = useCallback(
    (label: string, undo: () => void | Promise<void>) => {
      clearTimer()
      setPending({ label, undo })
      timerRef.current = setTimeout(() => setPending(null), AUTO_DISMISS_MS)
    },
    [clearTimer],
  )

  // Tapping "Undo": hide immediately, then run the undo callback.
  const confirmUndo = useCallback(() => {
    setPending((current) => {
      if (current) void current.undo()
      return null
    })
    clearTimer()
  }, [clearTimer])

  useEffect(() => clearTimer, [clearTimer])

  return { pending, trigger, dismiss, confirmUndo }
}
