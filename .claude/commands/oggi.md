---
description: Pick today's focus (1-3 Things to-dos tagged 🎯) and show it on the dashboard (Life → Oggi, also on the phone)
---

Daily focus lives in Things (tag `🎯`, which already exists) and is mirrored to the dashboard's **Oggi** section through an import link (like `/settimana`). Personal titles never go in this repo: the lines only travel in the link, which is opened on the Mac and then synced to the owner-only table.

0. **Snapshot (chores):** run `~/life/_sync/chores-sync.py` (Things project "Casa catia": recurring chores with their counter); it rides in the Oggi link of step 5 (one Save for focus and chores). Habits are no longer a snapshot: they live in the dashboard's Habits page and Life reads them live, so **do not run `streaks-sync.py` and always pass `--no-streaks`** to the link. Don't let a chores failure block the rest (`--no-chores` to skip on purpose).
1. **Read** (AppleScript): to-dos in Today, to-dos tagged `🎯` (leftovers from yesterday), the week's ⭐ to-dos, and today's events in `_sync/calendar/upcoming.md` (run `_sync/pull.sh` if stale).
2. **Clean up:** for every `🎯` leftover ask: done / still today / drop. Remove the tag from done or dropped ones; rolled-over ones keep it only if he confirms.
3. **Propose 1-3** for today, preferring the week's ⭐ items, then what has a deadline or a person waiting (`ping` tag), sized to the free hours in the calendar. One line each with why. Ask before tagging.
4. **Apply** after his OK: make sure each is scheduled for today and add the tag `🎯` (keep its other tags). A non-Things idea he mentions: create it with `_sync/things-add.sh "Titolo" today "" 🎯 "" <list>` first.
5. **Dashboard:** `cd ~/Dev/personal/dashboard && npm run --silent life:oggi-link -- --no-streaks <YYYY-MM-DD today> "Titolo 1" "Titolo 2"` prints the link (or one error per line: fix and rerun); it adds the chores snapshot by itself (Streaks is left out: habits are live in the app). Titles = the Things titles, without emoji prefixes. With no focus lines (all skipped) the link can still carry just the chores. `open "<link>"` on the Mac (a browser signed in to the dashboard, not one that syncs history/tabs); the page shows a preview (focus, chores) and he taps **Salva**, which replaces today's lines and the chores, and syncs to the phone. Never open the link on iOS. If he skips it, just say so.
6. End with the list, in one line.

Rules: max 3; a `🎯` must be a real Things to-do; never remove the weekly ⭐ / ⭐️ from here; the link is never saved without his tap.
