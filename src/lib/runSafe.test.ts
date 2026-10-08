import { afterEach, describe, expect, it, vi } from 'vitest'
import { runSafe, subscribeFlash } from './runSafe'

afterEach(() => vi.restoreAllMocks())

describe('runSafe', () => {
  it('passes args through and resolves on success without flashing', async () => {
    const seen: (string | null)[] = []
    const off = subscribeFlash((m) => seen.push(m))
    const fn = vi.fn(async (a: number, b: number) => a + b)
    await runSafe(fn)(1, 2)
    expect(fn).toHaveBeenCalledWith(1, 2)
    expect(seen).toEqual([])
    off()
  })

  it('catches rejections and sync throws, logs and flashes the message', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const seen: (string | null)[] = []
    const off = subscribeFlash((m) => seen.push(m))
    await expect(runSafe(async () => Promise.reject(new Error('x')), 'Could not save')()).resolves.toBeUndefined()
    await expect(
      runSafe(() => {
        throw new Error('y')
      })(),
    ).resolves.toBeUndefined()
    expect(err).toHaveBeenCalledTimes(2)
    expect(seen).toEqual(['Could not save', 'Something went wrong'])
    off()
  })
})
