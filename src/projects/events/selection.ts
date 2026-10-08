// Master-detail selection on wide screens (UI2): which event the detail panel
// shows, and how the keyboard moves it through the list. Pure, no DOM.
import type { WeekGroup } from './model'

/**
 * Event ids in list order, as the user sees them: folded weeks are skipped and
 * an event listed under two groups counts once (at its first place).
 */
export function visibleOrder(weeks: readonly WeekGroup[], collapsed: ReadonlySet<string>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of weeks) {
    if (w.key !== 'open-now' && collapsed.has(w.key)) continue
    for (const d of w.days) {
      for (const e of d.events) {
        if (seen.has(e.id)) continue
        seen.add(e.id)
        out.push(e.id)
      }
    }
  }
  return out
}

export type Move = 'next' | 'prev' | 'first' | 'last'

/**
 * The id the selection moves to. With nothing selected (or a selection that
 * is no longer in the list) next/first go to the top, prev/last to the bottom.
 * Clamps at both ends; null only for an empty list.
 */
export function moveSelection(order: readonly string[], current: string | null, move: Move): string | null {
  if (order.length === 0) return null
  const first = order[0] ?? null
  const last = order[order.length - 1] ?? null
  if (move === 'first') return first
  if (move === 'last') return last
  const i = current === null ? -1 : order.indexOf(current)
  if (i === -1) return move === 'next' ? first : last
  const j = move === 'next' ? Math.min(i + 1, order.length - 1) : Math.max(i - 1, 0)
  return order[j] ?? null
}

export type ListKeyAction = { kind: 'move'; move: Move } | { kind: 'clear' } | null

interface KeyLike {
  key: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}

/**
 * What a key press does to the list selection: Arrow Up/Down step, Home/End
 * jump, Esc clears. Any modifier leaves the key to the browser/OS.
 */
export function listKeyAction(k: KeyLike): ListKeyAction {
  if (k.altKey || k.ctrlKey || k.metaKey || k.shiftKey) return null
  switch (k.key) {
    case 'ArrowDown':
      return { kind: 'move', move: 'next' }
    case 'ArrowUp':
      return { kind: 'move', move: 'prev' }
    case 'Home':
      return { kind: 'move', move: 'first' }
    case 'End':
      return { kind: 'move', move: 'last' }
    case 'Escape':
      return { kind: 'clear' }
    default:
      return null
  }
}

interface TargetLike {
  tagName?: string
  isContentEditable?: boolean
}

/** Typing targets keep their own keys (arrows move the caret, Esc is theirs). */
export function isTypingTarget(t: TargetLike | null | undefined): boolean {
  if (!t) return false
  if (t.isContentEditable) return true
  const tag = (t.tagName ?? '').toUpperCase()
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}
