-- habits: a "normal" version next to the floor, and check states beyond
-- done/skip: 'floor' (only the minimum was done, counts as done) and 'fail'
-- (a day marked missed on purpose). Nullable, re-runnable.
alter table public.habits add column if not exists normal text;

alter table public.habits drop constraint if exists habits_normal_check;
alter table public.habits
  add constraint habits_normal_check check (normal is null or char_length(normal) <= 300);

alter table public.habit_checks drop constraint if exists habit_checks_status_check;
alter table public.habit_checks
  add constraint habit_checks_status_check check (status is null or status in ('done', 'floor', 'skip', 'fail'));
