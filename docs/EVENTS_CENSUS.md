# Events source census — rings 1 and 2 (2026-09-29)

Raw per-town research notes from the source census (research agent, stopped before its final summary; all towns were done). Verdicts: ADD / SKIP with reasons, endpoints and query details for implementers. See ROADMAP.md Project 12 for what is implemented.

## Implemented ring-2 sources (2026-09-30)

First full crawl with all of them: every source ok, 2,187 events after dedup,
125 HTTP requests, 213 s. Counts are events published this run (window 180
days, after the ring-2 interest filter); requests exclude one robots.txt per
host.

| adapter id | census row | raw → published | requests | notes |
|---|---|---|---|---|
| `mantova` | Comune di Mantova (Municipium) | 57 → 19 | 5 (4 pages + the empty 5th) | census ~55–60 ✓. Titles carry their date ("Laura Pausini - 1 ottobre", "Pax Tibi ? - dal 3 ottobre al 6 gennaio"): stripped, and a range sets the end (the pretitle only has the first day). Most of the 57 are monthly reading groups, guided tours and walks: dropped by the interest filter. |
| `brescia` | Comune di Brescia (Municipium) | 19 → 14 | 3 (2 pages + empty) | census ~20 ✓. Range cards "Da … a …". "Stagione Teatro Grande 2026" duplicates a `teatrogrande` night under another title (not merged). |
| `ctb` | CTB Brescia | 44 → 29 | 1 | census 46 productions: 46 cards, minus 2 school-only productions (morning-only times: "Se dicessimo la verità", "Pigmalione", both also on `/spettacoli/spettacoli-per-le-scuole`), 7 of the rest are June 2026 (past) and the rest beyond 180 days drop by the window. One all-day range per production. `/spettacoli/spettacoli-per-le-scuole` and `ctb-per-la-scuola-serali` are never fetched. |
| `teatrogrande` | Teatro Grande Brescia | 30 → 29 | 1 | Census "~40 rows" included 23 café rows ("Aperto", "Chiusura anticipata": opening hours, dropped); 27 shows + 3 "Aperitivo in Jazz" kept. Every row has `data-date="YYYY-MM-DD"`, so the month heading is not needed for the year. "Il Grande per i Piccoli" → `kids` (dropped). www redirects to the bare host; the bare host is requested. |
| `arteven` | Arteven (myarteven.it) | 106 → 81 | 1 (3.7 MB) | 232 performances in the JSON; kept only `(VI)` theatres + Padova city (110): Mestre, Portogruaro, Rovigo, Jesolo, Legnago, Albignasego, Fontaniva (PD) dropped; then 4 weekday-morning school matinées dropped (106). Children's rassegne (Schio "Civico da favola", Thiene "Domenica teatro") → `kids`. 21 of its 23 Vicenza shows merge with `tcvi` (the other 2 are not on tcvi). The event page URL built from the site's template was checked once (200). |
| `stabileveneto` | Teatro Stabile del Veneto | 38 → 33 | 1 POST | census 38 Padova productions ✓ (Verdi 20 + Ridotto 8 + Foyer 1 + Maddalene 9); filter on `locationCity.it === 'Padova'`. Public page `www.teatrostabileveneto.it/spettacolo/<hsUrl>` (the site's own links use it); image `media.teatrostabileveneto.it/uploadedmedia/<blobLinkIds>` (the site's `_mediaUrl`, not fetched by us). No overlap with `padova`. Needed `ctx.postJson` (new in `http.ts`). |
| `teatrosociale-mantova` | Teatro Sociale Mantova | 15 → 15 | 1 | census 19; the band now lists 17 shows, 2 marked "- SPOSTATO" (moved) dropped. No year on the band: the year whose date matches the card's weekday (unambiguous within two years); the month calendar's "sab 17 ott 2026" cross-checks the current month. Abstracts only for the current month. "Monet - Una vita a colori" merges with `mantova`. |

Not done: Garda/Peschiera Municipium lines (lake-wide `garda-veneto` covers
them), Comune di Vicenza OpenCity (21 MB per 30 days), bresciamusei.com,
Operaestate Bassano (summer, spot candidate).

---

# Rovereto: Teatro Zandonai + Filarmonica di Rovereto (ring 1) — done 2026-09-30

