---
description: Add a fixed weekly activity (games night, group, course) to scripts/events/recurring.json and re-crawl just that source
argument-hint: <activity, place, weekday and time, official URL if known>
---

Add the activity described in `$ARGUMENTS` to `scripts/events/recurring.json`
(rules: the `_readme` field of that file and "Recurring activities" in
`docs/EVENTS.md`). This is for things with a FIXED timetable that the place's
site does not publish as a calendar. A one-off or a dated event goes to
`/add-spot-event`; a course "on request" with no fixed dates is not an event:
tell the owner and add nothing.

1. Read `scripts/events/recurring.json` (match the formatting of existing
   entries; edit by hand, never by JSON round-trip).
2. Verify the timetable on the OFFICIAL page (WebFetch / WebSearch): weekday,
   start time, where, and the run (season or course start/end). Never guess.
   Check the site's robots.txt before fetching more than a page or two.
   - Confirmed: add normally.
   - Surely exists but the timetable is only on Instagram/Facebook or
     aggregators: add with `"verified": false` and say so in the `summary`
     (never scrape Instagram or Facebook; the owner can paste the post).
   - Cannot find it: do not add; tell the owner what is missing.
3. Entry: kebab-case `id` (stable, never changed), `title`, `city`, `venue`,
   `url` (official page), one honest `summary`, `weekdays`, `time`, `from`,
   `until` (a season's first and last day), optional `durationMin`,
   `everyWeeks`, `skip` (holidays), `tags`, `category` (boardgames, creative,
   courses, outdoor…). New town? Add it to `scripts/events/areas.ts` too.
4. Run `EVENTS_ONLY=recurring npm run events:crawl` (seconds) and check in
   `public/events.json` that the dates are right (weekday, time, no meetings
   after `until`) and that the records carry `recurring` and one `series.id`.
5. `npm run check`. Do not commit unless asked.
