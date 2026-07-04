// Cloud sync layer (Supabase) — NOT WIRED YET, see ROADMAP.md.
//
// Design:
// - Auth: magic-link login, restricted to a whitelist of emails.
//   The owner can whitelist guest emails per project (e.g. share shop-list
//   with one other person) via a `project_members` table + RLS policies.
// - local-transfer: files upload to Supabase Storage when online; the app
//   keeps working fully offline against IndexedDB and syncs on reconnect.
// - shop-list: items sync through a Postgres table with realtime updates.
//
// To enable, create a Supabase project and add to a `.env.local` file:
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const syncEnabled = Boolean(supabaseUrl && supabaseAnonKey)
