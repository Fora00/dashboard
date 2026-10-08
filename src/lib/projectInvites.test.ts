import { describe, expect, it } from 'vitest'
import '../test/fakeDb'
import { APP_URL, projectInviteUrl, projectUrl, syncProjectAfterJoin } from './projectInvites'

describe('project invite urls', () => {
  it('builds a hash-router join link on the app url', () => {
    expect(projectInviteUrl('abc123')).toBe(`${APP_URL}#/join/p/abc123`)
    expect(projectInviteUrl('abc123').startsWith('https://')).toBe(true)
  })
  it('projectUrl prefixes the hash', () => {
    expect(projectUrl('/todo')).toBe(`${APP_URL}#/todo`)
  })
})

describe('syncProjectAfterJoin', () => {
  it('ignores projects with nothing to kick', () => {
    expect(() => syncProjectAfterJoin('local-transfer')).not.toThrow()
    expect(() => syncProjectAfterJoin('nope')).not.toThrow()
  })
})
