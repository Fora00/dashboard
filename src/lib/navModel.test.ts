import { describe, expect, it } from 'vitest'
import { activeProjectId, contentWidthClass, isHomePath, layoutForPath, navSections } from './navModel'
import { projects } from './projects'

const byId = (id: string) => projects.find((p) => p.id === id)!

describe('navSections', () => {
  it('puts starred first, then areas in areas.ts order, registry order inside', () => {
    const visible = ['todo', 'events', 'links', 'habits', 'settings'].map(byId)
    const s = navSections(visible, (id) => id === 'events')
    expect(s.map((x) => x.id)).toEqual(['starred', 'utility', 'organizzazione'])
    expect(s[0]?.projects.map((p) => p.id)).toEqual(['events'])
    expect(s[1]?.projects.map((p) => p.id)).toEqual(['links', 'settings'])
    expect(s[2]?.projects.map((p) => p.id)).toEqual(['todo', 'habits'])
  })

  it('shows nothing for an empty list', () => {
    expect(navSections([], () => false)).toEqual([])
  })
})

describe('activeProjectId', () => {
  it('matches a project route and its sub-pages', () => {
    expect(activeProjectId('/climbing')).toBe('climbing')
    expect(activeProjectId('/life/edit')).toBe('life')
  })

  it('is null on Home, join pages and unknown routes, and never prefix-matches a longer name', () => {
    expect(activeProjectId('/')).toBeNull()
    expect(activeProjectId('/join/p/abc')).toBeNull()
    expect(activeProjectId('/nope')).toBeNull()
    expect(activeProjectId('/todos')).toBeNull()
  })
})

describe('isHomePath', () => {
  it('is true only for the root', () => {
    expect(isHomePath('/')).toBe(true)
    expect(isHomePath('/todo')).toBe(false)
  })
})

describe('layoutForPath', () => {
  it('is wide for Home and the dense pages, including sub-pages', () => {
    for (const path of [
      '/',
      '/events',
      '/life',
      '/life/import',
      '/meal-diary',
      '/sharing',
      '/links',
      '/trips',
      '/book-ideas',
      '/boardgame-ideas',
    ])
      expect(layoutForPath(path), path).toBe('wide')
  })

  it('is narrow for capture pages, join pages and unknown routes', () => {
    for (const path of [
      '/todo',
      '/shop-list',
      '/habits',
      '/climbing',
      '/local-transfer',
      '/settings',
      '/join/xyz',
      '/join/p/xyz',
      '/nope',
    ])
      expect(layoutForPath(path), path).toBe('narrow')
  })
})

describe('contentWidthClass', () => {
  it('keeps max-w-3xl below lg for both and widens only wide pages from lg', () => {
    expect(contentWidthClass('narrow')).toContain('max-w-3xl')
    expect(contentWidthClass('narrow')).not.toContain('lg:max-w-6xl')
    expect(contentWidthClass('wide')).toContain('max-w-3xl')
    expect(contentWidthClass('wide')).toContain('lg:max-w-6xl')
  })
})
