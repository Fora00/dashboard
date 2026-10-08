---
description: Diagnose one events source that is failing or publishing 0 events
argument-hint: <adapter id, e.g. ctb>
---

Diagnose the events adapter `$ARGUMENTS` (code: `scripts/events/adapters/`,
docs: `docs/EVENTS.md`). Read-only until you know the cause.

1. Its status: `node -e "const f=require('./public/events.json');console.log(f.sources.find(s=>s.id==='$ARGUMENTS'))"`
   (or the published file at https://fora00.github.io/dashboard/events.json).
2. Run it alone: `EVENTS_ONLY=$ARGUMENTS npm run events:crawl` and read the error.
3. Tell these causes apart before changing code:
   - **Filtered, not broken**: the adapter returns events but the pipeline
     drops them (ring `near` keeps only NEAR_INTERESTS; theatre/kids are out;
     see `keepForRing` in `tags.ts` and the "dropped by rule" line). Fix: the
     adapter should be `mayBeEmpty`, not "repaired".
   - **Anti-bot / transient**: HTML `sgcaptcha`, 403/429, timeouts. Re-run
     later; never spoof the User-Agent or bypass the challenge.
   - **Format changed**: the zod error names the field (`scripts/events/schemas.ts`);
     `curl` the page with the crawler's honest UA and compare with the adapter
     header comment.
   - **Genuinely empty**: off-season calendar; set `mayBeEmpty` if so.
4. Fix only what the cause requires, add or update the adapter test when the
   parsing changed, then `npm run check`. Do not commit unless asked.
