-- learning: checklist ticks and "where I left off" now follow the owner across
-- devices (src/lib/learningSync.ts). Same shape and rules as 20261022120000_learning.sql:
-- OWNER ONLY (is_owner()), deterministic text ids so two devices converge by
-- last-writer-wins, epoch-ms timestamps. The photo diary stays on the device.
--
-- Caps MUST match MAX_CHECKS in src/lib/learningSync.ts.

create table public.learning_checks (
  id text primary key
    check (char_length(id) <= 200 and id = course_id || ':' || module_id || ':' || item_id),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  item_id text not null check (char_length(item_id) between 1 and 60 and item_id !~ ':'),
  checked smallint[] not null default '{}' check (cardinality(checked) <= 100),
  updated_at bigint not null
);

-- One row per course: the module (and tab) the learner opened last.
create table public.learning_position (
  id text primary key check (id = course_id),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  tab text not null check (tab in ('lesson', 'quiz', 'cards', 'practice')),
  updated_at bigint not null
);

alter table public.learning_checks enable row level security;
alter table public.learning_position enable row level security;

create policy "owner select" on public.learning_checks
  for select using (public.is_owner());
create policy "owner insert" on public.learning_checks
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_checks
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_checks
  for delete using (public.is_owner());

create policy "owner select" on public.learning_position
  for select using (public.is_owner());
create policy "owner insert" on public.learning_position
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_position
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_position
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql).
create trigger ignore_stale_update before update on public.learning_checks
  for each row execute function public.ignore_stale_update();
create trigger ignore_stale_update before update on public.learning_position
  for each row execute function public.ignore_stale_update();

alter publication supabase_realtime add table public.learning_checks;
alter publication supabase_realtime add table public.learning_position;
