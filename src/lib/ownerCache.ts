import { readString, writeString } from './safeStorage'

// Last successful is_owner answer, per user id, so the owner keeps owner
// features offline (the rpc can't answer without a connection). Only a
// successful answer is ever cached — an error never overwrites it.

const KEY = 'dashboard.is-owner'

export interface OwnerResult {
  data: unknown
  error: unknown
}

/** Cached answer for this user, or undefined if none. */
export function readCachedOwner(userId: string): boolean | undefined {
  const raw = readString(`${KEY}.${userId}`)
  return raw === '1' ? true : raw === '0' ? false : undefined
}

/**
 * Turns an rpc result into the owner flag: a successful answer is cached and
 * returned; an error (or a thrown/offline call, passed as `result = null`)
 * falls back to the cached value, else false. Never caches on error.
 */
export function resolveOwner(
  userId: string,
  result: OwnerResult | null,
  read: (id: string) => boolean | undefined = readCachedOwner,
  write: (id: string, owner: boolean) => void = (id, o) => writeString(`${KEY}.${id}`, o ? '1' : '0'),
): boolean {
  if (result && !result.error) {
    const owner = Boolean(result.data)
    write(userId, owner)
    return owner
  }
  return read(userId) ?? false
}
