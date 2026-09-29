// Mart (Rovereto) + Casa d'Arte Futurista Depero + Galleria Civica Trento.
// The Next.js site renders /mostre-eventi from an Umbraco API whose URL sits
// in the page's __NEXT_DATA__ ("snippets" element, templateName
// events_search). That API lives on media.mart.tn.it (robots.txt: 404 = all
// allowed) and returns clean JSON: exhibitions with opening/closing dates and
// single events with a free-text "orario".
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { dateToIso, localToIso } from '../time.ts'
import { absUrl, htmlToText } from '../text.ts'

const API = 'https://media.mart.tn.it/umbraco/api/v1/pages/118214/children'
const SITE = 'https://www.mart.tn.it'
const MEDIA = 'https://media.mart.tn.it/'

interface MartItem {
  id?: number
  titolo?: string
  descrizioneRidotta?: string
  descrizioneEstesa?: string
  immagini?: { url?: { full?: string } }[]
  sede?: string
  altraSede?: string
  dataDiApertura?: string
  dataDiChiusura?: string
  orario?: string
  tipologia?: string
  url?: string
}

interface MartPage {
  contents?: MartItem[]
  pagination?: { offset?: number; limit?: number; total?: number }
}

const SEDE_CITY: [RegExp, string][] = [
  [/galleria civica|albere|trento/i, 'Trento'],
  [/online/i, 'Online'],
]

const TYPE_CATEGORY: Record<string, CategoryId> = {
  Mostra: 'exhibitions',
  'Visita guidata': 'exhibitions',
  Incontro: 'talks',
  Cinema: 'cinema',
  Musica: 'concerts',
}

/** "15.00 - 16.30", "17.30", "11.15- 12.15" → start/end; anything else → null. */
function parseOrario(orario: string | undefined): { start: string; end: string | null } | null {
  const m = orario?.trim().match(/^(\d{1,2})[.:](\d{2})(?:\s*[-–]\s*(\d{1,2})[.:](\d{2}))?$/)
  if (!m) return null
  return { start: `${m[1]}:${m[2]}`, end: m[3] ? `${m[3]}:${m[4]}` : null }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const out: RawEvent[] = []
  for (let offset = 0; offset < 1000; ) {
    const page = await ctx.fetchJson<MartPage>(
      `${API}?filter%5Bsearch%5D=prossimieventi&offset=${offset}`,
    )
    const items = page.contents ?? []
    for (const it of items) {
      const open = it.dataDiApertura?.slice(0, 10)
      if (!open || !it.titolo || !it.url) continue
      const close = it.dataDiChiusura?.slice(0, 10) || null
      const time = close === open || !close ? parseOrario(it.orario) : null
      const sede = it.sede?.trim() || null
      out.push({
        nativeId: String(it.id ?? it.url),
        title: htmlToText(it.titolo),
        start: time ? localToIso(open, time.start) : dateToIso(open),
        end: time ? (time.end ? localToIso(open, time.end) : null) : close ? dateToIso(close) : null,
        allDay: !time,
        venue: sede,
        city: SEDE_CITY.find(([re]) => sede && re.test(sede))?.[1] ?? 'Rovereto',
        url: `${SITE}${it.url}`,
        description: it.descrizioneEstesa || it.descrizioneRidotta || '',
        summary: htmlToText(it.descrizioneRidotta),
        image: absUrl(it.immagini?.[0]?.url?.full, MEDIA),
        ...(it.tipologia && TYPE_CATEGORY[it.tipologia] ? { categoryHint: TYPE_CATEGORY[it.tipologia] } : {}),
        tagText: it.tipologia ?? '',
      })
    }
    const total = page.pagination?.total ?? 0
    const limit = page.pagination?.limit ?? items.length
    offset += limit
    if (!items.length || offset >= total) break
  }
  return out
}

export const mart: Adapter = {
  id: 'mart',
  name: 'Mart',
  defaultCategory: 'other',
  run,
}
