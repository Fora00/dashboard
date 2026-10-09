-- events: event_interest, the owner's 👍 / 👎 on /events event cards (step 1
-- of the interest signal: COLLECT only, nothing reads it to rank yet).
-- Columns mirror the Dexie EventInterest shape (src/lib/db.ts); timestamps are
-- epoch milliseconds (bigint) like every other synced table. Client:
-- src/lib/eventInterestSync.ts. Same shape as 20261001130000_event_marks.sql.
--
-- OWNER ONLY, like event_marks, custom_events and life: gated by is_owner(),
-- never by is_member(). The /events page is public (no login); on anyone
-- else's device every push is rejected (42501) and dead-lettered client-side,
-- so signals stay local there. `events` is not in shareable_projects.
--
-- Un-doing a signal deletes the row (an outbox tombstone client-side). Rows are
-- NOT pruned when their event ends (unlike event_marks): `features` is the
-- snapshot learning will use after the event has left events.json.

-- ---------------------------------------------------------------------------
-- event_interest: one row per event the owner reacted to, keyed by the
-- event's id (same id rule as event_marks: crawler 16-hex ids, hand-added
-- uuids, spot slugs). value 1 = interested, -1 = not interested.
-- `features` is a small snapshot taken at click time (category, tags, city,
-- source(s), ring, area, weekday and hour in Europe/Rome), rebuilt and capped
-- client-side by sanitizeFeatures (src/projects/events/interest.ts), which
-- keeps it far below the 8 KB check here.
-- ---------------------------------------------------------------------------
create table public.event_interest (
  id text primary key
    check (char_length(id) between 1 and 100 and id ~ '^[A-Za-z0-9_-]+$'),
  value smallint not null
    check (value in (1, -1)),
  features jsonb not null,
  updated_at bigint not null,
  constraint event_interest_features_shape check (jsonb_typeof(features) = 'object'),
  constraint event_interest_features_size check (octet_length(features::text) <= 8192)
);

comment on table public.event_interest is
  'Owner-only 👍 (1) / 👎 (-1) per /events event id, with a feature snapshot taken at click time. Never pruned with events.json.';

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as event_marks).
-- ---------------------------------------------------------------------------
alter table public.event_interest enable row level security;

create policy "owner select" on public.event_interest
  for select using (public.is_owner());
create policy "owner insert" on public.event_interest
  for insert with check (public.is_owner());
create policy "owner update" on public.event_interest
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.event_interest
  for delete using (public.is_owner());

-- ---------------------------------------------------------------------------
-- Last-writer-wins: the shared trigger (20260930160000_sync_hardening.sql).
-- An update carrying an older updated_at than the stored row is ignored.
-- ---------------------------------------------------------------------------
create trigger ignore_stale_update before update on public.event_interest
  for each row execute function public.ignore_stale_update();

-- Realtime, so a 👎 on the phone hides the event on the Mac live (the hide
-- itself travels through event_marks). Realtime applies the select policy per
-- subscriber, so a guest's channel gets nothing.
alter publication supabase_realtime add table public.event_interest;
