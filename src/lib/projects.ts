// Project registry — the dashboard home renders this list.
// To add a new project: add an entry here, create src/projects/<id>/,
// and register its route in App.tsx.

export interface ProjectMeta {
  id: string
  name: string
  emoji: string
  description: string
  path: string
  status: 'live' | 'planned'
  // Shown on the home grid only to the signed-in owner.
  ownerOnly?: boolean
  // Public: local-only public data, usable by anyone with the plain link — no
  // login, no invite. Never offered as a grantable project on /sharing.
  public?: boolean
}

// Projects that are never granted through project_members, for reasons the
// flags above don't capture. shop-list is gated per area (shop_area_members,
// its own invite links in the list); settings is device-only.
const NOT_INVITABLE = new Set(['shop-list', 'settings'])

// Whether /sharing can grant this project to a guest and it can have a
// per-project invite link (#/join/p/<token>). MUST match the seeded rows of
// public.shareable_projects (supabase/migrations/20260930150000_project_invites.sql);
// a new synced project inserts its own row there (docs/NEW_PROJECT.md step 5).
export function isInvitable(p: ProjectMeta): boolean {
  return p.status === 'live' && !p.ownerOnly && !p.public && !NOT_INVITABLE.has(p.id)
}

export const projects: ProjectMeta[] = [
  {
    id: 'local-transfer',
    name: 'Local Transfer',
    emoji: '📁',
    description: 'Stash files on this device, offline. Share or sync when online.',
    path: '/local-transfer',
    status: 'live',
  },
  {
    id: 'shop-list',
    name: 'Shop List',
    emoji: '🛒',
    description: 'Groceries todo list, sharable with whitelisted guests.',
    path: '/shop-list',
    status: 'live',
  },
  {
    id: 'todo',
    name: 'Todo',
    emoji: '📝',
    description: 'Generic todo list. Works offline, syncs when signed in.',
    path: '/todo',
    status: 'live',
  },
  {
    id: 'climbing',
    name: 'Climbing',
    emoji: '🧗',
    description: 'Track climbing sessions, sends and grade progress.',
    path: '/climbing',
    status: 'live',
  },
  {
    id: 'habits',
    name: 'Habits',
    emoji: '✅',
    description: 'Daily habit tracker with streaks. Works offline, syncs when signed in.',
    path: '/habits',
    status: 'live',
  },
  {
    id: 'book-ideas',
    name: 'Book Ideas',
    emoji: '📖',
    description: 'Capture writing ideas for books, with room for notes.',
    path: '/book-ideas',
    status: 'live',
  },
  {
    id: 'boardgame-ideas',
    name: 'Boardgame Ideas',
    emoji: '🎲',
    description: 'Capture board game design ideas, with room for notes.',
    path: '/boardgame-ideas',
    status: 'live',
  },
  {
    id: 'links',
    name: 'Links',
    emoji: '🔗',
    description: 'Save links to read later, shared with whitelisted guests.',
    path: '/links',
    status: 'live',
  },
  {
    id: 'trips',
    name: 'Trips',
    emoji: '✈️',
    description: 'Travel ideas — solo or with friends',
    path: '/trips',
    status: 'live',
  },
  {
    id: 'events',
    name: 'Events',
    emoji: '📍',
    description: 'Public events around Trentino, Bolzano and Verona, tagged by interest.',
    path: '/events',
    status: 'live',
    public: true,
  },
  {
    id: 'meal-diary',
    name: 'Meal Diary',
    emoji: '🍽️',
    description: 'What you ate, day by day. Synced across your devices. Owner only.',
    path: '/meal-diary',
    status: 'live',
    ownerOnly: true,
  },
  {
    id: 'life',
    name: 'Life',
    emoji: '🧭',
    description: 'This week: focus, trackers, Sunday check. Owner only.',
    path: '/life',
    status: 'live',
    ownerOnly: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    emoji: '⚙️',
    description: 'Storage, sync status and device data.',
    path: '/settings',
    status: 'live',
  },
  {
    id: 'sharing',
    name: 'Sharing',
    emoji: '👥',
    description: 'Invite guests by email and choose which projects they can use.',
    path: '/sharing',
    status: 'live',
    ownerOnly: true,
  },
]
