import { describe, expect, it } from 'vitest'
import { groupByArea } from './groupByArea'
import type { ProjectMeta } from './projects'

const mk = (id: string, area: ProjectMeta['area']): ProjectMeta => ({
  id,
  name: id,
  emoji: '•',
  icon: 'link',
  color: '#000000',
  area,
  description: '',
  path: `/${id}`,
  status: 'live',
})

const list = [mk('a', 'svago'), mk('b', 'utility'), mk('c', 'svago'), mk('d', 'casa')]
const ids = (s: { projects: ProjectMeta[] } | undefined) => (s?.projects ?? []).map((p) => p.id)

describe('groupByArea', () => {
  it('groups by area in area order and keeps input order inside', () => {
    const s = groupByArea(list, () => false)
    expect(s.map((x) => x.id)).toEqual(['utility', 'casa', 'svago'])
    expect(ids(s[2])).toEqual(['a', 'c'])
  })

  it('puts starred projects in a Starred section on top, not repeated below', () => {
    const s = groupByArea(list, (id) => id === 'c')
    expect(s[0]?.id).toBe('starred')
    expect(ids(s[0])).toEqual(['c'])
    expect(ids(s.find((x) => x.id === 'svago')!)).toEqual(['a'])
  })

  it('omits empty sections (e.g. a hidden-out area or no stars)', () => {
    const s = groupByArea([mk('x', 'sport')], () => false)
    expect(s).toHaveLength(1)
    expect(s[0]?.id).toBe('sport')
    expect(groupByArea([], () => false)).toEqual([])
  })

  it('preserves a reversed/sorted input order', () => {
    const s = groupByArea([...list].reverse(), () => false)
    expect(ids(s.find((x) => x.id === 'svago')!)).toEqual(['c', 'a'])
  })
})
