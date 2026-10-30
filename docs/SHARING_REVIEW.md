# Sharing review (2026-10-29)

Analysis only, no code. Sources: `src/lib/projects.ts`, `docs/ARCHITECTURE.md`,
`supabase/migrations/`. Decide with the owner before building anything.

## 1. Who can see what today

| Project / table | Visibility |
|---|---|
| local-transfer, todo, climbing (`climb_sessions`, `climbs`), habits (`habits`, `habit_checks`), book-ideas, boardgame-ideas, links, trips (`trip_ideas`, `trip_companions`) | **Per-project members** (`project_members`, `/sharing`, invite link `#/join/p/<token>`; listed in `shareable_projects`) |
| shop-list (`shop_items`, `shop_areas`) | **Per-area members** (`shop_area_members`, own invite links; token now in `shop_area_tokens`) |
| events page + crawled data | **Public** (bundle data, works signed out) |
| events: `event_marks`, `event_prefs`, `custom_events`, `event_interest`, `event_interest_profile` | **Owner-only** (`is_owner()`); a guest's pushes are rejected (42501) and stay local |
| life (`life_*`), learning (`learning_*`), meal-diary (`meal_entries`) | **Owner-only** |
| `project_prefs` (home grid stars/hidden) | **Per user** (`user_id = auth.uid()`) |
| `project_members`, `project_invites`, `allowed_emails` | Owner-managed, `/sharing` is owner-only |
| settings | Device-only |

## 2. What should be shareable, and how

- **Events marks (save/hide/going, 👍/👎, interest profile).** Today a guest
  using `/events` gets no persistent marks across devices and cannot see the
  owner's. Best fit is the `project_prefs` pattern: per-user rows
  (`user_id = auth.uid()`, PK `(user_id, id)`), so every signed-in user gets
  their own marks and interest model with no sharing system involved. Owner
  data stays as is (migrate owner rows by defaulting `user_id`).
- **A read-only list of events** (e.g. "events I'm going to", for a friend).
  A read-only share link on the owner's "going" marks, or just the existing
  share-from-card action. Cheap: no new table, a signed/tokenised view.
- **Life / Learning / meal-diary.** Keep owner-only. Sensitive, and
  `~/life` must never leave the Mac. If a partner ever needs a slice (e.g.
  weekly chores), expose that table only, via `project_members`.
- **Shop-list vs others.** Two systems is the real cost: shop areas have
  their own invite/token model. Unifying under `project_members` plus an
  optional sub-scope would remove one concept, but it is a migration with
  real risk and little user-visible gain. Leave unless a third scoped project
  appears.
- **New shared projects** (expenses, chores rotation): reuse
  `project_members` + a `shareable_projects` row (`docs/NEW_PROJECT.md`).

## 3. Proposal, by value per effort

1. **Per-user event marks and interest (guests get their own).** M, `[opus]`
   (migration + RLS + sync key change). Biggest gap, known pattern.
2. **Read-only share of "going" events.** S, `[sonnet]`.
3. **Chores/other slice sharing from Life.** Only if asked for; S–M.
4. **Unify the two sharing systems.** L, `[opus]`; do not do now.

Open question for the owner: is anyone besides you actually going to use
`/events` signed in? If not, item 1 is low value and can wait.
