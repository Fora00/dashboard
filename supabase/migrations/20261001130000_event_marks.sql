-- events: event_marks + event_prefs, the owner's saved/hidden events and
-- favourite categories on /events, synced across devices. Columns mirror the
-- Dexie shapes (EventMark / EventPrefs in src/lib/db.ts); timestamps are epoch
-- milliseconds (bigint) like every other synced table. Client:
-- src/lib/eventMarksSync.ts. Same pattern as 20261001120000_custom_events.sql.
--
-- OWNER ONLY, like custom_events and life: gated by is_owner(), never by
-- is_member(). The /events page is public (no login); on anyone else's device
-- every push is rejected (42501) and dead-lettered client-side, so marks stay
-- local there. `events` is not in shareable_projects.
--
-- Un-saving / un-hiding deletes the row (an outbox tombstone client-side).

-- ---------------------------------------------------------------------------
-- event_marks: one row per marked event, keyed by the event's id (crawler
-- 16-hex ids, hand-added uuids, spot slugs). `event` is a snapshot of the
-- event (an events.json record) so a saved event outlives events.json. The
-- client rebuilds and caps it (sanitizeSnapshot in src/projects/events/marks.ts:
-- http(s) links only, no data URLs, description <= 4000 chars, bounded tag
-- lists), which keeps it far below the 32 KB check here.
-- ---------------------------------------------------------------------------
create table public.event_marks (
  id text primary key
    check (char_length(id) between 1 and 100 and id ~ '^[A-Za-z0-9_-]+$'),
  state text not null
    check (state in ('saved', 'hidden')),
  event jsonb not null,
  updated_at bigint not null,
  constraint event_marks_event_shape check (
    jsonb_typeof(event) = 'object'
    and event->>'id' = id
    and jsonb_typeof(event->'title') = 'string'
    and jsonb_typeof(event->'start') = 'string'
  ),
  constraint event_marks_event_size check (octet_length(event::text) <= 32768)
);

-- ---------------------------------------------------------------------------
-- event_prefs: a single row, id 'prefs' (owner-only, so one row in total).
-- Category ids are lowercase slugs (CATEGORIES in src/projects/events/model.ts);
-- at most 50, mirrored by sanitizeFavourites / MAX_FAVOURITES client-side.
-- ---------------------------------------------------------------------------

-- A CHECK can't hold the unnest subquery itself, so the per-element rule lives
-- in an IMMUTABLE helper (same approach as links_tags_within_length).
create or replace function public.event_categories_valid(cats text[])
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  select coalesce(bool_and(c is not null and c ~ '^[a-z][a-z0-9-]{0,39}$'), true)
  from unnest(cats) as c;
$$;

create table public.event_prefs (
  id text primary key default 'prefs'
    check (id = 'prefs'),
  favourite_categories text[] not null default '{}'
    check (cardinality(favourite_categories) <= 50
      and public.event_categories_valid(favourite_categories)),
  updated_at bigint not null
);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as custom_events / life_weeks).
-- ---------------------------------------------------------------------------
alter table public.event_marks enable row level security;

create policy "owner select" on public.event_marks
  for select using (public.is_owner());
create policy "owner insert" on public.event_marks
  for insert with check (public.is_owner());
create policy "owner update" on public.event_marks
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.event_marks
  for delete using (public.is_owner());

alter table public.event_prefs enable row level security;

create policy "owner select" on public.event_prefs
  for select using (public.is_owner());
create policy "owner insert" on public.event_prefs
  for insert with check (public.is_owner());
create policy "owner update" on public.event_prefs
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.event_prefs
  for delete using (public.is_owner());

-- ---------------------------------------------------------------------------
-- Last-writer-wins.
-- ---------------------------------------------------------------------------
-- event_marks: the shared trigger (20260930160000_sync_hardening.sql). An
-- update carrying an older updated_at than the stored row is ignored, so the
-- first sync of two devices that both had marks is a union by id with the
-- newer mark winning.
create trigger ignore_stale_update before update on public.event_marks
  for each row execute function public.ignore_stale_update();

-- event_prefs: the same LWW, plus a merge for updated_at = 0. A device whose
-- favourites predate sync queues them once with updated_at 0 (Dexie v15
-- upgrade in src/lib/db.ts): there is no real timestamp to compare, so instead
-- of overwriting (or being dropped by) the stored list, the two lists are
-- united, stored first, capped at 50, and the stored updated_at is kept. The
-- client then pulls the merged row. Inserts never fire it.
create or replace function public.event_prefs_merge()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.updated_at = 0 then
    new.favourite_categories := array(
      select c
      from unnest(old.favourite_categories || new.favourite_categories)
        with ordinality as u(c, n)
      group by c
      order by min(n)
      limit 50
    );
    new.updated_at := old.updated_at;
    return new;
  end if;
  if new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end;
$$;

comment on function public.event_prefs_merge() is
  'BEFORE UPDATE trigger on event_prefs: last-writer-wins by updated_at, except updated_at = 0 (favourites that predate sync), which is merged into the stored list.';

create trigger event_prefs_merge before update on public.event_prefs
  for each row execute function public.event_prefs_merge();

-- EXECUTE: new functions are authenticated-only by default (hardening
-- migration). The pure CHECK validator gets anon too, like
-- links_tags_within_length, so an anon write fails on RLS, not on a function
-- permission.
grant execute on function public.event_categories_valid(text[]) to anon;

-- Realtime, so saving on the phone shows up on the Mac live. Realtime applies
-- the select policy per subscriber, so a guest's channel gets nothing.
alter publication supabase_realtime add table public.event_marks;
alter publication supabase_realtime add table public.event_prefs;
