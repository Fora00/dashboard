import { describe, expect, it } from 'vitest'
import { thingsUrl } from './things'

describe('thingsUrl', () => {
  it('encodes values and keeps the parameter order', () => {
    expect(thingsUrl('add', { title: 'Rock & Roll #1 100%', notes: 'a\nb', when: '2026-10-20' })).toBe(
      'things:///add?title=Rock%20%26%20Roll%20%231%20100%25&notes=a%0Ab&when=2026-10-20',
    )
  })
  it('matches the old hand-built json URL', () => {
    const data = '[{"type":"to-do"}]'
    const back = 'https://x.test/#/life'
    expect(thingsUrl('json', { data, reveal: 'true', 'x-success': back })).toBe(
      `things:///json?data=${encodeURIComponent(data)}&reveal=true&x-success=${encodeURIComponent(back)}`,
    )
  })
})
