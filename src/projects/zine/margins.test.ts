import { describe, expect, it } from 'vitest'
import { DEFAULT_MARGINS, clampMargin, marginsOf, pageBox, setMargin, sideOf } from './margins'

describe('zine margins', () => {
  it('migrates old docs: margin -> top/bottom/outer, gutter -> spine', () => {
    expect(marginsOf({ margin: 10, gutter: 15 })).toEqual({ top: 10, bottom: 10, outer: 10, spine: 15 })
    expect(marginsOf({})).toEqual(DEFAULT_MARGINS)
    expect(marginsOf({ margins: { top: 3, bottom: 4, outer: 5, spine: 6 }, margin: 10, gutter: 15 })).toEqual({
      top: 3,
      bottom: 4,
      outer: 5,
      spine: 6,
    })
  })

  it('mirrors the spine: cover/odd pages have it on the left, even pages on the right', () => {
    const m = { top: 1, bottom: 2, outer: 3, spine: 4 }
    expect(pageBox(m, 0)).toEqual({ top: 1, bottom: 2, left: 4, right: 3 })
    expect(pageBox(m, 1)).toEqual({ top: 1, bottom: 2, left: 3, right: 4 })
    expect(sideOf('left', 2)).toBe('spine')
    expect(sideOf('left', 3)).toBe('outer')
    expect(sideOf('right', 3)).toBe('spine')
    expect(sideOf('top', 3)).toBe('top')
  })

  it('clamps to 0..max keeping 40 mm of live area, rounded to 0.5', () => {
    const m = { top: 8, bottom: 8, outer: 8, spine: 12 }
    expect(clampMargin(m, 'top', -4)).toBe(0)
    expect(clampMargin(m, 'top', 12.3)).toBe(12.5)
    expect(clampMargin(m, 'top', 500)).toBe(60)
    expect(clampMargin({ ...m, spine: 60 }, 'outer', 100)).toBe(48)
  })

  it('linked: top, bottom and outer move together, spine stays', () => {
    const m = { top: 8, bottom: 9, outer: 10, spine: 12 }
    expect(setMargin(m, 'top', 20, true)).toEqual({ top: 20, bottom: 20, outer: 20, spine: 12 })
    expect(setMargin(m, 'spine', 20, true)).toEqual({ ...m, spine: 20 })
    expect(setMargin(m, 'top', 20)).toEqual({ ...m, top: 20 })
  })
})
