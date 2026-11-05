import { describe, expect, it } from 'vitest'
import { fitWithin, MAX_PHOTO_SIDE } from './photo'

describe('fitWithin', () => {
  it('scales the long side down to the max, keeping the aspect ratio', () => {
    expect(fitWithin(4032, 3024)).toEqual({ width: MAX_PHOTO_SIDE, height: 1200 })
    expect(fitWithin(3024, 4032)).toEqual({ width: 1200, height: MAX_PHOTO_SIDE })
    expect(fitWithin(5000, 5000, 1000)).toEqual({ width: 1000, height: 1000 })
  })

  it('never upscales and guards bad sizes', () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 })
    expect(fitWithin(1600, 10)).toEqual({ width: 1600, height: 10 })
    expect(fitWithin(100000, 1)).toEqual({ width: 1600, height: 1 })
    expect(fitWithin(0, 100)).toEqual({ width: 0, height: 0 })
    expect(fitWithin(Number.NaN, 100)).toEqual({ width: 0, height: 0 })
  })
})
