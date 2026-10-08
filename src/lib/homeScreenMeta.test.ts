import { describe, expect, it } from 'vitest'
import { DEFAULT_TITLE, homeScreenMeta } from './homeScreenMeta'
import { projects } from './projects'

const BASE = '/dashboard/'

describe('homeScreenMeta', () => {
  it('uses the project tile and name on every project page', () => {
    for (const p of projects) {
      expect(homeScreenMeta(p.path, BASE)).toEqual({
        iconHref: `/dashboard/icons/projects/${p.id}.png`,
        title: p.name,
      })
    }
  })

  it('every project has its tile in public/icons/projects', () => {
    const files = Object.keys(import.meta.glob('../../public/icons/projects/*.png'))
    for (const p of projects) {
      expect(files, p.id).toContain(`../../public/icons/projects/${p.id}.png`)
    }
  })

  it('keeps the project on its sub-pages', () => {
    expect(homeScreenMeta('/life/import', BASE)).toEqual({
      iconHref: '/dashboard/icons/projects/life.png',
      title: 'Life',
    })
  })

  it('restores the app icon and name on Home and non-project routes', () => {
    const app = { iconHref: '/dashboard/icons/apple-touch-icon.png', title: DEFAULT_TITLE }
    expect(homeScreenMeta('/', BASE)).toEqual(app)
    expect(homeScreenMeta('/join/p/abc', BASE)).toEqual(app)
    expect(homeScreenMeta('/join/xyz', BASE)).toEqual(app)
    expect(DEFAULT_TITLE).toBe('Dashboard')
  })

  it('respects the base url', () => {
    expect(homeScreenMeta('/todo', '/').iconHref).toBe('/icons/projects/todo.png')
  })
})
