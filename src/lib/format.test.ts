import { describe, expect, it } from 'vitest'
import { formatBytes, formatDate } from './format'

describe('formatBytes', () => {
  it('uses bytes under 1 KB', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1023)).toBe('1023 B')
  })
  it('scales to KB/MB/GB with one decimal under 100', () => {
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
    expect(formatBytes(5 * 1024 ** 3)).toBe('5.0 GB')
  })
  it('drops decimals from 100 up', () => {
    expect(formatBytes(200 * 1024)).toBe('200 KB')
  })
  it('stays in GB beyond the largest unit', () => {
    expect(formatBytes(2048 * 1024 ** 3)).toBe('2048 GB')
  })
})

describe('formatDate', () => {
  it('renders something non-empty containing the day', () => {
    expect(formatDate(new Date(2026, 9, 5, 14, 30).getTime())).toContain('5')
  })
})
