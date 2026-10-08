import { describe, expect, it } from 'vitest'
// @ts-expect-error plain .mjs script, no types
import { resolveLook } from './new-project.mjs'

describe('resolveLook', () => {
  it('fills defaults', () => {
    expect(resolveLook({})).toEqual({
      area: 'utility',
      icon: 'folder',
      color: '#6366f1',
    })
  })
  it('accepts valid values', () => {
    expect(resolveLook({ area: 'sport', icon: 'dice-5', color: '#0EA5E9' })).toEqual({
      area: 'sport',
      icon: 'dice-5',
      color: '#0EA5E9',
    })
  })
  it('rejects bad area, colour and icon', () => {
    expect(resolveLook({ area: 'nope' }).error).toMatch(/area/)
    expect(resolveLook({ color: 'red' }).error).toMatch(/colour/)
    expect(resolveLook({ icon: 'Bad Name' }).error).toMatch(/icon/)
  })
})
