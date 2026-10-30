-- habits as cycles: anchor, floor (smallest version that counts), weekly
-- target, kind, cycle dates and a verdict; habit_checks gets a status so a day
-- can be a conscious skip. All columns are nullable: older rows stay valid
-- (a daily, open-ended forever habit; a check with no status is done).
-- Re-runnable. RLS unchanged (is_member('habits') covers the new columns).
-- Caps mirror MAX_TEXT_LENGTH in src/lib/habitSync.ts.

alter table public.habits
  add column if not exists anchor text,
  add column if not exists floor text,
  add column if not exists target smallint,
  add column if not exists kind text,
  add column if not exists cycle_start text,
  add column if not exists cycle_end text,
  add column if not exists verdict text;

alter table public.habit_checks
  add column if not exists status text;

alter table public.habits drop constraint if exists habits_cycle_check;
alter table public.habits
  add constraint habits_cycle_check check (
    (anchor is null or char_length(anchor) <= 300)
    and (floor is null or char_length(floor) <= 300)
    and (target is null or target between 1 and 7)
    and (kind is null or kind in ('forever', 'experiment'))
    and (verdict is null or verdict in ('up', 'stay', 'down', 'closed'))
    and (cycle_start is null or cycle_start ~ '^\d{4}-\d{2}-\d{2}$')
    and (cycle_end is null or cycle_end ~ '^\d{4}-\d{2}-\d{2}$')
  );

alter table public.habit_checks drop constraint if exists habit_checks_status_check;
alter table public.habit_checks
  add constraint habit_checks_status_check check (status is null or status in ('done', 'skip'));
