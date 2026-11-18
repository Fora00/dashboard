import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob } from './downloadBlob'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('downloadBlob', () => {
  it('clicks a download link and revokes the object URL only later', () => {
    vi.useFakeTimers()
    const a = { click: vi.fn(), remove: vi.fn(), style: {} as Record<string, string>, href: '', download: '', rel: '' }
    vi.stubGlobal('document', { createElement: () => a, body: { appendChild: vi.fn() } })
    const revoke = vi.fn()
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:x', revokeObjectURL: revoke })

    downloadBlob(new Blob(['x']), 'f.json')

    expect(a.download).toBe('f.json')
    expect(a.href).toBe('blob:x')
    expect(a.click).toHaveBeenCalledOnce()
    expect(revoke).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(revoke).toHaveBeenCalledWith('blob:x')
  })

  it('does nothing without a DOM', () => {
    expect(() => downloadBlob(new Blob(['x']), 'f')).not.toThrow()
  })
})
