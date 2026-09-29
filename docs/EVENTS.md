# Events crawler and `events.json`

Project 12, phase 1. A zero-dependency Node script (`scripts/events/`) crawls
public event sources in Trentino, Bolzano and Verona and writes
`public/events.json`. The deploy workflow runs it daily before the build, so
the file ships with the site:

- deployed: `https://fora00.github.io/dashboard/events.json`
- build output: `dist/events.json` (after `npm run events:crawl && npm run build`)

The file is a build artifact (gitignored). It is public data only: no
personal data, no auth, no Supabase.

## The schema (schemaVersion 1)

**Stability promise:** within `schemaVersion: 1` changes are additive only
(new fields, new category ids, new sources). No field is renamed, removed or
changes type or meaning. Consumers must ignore unknown fields and treat an
unknown `category`/`tags` value like `other`. A breaking change bumps
`schemaVersion`.

```jsonc
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-29T13:25:00.858Z", // UTC, when the crawl ran
  "sources": [ /* SourceStatus, in run order */ ],
  "events": [ /* Event, sorted by start, then title, then id */ ]
}
```

### SourceStatus

| field | type | meaning |
|---|---|---|
| `id` | string | Adapter id (`ludimus`, `bibcom-trento`, …). Stable. |
| `name` | string | Human name of the source. |
| `ok` | boolean | `true` if this run fetched it successfully. |
| `count` | number | Events this source contributed this run (before cross-source dedup). When `ok` is false: the previous events carried over. |
| `error` | string? | Present only when `ok` is false. |
| `lastSuccess` | string \| null | UTC ISO time of the last successful fetch; carried over from the previous file while failing. `null` if it never succeeded. |

### Event

| field | type | meaning |
|---|---|---|
| `id` | string | 16 hex chars, `sha1(source id + source-native key)`. Stable across runs for the same event occurrence — safe to key saved/hidden state on. See "Ids" below. |
| `title` | string | Plain text. |
| `start` | string | ISO 8601 with the explicit Europe/Rome offset, e.g. `2026-10-04T20:30:00+02:00`. |
| `end` | string \| null | Same format. `null` when the source gives no end time. |
| `allDay` | boolean | See "All-day convention". |
| `ongoing` | boolean | Already started and not yet over **at `generatedAt`**. Recompute on the client for accuracy (formula below). |
| `venue` | string \| null | Place name as the source gives it. |
| `city` | string | Town (`Trento`, `Rovereto`, `Bolzano`, `Verona`, `Arco`, …). `Online` for online events. |
| `url` | string | The event's own page at the source (https). Never just a homepage when the source has a per-event page. |
| `source` | string | Adapter id of the record that was kept. |
| `sources` | string[] | Every adapter id that listed this event (see "Dedup"); includes `source`; sorted. |
| `category` | string | Primary category id (see "Categories"). |
| `tags` | string[] | Every matching category id, in priority order; always includes `category`. May end with `kids` (see "The `kids` tag"). |
| `description` | string | Full plain text: HTML stripped, entities decoded, paragraphs separated by `"\n\n"` and line breaks by `"\n"`, at most ~2000 chars (cut on a word, ending with `…`). `""` when the source has none. |
| `summary` | string | One line of plain text, at most ~300 chars: the source's own abstract/intro when it has one, else the start of `description`. Can equal `description` for sources with only short text. `""` when none. |
| `image` | string \| null | Absolute https URL of the source's image for the event. Hot-linked from the source, never re-hosted; may disappear. |
| `occurrences` | number | `1` normally. `N > 1` when a series with more than 8 dates in the window was folded into one span record (see "Recurring events"). |
| `fetchedAt` | string | UTC ISO time this record was last fetched. Older than `generatedAt` when its source failed and the record was carried over. |

### Times and time zone

- Every `start`/`end` carries the Europe/Rome offset valid **on that date**
  (`+01:00` in winter, `+02:00` in summer), computed with `Intl`, so
  `Date.parse` gives the right instant. The first 10 chars are the local date.
- Sources that send another offset (or UTC) are converted to the same instant
  in Rome time.

### All-day convention

