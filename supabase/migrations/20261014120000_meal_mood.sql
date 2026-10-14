-- meal-diary: optional mood after a meal, 1 (low) to 5 (great). null = not
-- entered, which counts as indifferent. Lets the owner see whether the
-- snacking tracks how they feel. No new policy: the table's owner-only RLS
-- (20261005140000_meal_diary.sql) already covers the column.
alter table public.meal_entries
  add column mood smallint check (mood between 1 and 5);
