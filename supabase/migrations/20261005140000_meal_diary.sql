-- meal-diary: what the owner ate, one row per line. Columns mirror the Dexie
-- shape (MealEntry in src/lib/db.ts); timestamps are epoch milliseconds
-- (bigint) to match the client, like every other synced table.
--
-- OWNER ONLY, like life: gated by is_owner(), never by is_member(), so no
-- project_members row can ever grant a guest access and the project stays off
-- the shareable list on /sharing (no shareable_projects row on purpose).
--
-- Length cap: text 300. MUST match MAX_TEXT_LENGTH in src/lib/mealDiarySync.ts
-- (the input's maxLength). The numeric ranges must match NUTRITION_MAX in
-- src/projects/meal-diary/nutrition.ts.

create table public.meal_entries (
  id uuid primary key,
  -- Local calendar day the entry belongs to (the device's day, like Habits).
  day date not null,
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  text text not null check (char_length(text) between 1 and 300),
  -- Optional nutrition, whole numbers. Null = not entered. `estimated` marks
  -- values that came from the built-in food table rather than being typed.
  grams integer check (grams between 0 and 10000),
  kcal integer check (kcal between 0 and 10000),
  protein_g integer check (protein_g between 0 and 1000),
  carbs_g integer check (carbs_g between 0 and 1000),
  fat_g integer check (fat_g between 0 and 1000),
  estimated boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

create index meal_entries_day_idx on public.meal_entries (day);

alter table public.meal_entries enable row level security;

create policy "owner select" on public.meal_entries
  for select using (public.is_owner());
create policy "owner insert" on public.meal_entries
  for insert with check (public.is_owner());
create policy "owner update" on public.meal_entries
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.meal_entries
  for delete using (public.is_owner());

-- Server-side last-writer-wins: an update carrying an OLDER updated_at than the
-- stored row is silently ignored (a phone flushing a days-old outbox can't
-- clobber newer edits).
create trigger ignore_stale_update before update on public.meal_entries
  for each row execute function public.ignore_stale_update();

-- Realtime, so an entry on the phone reaches the Mac live. Realtime applies
-- the select policy per subscriber, so a guest's channel receives nothing.
alter publication supabase_realtime add table public.meal_entries;
