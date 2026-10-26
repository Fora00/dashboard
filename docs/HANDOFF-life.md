# Handoff: the "Life" project

Read `CLAUDE.md` and `ROADMAP.md` fully first; their rules win over this file.
Hard rules repeated here: no AI author/co-author lines, no commit unless the
owner asks, `npm run build` must pass, local-first (works offline and signed
out), mobile-first.

**Privacy (non-negotiable):** GitHub Pages and this repo are public. No
personal content from the owner's life ever goes into the repo or the build:
no real names, plans, tasks or tracker labels, not even in fixtures,
placeholders, docs or the ROADMAP. Examples and tests use obviously fake data
("Focus A", "Tracker A", "Friend X"). Real content only ever lives in the
owner's Dexie db and the owner-only Supabase rows.

Show/hide per project, which was also in the first version of this handoff,
shipped 2026-09-28 (see ROADMAP).

---

## What Life is

A weekly bridge between the owner's private notes (kept outside this repo,
maintained with a Claude session) and their phone. It is **not** a todo list
(tasks live in Things 3) and **not** a journal (that's on paper).

Id `life`, emoji 🧭, `ownerOnly: true`. **Synced like the other projects**
(generic engine, `SyncCard`), but RLS is **`is_owner()`**, not `is_member()`:
no guest can ever read it, and `life` must not appear among the shareable
projects on `/sharing`.

## Decisions (agreed with the owner 2026-09-28)

1. **Two tables, plan vs log.** With sync, a single per-week blob would make
   a +1 on the phone and a +1 on the Mac overwrite each other (LWW).
   - `life_weeks` — one row per week, key `week` (Monday, ISO date). Holds
     the imported plan (`plan` jsonb) + `importedAt`. Changes only on import.
   - `life_entries` — one row per thing logged: a tracker +1 (with optional
     energy before/after), a focus marked done, a Sunday answer, a task
     sent to Things. Tracker +1s are append-only rows with their own id.
     Focus-done, Sunday answers and task-sent use a **deterministic id**
     (e.g. `${week}:focus:${focusId}`), so toggling twice updates one row
     instead of creating duplicates. Two devices never write the same row
     except for those keyed toggles, where LWW by `updatedAt` is correct.
2. **Stable ids everywhere.** Focus items, tasks, trackers and Sunday
   questions all carry an `id` in the JSON. Entries link by id, never by
   text or position, so renaming something never loses what was logged.
3. **Re-import** of the same `week` replaces the plan entirely and never
   touches `life_entries`. Entries whose id is no longer in the plan stay:
   hidden in the UI, listed in the export as "(removed from plan)". The
   import preview shows the diff ("1 tracker removed, 2 tasks added").
4. **Week and day boundaries** in device local time, Monday–Sunday, same
   day-key logic as Habits (`YYYY-MM-DD`).
5. **Things bridge** — see 2.3. Behaviour verified against the real app on
   2026-09-28.
6. **Trackers stay separate from Habits** (default; no mapping).

## Food (Meal Diary) in the week

Added 2026-10-05. The Life week screen shows a read-only **Food** section
(average per logged day and per-day totals) from the `meals` table of the
Meal Diary, live, also in History. "Export week" appends a `## Food` Markdown
section and a `meals` array in the JSON block (only when the week has diary
entries; `life-things-status.ts` ignores it). Code: `model/meals.ts`
(`summarizeMealsWeek`), `week/FoodSection.tsx`, `model/export.ts`. Nothing is
stored in Life tables: the diary stays the source of truth. Estimates are
marked `≈`; `/meal-reconcile` fills missing values before exporting.

## Oggi (today's focus)

Up to 3 free-text lines for the current day, shown as an amber "☀️ Oggi" card
right above the weekly Focus on `#/life` (also when the week has no plan).
There is no input: the `/oggi` command picks the lines from Things and prints a
link `#/life/oggi?d=<base64url {day,lines}>` (`npm run life:oggi-link`). The
owner opens it on the Mac, previews, taps Save (replaces that day's lines,
keeps ticks of unchanged lines); sync carries it to the phone. On the page the
lines can be ticked or deleted. Only today's list is shown; nothing carries
over. Own table `life_day_focus` (migration `20261021120000_life_day_focus.sql`,
RLS `is_owner()`), id `${day}:${slot}` with slot 0-2 so a day never exceeds 3
rows. NOT in the week plan JSON, the summary or the export. Code:
`week/DayFocusSection.tsx`, `LifeToday.tsx`, `model/dayFocus.ts`,
`model/dayFocusLink.ts`, `setDayFocus` in `lifeSync.ts`.

## 2.1 Import the week (pasted JSON)

Life → "Import week": paste, validate, preview (with the diff), save.
Invalid JSON or schema → clear error, nothing saved partially.

**Import link (the comfortable path):** route `#/life/import?d=<base64url
JSON>` opens the same import screen prefilled; the owner reviews the
preview and taps Save. The owner's Mac-side Claude session opens this link
in the Mac browser. The data rides in the URL fragment, which browsers never
send to the server. Never auto-save from the link, always preview. If
signed out, show a clear note that the week stays on this device only.
Don't open it on iOS: links open in Safari, whose storage is separate from
the installed PWA. The phone gets the week through sync.

```jsonc
{
  "version": 1,
  "week": "2026-01-05",                // Monday, ISO date: the key
  "focus": [                           // max 3
    { "id": "f1", "title": "Focus A" },
    { "id": "f2", "title": "Focus B" }
  ],
  "rules": ["Rule 1", "Rule 2"],       // short lines, shown as a card
  "tasks": [                           // go to Things, NOT a todo list here
    { "id": "t1", "title": "Reply to Friend X", "when": "2026-01-06",
      "deadline": null, "area": "Area A", "project": "Project A",
      "tags": ["tag-a"], "notes": "" }
  ],
  "trackers": [                        // weekly counts
    { "id": "tr1", "emoji": "⭐", "label": "Tracker A", "target": 3 },
    { "id": "tr2", "emoji": "🔹", "label": "Tracker B", "max": 2, "energy": true }
  ],
  "sundayCheck": [                     // the Sunday form
    { "id": "q1", "label": "Question A", "type": "number" },
    { "id": "q2", "label": "Question B", "type": "boolean" },
    { "id": "q5", "label": "Tracker A 3 times?", "type": "boolean", "tracker": "tr1" },
    { "id": "q3", "label": "Question C", "type": "text" },
    { "id": "q4", "label": "Question D", "type": "scale5" }
  ],
  "checkins": [{ "date": "2026-01-31", "label": "Monthly review" }],
  "playbook": {                        // optional: the week's one practice
    "section": "Section A",            // playbook section (max 100)
    "practice": "Example practice",    // the line chosen (max 300)
    "plan": "Once in the morning"      // optional: when/how (max 300)
  }
}
```

`listId` on a task (optional) is the Things id of its area/project, set on
the Mac by `scripts/life-things-lists.ts`. "Send to Things" passes it as
`list-id`, which survives renames in Things; without it, `project ?? area`
is matched by exact name (a miss lands in the Inbox).

`tracker` on a Sunday question (optional, `number`/`boolean` only) links
it to a tracker of the same plan: the answer is computed from the week's
log — `number` = count, `boolean` = target reached (or done at least once
without a target) — and never typed. Use it for every question a habit
already answers.

Validation: ids unique within each array; `week` must be a Monday; dates
`YYYY-MM-DD`; `target`/`max` positive integers; text lengths capped (mirror
the caps in SQL, per the `links` pattern).

### Spock test: why not + habit ideas

Added 2026-10-26. In the **Sunday check** (`week/SpockWhy.tsx`) every habit
with a target that is under it this week asks "why not?" (one line, max 500).
Next to every habit (Habits block and the Sunday list) a 📈 button opens its
history sheet (`week/HabitHistory.tsx`): the last 12 weeks (done/target and the
reason given) and the **ideas to make it work**, which the owner adds, edits,
moves through To try / Trying / Works / Dropped, or deletes. Both are
`life_entries` rows, no new table:
- `why`: keyed `${week}:why:${trackerId}`, `value: { reason }`, edited in place
  (an emptied reason keeps the row with `reason: ""`). Shown in
  `summarizeWeek().whys` and the export under the habit as `why not:`.
- `idea`: random uuid id, `ref` = tracker id, `week` = the week it was written
  in, `value: { text, status }` (text max 300, status `open|trying|done|dropped`).
  It belongs to the habit, not to a week: never part of a week summary, read
  across weeks by `useHabitHistory` / `buildHabitHistory` (`habitStory.ts`).
  The export lists the live ones (not `dropped`) under the habit as `ideas:`,
  whatever week they were written in.
History follows the **tracker id**, which `/settimana` keeps stable for a habit
that continues (renaming the label loses nothing; a new id starts a new story).
Migration `20261026140000_life_habit_why_ideas.sql` widens the kind check and
caps both values. Code: `setWhy` / `addIdea` / `updateIdea` / `removeIdea` in
`lifeSync.ts`.

### Playbook of the week (optional)

Added 2026-10-26. `playbook` in the week JSON (absent on older plans, which
still validate and render; `version` stays 1 because the field is additive,
like `recap`) names the one practice from the owner's playbook chosen for the
week. `section` and `practice` are required one-line texts, `plan` optional;
unknown keys are an import error. It lives in the `plan` jsonb: no column.
Edits by hand keep it. The Week screen shows a "📖 Playbook of the week" card
(`week/PlaybookSection.tsx`) with an optional note field and a **"Used it
today"** button. It follows the tracker pattern: one use per day, tapping again
today undoes it. Entries are `life_entries` rows of kind `playbook`
(`ref: "playbook"`, `value: { note? }`, note max 300), append-only with a random
id like a tracker +1, so two devices never collide; Undo deletes the row. The
migration `20261026120000_life_playbook.sql` only widens the kind check and
caps the note. Entries whose week no longer has a playbook stay stored and show
up in the export as "(removed from plan)". Code: `logPlaybook` /
`setPlaybookNote` in `lifeSync.ts`, `summarizeWeek().playbook`.

### Recap (optional, read-only)

Added 2026-10-15. `recap` in the week JSON (absent on most plans) is a list of
up to 12 lines the Mac-side Claude computes; the app only draws it
(`week/RecapSection.tsx`, also in History) and puts it in the export. Edits by
hand keep it. `kind: "minimum"` has `weeks` (oldest to newest, Monday dates,
`done` of `of` 1–7, max 12) and optional `returns`; `kind: "progress"` has
`points` (`date`, `value`, max 24) and optional `unit`; both take an optional
`criterion` `{ text, met, of }` and `closed: true` (an experiment stopped on
purpose, shown calmly, criterion hidden). Ids are stable and unique. Invalid
recap = import error, nothing saved. No migration: it lives in `plan` jsonb.

**Month view** (Life → "Month", `week/MonthView.tsx`, `week/monthRecap.ts`):
read-only; one entry per month with a recap (the month of a week's Monday),
spoken for by that month's latest week with a recap. Same lines as the week
card plus the question "go up, stay, or go down?". Nothing is stored: the
decision lives in Notion and Things.

## 2.2 The Week screen (default view of `/life`)

1. **Focus:** the items, big. Tap marks done for the week.
1b. **Playbook of the week** (only when the plan has one): section, practice,
   plan, uses so far and "Used it today" with an optional note.
2. **Trackers:** one row each, today's "+1", a Mon–Sun dot row.
   `target` shows `n / target`; `max` is a ceiling — soft warning when
   reached, never blocks; `energy: true` asks energy before/after (1–5) on
   log. Undo a mistaken +1 (reuse `useUndoSnackbar`).
3. **Rules:** collapsible card.
4. **Next check-in:** countdown to the nearest future `checkins` date.
5. **Sunday:** visible Sat/Sun or via a button — the `sundayCheck` form,
   saved per week.

## 2.3 Send tasks to Things

Button "Send N tasks to Things" opens a **`things:///json?data=…`** URL
(`add-json` is deprecated). Array of `{ "type": "to-do", "attributes": {…} }`
with `title`, `notes`, `when`, `deadline`, `tags`, `list`. No auth token
(creation only; we never update Things items).

Verified on the owner's Mac 2026-09-28 with fake to-dos:
- `list` naming a project/area that doesn't exist → the to-do lands in the
  **Inbox**, no error.
- A tag that doesn't exist is **silently dropped**.
- `when: "today"` → Today; `when` + `deadline` dates both honoured.

So: `list` = project if present, else area; **always** append
`Area › Project` to the notes so nothing is lost if the name is wrong.
Official constraints: 250 items per 10 s, notes ≤ 10,000 chars, the user
must enable *Settings → General → Enable Things URLs*.

"Sent" only means "the link was opened" — Things can return created ids via
x-callback, but from an iOS PWA the callback would open Safari, not the app.
Mark tasks sent (entry per task id) so a second tap doesn't duplicate, and
offer "Resend selected". Still to test: `window.location.href = url` from
the **installed iOS PWA**.

## 2.4 Export the week

"Export week" → Markdown (plus the JSON in a collapsible block): focus
done/not, tracker counts per day with energy pairs, Sunday answers, entries
removed from the plan. When the Events page has saved events overlapping the
**following** week (Mon..Sun after the exported one; max 30, by start), a
`## Saved events next week` section lists them (`- Sat 2026-10-17 21:00 ·
Title — Venue, City`, no time if all-day) plus a `Favourite categories:` line,
and the JSON block gets a `savedEvents` array (only when non-empty).
`/settimana` proposes placing them in the new plan. When the plan has a
`playbook`, a `## Playbook` section lists `Section`, `Practice`, `Plan`, `Uses`
(count and days) and one indented line per use that has a note
(`  - 2026-01-06: note`); the uses are also in the JSON `entries` as
`kind: "playbook"` (`ref: "playbook"`, `value.note?`). Local only (Dexie
`eventMarks`/`eventPrefs`); code in `model/events.ts`. Copy to clipboard; `navigator.share` when available.

## 2.5 History

List of past weeks; tap → read-only view + re-export.

## Acceptance

- Works fully offline and signed out; syncs owner-only when signed in.
- Owner-only on the home grid and absent from `/sharing`.
- Invalid JSON → clear error, nothing partial saved.
- Import → log on two devices → export: counts match, nothing overwritten.
- Re-import keeps every logged entry.
- Things link opens the app with the right items (test on iPhone PWA).
- No real personal data anywhere in the repo, build or ROADMAP.
- `npm run build` passes; ROADMAP updated.
