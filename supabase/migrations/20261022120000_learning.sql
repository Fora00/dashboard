-- learning: the learner's progress in a course (src/projects/learning). Course
-- content is static bundle data and is NOT stored here; only what the owner did.
-- Columns mirror the Dexie rows in src/lib/db.ts; timestamps are epoch
-- milliseconds (bigint) like every other synced table.
--
-- OWNER ONLY, like Life: is_owner(), never is_member().
--
-- Ids are deterministic text `${course}:${module}:${item}` (learningSync.ts),
-- so two devices answering the same item converge on one row by
-- last-writer-wins. The checks tie the id to its three parts and bound every
-- text column. Caps MUST match MAX_NOTES_LENGTH in src/lib/learningSync.ts.

create table public.learning_quiz (
  id text primary key
    check (char_length(id) <= 200 and id = course_id || ':' || module_id || ':' || item_id),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  item_id text not null check (char_length(item_id) between 1 and 60 and item_id !~ ':'),
  selected smallint not null check (selected between 0 and 20),
  correct boolean not null,
  updated_at bigint not null
);

create table public.learning_cards (
  id text primary key
    check (char_length(id) <= 200 and id = course_id || ':' || module_id || ':' || item_id),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  item_id text not null check (char_length(item_id) between 1 and 60 and item_id !~ ':'),
  updated_at bigint not null
);

create table public.learning_practice (
  id text primary key
    check (char_length(id) <= 200 and id = course_id || ':' || module_id || ':' || item_id),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  item_id text not null check (char_length(item_id) between 1 and 60 and item_id !~ ':'),
  done boolean not null default false,
  notes text not null default '' check (char_length(notes) <= 2000),
  updated_at bigint not null
);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as life_day_focus in 20261021120000_life_day_focus.sql).
-- ---------------------------------------------------------------------------
alter table public.learning_quiz enable row level security;
alter table public.learning_cards enable row level security;
alter table public.learning_practice enable row level security;

create policy "owner select" on public.learning_quiz
  for select using (public.is_owner());
create policy "owner insert" on public.learning_quiz
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_quiz
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_quiz
  for delete using (public.is_owner());

create policy "owner select" on public.learning_cards
  for select using (public.is_owner());
create policy "owner insert" on public.learning_cards
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_cards
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_cards
  for delete using (public.is_owner());

create policy "owner select" on public.learning_practice
  for select using (public.is_owner());
create policy "owner insert" on public.learning_practice
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_practice
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_practice
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql).
create trigger ignore_stale_update before update on public.learning_quiz
  for each row execute function public.ignore_stale_update();
create trigger ignore_stale_update before update on public.learning_cards
  for each row execute function public.ignore_stale_update();
create trigger ignore_stale_update before update on public.learning_practice
  for each row execute function public.ignore_stale_update();

-- Realtime, so a card known on the phone shows up on the Mac and iPad live.
alter publication supabase_realtime add table public.learning_quiz;
alter publication supabase_realtime add table public.learning_cards;
alter publication supabase_realtime add table public.learning_practice;