- `allDay: true` → `start` is local midnight of the first day
  (`2026-10-03T00:00:00+02:00`); `end` is local midnight of the **last day,
  inclusive** (a one-day event has `end` = `start`'s date). Show dates only.
- An exhibition from 16 May to 18 October has
  `start: 2026-05-16T00:00:00+02:00`, `end: 2026-10-18T00:00:00+02:00`.
- Sources with exclusive all-day ends (iCal `DTEND;VALUE=DATE`, FullCalendar)
  are converted to this inclusive form.
- `allDay: false` → `start` is the start time; `end` the end time or `null`.

### Open now / ongoing

"Open now" is first-class: long-running events (exhibitions) that started
months ago are kept as long as they have not ended. The effective end is

```
allDay  → midnight after the last day:  local(end ?? start) + 1 day, 00:00
timed   → end ?? start
ongoing = start <= now && now < effectiveEnd
```

`ongoing` in the file is that formula at `generatedAt`; a client should
recompute it with its own clock since the file can be up to a day old.

### Window

An event is published when `effectiveEnd >= crawl time − 1 day` and
`start <= crawl time + 180 days`. Consumers should still hide events whose
effective end has passed.

### Recurring events

- OpenPA calendar sources and Open Data Hub list one entry per date; each
  date becomes its own event (`id` includes the date).
- A series with **more than 8 dates** inside the window (weekly markets,
  museum tickets, courses) is folded into **one** all-day record spanning its
  first to last date in the window, with `occurrences: N`. For these, `start`
  is the first date *within the window*, not the series' original start. The
  folded record has its own stable id (`series:` key), distinct from the
  per-date ids; a series crossing the threshold changes id.
- iCal RRULEs are not expanded (the WordPress feeds we read export each
  occurrence as its own VEVENT). Legacy OpenPA `event` objects are a single
  from/to interval: a course "every Tuesday for two weeks" appears as one
  timed range.

### Dedup

Across sources, two events are the same when **normalised title** (lowercase,
accents stripped, punctuation/whitespace collapsed) + **local start date** +
**normalised city** match. The richer record is kept (end time, venue, image,
timed rather than all-day, longer description), its missing fields are filled
from the other, `tags` are unioned and `sources` lists both. Within one
source, duplicate ids are dropped.

### Ids

`id = sha1(sourceId, nativeKey)[0..16]`. Native keys: the event URL
(Ludimus, Trentino Spettacoli), iCal `UID` (Volkan, Buonconsiglio), OpenPA
object id (+ occurrence start for calendar sources), Mart content id, Open
Data Hub id + occurrence start, normalised title + date (Tebe, which has no
per-event pages).
When dedup merges two records, the kept record's id survives, so an id can
disappear if a second source later publishes a richer copy. Rare, but
clients keying local state by id should tolerate a vanished id.

### Categories

| id | label |
|---|---|
| `boardgames` | Board games |
| `nerd` | Comics & games |
| `creative` | Creative (added 2026-09-29) |
| `theatre` | Theatre (added 2026-09-29) |
| `exhibitions` | Exhibitions |
| `concerts` | Concerts & music |
| `cinema` | Cinema |
| `talks` | Talks |
| `festivals` | Festivals & food |
| `other` | Other |

`category` = the source's own type when it has one (e.g. Mart "Mostra" →
`exhibitions`, every Ludimus event → `boardgames`), else the first category
(in table order) matching, in tiers: the **title**; the title plus the
source's typology/topic labels; the title plus the summary; the whole text;
else `other`. So a concert whose description mentions "teatro" stays a
concert.
Keywords live in `scripts/events/tags.ts` and match title + summary +
description + the source's typology labels, case- and accent-insensitive, on
whole words.

- **`creative`**: hands-on making for adults — ceramics (tornio, raku),
  drawing/painting/watercolour courses, printmaking, sewing, knitting,
  embroidery, weaving, photography courses and walks, creative writing,
  calligraphy, bookbinding, collage, sculpture, woodworking, upcycling, fab
  labs; German Werkstatt/Malkurs/Töpferkurs. An art medium alone ("pittura",
  "ceramica") only counts together with an activity word (laboratorio, corso,
  lezione, iscrizione…), so an exhibition of paintings stays `exhibitions`.
  Never set on a `kids` event.
- **`theatre`**: prose, comedy, monologues, dance and ballet, **opera**
  (staged, part of the theatre seasons — not under `concerts`), cabaret,
  stand-up, readings; German Theater/Schauspiel/Tanz.

### The `kids` tag

`tags` may also contain **`kids`**: a children's or family event (teatro
ragazzi, letture animate, "per bambini", age ranges like "6-10 anni" up to
14, school programmes, the source's own "Famiglie e bambini" type). It is a
tag, never a `category`. It is conservative: an event that also says it is
for adults ("adulti e bambini", "per tutti") is not tagged. Consumers may
hide these events (the dashboard page does). A `kids` event never has
`creative` as category or tag.

## Sources

