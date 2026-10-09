import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import {
  filmEvents,
  parseDateLine,
  parseFilm,
  parseProgramme,
  parseScreenings,
  parseTimeLine,
  resolveYmd,
  supercinema,
} from './supercinema.ts'

// Shortened from the real pages (2026-10-09).
const HOME = `<h3 style="text-align: center;"><span>Film in programmazione dall&#8217; 8 AL 13 OTTOBRE</span></h3>
<article id="post-34312"><a href="https://www.supercinemarovereto.it/?p=34312"><img src="x.jpg"></a>
<h3 class="cmsmasters_post_title entry-title"><a href="https://www.supercinemarovereto.it/?p=34312">HEART OF THE BEAST &#8211; NEL PROFONDO SELVAGGIO</a></h3>
<h4 style="text-align:center;background-color:#fa6426;"></h4></article>
<article><h3 class="cmsmasters_post_title entry-title"><a href="https://www.supercinemarovereto.it/?p=34300">DIGGER</a></h3>
<h4 style="text-align:center;"></h4></article>
<h3 style="text-align: center;"><span>PROSSIMAMENTE</span></h3>
<h3 style="text-align: center;"><span>RASSEGNA FILM DI QUALITÀ </span></h3>
<article><h3 class="cmsmasters_post_title entry-title"><a href="https://www.supercinemarovereto.it/?p=34265">SANTIAGO &#8211; UN CAMMINO PER RICOMINCIARE</a></h3>
<h4 style="text-align:center;"> GIOVEDI' 15 OTTOBRE<br /> ORE 18.00 - 21.00 </h4></article>`

const FILM = `<div class="cmsmasters_column one_third"><div class="cmsmasters_img"><img decoding="async" src="https://www.supercinemarovereto.it/WP/wp-content/uploads/2026/09/PITT-217x300.jpg" /></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading"></h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">SABATO 10 OTTOBRE</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">20.40</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">DOMENICA 11 OTTOBRE</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">18.15</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">20.30</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">LUNEDI&#8217; 12 OTTOBRE</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">18.15</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">Genere: Avventura, Thriller</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">Paese: USA</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">Anno: 2026</h3></div>
<div class="cmsmasters_heading_wrap"><h3 class="cmsmasters_heading">Durata: 101&#8242;</h3></div>
</div>
<div class="cmsmasters_column two_third">
<div class="cmsmasters_heading_wrap"><h1 class="cmsmasters_heading">HEART OF THE BEAST &#8211; NEL PROFONDO SELVAGGIO</h1></div>
<div class="cmsmasters_text">
<p><span><strong>HEART OF THE BEAST &#8211; NEL PROFONDO SELVAGGIO </strong>diretto da David Ayer, segue l&#8217;ufficiale James Belmont, disperso nelle gelide terre dell&#8217;Alaska.</span><br />
<span>Per trovare una via di salvezza, James e Odino dovranno affidarsi al coraggio.</span></p>
<p><span><strong>Regia</strong>: David Ayer</span></p>
<p><span><strong>Attori</strong>: Brad Pitt, J.K. Simmons</span></p>
<p>&nbsp;</p>
</div>
<div id="x" class="button_wrap"><a href="https://www.webtic.it/">PRENOTA</a></div>
</div>`

const SERIES = `<h3 class="cmsmasters_heading"></h3><h3 class="cmsmasters_heading">GIOVEDI&#8217; 15 OTTOBRE</h3>
<h3 class="cmsmasters_heading">18.00 &#8211; 21.00</h3><h3 class="cmsmasters_heading">Durata: 102&#8242;</h3>
<h1 class="cmsmasters_heading">SANTIAGO – UN CAMMINO PER RICOMINCIARE </h1>
<div class="cmsmasters_text"><p>Un film diretto da Yann Samuell.</p></div><div class="button_wrap"></div>`

const TODAY = '2026-10-09'
const entry = { id: '34312', url: 'https://www.supercinemarovereto.it/?p=34312', title: 'x', note: '' }

describe('supercinema line parsers', () => {
  it('reads Italian date lines with a typographic apostrophe', () => {
    expect(parseDateLine('SABATO 10 OTTOBRE')).toEqual([10, 9])
    expect(parseDateLine('LUNEDI’ 12 OTTOBRE')).toEqual([12, 9])
    expect(parseDateLine("GIOVEDI' 1 DICEMBRE")).toEqual([1, 11])
    expect(parseDateLine('Genere: Avventura')).toBeNull()
    expect(parseDateLine('Durata: 101′')).toBeNull()
  })
  it('reads dotted times, one or two per line', () => {
    expect(parseTimeLine('20.40')).toEqual(['20:40'])
    expect(parseTimeLine('18.00 – 21.00')).toEqual(['18:00', '21:00'])
    expect(parseTimeLine('ORE 18.00 - 21.00')).toEqual(['18:00', '21:00'])
    expect(parseTimeLine('Anno: 2026')).toBeNull()
    expect(parseTimeLine('25.00')).toBeNull()
  })
  it('rolls the year over around New Year', () => {
    expect(resolveYmd(10, 9, '2026-10-09')).toBe('2026-10-10')
    expect(resolveYmd(2, 0, '2026-12-28')).toBe('2027-01-02')
    expect(resolveYmd(30, 11, '2027-01-02')).toBe('2026-12-30')
    expect(resolveYmd(31, 10, '2026-10-09')).toBeNull() // 31 November
  })
  it('attaches every time to the date line before it', () => {
    expect(
      parseScreenings(['SABATO 10 OTTOBRE', '20.40', 'DOMENICA 11 OTTOBRE', '18.15', '20.30', '21.00'], TODAY),
    ).toEqual([
      { date: '2026-10-10', time: '20:40' },
      { date: '2026-10-11', time: '18:15' },
      { date: '2026-10-11', time: '20:30' },
      { date: '2026-10-11', time: '21:00' },
    ])
    expect(parseScreenings(['20.40'], TODAY)).toEqual([]) // a time without a date is ignored
  })
})

