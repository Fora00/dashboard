// Wraps a fire-and-forget async handler (`onClick={() => void fn()}`) so a
// rejection is logged and surfaced as a short error flash instead of an
// unhandled promise rejection. The flash is rendered by <ErrorFlash /> in
// Layout; this module is a tiny pub/sub so it needs no provider.

type Listener = (message: string | null) => void
const listeners = new Set<Listener>()

export function subscribeFlash(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function flash(message: string): void {
  for (const l of listeners) l(message)
}

export function runSafe<A extends unknown[]>(
  fn: (...args: A) => unknown,
  message = 'Something went wrong',
): (...args: A) => Promise<void> {
  return async (...args: A) => {
    try {
      await fn(...args)
    } catch (err) {
      console.error(err)
      flash(message)
    }
  }
}
