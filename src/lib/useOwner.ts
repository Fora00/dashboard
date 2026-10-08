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
  // The rpc answer, tagged with the user it belongs to so a stale answer from
  // a previous user is never returned.
  const [answer, setAnswer] = useState<{ userId: string; owner: boolean } | undefined>(undefined)
  const userId = session?.user.id

  useEffect(() => {
    if (!supabase || session === null || session === undefined || !userId) return
    let cancelled = false
    void Promise.resolve(supabase.rpc('is_owner'))
      .then(
        (res) => resolveOwner(userId, res),
        () => resolveOwner(userId, null),
      )
      .then((owner) => {
        if (!cancelled) setAnswer({ userId, owner })
      })
    return () => {
      cancelled = true
    }
  }, [session, userId])

  if (!supabase || session === null) return false
  if (session === undefined || !userId) return undefined
  if (answer?.userId === userId) return answer.owner
  return readCachedOwner(userId)
}