| site | endpoint | robots | finding | verdict |
|---|---|---|---|---|
| www.teatro-zandonai.it (Teatro Riccardo Zandonai, Comune di Rovereto; OpenPA) | `/opendata/api/content/search/classes [spettacolo] …` (existing `zandonai` source) | `Disallow: /api/ /content/search /content/advancedsearch …` — `/opendata/api/content/search` is not covered, so allowed | **Not misconfigured.** 648 `spettacolo` objects in total; the site's own home and `/Programmazione` show exactly the one upcoming show the API returns ("Suora e Basta", 3 Oct). Last season (Oct 2025 – May 2026): 83 shows, 1 cancelled. The whole "STAGIONE TEATRALE" + "STAGIONE DANZA" was published on **2025-10-07** in one batch (leads of 15–169 days); concerts, festivals, schools and rentals are added ~2 weeks ahead (median lead 15 days). The 2026/27 season is not announced anywhere yet (search, trentinospettacoli venue page: only "Il segreto di Francesco", 4 Oct). | **KEEP**, improved: fixed venue, title case for capitals, cancelled shows dropped, "Festival dei piccoli" → kids. The season will arrive automatically when the theatre publishes it (expected early/mid October). |
| www.filarmonicarovereto.it (Associazione Filarmonica di Rovereto; WordPress + Modern Events Calendar 6.5.5) | RSS `/events/feed/` (MEC namespace: `mec:startDate`, `startHour`, `endDate`, `endHour`, `location`, `category`); `wp-json/wp/v2/mec-events` (no dates except in titles); per-event iCal `/?method=ical&id=<post>`; event pages carry MEC JSON-LD `Event` with `location.name` | Yoast block, `User-agent: *` `Disallow:` (empty) = allow all | `wp-json/mec/v1/events` returns `[]`; `?mec-ical-feed=1` returns the home page (site-wide iCal off). RSS: 5 items now (the 4 "Preludio di Stagione" chamber concerts + "Risonanze", 3–4 Oct), `?paged=2` returns the same 5. The 2026/27 season (105th) is not posted yet; last year's ~45 posts were created on 2025-10-06 (16 season concerts at Zandonai / Auditorium Melotti, Musica in Biblioteca, family and school concerts). MEC categories: Stagione dei Concerti, Stagione Sinfonica, Preludio di Stagione, Musica in biblioteca, Concerti per le famiglie, Concerti per le scuole, Apprendista Musicista, Brentonico Classica, Mart Music, Eventi Speciali. | **ADD** `filarmonica-rovereto`: RSS + REST + per-event iCal fallback + JSON-LD venue names. 8 requests today (robots, RSS, REST, 5 venue pages); at season start up to ~50. |
| Sala Filarmonica di Rovereto | — | — | The choir seminar there (Federazione Cori, Jan 2027) comes from cultura-trentino; it is a venue, not the association's programme. | — |

