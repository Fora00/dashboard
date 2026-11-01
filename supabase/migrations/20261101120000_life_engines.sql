-- life: "Life Engines", the monthly audit of seven life areas in Life → Month.
-- One row per month and engine: a 1-10 score, a lead flag (at most one per
-- month, enforced by the client writer setEngineLead in src/lib/lifeSync.ts,
-- not here: two devices racing settle by last-writer-wins per row), and the
-- iceberg (event, pattern, system, belief, up to 3 whys, one lever, a
-- free-text link to a habit or experiment by name). Timestamps are epoch
-- milliseconds (bigint) like every other synced table.
--
-- OWNER ONLY, like the other Life tables: is_owner(), never is_member().
--
-- The id is `${month}:${engine}`, so a month can never hold more than one row
-- per engine; the checks tie id, month and engine together. Rows are edited in
-- place and never deleted by the app. Text caps mirror LIFE_CAPS.engine* in
-- src/projects/life/model/constants.ts (the client counts UTF-16 units, the
-- stricter side).
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

-- whys: at most 3 entries, none null, none longer than 300 characters.
-- Immutable, so it can back a CHECK constraint.
create or replace function public.life_engines_whys_ok(w text[])
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(cardinality(w), 0) <= 3
    and not exists (select 1 from unnest(w) as x where x is null or char_length(x) > 300)
$$;

create table if not exists public.life_engines (
  id text primary key,
  month text not null
    check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  engine text not null
    check (engine in ('physical-health', 'emotions', 'mind', 'relationships', 'career', 'money', 'environment')),
  score smallint
    check (score is null or score between 1 and 10),
  lead boolean not null default false,
  event text not null default '' check (char_length(event) <= 1000),
  pattern text not null default '' check (char_length(pattern) <= 1000),
  system text not null default '' check (char_length(system) <= 1000),
  belief text not null default '' check (char_length(belief) <= 1000),
  whys text[] not null default '{}' check (public.life_engines_whys_ok(whys)),
  lever text not null default '' check (char_length(lever) <= 200),
  link text not null default '' check (char_length(link) <= 100),
  updated_at bigint not null,
  constraint life_engines_id_is_month_engine check (id = month || ':' || engine)
);

create index if not exists life_engines_month_idx on public.life_engines (month);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as life_day_focus in 20261021120000_life_day_focus.sql).
-- ---------------------------------------------------------------------------
alter table public.life_engines enable row level security;

drop policy if exists "owner select" on public.life_engines;
create policy "owner select" on public.life_engines
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.life_engines;
create policy "owner insert" on public.life_engines
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.life_engines;
create policy "owner update" on public.life_engines
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.life_engines;
create policy "owner delete" on public.life_engines
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.life_engines;
create trigger ignore_stale_update before update on public.life_engines
  for each row execute function public.ignore_stale_update();

-- Realtime, so a score set on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'life_engines'
  ) then
    alter publication supabase_realtime add table public.life_engines;
  end if;
end
$$;