describe('supercinema home and film pages', () => {
  it('lists films in page order, with the series note', () => {
    const p = parseProgramme(HOME)
    expect(p.map((x) => x.id)).toEqual(['34312', '34300', '34265'])
    expect(p[0]?.title).toBe('HEART OF THE BEAST – NEL PROFONDO SELVAGGIO')
    expect(p[2]?.note).toBe("GIOVEDI' 15 OTTOBRE ORE 18.00 - 21.00")
  })
  it('makes one event per screening with end from Durata and the offset of the day', () => {
    const film = parseFilm(FILM)
    expect(film).toMatchObject({ genre: 'Avventura, Thriller', year: '2026', minutes: 101, director: 'David Ayer' })
    const ev = filmEvents(entry, film!, TODAY)
    expect(ev.map((e) => e.nativeId)).toEqual([
      '34312-2026-10-10-2040',
      '34312-2026-10-11-1815',
      '34312-2026-10-11-2030',
      '34312-2026-10-12-1815',
    ])
    expect(ev[0]).toMatchObject({
      title: 'Heart of the Beast – Nel Profondo Selvaggio',
      start: '2026-10-10T20:40:00+02:00',
      end: '2026-10-10T22:21:00+02:00',
      allDay: false,
      venue: 'Supercinema',
      city: 'Rovereto',
      categoryHint: 'cinema',
      url: entry.url,
      image: 'https://www.supercinemarovereto.it/WP/wp-content/uploads/2026/09/PITT-217x300.jpg',
    })
    expect(ev[0]?.description).toContain('Avventura, Thriller · 2026 · 101 min · regia di David Ayer')
    expect(ev[0]?.description).toContain('ufficiale James Belmont')
    expect(ev[0]?.description).not.toContain('Attori')
  })
  it('uses the right offset across the DST change', () => {
    const film = parseFilm(FILM)!
    const ev = filmEvents(entry, film, '2026-10-25')
    // 10 OTTOBRE read on 25 Oct is still this year (closest), CET/CEST depends on the date
    expect(ev[0]?.start).toBe('2026-10-10T20:40:00+02:00')
  })
  it('handles a series entry with two times on one line', () => {
    const film = parseFilm(SERIES)!
    const ev = filmEvents({ id: '34265', url: 'u', title: 's', note: '' }, film, TODAY)
    expect(ev.map((e) => [e.start, e.end])).toEqual([
      ['2026-10-15T18:00:00+02:00', '2026-10-15T19:42:00+02:00'],
      ['2026-10-15T21:00:00+02:00', '2026-10-15T22:42:00+02:00'],
    ])
  })
  it('falls back to the home note when the film page lists no date', () => {
    const film = parseFilm('<h1 class="cmsmasters_heading">Serpenti</h1><div class="cmsmasters_text"><p>x</p></div>')!
    const ev = filmEvents({ id: '1', url: 'u', title: 's', note: "GIOVEDI' 22 OTTOBRE ORE 18.00 - 21.00" }, film, TODAY)
    expect(ev.map((e) => e.start)).toEqual(['2026-10-22T18:00:00+02:00', '2026-10-22T21:00:00+02:00'])
  })
  it('gives nothing for an unparseable page', () => {
    expect(parseFilm('<html><body>Manutenzione</body></html>')).toBeNull()
    expect(parseProgramme('<html><body>Manutenzione</body></html>')).toEqual([])
  })
})

describe('supercinema run', () => {
  const mk = (pages: Record<string, string>, urls: string[] = []): AdapterContext =>
    ({
      now: Date.parse('2026-10-09T10:00:00Z'),
      horizonDays: 90,
      fetchText: async (url: string) => {
        urls.push(url)
        const text = pages[url]
        if (text === undefined) throw new Error('404')
        return { status: 200, url, text }
      },
    }) as unknown as AdapterContext

  it('fetches the home and each film once, skipping a failing page', async () => {
    const urls: string[] = []
    const out = await supercinema.run(
      mk(
        {
          'https://www.supercinemarovereto.it/': HOME,
          'https://www.supercinemarovereto.it/?p=34312': FILM,
          'https://www.supercinemarovereto.it/?p=34265': SERIES,
        },
        urls,
      ),
    )
    expect(urls).toHaveLength(4) // home + 3 films (34300 fails)
    expect(out).toHaveLength(6)
  })
  it('throws a clear error when the markup changed, so previous events are kept', async () => {
    await expect(
      supercinema.run(mk({ 'https://www.supercinemarovereto.it/': '<html>nuovo sito</html>' })),
    ).rejects.toThrow(/no film links/)
    await expect(
      supercinema.run(
        mk({
          'https://www.supercinemarovereto.it/': HOME,
          'https://www.supercinemarovereto.it/?p=34312': '<html>x</html>',
          'https://www.supercinemarovereto.it/?p=34300': '<html>x</html>',
          'https://www.supercinemarovereto.it/?p=34265': '<html>x</html>',
        }),
      ),
    ).rejects.toThrow(/no screening parsed/)
  })
})
