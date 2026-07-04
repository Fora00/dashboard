# WORKFLOW — how this project gets built

Three roles, one queue (`ROADMAP.md`), cheap models doing the typing.

## Roles

| Role | Who | Does | Never does |
|---|---|---|---|
| **Orchestrator** | top-tier model (Fable/Opus session) | reads roadmap, analyzes, writes briefs, launches builders, reviews diffs, runs final build, updates ROADMAP.md, commits | grunt implementation it can delegate |
| **opus-builder** | `.claude/agents/opus-builder.md` | `[opus]` tasks: sync engine, migrations/RLS, auth, tricky state, anything security-adjacent | `db push`, commits, ROADMAP edits |
| **sonnet-builder** | `.claude/agents/sonnet-builder.md` | `[sonnet]` tasks: copy a named reference pattern (new CRUD page, replicate an integration, UI polish, docs) | inventing new patterns/schemas |

Routing rule of thumb: **if the task needs a decision, it's [opus] (or the
orchestrator); if it needs a reference file imitated, it's [sonnet].** When a
sonnet-builder reports "the brief seems to require a new pattern", re-route to
opus instead of re-prompting sonnet.

## Task brief template (what the orchestrator sends a builder)

```
GOAL: one sentence.
CONTEXT: read ROADMAP.md; read <files>.
REFERENCE: imitate <file/flow>          # mandatory for sonnet
CHANGES: numbered, concrete.
DO NOT TOUCH: <files owned by parallel agents / orchestrator>
ACCEPTANCE: npm run build green; <behavioral checks>.
REPORT: files changed, build result, what was left out.
```

Briefs for "add a new subproject" tasks should point the builder at
`docs/NEW_PROJECT.md` — it is the complete 7-step recipe (registry, route,
Dexie, sync wrapper, SQL template, SyncCard, owner-applied `db push`).

## Parallelism rules (learned 2026-07-04, they work)

- Parallel builders must have **disjoint file sets**; name each agent's
  forbidden files explicitly in both briefs.
- Migrations: the orchestrator assigns each agent an **exact migration
  filename** up front so timestamps never collide.
- Nobody but the orchestrator edits `ROADMAP.md` — it's the shared state.
- Expect a builder's `npm run build` to fail on a *parallel* builder's
  in-flight files; the orchestrator runs the authoritative build after all
  agents land.

## Quality gates (orchestrator, after every builder)

1. `git diff --stat` sanity: did it touch only what the brief allowed?
2. `npm run build` + skim the diff for convention breaks (local-first,
   touch targets, RLS `WITH CHECK`, pinned `search_path` on SECURITY DEFINER).
3. Tick ROADMAP checkboxes, note follow-ups as new tagged tasks.
4. Commit (no AI author/co-author) only when asked.

---

## Guidelines for Francesco (the human)

**How to ask for work** — one goal per message beats five; say which of these
you want, because they're different requests:
- *"analyze/audit X"* → you get findings on the roadmap, no code changes;
- *"fix/build X"* → builders get dispatched;
- *"add X to the roadmap"* → ideas land as tagged tasks, nothing is built.

**Give symptoms, not diagnoses.** "My girlfriend couldn't check items after I
invited her" was perfect — who, what action, what happened. Screenshots and
the exact email used help with anything auth/sharing-related.

**Your two manual jobs nobody else may do:**
1. `npx supabase db push` after migrations land (and `SMTP_PASS=… npx
   supabase config push` if config changed). The roadmap will tell you when.
2. Deciding to commit/push — deploy goes live on push to `main`, so say
   "commit" / "commit and push" explicitly when you're ready.

**After a deploy, spot-check on your phone** (the real target): open the PWA,
go offline (airplane mode), confirm lists still load and edits stick, then
reconnect and confirm they sync. That 60-second ritual catches what builds
can't.

**Cost hygiene:** run day-to-day sessions with an Opus orchestrator; save the
top tier for planning/audit days. Batch small `[sonnet]` tasks (3–5 per
dispatch) instead of one-per-agent — each agent launch re-reads the repo cold.

**When a session ends mid-work:** everything worth knowing must already be in
`ROADMAP.md` — that's the contract. If you notice knowledge that lives only in
chat, say "put that on the roadmap".
