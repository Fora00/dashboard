import { describe, expect, it } from 'vitest'
import { BLOCK_IDS, DEFAULT_LAYOUT, moveHorizontal, moveVertical, sanitizeLayout, type BlockId } from './blockLayout'

const all = new Set<BlockId>(BLOCK_IDS)
const flat = (l: BlockId[][]) => l.flat().sort()

describe('sanitizeLayout', () => {
  it('falls back to the default for garbage', () => {
    expect(sanitizeLayout(null)).toEqual(DEFAULT_LAYOUT)
    expect(sanitizeLayout('x')).toEqual(DEFAULT_LAYOUT)
  })
  it('drops unknown/duplicate ids and restores missing ones', () => {
    const l = sanitizeLayout([['food', 'food', 'nope'], [], []])
    expect(flat(l)).toEqual([...BLOCK_IDS].sort())
    expect(l[0]).toEqual(['food', 'oggi', 'playbook', 'focus', 'trackers', 'recap', 'rules'])
  })
})

describe('moves', () => {
  it('moves down within a column and across its edge', () => {
    const a = moveVertical(DEFAULT_LAYOUT, 'oggi', 1, all)
    expect(a[0]?.slice(0, 2)).toEqual(['playbook', 'oggi'])
    const b = moveVertical(DEFAULT_LAYOUT, 'rules', 1, all)
    expect(b[0]).not.toContain('rules')
    expect(b[1]?.slice(0, 2)).toEqual(['things', 'rules'])
    expect(flat(b)).toEqual([...BLOCK_IDS].sort())
  })
  it('skips blocks that are not on screen', () => {
    const present = new Set<BlockId>(all)
    present.delete('playbook')
    expect(moveVertical(DEFAULT_LAYOUT, 'oggi', 1, present)[0]?.slice(0, 3)).toEqual(['playbook', 'focus', 'oggi'])
  })
  it('is a no-op at the very top and bottom', () => {
    expect(moveVertical(DEFAULT_LAYOUT, 'oggi', -1, all)).toBe(DEFAULT_LAYOUT)
    expect(moveVertical(DEFAULT_LAYOUT, 'progress', 1, all)).toBe(DEFAULT_LAYOUT)
  })
  it('moves between columns', () => {
    const l = moveHorizontal(DEFAULT_LAYOUT, 'focus', 1)
    expect(l[1]).toEqual(['things', 'checkins', 'focus', 'sunday', 'upgrades'])
    expect(moveHorizontal(DEFAULT_LAYOUT, 'oggi', -1)).toBe(DEFAULT_LAYOUT)
  })
})
