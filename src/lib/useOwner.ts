import { useEffect, useState } from 'react'
import { supabase } from './sync'
import { useAuth } from './useAuth'

/** Whether the signed-in user is the dashboard owner (undefined = loading). */
export function useOwner(): boolean | undefined {
  const session = useAuth()
  const [owner, setOwner] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (!supabase || session === null) {
      setOwner(false)
      return
    }
    if (session === undefined) return
    let cancelled = false
    void supabase.rpc('is_owner').then(({ data }) => {
      if (!cancelled) setOwner(Boolean(data))
    })
    return () => {
      cancelled = true
    }
  }, [session])

  return owner
}
