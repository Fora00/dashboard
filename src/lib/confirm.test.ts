import { describe, expect, it } from 'vitest'
import { confirm, currentConfirmRequest } from './confirm'

describe('confirm', () => {
  it('resolves true on confirm and closes', async () => {
    const p = confirm({ title: 'Delete?' })
    expect(currentConfirmRequest()?.title).toBe('Delete?')
    currentConfirmRequest()!.resolve(true)
    await expect(p).resolves.toBe(true)
    expect(currentConfirmRequest()).toBeNull()
  })

  it('resolves false on cancel', async () => {
    const p = confirm({ title: 'Delete?', danger: true })
    currentConfirmRequest()!.resolve(false)
    await expect(p).resolves.toBe(false)
  })

  it('a second call cancels the first and a late settle does not close it', async () => {
    const first = confirm({ title: 'A' })
    const firstReq = currentConfirmRequest()!
    const second = confirm({ title: 'B' })
    await expect(first).resolves.toBe(false)
    firstReq.resolve(true) // stale: ignored by the promise, must not close B
    expect(currentConfirmRequest()?.title).toBe('B')
    currentConfirmRequest()!.resolve(true)
    await expect(second).resolves.toBe(true)
  })
})
