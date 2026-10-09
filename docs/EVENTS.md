# Events crawler and `events.json`

Project 12, phase 1. A zero-dependency Node script (`scripts/events/`) crawls
public event sources in Trentino, Bolzano and Verona and writes
`public/events.json`. The `crawl.yml` workflow runs it daily (and on manual
dispatch) and deploys; push deploys (`deploy.yml`) do not crawl, they reuse the
published file. See `docs/CI.md`. The file ships with the site:

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
| `lastNonZero` | number? | Events of the last successful fetch that returned more than 0. Health check only (added 2026-10-08). |
| `zeroSince` | string? | UTC ISO time of the first fetch, after a non-zero one, that returned 0 events; absent while the source delivers. Health check only (added 2026-10-08). |

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
| `area` | string | Region-sized bucket (added 2026-09-29): `trentino`, `alto-adige`, `verona-garda`, `veneto`, `lombardia`, `emilia-romagna`, `piemonte`, `toscana`, `abroad`; more may be added. See "Areas and rings". Absent in files written before 2026-09-29: derive it from `city` (`Bolzano` → `alto-adige`, `Verona` → `verona-garda`, else `trentino`). |
| `ring` | string | Distance ring (added 2026-09-29): `home`, `near` or `spot`. See "Areas and rings". Absent in older files: treat as `home`. |
| `url` | string | The event's own page at the source (https). Never just a homepage when the source has a per-event page. |
| `source` | string | Adapter id of the record that was kept. |
| `sources` | string[] | Every adapter id that listed this event (see "Dedup"); includes `source`; sorted. |
| `category` | string | Primary category id (see "Categories"). |
| `tags` | string[] | Every matching category id, in priority order; always includes `category`. May then contain `kids` (see "The `kids` tag") and the format tags `social-friend`, `social-girl`, `solo-ok` (added 2026-09-30, see "Format tags"), in that order. |
| `description` | string | Full plain text: HTML stripped, entities decoded, paragraphs separated by `"\n\n"` and line breaks by `"\n"`, at most ~2000 chars (cut on a word, ending with `…`). `""` when the source has none. |
| `summary` | string | One line of plain text, at most ~300 chars: the source's own abstract/intro when it has one, else the start of `description`. Can equal `description` for sources with only short text. `""` when none. |
| `image` | string \| null | Absolute https URL of the source's image for the event. Hot-linked from the source, never re-hosted; may disappear. |
| `occurrences` | number | `1` normally. `N > 1` when a series with more than 8 dates in the window was folded into one span record (see "Recurring events"). |
| `datesTentative` | `true` \| absent | Only on hand-added spot events whose dates are not confirmed on the official site (`verified: false` in spot.json); the page shows a "Date da confermare" badge. Absent otherwise. Added 2026-10-05. |
| `firstSeen` | string \| absent | UTC ISO time the crawler first published this id (the "New since last visit" badge). Set on ids absent from the previous `events.json`, then carried over on every later run. Absent on events already published before 2026-10-09, and on every event when there was no previous file to compare with: absent means never "new". Added 2026-10-09. |
| `subcategory` | string \| absent | Finer split of four big categories, Italian lowercase-kebab ids; absent when no rule recognises the event (never a guess, no "altro" bucket) and always absent for every other category. `theatre`: `prosa`, `stand-up`, `danza`, `musical-opera`, `ragazzi` (the `kids` tag stays: every kids theatre event is `ragazzi`); `concerts`: `classica`, `jazz-blues`, `rock-pop`, `folk-cori`, `elettronica`; `exhibitions`: `arte`, `fotografia`, `storia`, `scienza`; `talks`: `conferenze`, `libri`, `dibattiti`. The ids and Italian labels live in `scripts/events/subcategories.ts` (`SUBCATEGORIES`, for the app to mirror); the rules (title, then title + summary, then the source's character) in the same file, re-run on every crawl so carried-over events get it too. Season programmes ("Stagione 2026/2027") are classified by their title only. Optional, additive (2026-10-09). |
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
`start <= crawl time + 90 days` (`HORIZON_DAYS`, owner's choice: nothing beyond 3 months; an adapter can set its own `horizonDays`, the hand-curated `spot` one keeps 540 days). Adapters ask their source only for that window, so a shorter horizon also means fewer requests. Consumers should still hide events whose
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
accents stripped, punctuation/whitespace collapsed) + **when** + **normalised
city** match. *When* is the exact start instant for timed events (so the 17:00
and 21:00 showings of one show on one day stay two events, while the 21:00
showing listed by two sources merges) and the local start date for all-day
ones (changed 2026-10-08; before, timed events keyed on the day too). An
all-day record also folds into a timed one with the same title, day and city
when that day has exactly one timed showing; with two or more it stays apart. The richer record is kept (end time, venue, image,
timed rather than all-day, longer description), its missing fields are filled
from the other, `tags` are unioned and `sources` lists both. The title
comparison ignores case, so Arteven's capitals merge with TCVI's mixed case
(21 Vicenza performances on 2026-09-30); a subtitle difference ("Frida Opera
Musical" / "Frida - Opera Musical") still matches because punctuation is
collapsed, but different wording does not (Comune di Brescia's "Stagione
Teatro Grande 2026" vs Teatro Grande's "Sonoma"). Within one
source, duplicate ids are dropped.

The merged record takes the title in **natural case** among the matching
ones: the one with lowercase letters and the fewest capitals (Trentino
Cultura's "Il segreto di Francesco" over the Zandonai's title-cased "Il
Segreto di Francesco"). Added 2026-09-30.

A second, narrow pass (added 2026-09-30) merges **subtitled copies**:
timed events at the same instant in the same city, from different sources,
where one normalised title of 3+ words is a word prefix of the other ("Il
segreto di Francesco" / "Il segreto di Francesco. Lo spirito del Santo di
Assisi, oggi"). On the 2026-09-30 data it merged exactly two pairs, both
right. Here the kept (richer) record's title stays.

### Ids

`id = sha1(sourceId, nativeKey)[0..16]`. Native keys: the event URL
(Ludimus, Trentino Spettacoli), iCal `UID` (Volkan, Buonconsiglio), OpenPA
object id (+ occurrence start for calendar sources), Mart content id, Open
Data Hub id + occurrence start, normalised title + date (Tebe, which has no
per-event pages).
When dedup merges two records, the kept record's id survives, so an id can
disappear if a second source later publishes a richer copy. Rare, but
clients keying local state by id should tolerate a vanished id.

### Areas and rings

Both are set by the crawler from `scripts/events/areas.ts` (one file: area
ids and labels, a town → area map, the ring-2 interest list).

- **`area`**: the town map wins when it knows `city`; otherwise the source's
  own area applies (default `trentino`; `bolzano` is `alto-adige`, `verona`
  `verona-garda`, `spot` falls back to `abroad`). Unknown area ids should be
  shown by their id.
- **`ring`** (from the ROADMAP coverage plan):
  - `home` — ring 1, about an hour from Trento/Rovereto, every category.
  - `near` — ring 2 (1–1.5 h): only events whose `category` or `tags`
    include one of `creative`, `theatre`, `boardgames`, `festivals`, `food`
    (split off "Festivals & food" on 2026-09-30), `nerd`, `exhibitions`,
    `concerts` are published, and never a `kids` event. The
    filter runs at crawl time, after tagging.
  - `spot` — hand-curated big events in far cities (`spot.json`).
- When dedup merges records from two sources, the closer ring wins
  (`home` < `near` < `spot`); the kept record's `area` stays.

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
| `food` | Cibo e vino (added 2026-09-30) |
| `tours` | Visite (added 2026-09-30) |
| `outdoor` | Outdoor (added 2026-09-30) |
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
  stand-up, readings; German Theater/Schauspiel/Tanz. Opera has its own
  words (lirica, melodramma, operetta, libretto, "opera in tre atti",
  "stagione d'opera", "Progetto Opera"), so "Rigoletto — Opera in tre atti /
  Musica di Giuseppe Verdi" is `theatre` with a `concerts` tag, not a
  concert (2026-09-30).
- **`nerd`**: keywords count only in the title, summary and typologies,
  never in the long description (it name-drops "Fantasy" chamber pieces and
  "fumetti" stalls at flea markets). 2026-09-30.
- **`food`** (2026-09-30): food and wine as the point of the event — wine
  and food tastings (degustazione, Verkostung), cooking schools and classes,
  wine and Speck walks, Törggelen, wine festivals, sagre and the seasonal
  food feasts (chestnuts/Keschtn, castagnate, marroni, pumpkins, polenta,
  apple feasts, honey, cheese…). Before `festivals`, so "Festa del marrone"
  is `food` with a `festivals` tag while a village "Festa di San Rocco"
  stays `festivals`. A product, dish or meal word ("formaggio", "cena",
  "cucina", "sapori") counts only with a food-event word next to it (festa,
  sagra, degustazione, prodotti tipici, menu…), so "Il Poliziotto del
  Formaggio" stays a play. Title, summary and typologies only.
- **`tours`** (2026-09-30): guided tours (visita guidata, Führung, tour
  guidato), city walks and "passeggiate", underground tours, FAI and
  heritage days, extraordinary openings; a castle, fort, church, tower,
  villa or palace only together with a visit word (visita, tour, apertura,
  scopri…). A guided tour of an exhibition stays `exhibitions` (earlier in
  the order) with a `tours` tag unless the source types it "Visita guidata".
  Title, summary and typologies only.
- **`outdoor`** (2026-09-30): outdoor activities you take part in — hikes
  and trekking, e-MTB and bike tours, via ferrata, climbing, walking groups
  ("gruppo di cammino"), social runs, Hike & Fly, kayak, open regattas,
  Bolzano's Social Park. Spectator sport is not here: it is dropped (see
  "Dropped at crawl time"). Title, summary and typologies only.
- **Typology and raw-title rules** (2026-09-30): a source typology that is
  exactly "Teatro" makes a play `theatre` even when its summary talks about
  a kitchen; a title starting "Teatro:" / "Teatro - " is `theatre`.
- **Long series** (2026-09-30): an Open Data Hub (`bolzano`) item folded
  from 10 or more dates that no keyword classifies is `exhibitions` (museum
  and exhibition tickets are sold as daily dates without any text).
- **Open Data Hub performers** (2026-09-30): titles with an origin tag
  ("Pablo Held Trio (D)", "Delfeayo Marsalis Quintet (USA/CH/I)") are
  concerts; with a German low quote after the tag ("MAX BEIER (D): „LOVE &
  ORDER"") they are Carambolage cabaret (`theatre`). No other field tells
  them apart.

### Dropped at crawl time

Added 2026-09-30 (owner's decision). Some events are not published at all;
the rules live in `scripts/events/tags.ts` (DROP RULES) and match the title
and the source's typologies, plus a few unambiguous phrases in the summary
(never the long description). The crawl summary prints a count per rule and
source, so nothing disappears silently:

```
dropped by rule (tags.ts DROP RULES):
  professional-training    26  (mart 2, bolzano 8, verona 7, cultura-trentino 9)
```

| rule | what | examples |
|---|---|---|
| `no-title` | the title has no letter or digit ("...") | — (Open Data Hub "..." items now use their German title instead) |
| `professional-training` | work safety, refresher and trade courses, teacher-only previews, job-centre sessions | "Sicurezza sul lavoro: corso di aggiornamento", "Diplom Bier-Expert", "Visita guidata per i docenti…", typology "Formazione professionale" |
| `civic-notice` | council sessions, traffic notices, monuments lit up for a cause, "the Comune adheres to…" campaigns. Parades stay (parade, parata, sfilata, corteo, Umzug, pride) | "Consiglio Circoscrizione 4^ - Convocazione…", "Fontana del Nettuno illuminata di arancione…", "Lilt for Women" |
| `spectator-sport` | matches, championships, cups, trophies, races and regattas to watch — only when the event is `other`, `outdoor` or `festivals`, and never with a participation marker (non competitiva, aperta a tutti, social run, veleggiata, camminata) | "HCB Südtirol Alperia - partite casalinghe", "Calendario partite FC Südtirol", "Regata regionale di canottaggio", "International Finn Cup" |
| `course-wellness` | courses, yoga, gym, sauna and therapy, language groups ("conversazione", "Sprachen Café"), senior and civic campaigns — only when no category claimed the event (`other`), so a ceramics or music course stays | "Corso di Yoga", "Serate a tema nella sauna", "English Club", "Scuole d'italiano per stranieri", "Campagna nastro rosa" |

Records carried over from a previous file (a failing source) go through
the same rules.

### The `kids` tag

`tags` may also contain **`kids`**: a children's or family event (teatro
ragazzi, letture animate, "per bambini", age ranges like "6-10 anni" up to
14, school programmes, the source's own "Famiglie e bambini" type). It is a
tag, never a `category`. It is conservative: an event that also says it is
for adults ("adulti e bambini", "per tutti") is not tagged. Consumers may
hide these events (the dashboard page does). A `kids` event never has
`creative` as category or tag.

### Format tags

Added 2026-09-30. Three tags that describe an event's **format** (what you
do there), never its audience: they are a keyword proxy and make no claim
about who attends. Never set on a `kids` event. Keywords match the title and
typologies, and for most formats the summary; for theatre, cinema, concerts
and exhibitions only the title and typologies count (a show's summary
describes its content). The long description can only veto.

- **`social-friend`** ("new friends"): formats where regulars form groups and
  talk — open-table game nights (every `boardgames` event), tournaments,
  quizzes, group hikes and rides, climbing and running meetups, jam
  sessions and open mics, volunteering days and repair cafés, workshops and
  courses ("corso di …", laboratorio, workshop, Kurs — title only), book
  groups, and every `creative` event.
- **`social-girl`** ("meeting people, conversation-friendly formats"):
  speed dating and singles evenings, social dance (swing, lindy hop, salsa,
  bachata, tango/milonga, balfolk, contact jam, Tanzabend), yoga and
  body-mind practice, art and creative workshops (every `creative` event),
  book clubs, language cafés and conversation groups, wine tastings and
  aperitivi, wine courses ("ABC del vino", "L'abbicì del vino") and
  breath / art-perception practices ("Respirare l'arte", respirazione;
  2026-09-30). Body-mind practice, tastings, aperitivi, wine courses and
  breath practices count in the title/typology only.
- **`solo-ok`** ("fine to go alone"): primary category `talks`,
  `exhibitions`, `cinema`, `concerts`, `creative` or `boardgames`, any event
  with a social tag, and guided tours, readings, stand-up and open mics —
  minus dinners and lunches, table bookings, couples and family formats,
  group-only, members-only and private events. Theatre and
  festivals/fairs are not in the base set. When dedup merges two records,
  their format tags are unioned like the categories (one source often
  types the event more narrowly, e.g. `other`).

An event may carry several. Consumers that don't know these tags ignore
them (the dashboard's category chips match only category ids).

## Sources

| id | source | how | notes |
|---|---|---|---|
| `ludimus` | ludimus.it | static HTML: `/events.html` listing, date in the URL | detail pages (time, venue, text, image) fetched only for the next 30 days; later events are all-day until they come closer |
| `bibcom-trento` | bibcom.trento.it | OpenPA `/opendata/api/content/search/` | server-side future filter; branch prefix stripped from titles; images are relations only (null) |
| `trentogiovani` | trentogiovani.it | OpenPA `/opendata/api/calendar/search/` | robots disallows `/api/` and `/opendata` but Allows `/opendata/api/calendar`; often few events (`mayBeEmpty`) |
| `volkan` | volkantdg.it | The Events Calendar site-wide iCal `/events/?ical=1` | often stale: an empty feed is ok with 0 events (`mayBeEmpty`) |
| `rovereto` | eventi.comune.rovereto.tn.it | OpenPA `/opendata/api/content/search/` | `/api/` disallowed, `/opendata/api/content` allowed; the ~1,900-event archive is never paginated |
| `comune-trento` | www.comune.trento.it | OpenPA calendar (class `event_link`, OpenAgenda) | same robots situation as trentogiovani |
| `mart` | Mart / Casa Depero / Galleria Civica | Umbraco JSON on media.mart.tn.it (the API behind `/mostre-eventi`) | robots.txt 404 = allowed. A "Workshop/Laboratorio" whose text gives a children's age range ("Dai 5 ai 12 anni") → `kids` |
| `bolzano` | Open Data Hub tourism API | `/v1/Event`, `locfilter=mun<Bolzano>`, date window server-side | CC0; texts, venues and images are rarely filled for Bolzano. A "..." Italian title falls back to the German title / Shortname. Origin-tagged performer titles get a concert/cabaret hint; 10+-date series nothing classifies → `exhibitions` (`longSeriesCategory`) |
| `verona` | www.comune.verona.it | OpenPA calendar | robots disallows `/api/` and `/content/search`, explicitly Allows `/opendata/api/calendar` |
| `cultura-trentino` | www.cultura.trentino.it (Provincia, "Trentino Cultura") | OpenPA `/opendata/api/content/search/`, class `event` | whole province; town from the `comune` relation; date-only events get a time from `orario_svolgimento` when it names exactly one ("ore 20.30"); robots `Crawl-delay: 10` (honoured); images are relations only (null) |
| `rovereto-comune` | www.comune.rovereto.tn.it (ViviRovereto agenda) | OpenPA calendar, class `event` | robots Allows only `/opendata/api/calendar`; the municipal highlights (RAM film festival, season preludes) — `rovereto` above is the library's agenda |
| `zandonai` | www.teatro-zandonai.it (official) | OpenPA search, class `spettacolo`, `main_datetime` | same install as Rovereto; one request. Correctly configured and complete: it is the theatre's own programme (83 objects in 2025/26). The prose + dance season is published in **one batch in early October** (2025-10-07, up to 5 months ahead); other shows ~2 weeks ahead, so it is nearly empty in September (`mayBeEmpty`). Fixed venue "Teatro Zandonai"; all-caps titles title-cased (`fixCaps`); "… - ANNULLATO" dropped (`skipTitle`); the series ("STAGIONE TEATRALE", "FESTIVAL DEI PICCOLI" → `kids`) is the subtitle, in tagText. teatrozandonai.it (no hyphen) is an unofficial, stale fan site |
| `filarmonica-rovereto` | www.filarmonicarovereto.it (Associazione Filarmonica di Rovereto; not the Trento one) | WordPress + Modern Events Calendar: RSS `/events/feed/` (`mec:startDate`/`startHour`/`location`/`category`), then `wp/v2/mec-events` + per-event iCal `/?method=ical&id=<post>` for upcoming posts the RSS left out | robots allows all. RSS ignores `?paged=` and is probably capped at WP's posts-per-feed, so a freshly published season (~45 posts, created in one batch in early October) is completed from REST (dates only in titles "… \| 03.10.2026") + iCal (≤ 40/run). Venue names from the MEC JSON-LD `Place` of one event page per distinct address (≤ 8). "Preludio di Stagione – " prefix and the "\| date" suffix stripped from titles (so "Camera 02" merges with Trentino Cultura). "Concerti per le scuole" dropped; "Concerti per le famiglie" → `kids`. iCal ends > 4 h after the start (MEC defaults) dropped. `mayBeEmpty` (quiet in summer) |
| `arcadia` | www.libreriarcadia.com (Libreria Arcadia Ubik, Rovereto) | WP REST `/wp-json/wp/v2/posts?categories=4` (one request, 100 posts) | robots allows all. Posts have no event fields: the schedule is in the title ("VENERDÌ 2 OTTOBRE, ORE 19:00 NAME PRESENTA “BOOK”"), the year is not, and post publish dates are unreliable, so the year is the one in [today, horizon] whose weekday matches. Off-site evenings (Sala Kennedy / Urban Center, Museo Civico) set the venue. Category `talks`. `mayBeEmpty` |
| `riva-del-garda`, `arco`, `mori`, `ala`, `pergine` | www.comune.<town>.tn.it | OpenPA calendar, class `event` (one `openpa({...})` line each) | added 2026-10-01; robots Allow `/opendata/api/calendar` (Riva, Mori, Ala, Pergine) or no rule (Arco). Riva carries the library's reading groups and "Oltre la pagina" author evenings. Ala is nearly empty (`mayBeEmpty`). Lavis and Borgo Valsugana answer HTML, not the API: skipped |
| `buonconsiglio` | www.buonconsiglio.it (Buonconsiglio, Thun, Beseno, Stenico, Caldes) | Events Manager `/events.ics` | its CATEGORIES ("Adulti", "Famiglie e bambini", "Scuole") feed the `kids` tag |
| `trentinospettacoli` | www.trentinospettacoli.it (Coordinamento Teatrale Trentino box office) | schema.org Event microdata on `/eventi/` + WP REST `eventi` categories | one listing page + 2–3 REST calls; "Teatro ragazzi" → `kids`, "Cinema" → `cinema`, other "Spettacoli" without a keyword → `theatre`; no descriptions. Film screenings are folded per film and town (`foldScreenings`: start = next screening, all of them listed in the description, `occurrences` = count; a subtitle after " – " is the same film), so one film is one card per town, not one per showing; ids changed with this on 2026-10-03 |
| `muse` | www.muse.it (MUSE – Museo delle Scienze di Trento) | WordPress CPT `events`: calendar page "In corso" cards + newest 60 by REST publish date, then one page each | robots allows all. REST has no dates (ACF empty) and the calendar lists no dates: the sidebar of each event page has `ico-calendar` lines in Italian prose ("Dal 22 ottobre all'1 novembre 2026") parsed by `parseDates`, an "Inaugurazione …" line is skipped, several lines = several records; all-day. `map-pin` line = venue, town after a comma or " a / di <Town>" (default Trento). ~70 requests (≈2 min); an event published long ago and not "In corso" is missed. Exhibitions via `categoryHint`; default `talks`; `mayBeEmpty` |
| `tebe` | www.apstebe.org (Tebe APS, Teatro comunale di Bedollo) | static HTML cards (Next.js page, no feed) | one request; no per-event pages, links to `#eventi`; `mayBeEmpty` |
| `garda-veneto` | www.lagodigardaveneto.com (ring 1, `verona-garda`) | HTML listing `?page=N` with per-card `data-gtm-el` JSON | ~11 pages; ranges become all-day spans. Children's typologies ("manifestazioni per famiglie e bambini") count only when they are the event's only specific ones: "Festa del marrone D.O.P" also lists music, markets and tastings, so it is not `kids` |
| `padova` | www.comune.padova.it (ring 2) | Drupal JSON:API `/api/events` | date filters in unix seconds; 2 pages |
| `stabileveneto` | Teatro Stabile del Veneto (ring 2): Teatro Verdi, Ridotto, Foyer, Teatro Maddalene | **POST** JSON `api.teatrostabileveneto.it/api/Public/eventslist` (`ctx.postJson`) | 1 request; Padova only (Treviso/Venezia dropped); one all-day range per production (no nightly times); genre "Concertistica" → `concerts`, anything else → `theatre` |
| `tcvi` | www.tcvi.it (ring 2): Teatro Comunale Vicenza, Olimpico | one static HTML page, one card per performance | 1 request; school and family-show types dropped |
| `infinityboulder` | infinityboulder.it: Infinity Boulder gym, Mattarello (Trento) | WP REST `wp/v2/evento` + one page per event (`Data evento: dd/mm/yyyy`) | all-day, no time of day; often 0 upcoming (`mayBeEmpty`). Block3 (Rovereto) has no public events source: its calendar is school courses, the rest is on Facebook. |
| `santachiara` | www.centrosantachiara.it: Teatro Sociale, Auditorium, Cuminetti, SanbàPolis, Melotti Rovereto, Musicantica, Cinemart | form POST `/csc_shows` (`date-range=dd/mm/yyyy - dd/mm/yyyy`) → `{correct: html}`; `ctx.postForm` | 1 request for the whole window; Crawl-delay 10; no long descriptions (only a note such as "Ingresso libero") |
| `arteven` | www.myarteven.it (ring 2): Arteven circuit — Bassano (Teatro Remondini), Vicenza, Thiene, Schio… | JSON array `rappresentazionitotal` inlined in the home page | 1 request, ~3.7 MB; only `(VI)` theatres + Padova; capitals title-cased; weekday-morning shows (school matinées) dropped; children's rassegne → `kids`; Vicenza shows merge with `tcvi` in dedup |
| `mantova` | www.comune.mantova.it (ring 2) | Municipium HTML listing `/it/eventi?page=N` (`municipium()` factory) | ~5 requests; the date suffix of titles ("- dal 3 ottobre al 6 gennaio") is stripped and sets the range end |
| `teatrosociale-mantova` | www.teatrosocialemantova.it (ring 2) | HTML "calendar band" on `/it-it/spettacoli.aspx` | 1 request; no year on the cards: the year (this or next) whose date falls on the card's weekday; "spostato/annullato" rows dropped; `mayBeEmpty` |
| `brescia` | www.comune.brescia.it (ring 2) | Municipium HTML listing (same factory) | ~3 requests; range cards ("Da … a …") |
| `ctb` | www.centroteatralebresciano.it (ring 2): CTB, Teatro Sociale + Mina Mezzadri | static HTML listing `/spettacoli/` | 1 request; one all-day range per production (first night's time in the summary); morning-only productions (school matinées) dropped; no descriptions or venues |
| `teatrogrande` | teatrogrande.it (ring 2): Teatro Grande Brescia | static HTML calendar `/it/calendario`, `data-date` per row | 1 request; café opening-hours rows dropped except "Aperitivo in Jazz"; "under 11"/"Educational" rows → `kids` |
| `spot` | `scripts/events/spot.json` (hand-curated) | no network | see "Spot events" |

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
- **centrosantachiara.it** — added later as `santachiara` (see table): the
  calendar's own POST endpoint, no feed needed.
- **artesella.it** — WP, the `calendario` post type is not in the REST API,
  no JSON-LD, no iCal.
- **museion.it** — custom site, no feed or JSON-LD on `/en/events`.
- **eventi.unitn.it** — Drupal, `rss.xml` is empty, no JSON-LD; mostly
  academic seminars. webmagazine.unitn.it: `Crawl-delay: 10`, markup only.
- **fablab.unitn.it** — events are Eventbrite links (not scraped).
- **Ubik Trento** (ubiklibri.it): its events page only mirrors Instagram/Facebook posts of all Ubik shops, free text, no dates: skipped. **Due Punti** (Trento) and **Rovereto in Centro**: Due Punti is Facebook/Instagram only (hand-add); Rovereto in Centro's `evento` type holds ~4 yearly festivals (Natale, in Fiore, in Rosa, Sotto le Stelle) with empty ACF: better as `spot.json` entries.
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
- A request whose socket the server closes before answering (a stale
  keep-alive, seen on myarteven.it) is retried once, after the usual delay.
  POST (only `stabileveneto`) goes through the same robots check and delay.
- At least 1.5 s between requests to the same host — more when robots.txt
  sets a `Crawl-delay` (our group or `*`, capped at 30 s); 20 s timeout; at
  most 60 requests per source per run. Sources run one after another. Daily.

## Resilience

A source **fails** when it throws or returns 0 events while the previous run
had some (unless it is flagged `mayBeEmpty`). A failing source keeps its
previous events (re-filtered by the window, `ongoing` recomputed,
`fetchedAt` unchanged) from the previous `events.json` — by default the
deployed one — and reports `ok: false` with the error and the carried-over
`lastSuccess`. Failed sources surface as `::warning::` annotations and a
per-source table in the job summary (`::error::` if more than a third failed,
job still green; in CI the `crawl.yml` health job also opens an issue then,
docs/CI.md).

**Zero watch** (added 2026-10-08). Each source status carries `lastNonZero`
and `zeroSince` (`scripts/events/health.ts` `zeroTracking`). A source that
is accepted as ok with 0 events (a `mayBeEmpty` source, or one whose carried
events all aged out) although it delivered 5 or more before gets a
`::warning title=Events source returns 0::` every run until it delivers
again: a broken adapter that returns `[]` looks exactly like that.

**Carried-over records** are validated first (`validPreviousEvents` in
`scripts/events/schemas.ts`): a record without a string `id`, non-empty
`title`, parseable `start` and `source` is dropped with one
`::warning title=Previous events dropped::` (count + first problem) instead
of crashing dedup for every source; missing optional fields (`city`, `tags`,
`sources`, `end`, …) get safe defaults.

**URLs** (added 2026-10-08): `url` and `image` go through `absUrl` in
`toEvents` (http upgraded to https). A record whose `url` is not absolute
http(s) is dropped and counted as `invalid-url` in the "dropped by rule"
summary line; an image that is not becomes `null`.

**Publish guards** (`scripts/events/previous.ts`). The previous file is fetched
with 3 attempts (backoff 3 s, 10 s); a 404/410 or a missing local file means
"first run" and is fine, anything else that still fails is "unreadable". The
crawler then exits 1 **without writing** (so CI deploys nothing and the live
file stays the next run's previous) when (a) the previous file was unreadable
and any source that ran, not flagged `mayBeEmpty`, failed or returned 0 (its
events would be lost for good), or (b) the new total is below 50% of the
previous file's total (both numbers are logged). `EVENTS_FORCE=1` publishes
anyway (`::warning::` instead); in CI run `crawl.yml` by hand with **force**
ticked, e.g. after a real seasonal drop. Otherwise the script exits 0 unless it
cannot write the output file.

## Running locally

```sh
npm run events:crawl                     # all sources, ~4 min, writes public/events.json
EVENTS_ONLY=mart,verona npm run events:crawl   # only these (others keep previous events)
```

| env | meaning |
|---|---|
| `EVENTS_ONLY=id,id` | Run only these sources; the others keep their previous events and status. |
| `EVENTS_FAIL=id,id` | Simulate a failure of these sources (resilience testing). |
| `EVENTS_PREVIOUS_URL=…` | Previous file: `https://…`, `file://…` or a local path. Default: the deployed file. A 404 is a first run; garbage or a network failure trips the publish guard if a source also fails. |
| `EVENTS_OUT=path` | Output path (default `public/events.json`). |
| `EVENTS_FORCE=1` | Publish even when a publish guard refuses (see Resilience). |

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
   A Municipium (Maggioli) comune site is one
   `municipium({ id, name, host, city, area, ring })` entry
   (`adapters/municipium.ts`; Garda and Peschiera would be further lines).
   Use `calendar` where robots only allows `/opendata/api/calendar`, `search`
   where `/opendata/api/content/search` is allowed and the calendar is not
   configured ("Environment 'calendar' bad configuration").
   A class with other date fields (e.g. `spettacolo` with a single
   `main_datetime`) takes `timeFields: { from: 'main_datetime' }`.
   A single-venue site takes `venue` (used when an object names none);
   `fixCaps` title-cases titles written in capitals; `skipTitle` drops
   objects by title (cancellations).
   An iCal feed (The Events Calendar `?ical=1`, Events Manager
   `/events.ics`) is one `ical({ id, name, feed, home, city })` entry
   (`adapters/ical.ts`).
3. Anything else: a new `scripts/events/adapters/<id>.ts` exporting an
   `Adapter` (`id`, `name`, `defaultCategory`, optional `mayBeEmpty` /
   `maxRequests`, `run(ctx)`), using only `ctx.fetchText`/`ctx.fetchJson`
   (they enforce robots, delay, timeout and the request cap; a POST-only
   JSON API uses `ctx.postJson(url, body)`, same rules). Return
   `RawEvent`s — the orchestrator derives ids, tags, window, folding and
   dedup. Build times with `localToIso`/`dateToIso`/`normalizeIso` from
   `time.ts`. Give `seriesKey` to occurrences of one series.
4. Outside Trentino, give it an `area` (and `ring: 'near'` for a ring-2
   town); all three forms (`openpa`, `ical`, a hand-written `Adapter`) take
   both. Add its towns to `TOWNS` in `scripts/events/areas.ts` if they are
   new.
5. Add it to `ADAPTERS`, run `EVENTS_ONLY=<id> npm run events:crawl`, check
   the output, then document it in the table above.

## Spot events

Big, specific events in far cities (Lucca Comics, Artissima, Arte Fiera...)
are curated by hand in `scripts/events/spot.json`, read by the `spot` adapter
(no network). To add one, append to `events`: `id` (kebab-case with the year,
never change it once published), `title`, `start`/`end` (local Rome
`YYYY-MM-DD`, both inclusive), `city`, `url` (official page where you verified
the dates), `summary`, and optionally `venue`, `tags`, `category` and `image` (the event page's
`og:image`, picked by hand: skip logos and generic placeholders). Only
add dates confirmed on the official site; if an event is certain to exist but
its dates are only on aggregators (or conflict), add it with `"verified": false`:
it is published with `datesTentative` and shown as "Date da confermare" until
you verify it and drop the flag. The file is validated with zod
(`scripts/events/schemas.ts`): a malformed entry, a duplicate `id` or a
`category` that is not a CATEGORIES id in `tags.ts` fails the `spot` adapter
with the entry named, the crawl carries the previous spot events over. Entries stay in the file and appear
when they come into the spot horizon (540 days, not the 90 of the crawled sources).
Spot events get `ring: "spot"`; their `area` comes from the town map in
`scripts/events/areas.ts`, so add a new town there (else it lands in
`abroad`).

## Adjacent interests

`adjacent` is a tag, not a category (it sits beside `kids` and the format
tags): an event about illustration/comics/animation, sci-fi/fantasy/tech,
photography/design/architecture, nerd culture (Lego, Star Wars, retro
gaming...) or book fairs and book exhibitions ("Salone del libro", "mostra di libri antichi"; not every book presentation) that is not already boardgames, nerd or creative. Matched on the
title, summary and typologies only (`ADJACENT_WORDS` in `tags.ts`). The page
lists it as "Interessi adiacenti" and shows it by default, so those exhibitions
and talks surface while the rest stay hidden. Owner's topics, 2026-10-03.

## Images (og:image)

Most sources give an image URL directly. The OpenPA ones (Verona, Pergine,
Riva, Arco, Mori, Ala, Rovereto-comune, Trentogiovani, Trentino Cultura) only
give a relation (an object id) and their robots.txt forbids resolving it, so
`scripts/events/ogimage.ts` reads `<meta og:image>` from the public event page
after dedup (`OG_SOURCES`). Bounded per run: at most 150 pages and 8 minutes,
sources in turns, soonest events first. Images found earlier are carried over
from the previous `events.json` and never re-fetched; a page without a usable
image (missing, or a logo/placeholder by name) is listed in the optional
top-level `ogMisses` (event id → crawl time, additive) and retried after a
week. A backlog is worked off over a few daily runs. Sources with no usable
image at all (Bolzano's API has none, Padova's og:image is the site logo, the
Trento library pages have none) get the page's category placeholder instead.

## Adding a category

Add one entry to `CATEGORIES` in `scripts/events/tags.ts` (id, label,
keywords) at the priority position you want, and add the id to the
`CategoryId` union. For the dashboard page to offer it as a chip, add the
same id and label, in the same order, to `CATEGORIES` in
`src/projects/events/model.ts`. Keywords are written lowercase without accents; `word*`
matches a prefix. That is all — consumers treat unknown ids as `other` until
they learn the new one.

## Manual events

The owner can add events by hand on `/events` (the "＋ Add" button), e.g.
after a climbing gym's Instagram post. They never come from the crawler and
never appear in `events.json`.

- **Storage:** Dexie table `customEvents` (db v14) is the source of truth,
  so adding, editing and deleting work offline and signed out. Signed in as
  the owner, they sync through the generic engine
  (`src/lib/customEventsSync.ts`) to the Supabase table `custom_events`
  (`supabase/migrations/20261001120000_custom_events.sql`).
- **Owner-only:** RLS is `is_owner()` for every operation, like `life`. The
  page stays public; on anyone else's device the push is rejected and the
  event just stays on that device.
- **Fields:** `title`, `start`/`end` (same format as events.json: ISO with the
  Europe/Rome offset, all-day end inclusive; the form builds them from a date,
  an optional end date and optional times, no time = all day), `venue`,
  `city` (default Trento), `url` (http(s) or empty), `note`, `category` (a
  page category id, default `other`), `image`. Caps: title 300, venue 300,
  city 100, url 2000, note 2000, image 210,000 chars, mirrored in SQL.
- **Image:** downscaled in the browser to 800 px on the long side, JPEG 0.7,
  lower quality/size until the data URL fits the cap (about 150 KB), and
  stored inline in the row. No Storage bucket.
- **In the list** (`src/projects/events/custom.ts`): each one becomes an
  `Event` with `source`/`sources` = `manual`, `ring: home`, `area` from a
  small town map (unknown town → `trentino`), `tags: [category]`,
  `description` = the note and `summary` = its first line, `occurrences: 1`.
  They are never dropped by the kids rule nor by the favourite-category
  default (an explicit category, area or city choice still applies), work
  with no `events.json` at all, and can be saved or hidden like any event.
  The card shows an "Added by you" badge and an Edit button; delete is in
  the edit sheet, with Undo.
- **Prefill link** (for an iOS Shortcut or share sheet):
  `#/events?add=1&title=…&url=…` opens the add sheet prefilled. Also read:
  `date` (YYYY-MM-DD), `time` (HH:MM), `venue`, `city`, `category`, `note`
  (or `text`; a link inside `text` fills `url` when `url` is missing). Every
  value is validated and capped; the keys are removed from the URL after use.

Hand-added events are deleted automatically 14 days after their last day
(`pruneCustomEvents`, run when `/events` opens; the deletion syncs like any
other). A saved mark keeps its own snapshot.

## Saved & hidden sync

Saved/hidden events (`eventMarks`, with an event snapshot) and favourite categories (`eventPrefs`) sync across the owner's devices (`src/lib/eventMarksSync.ts`, tables `event_marks` and `event_prefs`, migration `20261001130000_event_marks.sql`). Owner-only, like hand-added events; on other devices the marks stay local. Last write wins by `updatedAt`; first sync unions both devices' marks and favourites.

Marks are pruned once their event is over (last day before today): `pruneEventMarks` runs when /events opens and deletes the saved *and* hidden mark through the outbox, so the server row goes too.
