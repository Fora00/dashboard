-- life: Streaks (iOS app) snapshot. Adds one entry kind to life_entries:
--   streak  id `streak:${ref}`, ref = a stable slug of the habit name; value
--           {name, emoji?, days, streak, best?, asOf}: a Streaks habit as the
--           Mac read it from the app's backup, shown read-only under Habits.
--           Like 'upgrade' it is not tied to a week (week = the week it was
--           first imported); replaced on each import that carries `streaks`,
--           deleted when the habit leaves the snapshot.
--   days    28 chars, oldest -> newest: d done, m missed, - not scheduled.
-- Only the kind check widens and one value check is added; no column.
-- Re-runnable. RLS unchanged (is_owner() policies cover every kind).
-- The caps mirror LIFE_CAPS.streakName / emoji / streakDays / streakMax in
-- src/projects/life/model. Integers are checked on their text (no cast, so a
-- malformed value fails the check instead of raising a cast error).

alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin', 'playbook', 'why', 'idea', 'upgrade', 'streak'));

alter table public.life_entries
  drop constraint if exists life_entries_streak_value;
alter table public.life_entries
  add constraint life_entries_streak_value
  check (
    kind <> 'streak' or (
      jsonb_typeof(value -> 'name') = 'string'
      and char_length(value ->> 'name') between 1 and 60
      and (not (value ? 'emoji') or (
        jsonb_typeof(value -> 'emoji') = 'string'
        and char_length(value ->> 'emoji') <= 16
      ))
      and jsonb_typeof(value -> 'days') = 'string'
      and value ->> 'days' ~ '^[dm-]{28}$'
      and jsonb_typeof(value -> 'streak') = 'number'
      and value ->> 'streak' ~ '^(0|[1-9][0-9]{0,4}|100000)$'
      and (not (value ? 'best') or (
        jsonb_typeof(value -> 'best') = 'number'
        and value ->> 'best' ~ '^(0|[1-9][0-9]{0,4}|100000)$'
      ))
      and jsonb_typeof(value -> 'asOf') = 'string'
      and value ->> 'asOf' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    )
  );
