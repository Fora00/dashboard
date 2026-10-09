import { describe, expect, it } from 'vitest'
import { isWhitelistRejection } from './sync'

describe('isWhitelistRejection', () => {
  it('recognises the opaque GoTrue error by message or by code', () => {
    expect(isWhitelistRejection({ message: 'Database error saving new user', status: 500 })).toBe(true)
    expect(isWhitelistRejection({ message: 'something new', code: 'unexpected_failure', status: 500 })).toBe(true)
  })
  it('leaves other errors alone', () => {
    expect(
      isWhitelistRejection({ message: 'Email rate limit exceeded', code: 'over_email_send_rate_limit', status: 429 }),
    ).toBe(false)
    expect(isWhitelistRejection({ message: 'Invalid login', status: 400 })).toBe(false)
  })
})
