import { describe, expect, it } from 'vitest'
import { decodeDayFocusParam, encodeDayFocusLink, parseDayFocusJson } from './index.ts'

describe('day focus link', () => {
  it('round-trips lines with accents and emoji', () => {
    const link = encodeDayFocusLink({ day: '2026-10-22', lines: ['Chiamare È ☀️', 'B'] }, 'x/')
    const d = link.split('?d=')[1] ?? ''
    const dec = decodeDayFocusParam(d)
    expect(dec.ok && parseDayFocusJson(dec.text)).toEqual({
      ok: true,
      plan: { day: '2026-10-22', lines: ['Chiamare È ☀️', 'B'] },
    })
  })

  it('rejects bad day, empty and more than 3 lines', () => {
    expect(parseDayFocusJson('{"day":"22/10","lines":["a"]}').ok).toBe(false)
    expect(parseDayFocusJson('{"day":"2026-10-22","lines":[" "]}').ok).toBe(false)
    expect(parseDayFocusJson('{"day":"2026-10-22","lines":["a","b","c","d"]}').ok).toBe(false)
    expect(parseDayFocusJson('nope').ok).toBe(false)
  })
})