| id | source | how | notes |
|---|---|---|---|
| `ludimus` | ludimus.it | static HTML: `/events.html` listing, date in the URL | detail pages (time, venue, text, image) fetched only for the next 30 days; later events are all-day until they come closer |
| `bibcom-trento` | bibcom.trento.it | OpenPA `/opendata/api/content/search/` | server-side future filter; branch prefix stripped from titles; images are relations only (null) |
| `trentogiovani` | trentogiovani.it | OpenPA `/opendata/api/calendar/search/` | robots disallows `/api/` and `/opendata` but Allows `/opendata/api/calendar`; often few events (`mayBeEmpty`) |
| `volkan` | volkantdg.it | The Events Calendar site-wide iCal `/events/?ical=1` | often stale: an empty feed is ok with 0 events (`mayBeEmpty`) |
| `rovereto` | eventi.comune.rovereto.tn.it | OpenPA `/opendata/api/content/search/` | `/api/` disallowed, `/opendata/api/content` allowed; the ~1,900-event archive is never paginated |
| `comune-trento` | www.comune.trento.it | OpenPA calendar (class `event_link`, OpenAgenda) | same robots situation as trentogiovani |
| `mart` | Mart / Casa Depero / Galleria Civica | Umbraco JSON on media.mart.tn.it (the API behind `/mostre-eventi`) | robots.txt 404 = allowed |
| `bolzano` | Open Data Hub tourism API | `/v1/Event`, `locfilter=mun<Bolzano>`, date window server-side | CC0; texts, venues and images are rarely filled for Bolzano |
| `verona` | www.comune.verona.it | OpenPA calendar | robots disallows `/api/` and `/content/search`, explicitly Allows `/opendata/api/calendar` |
| `cultura-trentino` | www.cultura.trentino.it (Provincia, "Trentino Cultura") | OpenPA `/opendata/api/content/search/`, class `event` | whole province; town from the `comune` relation; date-only events get a time from `orario_svolgimento` when it names exactly one ("ore 20.30"); robots `Crawl-delay: 10` (honoured); images are relations only (null) |
| `rovereto-comune` | www.comune.rovereto.tn.it (ViviRovereto agenda) | OpenPA calendar, class `event` | robots Allows only `/opendata/api/calendar`; the municipal highlights (RAM film festival, season preludes) — `rovereto` above is the library's agenda |
| `zandonai` | www.teatro-zandonai.it (official) | OpenPA search, class `spettacolo`, `main_datetime` | same install as Rovereto; one request; often empty between seasons (`mayBeEmpty`). teatrozandonai.it (no hyphen) is an unofficial, stale fan site |
| `buonconsiglio` | www.buonconsiglio.it (Buonconsiglio, Thun, Beseno, Stenico, Caldes) | Events Manager `/events.ics` | its CATEGORIES ("Adulti", "Famiglie e bambini", "Scuole") feed the `kids` tag |
| `trentinospettacoli` | www.trentinospettacoli.it (Coordinamento Teatrale Trentino box office) | schema.org Event microdata on `/eventi/` + WP REST `eventi` categories | one listing page + 2–3 REST calls; "Teatro ragazzi" → `kids`, "Cinema" → `cinema`, other "Spettacoli" without a keyword → `theatre`; no descriptions |
| `tebe` | www.apstebe.org (Tebe APS, Teatro comunale di Bedollo) | static HTML cards (Next.js page, no feed) | one request; no per-event pages, links to `#eventi`; `mayBeEmpty` |

Not included (checked 2026-09-29):

- **visitrovereto.it** — the Events Manager REST API answers 401,
  `/events.ics` is empty even with `scope=all`, `wp/v2` exposes no event type
  and pages carry no JSON-LD Event; only rendered markup remains.
- **visittrentino.info** — the events listing is ~0.9 MB per page with
  JSON-LD for only ~6 highlighted events (with made-up times); paging goes
  through `/ajax` URLs that robots.txt disallows, and `/download-ical` is
  disallowed too.
- **muse.it** — WP REST has an `events` type but no dates (empty ACF); the
  calendar is rendered markup only. Much of it is also on cultura.trentino.it.
- **fondazionemcr.it** (Museo Civico Rovereto) and **ramfilmfestival.it** —
  JSP sites, no feed or structured data. RAM film festival comes in through
  `rovereto-comune`.
- **centrosantachiara.it** — custom CMS, no feed or structured data;
  `Crawl-delay: 10`. Its shows are largely on comune-trento / cultura.trentino.it.
- **artesella.it** — WP, the `calendario` post type is not in the REST API,
  no JSON-LD, no iCal.
- **museion.it** — custom site, no feed or JSON-LD on `/en/events`.
- **eventi.unitn.it** — Drupal, `rss.xml` is empty, no JSON-LD; mostly
  academic seminars. webmagazine.unitn.it: `Crawl-delay: 10`, markup only.
