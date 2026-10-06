// Bassano del Grappa + Vicenza province (ring 2, interests only): Arteven,
// the Veneto regional theatre circuit. The Bassano city season (Teatro
// Remondini) lives only here. myarteven.it's home page inlines the WHOLE
// performance list as JSON inside an underscore.js calendar template:
//   <% rappresentazionitotal = [{"id":"…","data_rapp":"2026-10-04","orario":"17.00",
//      "ref_spettacolo":{…},"teatro_id":{"name":"TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)",…},
//      "rassegna_id":{…},"slug":"…"}, …]
// so one request a day (≈3.7 MB). robots.txt disallows only
// /risultati-ricerca and /dichiarazione-di-accessibilita (checked 2026-09-30).
//
// Kept: theatres in the Vicenza province ("(VI)": Bassano, Vicenza, Thiene,
// Schio, Cassola, Rosà…) and in Padova city; Mestre, Portogruaro, Rovigo,
// Jesolo… are outside the rings. Vicenza's Teatro Comunale (Sala Maggiore,
// Ridotto) is also on `tcvi`: the pipeline's dedup (normalised title, so
// Arteven's UPPERCASE matches TCVI's mixed case, + day + city) merges them.
//
// Not wanted: the children's rassegne (Schio "Civico da favola", Thiene
// "Domenica teatro", Portogruaro "Giovanissimi e primi passi") are tagged
// kids via tagText; weekday-morning performances (10:00, 11:00) are school
// matinées and are dropped, like CTB's.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { z } from 'zod'
import { localToIso } from '../time.ts'
import { parseList } from '../schemas.ts'
import { absUrl, htmlToText, titleCase } from '../text.ts'

const BASE = 'https://www.myarteven.it'
const MARKER = 'rappresentazionitotal = ['

// Only the fields the adapter reads; a record missing the id or with a
// wrongly typed field is skipped, a changed format fails the adapter.
const NamedSchema = z.looseObject({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
})
const SpettacoloSchema = NamedSchema.extend({
  sottotitolo: z.string().nullish(),
  compagnia_teatrale: z.string().nullish(),
  descrizione: z.string().nullish(),
  anteprima_id: z.looseObject({ mediaurl: z.string().nullish() }).nullish(),
})
const RappresentazioneSchema = z.looseObject({
  id: z.string(),
  name: z.string().optional(),
  data_rapp: z.string().optional(),
  orario: z.string().nullish(),
  slug: z.string().optional(),
  stato_web: z.boolean().optional(),
  ref_spettacolo: SpettacoloSchema.nullish(),
  teatro_id: NamedSchema.nullish(),
  rassegna_id: NamedSchema.nullish(),
})
const KIDS_RASSEGNA = /da favola|domenica teatro|giovanissimi|primi passi|ragazzi|famigli/i
/** Slice the JSON array that starts at `from` (at its "["), respecting strings. */
export function sliceJsonArray(text: string, from: number): string {
  let depth = 0
  let inString = false
  for (let i = from; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
    } else if (c === '"') inString = true
    else if (c === '[' || c === '{') depth++
    else if (c === ']' || c === '}') {
      depth--
      if (depth === 0) return text.slice(from, i + 1)
    }
  }
  throw new Error('unterminated rappresentazionitotal array')
}

/** "TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)" → venue, town, province. */
function place(name: string): { venue: string; city: string; prov: string } {
  const m = name.match(/^(.*)\s+-\s+(.*?)\s*\((\w{2})\)\s*$/)
  if (!m) return { venue: titleCase(name.trim()), city: '', prov: '' }
  return {
    venue: titleCase((m[1] ?? '').replace(/\s+/g, ' ')),
    city: titleCase(m[2] ?? ''),
    prov: (m[3] ?? '').toUpperCase(),
  }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(`${BASE}/`)
  const at = text.indexOf(MARKER)
  if (at < 0) throw new Error('rappresentazionitotal not found (markup changed?)')
  const list = parseList(RappresentazioneSchema, JSON.parse(sliceJsonArray(text, at + MARKER.length - 1)), 'arteven')
  const out: RawEvent[] = []
  for (const r of list) {
    const show = r.ref_spettacolo
    const where = place(r.teatro_id?.name ?? '')
    if (r.stato_web === false || !show?.name || !r.data_rapp) continue
    if (where.prov !== 'VI' && where.city !== 'Padova') continue
    const time = (r.orario ?? '').match(/^(\d{1,2})[.:](\d{2})/)
    const hm = time ? `${(time[1] ?? '').padStart(2, '0')}:${time[2]}` : '00:00'
    const weekday = new Date(`${r.data_rapp}T12:00:00Z`).getUTCDay()
    // School matinée: a weekday morning.
    if (time && Number(time[1]) < 12 && weekday >= 1 && weekday <= 5) continue
    const rassegna = r.rassegna_id?.name ?? ''
    const img = show.anteprima_id?.mediaurl
    out.push({
      nativeId: r.id,
      seriesKey: show.id ?? show.name,
      title: titleCase(show.name.trim()),
      start: localToIso(r.data_rapp, hm),
      end: null,
      allDay: !time,
      venue: where.venue,
      city: where.city || 'Vicenza',
      // The page's own template builds this URL.
      url:
        r.rassegna_id?.slug && show.slug && r.slug
          ? `${BASE}/rassegne/${r.rassegna_id.slug}/${show.slug}/${r.slug}`
          : `${BASE}/`,
      description: show.descrizione ?? '',
      image: img ? absUrl(encodeURI(img), BASE) : null,
      tagText: [
        titleCase(rassegna),
        htmlToText(show.sottotitolo),
        htmlToText(show.compagnia_teatrale),
        KIDS_RASSEGNA.test(rassegna) ? 'teatro ragazzi' : '',
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
  return out
}

// Every Arteven entry is a stage show: `theatre` is always the category
// (a non-'other' default wins over keywords); keywords still add tags.
export const arteven: Adapter = {
  id: 'arteven',
  name: 'Arteven — circuito teatrale (Bassano, Vicenza)',
  defaultCategory: 'theatre',
  area: 'veneto',
  ring: 'near',
  // Theatre is out of the near ring, so a quiet stretch with no concerts/talks is normal.
  // A changed markup still throws inside run().
  mayBeEmpty: true,
  maxRequests: 2,
  run,
}
