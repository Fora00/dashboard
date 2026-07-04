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
]
