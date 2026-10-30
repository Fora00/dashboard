-- habits: grace = how many slips a week a "don't" habit tolerates before the
-- streak breaks (0 = none). Nullable, re-runnable. Caps mirror MAX_GRACE in
-- src/lib/habitSync.ts.
alter table public.habits add column if not exists grace smallint;

alter table public.habits drop constraint if exists habits_grace_check;
alter table public.habits
  add constraint habits_grace_check check (grace is null or grace between 0 and 7);
