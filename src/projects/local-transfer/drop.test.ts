import { describe, expect, it } from 'vitest'
import { hasFiles, uniqueFiles } from './drop'

const f = (name: string, size = 1, lastModified = 1) => ({ name, size, lastModified })

describe('hasFiles', () => {
  it('is true only when the drag carries files', () => {
    expect(hasFiles(['Files'])).toBe(true)
    expect(hasFiles(['text/plain', 'Files'])).toBe(true)
    expect(hasFiles(['text/plain', 'text/uri-list'])).toBe(false)
    expect(hasFiles([])).toBe(false)
    expect(hasFiles(null)).toBe(false)
  })
})

describe('uniqueFiles', () => {
  it('drops exact repeats and keeps the order', () => {
    const out = uniqueFiles([f('a'), f('b'), f('a'), f('c')])
    expect(out.map((x) => x.name)).toEqual(['a', 'b', 'c'])
  })

  it('keeps same-name files that differ in size or date', () => {
    expect(uniqueFiles([f('a', 1), f('a', 2), f('a', 1, 9)])).toHaveLength(3)
  })
})
