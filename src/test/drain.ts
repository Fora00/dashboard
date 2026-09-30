// Deterministic "let the engine go quiet" helper for async engine tests: yields
// to the event loop (setImmediate, which fake-indexeddb also uses) until the
// observable state string stops changing. Condition-based, not a timed sleep.
//
//   await drain(async () => `${fake.calls.length}|${await db.outbox.count()}`)
const setImmediateNode = (globalThis as unknown as { setImmediate: (fn: () => void) => void }).setImmediate
const tick = () => new Promise<void>((r) => setImmediateNode(r))

export async function drain(state: () => Promise<string> | string, stableFor = 12): Promise<void> {
  let last = await state()
  let stable = 0
  for (let i = 0; i < 5000 && stable < stableFor; i++) {
    await tick()
    const now = await state()
    if (now === last) stable++
    else {
      stable = 0
      last = now
    }
  }
}

/** Yield to the event loop until `cond()` holds (fails loudly after many ticks). */
export async function until(cond: () => Promise<boolean> | boolean): Promise<void> {
  for (let i = 0; i < 5000; i++) {
    if (await cond()) return
    await tick()
  }
  throw new Error('until(): condition never became true')
}
