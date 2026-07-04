import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './sync'

/** Current Supabase session (null = signed out, undefined = still loading). */
export function useAuth(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(
    supabase ? undefined : null,
  )

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return session
}
