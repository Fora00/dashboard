-- Sync parity: todo, climbing and habits get the same optional cloud sync as
-- shop-list, via the generic engine (src/lib/cloudSync.ts). Tables mirror the
-- Dexie shapes in src/lib/db.ts; timestamps are epoch milliseconds (bigint)
-- to match the client. RLS is per-project via is_member('<project-id>').

-- ---------------------------------------------------------------------------
-- todo: generic todo list.
-- ---------------------------------------------------------------------------
create table public.todos (
  id uuid primary key,
  text text not null,
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

alter table public.todos enable row level security;

create policy "members full access" on public.todos
  for all
  using (public.is_member('todo'))
  with check (public.is_member('todo'));

-- ---------------------------------------------------------------------------
-- climbing: sessions + climbs. `date`/`discipline` on climbs are denormalized
-- from the session, matching the client schema.
-- ---------------------------------------------------------------------------
create table public.climb_sessions (
  id uuid primary key,
  date text not null,          -- 'YYYY-MM-DD', sortable as a string
  location text not null,
  discipline text not null check (discipline in ('boulder', 'lead')),
  notes text,
  created_at bigint not null
);

alter table public.climb_sessions enable row level security;

create policy "members full access" on public.climb_sessions
  for all
  using (public.is_member('climbing'))
  with check (public.is_member('climbing'));

create table public.climbs (
  id uuid primary key,
  session_id uuid not null references public.climb_sessions(id) on delete cascade,
  date text not null,
  discipline text not null check (discipline in ('boulder', 'lead')),
  grade text not null,
  sent boolean not null default false,
  created_at bigint not null
);

alter table public.climbs enable row level security;

create policy "members full access" on public.climbs
  for all
  using (public.is_member('climbing'))
  with check (public.is_member('climbing'));

-- ---------------------------------------------------------------------------
-- habits: habits + daily checks.
-- ---------------------------------------------------------------------------
create table public.habits (
  id uuid primary key,
  name text not null,
  emoji text not null,
  created_at bigint not null,
  archived_at bigint            -- null = active
);

alter table public.habits enable row level security;

create policy "members full access" on public.habits
  for all
  using (public.is_member('habits'))
  with check (public.is_member('habits'));

create table public.habit_checks (
  id uuid primary key,
  habit_id uuid not null references public.habits(id) on delete cascade,
  day text not null,           -- local-date 'YYYY-MM-DD'
  created_at bigint not null,
  unique (habit_id, day)
);

alter table public.habit_checks enable row level security;

create policy "members full access" on public.habit_checks
  for all
  using (public.is_member('habits'))
  with check (public.is_member('habits'));

-- ---------------------------------------------------------------------------
-- Realtime for cross-device updates. shop_areas was missing from the
-- publication (audit finding: new/renamed areas never reached other devices
-- live); the new item-like tables join it too.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.shop_areas;
alter publication supabase_realtime add table public.todos;
alter publication supabase_realtime add table public.climb_sessions;
alter publication supabase_realtime add table public.climbs;
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_checks;
