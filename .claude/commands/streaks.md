---
description: Refresh the Streaks habits on the dashboard (Life → Habits) from the latest iCloud backup, without redoing the week
---

The Streaks habits are read-only on the dashboard: a Mac script reads the Streaks app's iCloud backup (it can be ~2 days old) and the snapshot rides in a link, like `/settimana` and `/oggi`. Personal data never goes in this repo.

1. **Read the backup:** `~/life/_sync/streaks-sync.py` (read-only on iCloud; rewrites `~/life/_sync/streaks/snapshot.json`). If it says no backup was found, tell him and stop.
2. **Link:** `cd ~/Dev/personal/dashboard && npm run --silent life:streaks-link` (add `--force` if he asked for it explicitly). It prints the link, or **nothing** when the backup is no newer than the last link made: then say "Streaks già aggiornati (backup del <asOf>)" and stop. One error per line means a bad snapshot: tell him.
3. Open it from the shell in one command, `open -a "Google Chrome" "$(npm run --silent life:streaks-link)"` (never paste the link in the chat: a hand-copied link breaks), on the Mac (a browser signed in to the dashboard, not one that syncs history/tabs). The page shows a preview and he taps **Salva**, which replaces the Streaks rows and syncs to the phone. Never open the link on iOS. If he skips it, just say so (the next run will offer it again with `--force`).
4. End with one line: how many habits and the backup date.

Rules: the link is never saved without his tap; never put a habit in both Streaks and the plan trackers; don't edit the snapshot by hand.
