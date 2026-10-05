-- meal-diary: was the meal weighed, or eyeballed? Lets the AI estimate (the
-- /meal-reconcile command and its nutritionist agent) trust a stated quantity
-- when it was weighed and apply the owner's own tendencies when it was not.
-- Existing rows count as "by eye" (false). No new policy: the table's
-- owner-only RLS (20261005140000_meal_diary.sql) already covers the column.
alter table public.meal_entries
  add column weighed boolean not null default false;