- **fablab.unitn.it** — events are Eventbrite links (not scraped).
- Ceramics studios: **percorsoargilla.com** (Ala) — WP without an events
  plugin; **manimono.it** — robots.txt answers HTTP 500 (host skipped by our
  rules); **cochiceramica.com** has a Tribe iCal but is in Brescia and empty.
  **Associazione Alchemica**, **Studio d'Arte Andromeda** (Trento) — Wix
  sites, no feed.

## Politeness

- User-Agent `dashboard-events-crawler/1.0 (+https://github.com/Fora00/dashboard)`.
- robots.txt fetched once per host: our group if named, else `*`;
  Allow/Disallow with `*` and `$`, longest match wins, Allow wins ties.
  404/410 = allow all; any other failure = the host is skipped with an error.
- A disallowed URL is never requested. Redirects are followed by hand and
  every hop is checked against its host's robots.txt.
- At least 1.5 s between requests to the same host — more when robots.txt
  sets a `Crawl-delay` (our group or `*`, capped at 30 s); 20 s timeout; at
  most 60 requests per source per run. Sources run one after another. Daily.

## Resilience

A source **fails** when it throws or returns 0 events while the previous run
had some (unless it is flagged `mayBeEmpty`). A failing source keeps its
previous events (re-filtered by the window, `ongoing` recomputed,
`fetchedAt` unchanged) from the previous `events.json` — by default the
deployed one — and reports `ok: false` with the error and the carried-over
`lastSuccess`. The script exits 0 unless it cannot write the output file, and
the workflow step is `continue-on-error`, so the deploy never blocks on it.

## Running locally

```sh
npm run events:crawl                     # all sources, ~1.5 min, writes public/events.json
EVENTS_ONLY=mart,verona npm run events:crawl   # only these (others keep previous events)
```

| env | meaning |
|---|---|
| `EVENTS_ONLY=id,id` | Run only these sources; the others keep their previous events and status. |
| `EVENTS_FAIL=id,id` | Simulate a failure of these sources (resilience testing). |
| `EVENTS_PREVIOUS_URL=…` | Previous file: `https://…`, `file://…` or a local path. Default: the deployed file. A 404 or garbage is tolerated. |
| `EVENTS_OUT=path` | Output path (default `public/events.json`). |

Resilience check: run once, copy the output aside, then
`EVENTS_PREVIOUS_URL=/tmp/prev.json EVENTS_FAIL=mart npm run events:crawl`
→ `mart` is `ok: false` and keeps its events; exit code 0.

The code is plain TypeScript run by Node's type stripping (Node ≥ 22.18):
erasable syntax only, `import type` for types, relative imports with `.ts`.
It is type-checked by `npm run build` (`tsconfig.node.json`) and linted by
`npm run lint`.

## Adding a source

1. Check robots.txt first and prefer a structured feed (JSON API, iCal,
   `__NEXT_DATA__`/CMS API) over rendered markup.
2. An OpenPA site is one entry in `scripts/events/adapters/index.ts`:
   `openpa({ id, name, host, mode: 'search' | 'calendar', classes, city })`.
   Use `calendar` where robots only allows `/opendata/api/calendar`, `search`
   where `/opendata/api/content/search` is allowed and the calendar is not
   configured ("Environment 'calendar' bad configuration").
   A class with other date fields (e.g. `spettacolo` with a single
   `main_datetime`) takes `timeFields: { from: 'main_datetime' }`.
   An iCal feed (The Events Calendar `?ical=1`, Events Manager
   `/events.ics`) is one `ical({ id, name, feed, home, city })` entry
   (`adapters/ical.ts`).
3. Anything else: a new `scripts/events/adapters/<id>.ts` exporting an
   `Adapter` (`id`, `name`, `defaultCategory`, optional `mayBeEmpty` /
   `maxRequests`, `run(ctx)`), using only `ctx.fetchText`/`ctx.fetchJson`
   (they enforce robots, delay, timeout and the request cap). Return
   `RawEvent`s — the orchestrator derives ids, tags, window, folding and
   dedup. Build times with `localToIso`/`dateToIso`/`normalizeIso` from
   `time.ts`. Give `seriesKey` to occurrences of one series.
4. Add it to `ADAPTERS`, run `EVENTS_ONLY=<id> npm run events:crawl`, check
   the output, then document it in the table above.

## Adding a category

Add one entry to `CATEGORIES` in `scripts/events/tags.ts` (id, label,
keywords) at the priority position you want, and add the id to the
`CategoryId` union. Keywords are written lowercase without accents; `word*`
matches a prefix. That is all — consumers treat unknown ids as `other` until
they learn the new one.
