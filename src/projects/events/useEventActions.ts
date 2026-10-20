import { useCallback } from 'react'
import type { EventMark } from '../../lib/db'
import { restoreEventMark, toggleEventMark } from '../../lib/eventMarksSync'
import { toggleInterest } from '../../lib/eventInterestSync'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import type { EventItem } from './types'
import type { InterestValue } from './interest'

/**
 * Save / Go / Hide and 👍 / 👎 for event cards, with the Undo snackbar state.
 * Shared by every page that shows EventCards. The handlers are stable (they
 * read the current mark from Dexie), so memoised cards only re-render when
 * their own props change.
 */
export function useEventActions() {
  const { trigger: triggerUndo, pending: pendingUndo, confirmUndo } = useUndoSnackbar()
  const setMark = useCallback(
    async (e: EventItem, state: EventMark['state']) => {
      // Through the owner-only sync engine (eventMarksSync.ts). The snapshot
      // is sanitised there: a hand-added event's inline image is dropped (the
      // live row has it), scraped fields are capped.
      const prev = await toggleEventMark(e, state)
      // Hiding makes the card vanish: offer Undo, restoring the previous mark.
      if (state === 'hidden' && prev?.state !== 'hidden') {
        triggerUndo('Event hidden', () => restoreEventMark(e.id, prev))
      }
    },
    [triggerUndo],
  )
  const onToggleSave = useCallback((e: EventItem) => void setMark(e, 'saved'), [setMark])
  const onToggleGoing = useCallback((e: EventItem) => void setMark(e, 'going'), [setMark])
  const onToggleHide = useCallback((e: EventItem) => void setMark(e, 'hidden'), [setMark])
  // 👍 / 👎 (eventInterestSync.ts). A new 👎 also hides the card, so it gets
  // the same Undo as Hide, which puts back both the signal and the mark.
  const onInterest = useCallback(
    (e: EventItem, value: InterestValue) => {
      void toggleInterest(e, value).then(({ hid, undo }) => {
        if (hid) triggerUndo('Not interested · hidden', undo)
      })
    },
    [triggerUndo],
  )
  return { triggerUndo, pendingUndo, confirmUndo, onToggleSave, onToggleGoing, onToggleHide, onInterest }
}
