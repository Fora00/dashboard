---
description: Monthly check: what the month's data says per habit and area, a go up / stay / go down proposal for each, and the monthly review notes in ~/life
---

The monthly review (first Sunday of the month; the October one is Sun 01/11/2026) decides, with the numbers in front of the owner, which habit goes **up, stays or goes down**. This command gathers the numbers, reads them, proposes, and only after the owner's yes writes the notes. It is read-only until step 5. Personal data only goes into `~/life`, never into this repo. Tone: calm, no streak-as-weapon, a miss is a data point and a return after a miss is a good thing (`~/life/self-improvement/handoff-dashboard-recap.md`).

Month = the one just ended if today is in its first 7 days, otherwise the current one (partial: say "up to <date>" everywhere). A month name or `YYYY-MM` argument overrides.

0. **Refresh:** `~/life/_sync/pull.sh`, `~/life/_sync/streaks-sync.py`, `~/life/_sync/chores-sync.py`, `~/life/fincances/greenbooks-sync.sh`. If the Streaks backup is older than the month's last day, ask for a manual backup (Streaks → Settings → Backup) and rerun. A failed source never blocks the others: list it as "missing" in the report.
1. **Read the month** (read-only, counts and totals only):
   - **Dashboard export (first):** he taps **Export month for /month** in the dashboard (Life → Month), so the export is on the clipboard: read it with `pbpaste`. If it isn't a `# Life month` export, ask him to export first (or skip if he says there is nothing). It carries what only the app has: the live **Habits** of the Habits page for the month (done, floor, rest, missed, unmarked, target hit and reasons per habit), the progress lines (Focus, Habits, Oggi, Casa) against last month, tracker totals and target hits per week, the Spock reasons, and the Streaks strips as the app last imported them. Use it with the sources below, never instead of them.
   - **Habits (Streaks):** `_sync/streaks/summary.md` (done/failed per month, this and the last 3 months) and `_sync/streaks/snapshot.json` (28-day strip, current streak). Per habit: done days of days with a verdict, last month, weekly done of 7 for each week of the month, **returns** (a ✓ within a day after a ✗), the weekdays that fail most. A "don't" habit with no failure marked looks perfect: flag a habit whose log stops.
   - **Trackers and week plans:** the weeks of the month in `_sync/inbox/processed/` and `plan-<month>-*.md` (targets, focus, the Spock tests in `self-improvement/habits-flow-*.md`). Notion `Habits`, Journal and the habit tracker are hidden: never read them another way.
   - **Body:** climbing (Arrampicata) and running (Corsa) rows of the month in `_sync/calendar/notion.md`, steps and weight only if the Streaks habits carry them.
   - **Things:** to-dos completed in the month by area (logbook, AppleScript), `🎯` and ⭐ completed vs rolled over, open overdue ones, the `ping` tag (who he wrote first to).
   - **Calendar:** events of the month per calendar (persone, body, mind, hobbies, lavoro…) from `_sync/calendar/upcoming.md`.
   - **Money:** GreenBooks totals per category against `budget.csv`; totals only, never transactions.
   - **Plan and playbook:** the live goals in `plan-q4-2026.md`, the open trials and "Monthly review log" in `knowledge/playbook-pratica.md`, the criteria written beforehand.
2. **Read it (the insight):** answer, in this order, in short lines with the number next to each claim:
   1. **Did I keep the promises?** per area (Corpo, Mente, Persone, Cibo, Soldi): the promise, the number, vs last month.
   2. **Per habit:** done of days, the 4 weeks as bars, returns, the criterion written beforehand ("5 of 7 for 4 weeks": met x of 4), the Spock reason if one exists, then a **proposal**: up / stay / down / close, with one sentence why and **one lever** (one change at a time). Going down is allowed when the numbers say so.
   3. **Patterns:** weekdays, what the best weeks had in common (a climb? a walk? a person?), what changed vs last month. Hints only below 6-8 weeks of data, say so.
   4. **What didn't get measured:** missing sources, habits with no log, anything he said he'd do with no row anywhere.
3. **Dashboard:** tell him the Month view (Life → Week → Month) shows the same numbers from the app's own data, to read side by side. If its Streaks data is stale, `/streaks` refreshes it. Never invent numbers the app doesn't have.
4. **Decide, one habit at a time:** for each habit ask go up / stay / go down / close and wait. Don't bundle the questions; skip the habits he has no doubt about ("stay" by default, said once).
5. **Apply after his yes** (the stop-rule in `~/life/CLAUDE.md` still holds: no new councils or automations; the playbook theory changes only here, one in and one out):
   - `~/life/self-improvement/month-YYYY-MM.md`: the numbers (totals, no raw text), the decisions, the levers, what to measure next month.
   - `knowledge/playbook-pratica.md`: the entry in "Monthly review log" (held, what changed, what left) and the closed trials.
   - `self-improvement/habits-flow-*.md`: the new minimums/levels. Streaks changes are his to make in the app: list them.
   - Things: the next review as a to-do (`_sync/things-add.sh`, no recurring ones) and one to-do per lever, in the right list.
   - `_sync/CHANGELOG.md`: one line; remind him to run `_sync/build-upload.sh` if upload files changed.
6. End with: the month, per habit one word (up / stay / down / close), and the first lever he starts tomorrow.

Rules: read-only until step 5; counts and totals, never meal text, chat text or transactions in files; one decision at a time; propose, never decide for him; never put a habit in both Streaks and the plan trackers; no commits unless he asks.
