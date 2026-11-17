-- learning: "Ripasso", the review schedule across courses and Vocabolario
-- (src/projects/learning/review.ts, synced by src/lib/learningSync.ts).
-- One row per reviewed item, written only when the learner grades it in
-- Ripasso; items never graded get a computed due date on the device, so a
-- fresh device never writes rows that could clobber another device's
-- schedule. Same rules as 20261022120000_learning.sql: OWNER ONLY
-- (is_owner()), deterministic text ids (last-writer-wins), epoch-ms updated_at.
--
-- kind 'card' = a known flashcard (course card or Vocabolario word, course_id
-- 'vocabolario'); kind 'quiz' = a quiz question answered wrong.
-- step = index into the intervals in review.ts (MAX_STEP MUST match).

create table public.learning_reviews (
  id text primary key
    check (char_length(id) <= 210 and id = kind || ':' || course_id || ':' || module_id || ':' || item_id),
  kind text not null check (kind in ('card', 'quiz')),
  course_id text not null check (char_length(course_id) between 1 and 60 and course_id !~ ':'),
  module_id text not null check (char_length(module_id) between 1 and 60 and module_id !~ ':'),
  item_id text not null check (char_length(item_id) between 1 and 60 and item_id !~ ':'),
  step smallint not null check (step between 0 and 5),
  due date not null,
  reviewed_on date,
  updated_at bigint not null
);

alter table public.learning_reviews enable row level security;

create policy "owner select" on public.learning_reviews
  for select using (public.is_owner());
create policy "owner insert" on public.learning_reviews
  for insert with check (public.is_owner());
create policy "owner update" on public.learning_reviews
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.learning_reviews
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql).
create trigger ignore_stale_update before update on public.learning_reviews
  for each row execute function public.ignore_stale_update();

alter publication supabase_realtime add table public.learning_reviews;
