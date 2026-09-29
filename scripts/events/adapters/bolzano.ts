// Bolzano via the Open Data Hub tourism API (public, CC0 event data;
// robots.txt 404 = allowed). Filtered server-side to the Bolzano
// municipality and the crawl window. Each item lists its dates in
// `EventDate` (From/To dates + Begin/End local times); every date inside the
// window becomes one occurrence. Items with hundreds of dates (museum
// tickets, courses) are folded into one span by the orchestrator.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { addDays, localToIso, dateToIso, romeDate } from '../time.ts'
import { absUrl, firstNonEmpty } from '../text.ts'

const API = 'https://tourism.api.opendatahub.com/v1/Event'
const BOLZANO_MUNICIPALITY = '50FCFD4334A04DB087C1FD10ED864018'
const PAGE_SIZE = 200

interface Detail { Title?: string; BaseText?: string; IntroText?: string }
interface EventDate { From?: string; To?: string; Begin?: string; End?: string; Cancelled?: string; IsCancelled?: boolean }
interface OdhEvent {
  Id: string
  Shortname?: string
  Detail?: Record<string, Detail>
  EventDate?: EventDate[]
  EventUrls?: { Url?: Record<string, string>; Type?: string }[]
  ContactInfos?: Record<string, { CompanyName?: string; City?: string }>
  EventAdditionalInfos?: Record<string, { Location?: string; Mplace?: string }>
  Topics?: { TopicInfo?: string }[]
  ImageGallery?: { ImageUrl?: string }[]
  LocationInfo?: { MunicipalityInfo?: { Name?: Record<string, string> } }
}
interface OdhPage { TotalPages?: number; Items?: OdhEvent[] }

function time(t: string | undefined): string | null {
  return t && /^\d{2}:\d{2}/.test(t) && !t.startsWith('00:00') ? t.slice(0, 5) : null
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const until = addDays(today, ctx.horizonDays)
  const out: RawEvent[] = []
  for (let page = 1; page <= 10; page++) {
    const url = `${API}?pagesize=${PAGE_SIZE}&pagenumber=${page}&begindate=${today}&enddate=${until}` +
      `&locfilter=mun${BOLZANO_MUNICIPALITY}&active=true&removenullvalues=true`
    const res = await ctx.fetchJson<OdhPage>(url)
    for (const ev of res.Items ?? []) {
      const title = firstNonEmpty(ev.Detail?.it?.Title, ev.Detail?.de?.Title, ev.Detail?.en?.Title, ev.Shortname).trim()
      if (!title) continue
      // Italian first; many Bolzano items only have German text.
      const description = firstNonEmpty(ev.Detail?.it?.BaseText, ev.Detail?.de?.BaseText, ev.Detail?.en?.BaseText)
      const summary = firstNonEmpty(ev.Detail?.it?.IntroText, ev.Detail?.de?.IntroText, ev.Detail?.en?.IntroText)
      const image = absUrl(ev.ImageGallery?.find((g) => g.ImageUrl)?.ImageUrl, 'https://tourism.api.opendatahub.com/')
      const booking = ev.EventUrls?.find((u) => u.Url)?.Url
      const link = booking?.it ?? booking?.de ?? `https://mysuedtirol.info/it/eventi?eventid=${ev.Id}`
      const venue = firstNonEmpty(
        ev.EventAdditionalInfos?.it?.Location, ev.EventAdditionalInfos?.it?.Mplace, ev.ContactInfos?.it?.CompanyName,
      ).trim() || null
      const city = ev.LocationInfo?.MunicipalityInfo?.Name?.it ?? 'Bolzano'
      const tagText = [ev.Detail?.de?.Title, ev.Detail?.en?.Title, ...(ev.Topics ?? []).map((t) => t.TopicInfo)]
        .filter(Boolean).join(' · ')
      for (const d of ev.EventDate ?? []) {
        if (d.IsCancelled || d.Cancelled === '1') continue
        const from = d.From?.slice(0, 10)
        if (!from || from > until) continue
        const to = d.To?.slice(0, 10) || from
        if (to < addDays(today, -1)) continue
        const begin = time(d.Begin)
        const endT = time(d.End)
        const allDay = !begin
        const start = allDay ? dateToIso(from) : localToIso(from, begin ?? '00:00')
        const end = allDay ? dateToIso(to < from ? from : to) : endT ? localToIso(to, endT) : null
        out.push({
          nativeId: `${ev.Id}@${start}`,
          seriesKey: ev.Id,
          title,
          start,
          end,
          allDay,
          venue,
          city,
          url: link,
          description: description || summary,
          summary,
          image,
          tagText,
        })
      }
    }
    if (page >= (res.TotalPages ?? 1)) break
  }
  return out
}

export const bolzano: Adapter = {
  id: 'bolzano',
  name: 'Bolzano (Open Data Hub)',
  defaultCategory: 'other',
  run,
}
