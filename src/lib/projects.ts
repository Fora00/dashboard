// Project registry — the dashboard home renders this list.
// To add a new project: add an entry here, create src/projects/<id>/,
// and register its route in App.tsx.

import type { AreaId } from './areas'

// Content column width from lg (1024px) up; below lg every page is the same
// single max-w-3xl column. narrow = max-w-3xl centred (capture pages used
// one-handed), wide = up to max-w-6xl (dense / reading pages). See navModel.ts.
export type ProjectLayout = 'narrow' | 'wide'

export interface ProjectMeta {
  id: string
  name: string
  // Plain-text fallback (share messages, unknown icon name).
  emoji: string
  // Home section; see areas.ts.
  area: AreaId
  // Lucide icon name; must exist in components/projectIcons.ts.
  icon: string
  // Sub-colour dot on the icon tile (hex).
  color: string
  description: string
  path: string
  status: 'live' | 'planned'
  // Shown on the home grid only to the signed-in owner.
  ownerOnly?: boolean
  // Public: local-only public data, usable by anyone with the plain link — no
  // login, no invite. Never offered as a grantable project on /sharing.
  public?: boolean
  // Content width at lg+ (see ProjectLayout). Omitted = 'narrow'.
  layout?: ProjectLayout
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
    area: 'utility',
    icon: 'folder-sync',
    color: '#0ea5e9',
    description: 'Stash files on this device, offline. Share or sync when online.',
    path: '/local-transfer',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'shop-list',
    name: 'Shop List',
    emoji: '🛒',
    area: 'casa',
    icon: 'shopping-cart',
    color: '#f59e0b',
    description: 'Groceries todo list, sharable with whitelisted guests.',
    path: '/shop-list',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'todo',
    name: 'Todo',
    emoji: '📝',
    area: 'organizzazione',
    icon: 'list-checks',
    color: '#0ea5e9',
    description: 'Generic todo list. Works offline, syncs when signed in.',
    path: '/todo',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'climbing',
    name: 'Climbing',
    emoji: '🧗',
    area: 'sport',
    icon: 'mountain-snow',
    color: '#e11d48',
    description: 'Track climbing sessions, sends and grade progress.',
    path: '/climbing',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'habits',
    name: 'Habits',
    emoji: '✅',
    area: 'organizzazione',
    icon: 'flame',
    color: '#22c55e',
    description: 'Daily habit tracker with streaks. Works offline, syncs when signed in.',
    path: '/habits',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'book-ideas',
    name: 'Book Ideas',
    emoji: '📖',
    area: 'svago',
    icon: 'book-open',
    color: '#6366f1',
    description: 'Capture writing ideas for books, with room for notes.',
    path: '/book-ideas',
    status: 'live',
    layout: 'wide',
  },
  {
    id: 'boardgame-ideas',
    name: 'Boardgame Ideas',
    emoji: '🎲',
    area: 'svago',
    icon: 'dice-5',
    color: '#ef4444',
    description: 'Capture board game design ideas, with room for notes.',
    path: '/boardgame-ideas',
    status: 'live',
    layout: 'wide',
  },
  {
    id: 'links',
    name: 'Links',
    emoji: '🔗',
    area: 'utility',
    icon: 'link',
    color: '#3b82f6',
    description: 'Save links to read later, shared with whitelisted guests.',
    path: '/links',
    status: 'live',
    layout: 'wide',
  },
  {
    id: 'trips',
    name: 'Trips',
    emoji: '✈️',
    area: 'sport',
    icon: 'plane',
    color: '#3b82f6',
    description: 'Travel ideas — solo or with friends',
    path: '/trips',
    status: 'live',
    layout: 'wide',
  },
  {
    id: 'events',
    name: 'Events',
    emoji: '📍',
    area: 'sport',
    icon: 'map-pin',
    color: '#f59e0b',
    description: 'Public events around Trentino, Bolzano and Verona, tagged by interest.',
    path: '/events',
    status: 'live',
    layout: 'wide',
    public: true,
  },
  {
    id: 'meal-diary',
    name: 'Meal Diary',
    emoji: '🍽️',
    area: 'casa',
    icon: 'apple',
    color: '#ef4444',
    description: 'What you ate, day by day. Synced across your devices. Owner only.',
    path: '/meal-diary',
    status: 'live',
    layout: 'wide',
    ownerOnly: true,
  },
  {
    id: 'life',
    name: 'Life',
    emoji: '🧭',
    area: 'organizzazione',
    icon: 'compass',
    color: '#a855f7',
    description: 'This week: focus, trackers, Sunday check. Owner only.',
    path: '/life',
    status: 'live',
    layout: 'wide',
    ownerOnly: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    emoji: '⚙️',
    area: 'utility',
    icon: 'settings',
    color: '#475569',
    description: 'Storage, sync status and device data.',
    path: '/settings',
    status: 'live',
    layout: 'narrow',
  },
  {
    id: 'sharing',
    name: 'Sharing',
    emoji: '👥',
    area: 'utility',
    icon: 'share-2',
    color: '#14b8a6',
    description: 'Invite guests by email and choose which projects they can use.',
    path: '/sharing',
    status: 'live',
    layout: 'wide',
    ownerOnly: true,
  },
]