Dedup checks (2026-09-30 crawl): "Camera 02" (3 Oct 20:00) merges across
`filarmonica-rovereto`, `cultura-trentino` and `rovereto`; "Il segreto di
Francesco" (4 Oct 20:30) merges `cultura-trentino` + `trentinospettacoli` +
`rovereto-comune`'s subtitled copy (new second dedup pass). Last season's
lists show Filarmonica season concerts at the Zandonai (e.g. "Un Americano a
Parigi", 28 Oct 2025) in both `zandonai` (capitals) and `filarmonica-rovereto`
with the same title and date, so they should merge and keep the natural-case
title. This was not exercised end to end: neither source has such a concert
in the window today.

---

# Merano / Meran + Bressanone / Brixen (ring 1) — done 2026-09-29

| town | candidate URL | type | robots | future events (180 d) | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Merano + Bressanone | tourism.api.opendatahub.com/v1/Event (widen existing `bolzano` adapter) | odh | robots.txt **404** = allow all | **170 items** (Merano 105, Bressanone 65) = **1,642 occurrences** in window (orchestrator folds series >8 dates) | 1 request, **4.6 MB** (EventDate arrays are 2.4 MB of it) | **ADD** | config: widen `locfilter` (one shared request with Bolzano, paging already handled) |
| Bressanone | www.comune.bressanone.bz.it/opendata/api/calendar/search/classes%20%5Bevent%5D | openpa-calendar (OpenCity) | `Allow: /opendata/api/calendar` (with `Disallow: /opendata`, `Disallow: /api/`; `# Crawl-delay: 10` is commented out) | 2 unique in 30 d, both admin ("Commissione edilizia", "Orario di ricevimento urbanistica") | 163 KB / 30 d | **SKIP** — only municipal office hours; real events come via ODH | — |
| Merano | www.comune.merano.bz.it | other (ASP.NET WebForms) | `Crawl-delay: 20` | not checked further | — | **SKIP** — no feed; tourism events are in ODH | — |
| Merano | www.kurhaus.it (Kurhaus + Teatro Puccini) `/it/eventi-merano/54-0.html` | other | `Disallow: /pfengine/ /tracking/ /default/` | calendar is rendered by JS (page has no events in HTML, no JSON-LD) | — | **SKIP** — no structured data; Kurhaus events are in ODH (LTS) | — |
| Merano | ostwestclub.it (club/concerts, WP) | WP REST | `Disallow:` (empty) | no events namespace (Elementor only) | — | **SKIP** — no events plugin | — |
| Bressanone | www.dekadenz.it (cabaret theatre, Consisto CMS) / www.forum-brixen.com | other | dekadenz: `User-agent: *` no disallow; forum-brixen: `Disallow:` empty | no JSON-LD / feed found on home | — | **SKIP** (optional later check) | — |

## Implementation detail (ODH)

Municipality ids (from `/v1/Municipality`):
- Bolzano `50FCFD4334A04DB087C1FD10ED864018` (existing, Istat 021008)
- Bressanone/Brixen `2B2B22E275734BB990DE4A3FC98C6A18` (Istat 021011)
- Merano/Meran `418E5CC913764648802DD2BE30AD91AC` (Istat 021051)

`locfilter` accepts a comma list:
```
https://tourism.api.opendatahub.com/v1/Event?pagesize=200&pagenumber=1&begindate=<today>&enddate=<today+180>&active=true&removenullvalues=true&locfilter=mun50FCFD4334A04DB087C1FD10ED864018,mun418E5CC913764648802DD2BE30AD91AC,mun2B2B22E275734BB990DE4A3FC98C6A18
```
Verified: Merano+Bressanone alone = TotalResults 170, TotalPages 1, 4.58 MB. With Bolzano (292) expect ~460 items = 3 pages at pagesize 200 (~12 MB total). The adapter already reads `LocationInfo.MunicipalityInfo.Name.it` for `city` — only the "Bolzano" fallback and adapter name need changing (or split into 3 adapters with one id each if per-city source status is wanted; costs 2 more requests).

Data quality (same as Bolzano): all 170 have an Italian title; **0** have BaseText, **0** have images, EventUrls empty. Titles are sometimes German even in `it` ("25. Internationales Brassfestival Meran/o"). Many are tourist offers (guided tours, "Tour serale", "Visite serali alla Torre Bianca") with dozens of dates — they fold into series. Wine festivals (Merano WineFestival), Brassfestival, concerts are there.

---

# Lake Garda Veneto — Malcesine, Bardolino, Lazise, Garda, Peschiera (ring 1) — done 2026-09-29

| town | candidate URL | type | robots | future events | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| lake-wide (Veneto shore + hinterland: Malcesine, Brenzone, Torri, Garda, Bardolino, Lazise, Peschiera, Castelnuovo, Bussolengo, San Zeno…) | www.lagodigardaveneto.com/it/cosa-fare/eventi-lago-di-garda-veneto?page=N (Destination Verona & Garda Foundation; Pimcore "destisuite") | other: HTML listing with per-card JSON in `data-gtm-el` + detail pages with **JSON-LD Event** | `User-agent: *` / `Disallow:` (empty) = allow all | **~95** listing items (11 pages × 9; page 12 empty); page 9 already reaches 18 Oct, so the listing seems to hold only the next few weeks + long-running markets | 11 requests, ~2.7 MB (240–290 KB/page) | **ADD** — the only lake-wide source; covers all 3 target towns + Garda/Peschiera | **bespoke small adapter** |
| Bardolino | www.comune.bardolino.vr.it/it/events/feed | other (Municipium RSS) | `User-agent: *` `Allow: /` | 3 current; RSS = "ultimi 5 eventi", no event dates | 1 req, 6 KB | **SKIP** — no dates in RSS; festa dell'uva etc. are on lagodigardaveneto | — |
| Garda / Peschiera | www.comune.garda.vr.it, www.comune.peschieradelgarda.vr.it | other (Municipium, same as Brescia/Mantova) | `User-agent: *` (no disallow) | not counted | — | **SKIP** for now — lake-wide source covers them; could reuse the Municipium factory later (config line) | config line if the factory exists |
| Lazise | www.comune.lazise.vr.it/wp-json/wp/v2/eventi | other (WP custom REST, Halley theme) | `Disallow: /wp-admin/` only | **3** future (of 342 returned — endpoint ignores per_page and returns the whole archive) | 1 req, **614 KB** | **SKIP** — 3 events, and "ASCinema" is already on lagodigardaveneto. (Note: "Dai che zughen!" 4 Oct is a games day.) | would be small adapter |
| Malcesine | www.comunemalcesine.it/eventi | other (Laravel) | `User-agent: GPTBot Disallow: /` / `User-agent: *` `Disallow: /admin /media/` | no event links in HTML | 1.35 MB per page | **SKIP** — no structured events, huge pages | — |
| Malcesine | www.visitmalcesine.com/it/calendario-eventi | other | `Disallow:/AJAX/`, `Disallow: *.html*`, `Disallow: /*lang*` | events loaded via AJAX (disallowed); no JSON-LD | — | **SKIP** — robots | — |
| Bardolino | bardolinotop.it/eventi-top/ | Feratel Deskline DW5 widget (Veneto regional DMS) | bardolinotop: `Disallow:` empty; resc.deskline.net robots.txt 404 | — | — | **SKIP** — proprietary widget API (Angular app, client keys), not a published feed | — |

## Implementation detail (lagodigardaveneto.com)

- Listing: `https://www.lagodigardaveneto.com/it/cosa-fare/eventi-lago-di-garda-veneto?page=N`, N = 1.. until a page has 0 `/it/eventi/<slug>_<id>` links (page 12 returned a 58 KB page with 0 links). Pager shows a sliding window (links to N+1, N+2).
- Each card has `<a href="https://www.lagodigardaveneto.com/it/eventi/<slug>_<id>" ... data-gtm-el="{...}">` — HTML-entity-encoded JSON with `id`, `title`, `classname:"event"`, `locations:[{name:"Brenzone sul Garda"}]`, `categories:[{name:"natura - animali/piante"}, {name:"manifestazioni per famiglie e bambini"}]` (→ kids tag / category hints), `price_from`.
- The visible card text carries dates/time/town: `25.09 - 05.10.2026`, `29.09.2026`, `( Ogni Martedì )`, `Bardolino - Lungolago Cornicello`, `00:00`/`08:00`, `Altre date disponibili`.
- Detail page (≈200 KB each) has clean JSON-LD: `{"@type":"Event","name","location":{"@type":"Place","name","address":{"addressLocality":"Bardolino",...}},"organizer",...,"eventSchedule":[{"@type":"Schedule","startDate":"2026-09-25","endDate":"2026-10-05","startTime":"00:00"}],"startDate":"2026-09-25T00:00:00+02:00","image":"https://www.lagodigardaveneto.com/website_images/external/events/<uuid>.jpg"}` — use it Ludimus-style for the next ~30 days only (image + venue), keep listing data otherwise.
- Filter form fields exist (`date`, `locations[]`, `categories[]`, `topEvent`, `q`), `?date=2026-11-15` returned the same long-running items first — date filtering is not a reliable way to reach further ahead; just page.
- Noise: many weekly markets (`Mercato settimanale`, "01.01 - 31.12.2068 ( Ogni Martedì )") and bus tours — ringed "all categories" but consider dropping markets/"Bus" by title.
- Also an `ajax-events?multisiteOrigin=3#<id>` link per card (`/it/ajax-events`, allowed) — not explored.

---

# Padova (ring 2) — done 2026-09-29

| town | candidate URL | type | robots | future events (180 d) | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Padova | www.comune.padova.it/api/events (decoupled Drupal **JSON:API**, the backend of the Angular site) | other: Drupal JSON:API | `User-agent: *` `Disallow: /page-not-found` only | **88** events (meta.count with the date filter) | 2 requests × 50 (page[limit]=50), ~0.7 MB/page with includes (slim with `fields[event]`) → ~1.4 MB | **ADD** — the city's official agenda, well typed (Mostre, Musica, Teatro e danza, Manifestazioni e spettacoli, Conferenze…) with venues and a human date text | **small adapter** |

## Implementation detail

Query (dates are **unix timestamps in seconds**, not ISO — ISO values are silently mis-compared; found in the site's own JS `getEvents()`):
```
https://www.comune.padova.it/api/events
  ?filter[status][value]=1
  &filter[a][condition][path]=event_date.value&filter[a][condition][operator]=<=&filter[a][condition][value]=<unix now+180d>
  &filter[b][condition][path]=event_date.end_value&filter[b][condition][operator]=>=&filter[b][condition][value]=<unix now>
  &sort=event_date.value&page[limit]=50&page[offset]=<0,50,…>
  &include=event_type,event_place&jsonapi_include=1
  (+ optional fields[event]=title,path,event_date,event_short_description,event_description,field_text_date,event_type,event_place,event_tags,field_image)
```
Verified URL (URL-encoded): https://www.comune.padova.it/api/events?filter%5Bstatus%5D%5Bvalue%5D=1&filter%5Ba%5D%5Bcondition%5D%5Bpath%5D=event_date.value&filter%5Ba%5D%5Bcondition%5D%5Boperator%5D=%3C%3D&filter%5Ba%5D%5Bcondition%5D%5Bvalue%5D=1806261965&filter%5Bb%5D%5Bcondition%5D%5Bpath%5D=event_date.end_value&filter%5Bb%5D%5Bcondition%5D%5Boperator%5D=%3E%3D&filter%5Bb%5D%5Bcondition%5D%5Bvalue%5D=1790709965&sort=event_date.value&page%5Blimit%5D=50&include=event_type,event_place&jsonapi_include=1
Paging: follow `links.next` until absent.

Fields (with jsonapi_include=1, flattened):
- `title`; `path.alias` → `https://www.comune.padova.it` + alias (e.g. /vivere-il-comune/eventi/mostra-…)
- `event_date[]`: `{value, end_value, duration, rrule}` in UTC. All-day events are stored as local midnight → `2026-05-27T22:00:00+00:00` … `2026-09-30T21:59:00+00:00`; detect "starts at 22:00/23:00 UTC and ends at :59" = all-day. Several deltas per event (e.g. 4–11 dates for a rassegna) = occurrences.
- `field_text_date` ("Dal 19 settembre al 22 novembre", "Martedì 29 settembre 2026, ore 21") — human text, good for summary/time.
- `event_type.name` (taxonomy eventi): Mostre, Conferenze e incontri, Musica, Manifestazioni e spettacoli, Visite guidate, Salute, Teatro e danza, Fiere e mercati, Cerimonie e ricorrenze … → tagText / category hint.
- `event_place` (included, `title` = venue: Teatro Verdi, Caffè Pedrocchi, Centro Culturale Altinate/San Gaetano, "Città di Padova" as a generic placeholder).
- `event_short_description`, `event_description.value` (HTML).
- `field_image` is a media relation (id only) — images would need `include=field_image.field_media_image` (the site itself uses that include for other types); not verified for events.
- Unpublished items are omitted (meta.omitted) — harmless.

Notes: includes long-running items (one exhibition ends 2037-12-31; fold/clip). Teatro Verdi (Teatro Stabile del Veneto) seasons show up here only as highlights (La Sfera Danza festival, guided tours) — see the theatres file for Stabile del Veneto.

## Padova theatre — Teatro Stabile del Veneto (Teatro Verdi, Teatro Maddalene; also Treviso/Venezia)

| town | candidate URL | type | robots | future events | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Padova (+ Treviso, Venezia) | **POST** https://api.teatrostabileveneto.it/api/Public/eventslist (the JSON API behind the HubSpot site's Vue list) | other: JSON API, **POST only** | api host robots.txt **404** = allow all. On www: `Disallow: /spettacoli-per-tipologia/` (the HTML list page — not needed) | **88** productions (30 Sep 2026 → 31 May 2027), all in one page with pageSize 100; **Padova: 38** (Teatro Verdi 20 + Ridotto 8 + Foyer 1, Teatro Maddalene 9); rest Treviso (Del Monaco 35) / Venezia (Goldoni 15) | 1 request, 153 KB | **ADD** — Padova's main prose/opera house; Treviso/Venezia out of rings (drop or keep by venue) | **small adapter + a `postJson` in `AdapterContext`/`http.ts`** (the crawler is GET-only today; robots check applies the same) |

Body (JSON): `{"new":false,"filterOnly":false,"lang":"it","listType":0,"search":"","cities":[],"genres":[],"productions":false,"firstDate":null,"page":0,"pageSize":100,"giftCard":null}` (header `Content-Type: application/json`).
Response: `{TotalEvents, PageSize, TotalPages, CurrentPage, HasNextPage, Events:[…], Filters}`. Event fields: `mainEventId`, `eventId`, `startDate`/`endDate` (local, no TZ, date-only: a run "30 settembre - 3 ottobre 2026" = `datePeriod`), `locationName` (Teatro Verdi / Teatro Maddalene / …), `title` and `shortDescription` and `genres` and `companyName` are **JSON strings** of `{"it":…,"en":…}` (genres `;`-separated: Contemporaneo, Letture, Prosa, Danza, Lirica…), `hsUrl` (`1650__39_spirito_del_teatro`, the slug of the public page — exact public URL pattern not verified; the site's `_urlList['spettacolo']` = `/spettacolo`, so likely `https://www.teatrostabileveneto.it/spettacolo?…` — check before shipping), `blobLinkIds` (image blob id; URL pattern unverified), `gratisFlag`, `isSellable`.
No per-night times in the list (it's per production); nightly times would need a per-event call (not explored).

---

# Vicenza (ring 2) — done 2026-09-29

| town | candidate URL | type | robots | future events | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Vicenza | www.tcvi.it/it/eventi/calendario-eventi/ (Fondazione Teatro Comunale Città di Vicenza: Teatro Comunale, Ridotto, **Teatro Olimpico** Ciclo Classici, Sala Maggiore) | other: one static HTML page (ProcessWire, UIkit), whole season | `User-agent: *` / `Disallow:` (empty) | **147** performances, Sep 2026 → Jun 2027 (≈120 inside 180 d) | **1 request, 457 KB** | **ADD** — best theatre coverage per request in ring 2 | **small bespoke adapter** (one page, regular markup) |
| Vicenza | www.comune.vicenza.it/opendata/api/calendar/search/classes%20%5Bevent%5D?start=…&end=… (OpenCity) | openpa-calendar | `Allow: /opendata/api/calendar` beats `Disallow: /opendata` and `Disallow: /api/opendata` (same pattern as Trento/Verona); `# Crawl-delay: 10` is **commented out**; bot-specific `Disallow: /` groups do not name us | **215 unique** events / **926 occurrences** in the next 30 days (theatre, exhibitions, Teatro Olimpico, "FOOLS Rido da Matti", many recurring) | **21 MB per 30-day chunk** (≈125 MB for 180 d!). `time_interval` (full recurrence list repeated in every occurrence) is 16 MB of it | **DEFER / SKIP for now** — works with the existing `openpa({mode:'calendar'})` config line, but 6× heavier than Verona. Only worth it with a per-source horizon of ≤30 days (1 request, 21 MB). `select-fields` in the calendar query → HTTP 500 (can't slim) | config line (+ a per-source `horizonDays` option) |

## Implementation detail — TCVI

- URL: `https://www.tcvi.it/it/eventi/calendario-eventi/` (single page, all months; month filtering is client-side UIkit `uk-filter`).
- One card per performance: `<div data-month="ottobre-2026" data-type="spettacoli-79-ciclo-classici" class="uk-event …">`
  - date: `<span class="date-mobile"><span class="day-mobile">mer</span> 30 settembre <span class="hour-mobile">ore 21:00</span></span>` — year from `data-month` (`settembre-2026`).
  - time also in `.calendar-time` (`<strong>mer</strong><br>21:00`).
  - category label `<span class="uk-label">Spettacoli - 79° Ciclo Classici</span>`; `data-type` slugs include prosa, danza, musical, operetta, cabaret, circo-contemporaneo, concertistica, sinfonica, gospel, live, show, talk, conferenze, family-show (→ kids), spettacoli-per-le-scuole (→ kids / drop), eventi-ospitati, visite-guidate…
  - title + link: `<h3><a class="serif" href="/it/classici/spettacoli/…/bord-de-mer/">Bord de Mer</a></h3>` (relative → https://www.tcvi.it).
  - image: `<img src="/site/assets/files/42500/classici_500x408_7.150x100.png">` (thumbnail; drop the `.150x100` suffix for the original — unverified).
  - venue follows the title (`Teatro Olimpico di Vicenza`, `Sala Maggiore`, `Biblioteca di Villa Tacchi`), then price text ("a partire da 15 €", "Ingresso gratuito").
- No descriptions on the listing (detail pages not checked). No iCal/JSON-LD ("ical" hits were "mus**ical**").
- "Eventi ospitati" includes non-cultural rentals (e.g. "Giornata del Medico e dell'Odontoiatra") — the ring-2 interest filter should drop them by tags.

## Implementation detail — Comune (if ever enabled)

`openpa({ id: 'vicenza', name: 'Comune di Vicenza', host: 'www.comune.vicenza.it', mode: 'calendar', classes: '[event]', city: 'Vicenza' })` + horizon 30 d. Item URL from `extendedProps.location` (e.g. `/Vivere-il-Comune/Eventi/Eumenidi-Tutta-tutta-del-Padre-io-sono`). Typology field `has_public_event_typology` came back empty in the sample — rely on keywords.

---

# Brescia (ring 2) — done 2026-09-29

| town | candidate URL | type | robots | future events | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Brescia | www.centroteatralebresciano.it/spettacoli/ (CTB, the city's teatro stabile: Teatro Sociale, Teatro Mina Mezzadri) | other: static HTML listing, custom CMS | `User-agent: *` / `Disallow:` (empty) | **46** productions of the 2026/27 season (`/spettacoli/2026/<slug>`), each with a date range | 1 request, 75 KB | **ADD** — prose season, great theatre value per request | small bespoke adapter |
| Brescia | teatrogrande.it/it/calendario (Teatro Grande, Kirby CMS) | other: static HTML | `Disallow: /content /kirby /site /media /archive` (calendar path allowed) | **~40** dated performances Oct–Dec 2026, 18 productions (danza, concerti, opera e balletto) | 1 request, 104 KB | **ADD** | small bespoke adapter |
| Brescia | www.comune.brescia.it/it/eventi?page=N (Municipium) | other: HTML listing (municipium-factory.md) | `User-agent: *` `Allow: /` | **~20** (2 pages: 15 + 5) — CNE film focus, Librixia, Carme, exhibitions, plus civic items | 2 requests, ~230 KB | **ADD (cheap, config line once the Municipium factory exists)** | config line |
| Brescia | www.bresciamusei.com (Fondazione Brescia Musei, WP + WPML) | WP | `User-agent: *` `Disallow:` | not probed further (1 JSON-LD block on home, no Event type) | — | **SKIP for now** — optional follow-up: check `wp-json` for an events type | — |
| Brescia | Lombardia open data | — | — | none for Brescia | — | SKIP (regional.md) | — |

Details:
- CTB card text: `Fedra | MARTEDÌ 24 NOVEMBRE 2026 - 20:30 | FINO AL 29 NOVEMBRE 2026` → start = first date+time, end = "FINO AL" date (a run of nightly shows; treat as one event with a range, or occurrences if the detail page lists them). Category pages: `/spettacoli/categoria/stagione-di-prosa`, `ospitalita-in-stagione`, `fantasie-metropolitane`, `altri-percorsi`, `nello-spazio-e-nel-tempo`, `fuori-stagione`; `/spettacoli/spettacoli-per-le-scuole` + `ctb-per-la-scuola-serali` → kids/drop. Tickets on ctb.vivaticket.it (not needed).
- Teatro Grande calendar rows: category (Danza/Concerti/Opera e Balletto/Spettacoli/Educational), title, subtitle, `ven. 02 ott | 20:00`, long blurb (description!), link `/it/stagioni/2026/<slug>`. **No year** in the row: take it from the month heading (`ottobre 2026`). Audience filters on the page ("Per under 11 e famiglie") → kids.

---

# Mantova (ring 2) — done 2026-09-29

| town | candidate URL | type | robots | future events | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Mantova | www.comune.mantova.it/it/eventi?page=N (Municipium) | other: HTML listing (see municipium-factory.md) | `User-agent: *` `Allow: /` | **~55–60** (4 pages × 15; page 4 is the last, reaches Mar 2027 + one Sep 2027) — concerts (Laura Pausini), Noh theatre, exhibitions ("Pax Tibi" 3 Oct–6 Jan), laboratori, guided tours | 4 requests, ~0.5 MB | **ADD** — good mix incl. theatre/concerts/exhibitions, typology labels on every card | small adapter (Municipium factory, shared with Brescia) |
| Mantova | www.teatrosocialemantova.it/it-it/spettacoli.aspx (Teatro Sociale, ASP.NET) | other: HTML | robots.txt has only a `Sitemap:` line (no groups) = allow all | **19** shows, Oct–Dec 2026 (Yamamoto Noh, Gidon Kremer, Virginia Raffaele, Il lago dei cigni…) | 1 request, 85 KB | **ADD (optional)** — clean but **no year** in the card (`21:00 | 17 | ottobre | sabato`, infer year from weekday/next occurrence); some overlap with the comune listing | small bespoke adapter |
| Mantova | Lombardia open data | — | — | none for Mantova | — | SKIP (see regional.md) | — |

Details:
- Teatro Sociale cards: link `/it-it/<slug>.aspx?event=<GUID>` (GUID = stable native id), text sequence `TITLE | HH:MM | DD | month | weekday`. JSON-LD on the site is Organization/WebSite only.
- Festivaletteratura (Sept) and Mantova's big exhibitions are better as hand-curated spot events.

---

# Bassano del Grappa (ring 2) — done 2026-09-29

| town | candidate URL | type | robots | future events (180 d) | cost/run | verdict | effort |
|---|---|---|---|---|---|---|---|
| Bassano (+ Vicenza, Thiene, Schio, Cassola, Rosà, Fontaniva, Padova-Piccolo Teatro, Jesolo, Mestre… — the whole **Arteven** regional theatre circuit) | www.myarteven.it/ (home page embeds the full performance list as JSON) | other: embedded JSON (`rappresentazionitotal = [...]` inside an underscore.js calendar template) | `User-agent: *` `Disallow: /risultati-ricerca` `Disallow: /dichiarazione-di-accessibilita` | **232** performances total (3 Oct 2026 → 16 May 2027), **202** within 180 d; **17 in Bassano** (Teatro Remondini season 2026/27 + Colibrì festival), 28 in Vicenza (TCVI Sala Maggiore/Ridotto — overlap with tcvi), 37 Thiene, 22 Schio | **1 request, 3.7 MB** | **ADD** — the Bassano city theatre season lives here (not on the comune site); bonus Vicenza-province coverage | **small bespoke adapter** (extract + JSON.parse) |
| Bassano | teatroremondini.it `wp-json/wp/v2/event_listing` (WP Event Manager) | WP REST + JSON-LD on detail pages | Yoast block, `Disallow:` (empty) | 13 listings total (private-hire gigs, musicals, tribute bands; ~4–5 future); REST has **no dates** (`meta` empty) — dates only in each detail page's JSON-LD Event | 1 + N requests (~80 KB each) | **SKIP** — few, commercial rentals; the actual season is on Arteven | small adapter if ever wanted |
| Bassano | www.operaestate.it (Joomla) | JSON-LD (only one generic "Home page" Event) | `User-agent: *` `Allow: /` | **0** now — festival runs mid-June → mid-Sept (46th edition over) | — | **SKIP** as a daily source → **spot** list candidate (Operaestate / B.Motion, summer) | spot entry |
| Bassano | www.comune.bassano.vi.it (myPortal, old AngularJS SPA; `/robots.txt` returns the SPA HTML) | other | no rules | not reachable without JS | — | **SKIP** | — |

## Implementation detail — Arteven

- Fetch `https://www.myarteven.it/` (3.7 MB; the page is heavy because the template inlines everything).
- Find `rappresentazionitotal = [` in the HTML and `JSON.parse` the array from there (use a bracket-balanced slice or a streaming parse; in Python `json.JSONDecoder().raw_decode` works directly; in TS scan for the matching `]` while respecting strings).
- Per performance:
  - `id` (uuid, native id), `data_rapp` `2026-10-04`, `orario` `"17.00"` (dot separator), `gratuito`, `link_esterno` (vivaticket/boxol ticket URL),
  - `name` = `TITLE_DD_MM_YYYY_HH.MM` → strip the suffix for the title (or use `ref_spettacolo.name` if present),
  - `teatro_id.name` `TEATRO REMONDINI - BASSANO DEL GRAPPA (VI)` → venue + city (split on ` - `, drop `(VI)`), `teatro_id.indirizzo`,
  - `rassegna_id.name` (`BASSANO DEL GRAPPA - STAGIONE TEATRALE 2026/2027`, `COLIBRÌ 2026 - FESTIVAL…`) → tagText; rassegne for schools/kids exist (e.g. "LO SPECCHIO DELLA REGINA" 17:00 Sunday) → kids tag by keywords,
  - image: `custom_spettacolo`/`ref_spettacolo.anteprima_id.mediaurl` (`https://s3.iimage.it/myarteven/public/media/spettacoli/<file>.jpg`, spaces in filename → encode).
  - Page URL (from the template): `https://www.myarteven.it/rassegne/${rassegna_id.slug}/${ref_spettacolo.slug}/${slug}`.
- `seriesKey` = `ref_spettacolo.id` (same show on consecutive nights).
- Ring filter: keep only venues in ring-2 towns (Bassano, Vicenza) — or keep the whole Vicenza province if the owner wants; Jesolo/Mestre are outside all rings.
- Dedup: Vicenza Sala Maggiore/Ridotto performances duplicate `tcvi` (same title + date → the pipeline's exact dedup should merge if titles match; TCVI uses mixed case, Arteven uppercase — check dedup is case-insensitive).

---

# Municipium (Maggioli) comune sites — shared notes (Brescia, Mantova; also Bardolino, Garda, Peschiera)

Platform: Municipium by Maggioli, AGID "bootstrap-italia" templates. robots.txt on all five: `User-agent: *` + `Allow: /` (Brescia, Mantova, Bardolino) or no disallow (Garda, Peschiera).
No API/JSON-LD for events: detail pages carry only `GovernmentOrganization` JSON-LD; the `<town>-api.municipiumapp.it` host serves the Angular admin app; `/it/events/feed` is RSS of the **last 5** events with no event dates. So: HTML listing.

- Listing: `https://www.comune.<town>.it/it/events?page=N` (the site also answers on `/it/eventi`, `/it/events` redirects there — note the redirect is followed by hand and robots-checked by http.ts; request `/it/eventi?page=N` directly to save a hop). 15 cards per page; stop when a page has no `data-element="event-link"`.
- Only current and future events are listed (no archive: `/it/old-events` is separate).
- Card (`<article class="card-wrapper">`):
  - `<span class="h5 card-pretitle"> 1 ottobre 2026 </span>` — single day; or a range variant `Da 28 settembre 2026` … `a 2 ottobre 2026` (Brescia).
  - `<div class="category …"> Manifestazione musicale </div>` — the comune's typology (Spettacolo teatrale, Mostra, Laboratorio, Visita guidata, Dibattito/dialogo pubblico, Escursione, Corsa, Cerimonia, Giornata aperta…) → tagText / category hint.
  - `<a class="link-detail" data-element="event-link" href="…/it/events/<slug>"><h1 class="card-title h5"> Title </h1></a>`
  - `<p class="card-text"> short description </p>` → summary.
  - image `<img src="//<town>-api.municipiumapp.it/s3/…/media/eventi/2026/x.jpg">` (protocol-relative → https:).
  - topic chips (`/it/topics/41` "Patrimonio culturale").
- No times on the listing (all-day unless the title says otherwise); detail pages not checked for times.
- One adapter factory `municipium({ id, name, host, city })` → a config line per town.

---

# Regional open data (Veneto, Lombardia) — done 2026-09-29

| region | candidate URL | type | robots | future events | cost | verdict | effort |
|---|---|---|---|---|---|---|---|
| Veneto | dati.veneto.it (Drupal catalog) | other | `User-agent: *` `Crawl-delay: 10`, `Disallow: /search/`, `Disallow: /?q=search/` | catalog facet "Eventi" = **3** JSON datasets in the whole region; no live calendar feed; CKAN API `/api/3/action/package_search` → 404 | — | **SKIP** — no fresh event dataset | — |
| Veneto | www.veneto.eu/it/eventi (regional tourism portal, fed by the regional DMS = Feratel Deskline) | other (SPA) | `/robots.txt` returns the SPA HTML (no rules) | events rendered client-side; no JSON-LD in HTML | 125 KB | **SKIP** — no public feed; DMS is proprietary | — |
| Lombardia | www.dati.lombardia.it (Socrata) `/api/catalog/v1?q=eventi` | other (Socrata SODA) | `Crawl-delay: 1`; `Disallow: /api/odata/`, `/api/collocate*`, `/browse?*&q=` (catalog API itself not disallowed) | 29 "eventi" datasets, all small comuni (Bianzano, Cenate Sotto, Torre de' Roveri…) or stale (2018–2023); **none for Brescia or Mantova** (`q=brescia eventi`, `q=mantova eventi` → 0) | — | **SKIP** — nothing for the target towns | — |
