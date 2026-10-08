---
description: Add a hand-curated event to scripts/events/spot.json and re-crawl just that source
argument-hint: <event name, date(s), city, official URL if known>
---

Add the event described in `$ARGUMENTS` to `scripts/events/spot.json`
(rules: the `_readme` field of that file and "Spot events" in `docs/EVENTS.md`).

1. Read `scripts/events/spot.json` (match the formatting of existing entries;
   never reformat the file: edit it by hand, not by JSON round-trip).
2. Verify the dates on the OFFICIAL page (WebFetch / WebSearch). Never guess.
   - Confirmed on the official site: add normally.
   - Event surely exists but dates are only on aggregators or conflict:
     add with `"verified": false` (shown as "Date da confermare") and say so
     in the `summary`.
   - Cannot find it at all: do not add; tell the owner what is missing.
3. Entry: kebab-case `id` ending with the year (never changed later),
   `title`, `start`/`end` (`YYYY-MM-DD`, inclusive), `city`, `url`, one-line
   honest `summary`; optional `venue`, `tags`, `category`, `image`
   (the page's og:image, never a logo). New town? Add it to
   `scripts/events/areas.ts` too.
4. Run `EVENTS_ONLY=spot npm run events:crawl` (seconds: the og:image pass is
   skipped on partial runs) and check the event appears in
   `public/events.json` with the right `area`/`ring`.
5. `npm run check`. Do not commit unless asked.
