import { useSyncExternalStore } from 'react'

export interface ConfirmOptions {
  title: string
  body?: string
  confirmLabel?: string
  /** Destructive action: red button, and the safe (cancel) button gets focus. */
  danger?: boolean
}

export interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void
}

// Module-level store: one dialog host (ConfirmHost, mounted in Layout) renders
// the current request, so any lazy page can `await confirm(...)` without a provider.
let current: ConfirmRequest | null = null
const listeners = new Set<() => void>()

function set(next: ConfirmRequest | null) {
  current = next
  listeners.forEach((l) => l())
}

/** Opens the dialog; resolves true on confirm, false on cancel/Escape/backdrop. */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  // A second call while one is open dismisses the first as cancelled.
  current?.resolve(false)
  return new Promise<boolean>((resolve) => {
    const req: ConfirmRequest = {
      ...options,
      resolve: (ok) => {
        // Settle once; close only if this request is still the open one.
        if (current === req) set(null)
        resolve(ok)
      },
    }
    set(req)
  })
}

export function currentConfirmRequest(): ConfirmRequest | null {
  return current
}

export function useConfirmRequest(): ConfirmRequest | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
}

export function useConfirm() {
  return confirm
}
