import { useEffect, useRef } from 'react'

// Keyboard shortcuts for Mac / iPad with a keyboard. One tiny hook, no
// dependency. A combo is lower-case, '+' separated: 'mod+k' (⌘ on Apple, Ctrl
// elsewhere), 'shift+/', '/', 'n', '?', 'escape'. A plain key is ignored while
// the user is typing in a field, with a modifier held, or while an IME is
// composing, so it never steals text input.

const isApple =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)

export interface HotkeyOptions {
  /** Default true. */
  enabled?: boolean
  /** Fire even while typing in an input/textarea/select (use for mod+k, escape). */
  allowInInput?: boolean
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target as Element).tagName) return false
  const el = target as HTMLElement
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return el.isContentEditable === true
}

interface KeyLike {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  altKey: boolean
  shiftKey: boolean
}

/** Pure matcher so the rules are testable without a DOM. */
export function matchesCombo(e: KeyLike, combo: string, apple: boolean = isApple): boolean {
  const parts = combo.toLowerCase().split('+')
  const key = parts[parts.length - 1] ?? ''
  const mods = new Set(parts.slice(0, -1))
  const wantMeta = mods.has('meta') || (mods.has('mod') && apple)
  const wantCtrl = mods.has('ctrl') || (mods.has('mod') && !apple)
  const wantAlt = mods.has('alt')
  // Shift is part of the key for symbols ('?'), so it is only enforced when named.
  const wantShift = mods.has('shift')
  if (e.metaKey !== wantMeta || e.ctrlKey !== wantCtrl || e.altKey !== wantAlt) return false
  if (wantShift && !e.shiftKey) return false
  return e.key.toLowerCase() === key
}

/** Should a plain (modifier-free) shortcut be suppressed for this event? */
export function shouldIgnore(e: KeyboardEvent, combo: string, opts: HotkeyOptions): boolean {
  if (e.isComposing || e.defaultPrevented) return true
  // A combo with a command modifier (mod+k) is safe to fire from a field; a
  // plain key ('n', '/') must never steal text input.
  const hasMod = /(^|\+)(mod|meta|ctrl|alt)\+/.test(combo.toLowerCase())
  return !opts.allowInInput && !hasMod && isTypingTarget(e.target)
}

export function useHotkey(combo: string, handler: (e: KeyboardEvent) => void, opts: HotkeyOptions = {}): void {
  const handlerRef = useRef(handler)
  // Keep the latest handler without re-subscribing on every render.
  useEffect(() => {
    handlerRef.current = handler
  })
  const enabled = opts.enabled ?? true
  const allowInInput = opts.allowInInput ?? false

  useEffect(() => {
    if (!enabled) return
    function onKeyDown(e: KeyboardEvent) {
      if (!matchesCombo(e, combo)) return
      if (shouldIgnore(e, combo, { allowInInput })) return
      handlerRef.current(e)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, enabled, allowInInput])
}

/** Human label for a combo, e.g. 'mod+k' -> '⌘K' on Apple, 'Ctrl K' elsewhere. */
export function comboLabel(combo: string, apple: boolean = isApple): string {
  return combo
    .split('+')
    .map((p) => {
      const k = p.toLowerCase()
      if (k === 'mod') return apple ? '⌘' : 'Ctrl'
      if (k === 'shift') return apple ? '⇧' : 'Shift'
      if (k === 'alt') return apple ? '⌥' : 'Alt'
      if (k === 'escape') return 'Esc'
      return k.length === 1 ? k.toUpperCase() : k
    })
    .join(apple ? '' : ' ')
}
