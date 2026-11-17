import { describe, expect, it } from 'vitest'
import { searchCourses } from './courseSearch'
import { card, mod, prac, q } from './courses/kit'
import type { Course } from './types'

const lesson =
  '<p>Intro con perro.</p><h3>Verbi</h3><p>Il congiuntivo spagnolo.</p><div><h3>Àccenti</h3><p>La tilde.</p></div>'
const c: Course = {
  id: 'es',
  title: 'Spagnolo',
  emoji: '🇪🇸',
  summary: '',
  groups: [{ id: 'a1', label: 'A1' }],
  intro: '',
  modules: [
    mod(
      'm1',
      'Pronuncia',
      'Suoni e accento',
      'a1',
      lesson,
      [q('q1', 'Quale <b>perro</b>?', ['uno', 'due', 'tre', 'quattro'], 0, 'Perché sì.')],
      [card('c1', 'el perro', 'il cane')],
      [prac('p1', 'Scrivi', 'congiuntivo')],
    ),
  ],
}

describe('searchCourses', () => {
  it('ignores queries under 2 characters', () => {
    expect(searchCourses([c], 'p')).toEqual([])
  })

  it('ranks title, then section heading, then lesson text, then items, accent-insensitive', () => {
    expect(searchCourses([c], 'ACCENT').map((h) => [h.kind, h.section])).toEqual([
      ['module', undefined],
      ['section', 1],
    ])
    expect(searchCourses([c], 'perro').map((h) => h.kind)).toEqual(['lesson', 'quiz', 'card'])
  })

  it('points lesson hits at their section and builds a highlighted snippet', () => {
    const [h] = searchCourses([c], 'congiuntivo')
    expect(h).toMatchObject({ kind: 'lesson', label: 'Verbi', section: 0, tab: 'lesson' })
    expect(h!.snippet).toEqual({ before: 'Il ', match: 'congiuntivo', after: ' spagnolo.' })
    expect(searchCourses([c], 'congiuntivo').map((x) => x.tab)).toEqual(['lesson', 'practice'])
  })

  it('keeps a space between blocks in snippets', () => {
    const m = mod('m2', 'Altro', '', 'a1', '<p>Uno.</p><p>Due</p>', [], [], [])
    const [h] = searchCourses([{ ...c, modules: [m] }], 'due')
    expect(h!.snippet).toEqual({ before: 'Uno. ', match: 'Due', after: '' })
  })

  it('caps the number of hits', () => {
    expect(searchCourses([c, c, c], 'perro', 4)).toHaveLength(4)
  })
})
