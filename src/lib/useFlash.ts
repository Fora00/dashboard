import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Short-lived "Copied ✓" style flag. `trigger()` sets it, it clears itself
 * after `ms`; re-triggering restarts the timer; the timer is cleared on
 * unmount. With a value (`useFlash<string>(1500)` / `trigger(id)`) it tracks
 * which item is flashing. Idle is always null (falsy).
 */
export function useFlash(ms: number): [true | null, () => void]
export function useFlash<T>(ms: number): [T | null, (value: T) => void]
export function useFlash(ms: number): [unknown, (value?: unknown) => void] {
  const [value, setValue] = useState<unknown>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    [],
  )

  const trigger = useCallback(
    (next: unknown = true) => {
      if (timer.current !== null) clearTimeout(timer.current)
      setValue(next)
      timer.current = setTimeout(() => {
        timer.current = null
        setValue(null)
      }, ms)
    },
    [ms],
  )

  return [value, trigger]
}
