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
    description: 'Generic todo list. Local-only on this device for now.',
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
    description: 'Daily habit tracker with streaks. Local-only on this device.',
    path: '/habits',
    status: 'live',
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
