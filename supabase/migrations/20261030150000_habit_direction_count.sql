-- habits: direction ('do' | 'avoid': a "don't" habit is kept unless a slip is
-- marked) and per_day (how many taps make a day done, 1 = a single tap);
-- habit_checks: count (taps so far on a multi-tap day). Nullable, re-runnable.
-- Caps mirror MAX_PER_DAY in src/lib/habitSync.ts.
alter table public.habits
  add column if not exists direction text,
  add column if not exists per_day smallint;
alter table public.habit_checks add column if not exists count smallint;

alter table public.habits drop constraint if exists habits_direction_check;
alter table public.habits
  add constraint habits_direction_check check (
    (direction is null or direction in ('do', 'avoid'))
    and (per_day is null or per_day between 1 and 20)
  );

alter table public.habit_checks drop constraint if exists habit_checks_count_check;
alter table public.habit_checks
  add constraint habit_checks_count_check check (count is null or count between 1 and 99);
