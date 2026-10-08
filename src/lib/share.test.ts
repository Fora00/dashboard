import { afterEach, describe, expect, it, vi } from 'vitest'
import { shareFile, shareOrCopy } from './share'

function stubNav(nav: Record<string, unknown>) {
  vi.stubGlobal('navigator', nav)
}
afterEach(() => vi.unstubAllGlobals())

const abort = () => Object.assign(new Error('x'), { name: 'AbortError' })

describe('shareOrCopy', () => {
  it('shares when the sheet is available', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    stubNav({ share })
    expect(await shareOrCopy('hi', { title: 't' })).toBe('shared')
    expect(share).toHaveBeenCalledWith({ text: 'hi', title: 't' })
  })
  it('reports a dismissed sheet as cancelled without copying', async () => {
    const writeText = vi.fn()
    stubNav({ share: vi.fn().mockRejectedValue(abort()), clipboard: { writeText } })
    expect(await shareOrCopy('hi')).toBe('cancelled')
    expect(writeText).not.toHaveBeenCalled()
  })
  it('falls back to the clipboard on other share errors', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNav({ share: vi.fn().mockRejectedValue(new Error('NotAllowed')), clipboard: { writeText } })
    expect(await shareOrCopy('hi', { url: 'https://u' })).toBe('copied')
    expect(writeText).toHaveBeenCalledWith('hi\nhttps://u')
  })
  it('copies when there is no share sheet', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNav({ clipboard: { writeText } })
    expect(await shareOrCopy('hi')).toBe('copied')
  })
})

describe('shareFile', () => {
  const file = new File(['a'], 'a.txt')
  it('is unsupported without canShare', async () => {
    stubNav({ share: vi.fn() })
    expect(await shareFile(file)).toBe('unsupported')
  })
  it('shares and maps abort to cancelled', async () => {
    stubNav({ share: vi.fn().mockResolvedValue(undefined), canShare: () => true })
    expect(await shareFile(file, 't')).toBe('shared')
    stubNav({ share: vi.fn().mockRejectedValue(abort()), canShare: () => true })
    expect(await shareFile(file)).toBe('cancelled')
  })
})
