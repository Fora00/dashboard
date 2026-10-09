-- events: event_interest_profile, the owner's interest profile on /events
-- (step 2 of the interest signal). One row per feature key of the scoring
-- model (src/projects/events/interestScore.ts): `seed` is the owner's
-- starting guess in [-1, 1] that fades as 👍 / 👎 / saved / hidden signals
-- arrive; `pin` ('up' | 'down' | 'mute') overrides what was learned.
-- Columns mirror the Dexie EventInterestProfile shape (src/lib/db.ts);
-- timestamps are epoch milliseconds (bigint) like every other synced table.
-- Client: src/lib/eventInterestProfileSync.ts. Same shape as
-- 20261009150000_event_interest.sql.
--
-- OWNER ONLY, like event_interest and event_marks: gated by is_owner(), never
-- by is_member(). The /events pages are public (no login); on anyone else's
-- device every push is rejected (42501) and dead-lettered client-side, so the
-- profile stays local there. `events` is not in shareable_projects.
--
-- A row with neither seed nor pin is deleted by the client (an outbox
-- tombstone), so "clear" propagates. The seed values are personal data: they
-- only ever arrive through the app (paste box or a #/events/interests?seed=
-- link), never from the repo.

-- ---------------------------------------------------------------------------
-- event_interest_profile: id = feature key `<kind>:<value>`, e.g.
-- `cat:theatre`, `sub:jazz-blues`, `city:riva del garda`, `wd:6`,
-- `hour:evening` (canonical form: keyPart() in
-- src/projects/events/featureKeys.ts, which keeps it inside this check).
-- ---------------------------------------------------------------------------
create table public.event_interest_profile (
  id text primary key
    check (id ~ '^[a-z]+:[A-Za-z0-9 _.-]{1,80}$'),
  seed real
    check (seed is null or (seed >= -1 and seed <= 1)),
  pin text
    check (pin is null or pin in ('up', 'down', 'mute')),
  updated_at bigint not null
);

comment on table public.event_interest_profile is
  'Owner-only interest profile per /events feature key: seed (starting guess in [-1,1], fades as signals arrive) and pin (up/down/mute overrides learning).';

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as event_interest).
-- ---------------------------------------------------------------------------
alter table public.event_interest_profile enable row level security;

create policy "owner select" on public.event_interest_profile
  for select using (public.is_owner());
create policy "owner insert" on public.event_interest_profile
  for insert with check (public.is_owner());
create policy "owner update" on public.event_interest_profile
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.event_interest_profile
  for delete using (public.is_owner());

-- ---------------------------------------------------------------------------
-- Last-writer-wins: the shared trigger (20260930160000_sync_hardening.sql).
-- An update carrying an older updated_at than the stored row is ignored.
-- ---------------------------------------------------------------------------
create trigger ignore_stale_update before update on public.event_interest_profile
  for each row execute function public.ignore_stale_update();

-- Realtime, so a pin set on the phone reorders the list on the Mac live.
-- Realtime applies the select policy per subscriber, so a guest's channel
-- gets nothing.
alter publication supabase_realtime add table public.event_interest_profile;
