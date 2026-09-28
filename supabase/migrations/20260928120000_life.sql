-- life: the owner's weekly plan (imported JSON) and the log against it.
-- Spec: docs/HANDOFF-life.md. Two tables so that a +1 on the phone and a +1
-- on the Mac never overwrite each other (the plan is one row per week; every
-- logged thing is its own row). Timestamps are epoch milliseconds (bigint) to
-- match the client, like every other synced table.
--
-- OWNER ONLY. Unlike every other project this is gated by is_owner(), never
-- by is_member(): no row in project_members can ever grant a guest access,
-- so `life` must also stay off the shareable list on /sharing.
--
-- The caps below are mirrored by the client validator in
-- src/projects/life/model.ts (LIFE_CAPS). The client is always the stricter
-- side, so a plan the client accepts is always accepted here.

-- ---------------------------------------------------------------------------
-- life_weeks: one row per week, replaced wholesale on (re-)import.
-- ---------------------------------------------------------------------------
-- The key is the week (its Monday). The generic sync engine addresses every
-- row by an `id` column (deletes use .eq('id', …) and realtime reads
-- payload.new.id), so the key is stored as `id` = the ISO date text, with
-- `week` alongside as a real date that Postgres validates. The checks tie
-- the two together and to the plan's own `week` field.
create table public.life_weeks (
  id text primary key
    check (id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  week date not null unique
    check (extract(isodow from week) = 1),
  plan jsonb not null
    check (jsonb_typeof(plan) = 'object')
    check (pg_column_size(plan) <= 131072),
  imported_at bigint not null,
  updated_at bigint not null,
  constraint life_weeks_id_is_week check (id::date = week),
  constraint life_weeks_plan_week check (plan ->> 'week' = id)
);

-- ---------------------------------------------------------------------------
-- life_entries: one row per logged thing.
-- ---------------------------------------------------------------------------
--   tracker  append-only +1, random uuid id; value {energyBefore?, energyAfter?}
--   focus    keyed toggle, id `${week}:focus:${ref}`;  value {done}
--   sunday   keyed answer, id `${week}:sunday:${ref}`; value {answer}
--   sent     keyed toggle, id `${week}:sent:${ref}`;   value {sent}
-- `ref` is the plan item's stable id. There is deliberately no foreign key to
-- life_weeks: re-importing a week replaces the plan and must never touch the
-- log, and an entry whose ref left the plan is kept ("removed from plan").
create table public.life_entries (
  id text primary key
    check (char_length(id) between 1 and 100),
  week date not null
    check (extract(isodow from week) = 1),
  kind text not null
    check (kind in ('focus', 'tracker', 'sunday', 'sent')),
  ref text not null
    check (ref ~ '^[A-Za-z0-9_.-]{1,40}$'),
  -- Local calendar day the entry was logged on (the device's day, like Habits).
  day date not null,
  value jsonb not null default '{}'::jsonb
    check (jsonb_typeof(value) = 'object')
    check (pg_column_size(value) <= 16384),
  created_at bigint not null,
  updated_at bigint not null
);

create index life_entries_week_idx on public.life_entries (week);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side.
-- ---------------------------------------------------------------------------
alter table public.life_weeks enable row level security;
alter table public.life_entries enable row level security;

create policy "owner select" on public.life_weeks
  for select using (public.is_owner());
create policy "owner insert" on public.life_weeks
  for insert with check (public.is_owner());
create policy "owner update" on public.life_weeks
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.life_weeks
  for delete using (public.is_owner());

create policy "owner select" on public.life_entries
  for select using (public.is_owner());
create policy "owner insert" on public.life_entries
  for insert with check (public.is_owner());
create policy "owner update" on public.life_entries
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.life_entries
  for delete using (public.is_owner());

-- Realtime, so a +1 on one device reaches the other live. Realtime applies
-- the select policy per subscriber, so a guest's channel receives nothing.
alter publication supabase_realtime add table public.life_weeks;
alter publication supabase_realtime add table public.life_entries;
