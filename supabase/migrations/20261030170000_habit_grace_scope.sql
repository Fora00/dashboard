-- habits: the scope of the grace of a "don't" habit: 'day' (slips tolerated
-- per day, each tap on the tile is one slip) or 'week' (the default when null).
-- Nullable, re-runnable.
alter table public.habits add column if not exists grace_scope text;

alter table public.habits drop constraint if exists habits_grace_scope_check;
alter table public.habits
  add constraint habits_grace_scope_check check (grace_scope is null or grace_scope in ('day', 'week'));
