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
  "checkins": [{ "date": "2026-01-31", "label": "Monthly review" }]
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

## 2.2 The Week screen (default view of `/life`)

1. **Focus:** the items, big. Tap marks done for the week.
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
removed from the plan. Copy to clipboard; `navigator.share` when available.

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
