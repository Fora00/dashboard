---
description: Round-trip the Life week between ~/life and the dashboard (export in, new week out)
---

Weekly sync between the owner's private `~/life` notes and the dashboard's
Life project. Canonical copy of this command: it lives in the dashboard repo
so the formats below change together with `src/projects/life/model.ts`.
`~/life/.claude/commands/settimana.md` only points here.

**Privacy:** this file is in a public repo. Never write personal content
here, in the repo, or in any file outside `~/life`. `~/life` never leaves
the Mac: no git remotes, no uploads, no cloud sessions. Read `~/life` only
as far as this command needs.

Paths: dashboard = `~/Dev/personal/dashboard`, notes = `~/life`.

## 1. Bring the past week in (dashboard → ~/life)

1. The owner has tapped "Export week" in the dashboard, so the export is on
   the clipboard. Read it with `pbpaste`. If it isn't a Life export (it
   carries a `<details>` block with `{ "plan", "entries" }` JSON), ask the
   owner to export first. If they say there's nothing to bring in, skip to 2.
   The export also carries the week's **food** when the Meal Diary has entries
   for it: a `## Food` section (average per logged day, per-day totals, what was
   eaten) and a `meals` array in the JSON. Values marked `≈` are estimates. If
   many entries have no values, suggest running `/meal-reconcile` first and
   exporting again. Bring food into `~/life` the way `~/life`'s own
   instructions say (usually a summary: averages and notable days, not every
   entry); it is the owner's data and stays on the Mac.
   It may also carry a `## Saved events next week` section (and a
   `savedEvents` array in the JSON): the events the owner saved in the
   dashboard's Events page for the coming week, plus their favourite
   categories. Use it in step 2.1 below.
2. Check what happened in Things to the week's tasks (read-only, Mac only):
   `pbpaste | npx -y tsx ~/Dev/personal/dashboard/scripts/life-things-status.ts`.
   It matches by each send's timestamp, so renamed to-dos are still found.
   It prints completed / open / canceled / deleted per task, duplicates from
   a resend, and anything it couldn't match. Only its printed report
   matters; don't query Things more broadly. Carry open tasks into the new
   week's proposal if the owner wants them.
3. Update the files in `~/life` following **`~/life`'s own instructions**
   (its CLAUDE.md or equivalent). This command doesn't define which files
   change or how. Show the owner a short summary of what you changed.

## 2. Prepare the new week (~/life → dashboard)

1. With the owner, decide the coming week from `~/life`. Write the plan as
   JSON per the schema in the dashboard's `docs/HANDOFF-life.md` (section
   2.1): `week` is the coming Monday. **Keep ids stable** across weeks for
   anything that continues (trackers, recurring questions): logged entries
   link by id, so a renamed label with the same id keeps its history.
   A Sunday question a habit already answers ("gym 3 times?", "how many
   runs?") gets `"tracker": "<tracker id>"` and type `boolean`/`number`:
   the dashboard fills it in by itself, the owner never types it.
   Read the export's `## Saved events next week` section too and propose
   where those events fit in the coming plan (day, time, what they displace),
   and which favourite categories are worth a slot. They are the owner's
   choices, so propose and let them confirm; never add them silently.
2. Tags on tasks must already exist in Things, or Things drops them
   silently. If unsure, list them (read-only):
   `osascript -e 'tell application "Things3" to get name of tags'`.
3. Write the JSON to a temp file (never inside either repo). If tasks have
   an area/project, link them to Things (read-only lookup):
   `npx -y tsx scripts/life-things-lists.ts <file> > <file2>`.
   It sets each task's `listId` and the exact Things name, matching loosely
   ("casa" → "🏡Casa"). On "no match"/"ambiguous" (exit 1), ask the owner
   and fix the name; never guess. The id keeps working if the area is
   renamed in Things later.
   Then validate it with the app's own validator:
   `cd ~/Dev/personal/dashboard && npx -y tsx scripts/life-link.ts <file2>` (or `<file>` if nothing to link).
   It prints the import link, or one error per line: fix and rerun.
4. Delete the temp files, then `open "<link>"` on the Mac. The dashboard shows
   the preview; the owner reviews and taps Save. Sync carries it to the
   phone. Never open the link on iOS (Safari's storage is separate from the
   installed PWA).
   Open it in a browser that does not sync history/tabs (not Chrome/Safari
   signed in to a sync account), or skip the link: copy the plan JSON and paste
   it in the Import screen. Why: Life data never leaves the Mac except via
   owner-only Supabase, and a synced history entry would leak it.
5. Remind the owner, if the plan has tasks: "Send to Things" from the Life
   page.
