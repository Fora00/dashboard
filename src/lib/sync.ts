import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Cloud sync layer (Supabase).
//
// - Auth: email OTP (6-digit code), restricted to a whitelist of emails
//   enforced server-side (see supabase/migrations). The code flow is used
//   instead of magic links because on iOS a link opens Safari, not the
//   installed PWA, so the session would land in the wrong context.
// - The app always works fully offline against IndexedDB; signing in only
//   adds sync on top (see shopSync.ts).
//
// Config comes from .env.local (dev) / repo Actions secrets (Pages build):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const syncEnabled = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient<Database> | null = syncEnabled
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null

/** Email a 6-digit sign-in code. Fails if the email isn't whitelisted. */
export async function requestLoginCode(email: string): Promise<void> {
  if (!supabase) throw new Error('Sync is not configured')
  const { error } = await supabase.auth.signInWithOtp({ email })
  if (error) {
    // The whitelist trigger rejects the user insert with an opaque error.
    if (/database error/i.test(error.message)) {
      throw new Error("This email isn't invited to this dashboard.")
    }
    throw error
  }
}

/** Complete sign-in with the emailed code. */
export async function verifyLoginCode(email: string, code: string): Promise<void> {
  if (!supabase) throw new Error('Sync is not configured')
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code.trim(),
    type: 'email',
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut()
}
