-- events: custom_events, the events the owner adds by hand on /events (e.g.
-- after a climbing gym's Instagram post). Columns mirror the Dexie shape
-- (CustomEvent in src/lib/db.ts); timestamps are epoch milliseconds (bigint)
-- like every other synced table. See "Manual events" in docs/EVENTS.md.
--
-- OWNER ONLY, like life: gated by is_owner(), never by is_member(). The
-- /events page is public (no login), but nothing in project_members can ever
-- grant a guest these rows, and `events` is not in shareable_projects.
--
-- start_at / end_at are TEXT on purpose: the client keeps events.json's exact
-- format (ISO 8601 with the Europe/Rome offset of that date, e.g.
-- 2026-10-04T20:30:00+02:00; the first 10 chars are the local day). A
-- timestamptz would come back in UTC and lose the local day. The checks pin
-- the format and that it parses.
--
-- Caps mirror src/projects/events/custom.ts (MAX_*_LENGTH; the client is the
-- stricter side, UTF-16 units vs code points):
--   title 300, venue 300, city 100, url 2000, note 2000,
--   image 210000 (a JPEG data URL, about 150 KB of image; no Storage bucket).

create table public.custom_events (
  id uuid primary key,
  title text not null
    check (char_length(title) between 1 and 300),
  start_at text not null
    check (start_at ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$'),
  end_at text
    check (end_at is null or end_at ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$'),
  all_day boolean not null default false,
  venue text
    check (venue is null or char_length(venue) <= 300),
  city text not null default 'Trento'
    check (char_length(city) <= 100),
  url text not null default ''
    check (char_length(url) <= 2000 and (url = '' or url ~* '^https?://')),
  note text not null default ''
    check (char_length(note) <= 2000),
  category text not null default 'other'
    check (category ~ '^[a-z][a-z-]{0,39}$'),
  image text
    check (image is null or (
      char_length(image) <= 210000
      and image ~ '^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$'
    )),
  created_at bigint not null,
  updated_at bigint not null,
  constraint custom_events_start_parses check (start_at::timestamptz is not null),
  constraint custom_events_end_after_start check (end_at is null or end_at::timestamptz >= start_at::timestamptz)
);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as life_weeks / life_entries in 20260928120000_life.sql).
-- ---------------------------------------------------------------------------
alter table public.custom_events enable row level security;

create policy "owner select" on public.custom_events
  for select using (public.is_owner());
create policy "owner insert" on public.custom_events
  for insert with check (public.is_owner());
create policy "owner update" on public.custom_events
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.custom_events
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
create trigger ignore_stale_update before update on public.custom_events
  for each row execute function public.ignore_stale_update();

-- Realtime, so an event added on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
alter publication supabase_realtime add table public.custom_events;
