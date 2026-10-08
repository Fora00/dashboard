import { useEffect, useState } from 'react'
import { supabase } from './sync'
import { useAuth } from './useAuth'
import { readCachedOwner, resolveOwner } from './ownerCache'

/**
 * Whether the signed-in user is the dashboard owner (undefined = loading).
 * The last successful answer is cached per user id, so the owner keeps owner
 * features offline instead of flipping to false when the rpc fails.
 */
export function useOwner(): boolean | undefined {
  const session = useAuth()
  const [owner, setOwner] = useState<boolean | undefined>(undefined)
  const userId = session?.user.id

  useEffect(() => {
    if (!supabase || session === null) {
      setOwner(false)
      return
    }
    if (session === undefined || !userId) return
    let cancelled = false
    const cached = readCachedOwner(userId)
    if (cached !== undefined) setOwner(cached)
    void Promise.resolve(supabase.rpc('is_owner'))
      .then(
        (res) => resolveOwner(userId, res),
        () => resolveOwner(userId, null),
      )
      .then((value) => {
        if (!cancelled) setOwner(value)
      })
    return () => {
      cancelled = true
    }
  }, [session, userId])

  return owner
}
