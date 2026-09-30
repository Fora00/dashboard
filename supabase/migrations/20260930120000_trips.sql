-- trips: travel ideas, each Solo (companion_ids = '{}') or with a set of
-- people from trip_companions. Columns mirror the Dexie shapes in
-- src/lib/db.ts; timestamps are epoch milliseconds (bigint) to match the
-- client.
--
-- Length caps MUST match the constants in src/lib/tripsSync.ts and the inputs'
-- maxLength in src/projects/trips/: title 300, notes 2000, companion name 40,
-- emoji 8, at most 20 companions per idea (MAX_COMPANIONS_PER_IDEA), each id
-- at most 64 chars.
--
-- companion_ids holds trip_companions ids WITHOUT a foreign key: Postgres
-- can't FK into an array, and the client strips a deleted person from every
-- idea (an upsert per idea, queued before the companion delete).

create table public.trip_companions (
  id uuid primary key,
  name text not null check (char_length(name) <= 40),
  emoji text not null default '🙂' check (char_length(emoji) <= 8),
  created_at bigint not null,
  updated_at bigint not null
);

-- A CHECK can't contain the `unnest` subquery the per-element check needs, so
-- it lives in an IMMUTABLE helper (same approach as links_tags_within_length).
create or replace function public.trips_ids_within_length(ids text[])
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  select coalesce(max(char_length(t)), 0) <= 64 from unnest(ids) as t;
$$;

create table public.trip_ideas (
  id uuid primary key,
  title text not null check (char_length(title) <= 300),
  notes text not null default '' check (char_length(notes) <= 2000),
  companion_ids text[] not null default '{}',
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null,
  constraint trip_ideas_companions_max_count
    check (coalesce(array_length(companion_ids, 1), 0) <= 20),
  constraint trip_ideas_companions_max_length
    check (public.trips_ids_within_length(companion_ids))
);

alter table public.trip_companions enable row level security;
alter table public.trip_ideas enable row level security;

-- One policy per table for all ops. WITH CHECK on the write side is required
-- so a guest can't insert/update rows for a project she isn't a member of.
create policy "members full access" on public.trip_companions
  for all
  using (public.is_member('trips'))
  with check (public.is_member('trips'));

create policy "members full access" on public.trip_ideas
  for all
  using (public.is_member('trips'))
  with check (public.is_member('trips'));

-- Realtime, so edits reach other devices live.
alter publication supabase_realtime add table public.trip_companions;
alter publication supabase_realtime add table public.trip_ideas;
