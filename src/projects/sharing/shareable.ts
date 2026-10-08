import { isInvitable, projects } from '../../lib/projects'

// Generic project chips (project_members) and per-project invite links. Shop
// List is handled separately via area membership; public projects (events)
// need no grant at all and get a plain link instead; settings is device-only.
// isInvitable() mirrors public.shareable_projects in SQL.
export const shareable = projects.filter(isInvitable)
export const publicProjects = projects.filter((p) => p.public && p.status === 'live')
