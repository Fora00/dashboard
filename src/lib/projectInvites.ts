import { syncNow as syncBoardgameIdeas } from './boardgameIdeasSync'
import { syncNow as syncBookIdeas } from './bookIdeasSync'
import { syncNow as syncClimbing } from './climbSync'
import { syncNow as syncHabits } from './habitSync'
import { syncNow as syncLinks } from './linksSync'
import { syncNow as syncTodo } from './todoSync'
import { syncNow as syncTrips } from './tripsSync'

// Per-project invite links (#/join/p/<token>). The token is the project's
// share_token in public.project_invites (owner-only; handed out by the
// project_invite_token RPC). See supabase/migrations/20260930150000_project_invites.sql.

export const APP_URL = 'https://fora00.github.io/dashboard/'

export function projectInviteUrl(token: string): string {
  return `${APP_URL}#/join/p/${token}`
}

export function projectUrl(path: string): string {
  return `${APP_URL}#${path}`
}

export { shareOrCopy } from './share'

// Engines to kick right after a guest joins a project, so the newly visible
// rows arrive without waiting for the next reconnect/foreground. The engine's
// cycle guard makes a call during an in-flight cycle a no-op, so callers
// should also retry once shortly after (see syncProjectAfterJoin).
const syncByProject: Record<string, () => Promise<void>> = {
  todo: syncTodo,
  climbing: syncClimbing,
  habits: syncHabits,
  'book-ideas': syncBookIdeas,
  'boardgame-ideas': syncBoardgameIdeas,
  links: syncLinks,
  trips: syncTrips,
  // local-transfer lists remote files when its page mounts; nothing to kick.
}

export function syncProjectAfterJoin(projectId: string): void {
  const run = syncByProject[projectId]
  if (!run) return
  void run().catch(() => {})
  // The sign-in itself starts every engine; if that first cycle raced the
  // membership insert (or was still running, making the call above a no-op),
  // this second pass picks the rows up.
  setTimeout(() => void run().catch(() => {}), 2500)
}
