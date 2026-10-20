import { describe, expect, it } from 'vitest'
import { parsePage, toEvents } from './mymovies.ts'

// Shortened from the real city pages (2026-10-20).
const hall = (city: string, hallId: string, name: string, filmId: string, times: string[], film: string) => `
<strong>OGGI  A ${city}</strong>
<a class="link-19" href="https://www.mymovies.it/cinema/trento/${city.toLowerCase()}/${hallId}/" title="Programmazione del cinema ${name} di ${city}">x</a>
<i onclick="GetMappa(${hallId}, ${filmId});">m</i>
${times.map((t) => `<span class="mm-medium mm-weight-700">${t}</span><br />`).join('\n')}
<a href="${film}" title="Recensione del film Qualcosa">Recensione</a>`

const PAGE = `<div><a href="//www.mymovies.it/cinema/trento/provincia/?f=1">Primetime</a>
<a href="//www.mymovies.it/cinema/trento/provincia/?f=1">Primetime</a></div>
${hall('TRENTO (TRENTO)', '5571', 'Multisala Modena', '1', ['19:00', '21:30'], 'https://www.mymovies.it/film/2026/primetime/')}
${hall('TRENTO (TRENTO)', '24454', 'HarpoLab', '2', ['18:00'], 'https://www.mymovies.it/film/2023/frammenti/')}
${hall('PERGINE VALSUGANA (TRENTO)', '21554', 'Teatro Comunale di Pergine', '3', ['20:30'], 'https://www.mymovies.it/film/2026/amarga/').replace('Recensione del film Qualcosa', 'Recensione del film Amarga Navidad')}`

describe('mymovies parsePage', () => {
  const s = parsePage(PAGE)
  it('reads one entry per film and hall', () => {
    expect(s.map((x) => [x.city, x.hall, x.title, x.times])).toEqual([
      ['Trento', 'Multisala Modena', 'Primetime', ['19:00', '21:30']],
      ['Trento', 'HarpoLab', 'Qualcosa', ['18:00']],
      ['Pergine Valsugana', 'Teatro Comunale di Pergine', 'Amarga Navidad', ['20:30']],
    ])
  })
  it('keeps the film page url', () => {
    expect(s[0]?.url).toBe('https://www.mymovies.it/film/2026/primetime/')
  })
  it('returns nothing for a page without programme', () => {
    expect(parsePage('<html>manutenzione</html>')).toEqual([])
  })
})

describe('mymovies toEvents', () => {
  it('makes one event per time, dated today, with a unique id', () => {
    const ev = toEvents(parsePage(PAGE), '2026-10-20')
    expect(ev).toHaveLength(4)
    expect(ev[0]).toMatchObject({
      title: 'Primetime',
      venue: 'Multisala Modena',
      city: 'Trento',
      categoryHint: 'cinema',
    })
    expect(ev[0]?.start).toBe('2026-10-20T19:00:00+02:00')
    expect(new Set(ev.map((e) => e.nativeId)).size).toBe(4)
  })
})
