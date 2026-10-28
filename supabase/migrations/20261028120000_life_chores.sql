-- life: household chores (Things project "Casa catia"). Adds one entry kind to
-- life_entries:
--   chore  id `chore:${ref}`, ref = a stable slug of the chore name; value
--          {name, repeat, done, count, last?, asOf}: a chore as the Mac read it
--          from Things (repeat = a recurring to-do, count = times completed,
--          last = day of the latest completion, asOf = snapshot day), also
--          tickable here (flips done and, if repeat, count). Like 'streak' it
--          is not tied to a week (week = the week first imported); replaced on
--          each import that carries `chores`, deleted when it leaves it.
-- Only the kind check widens and one value check is added; no column.
-- Re-runnable. RLS unchanged (is_owner() policies cover every kind).
-- The caps mirror LIFE_CAPS.choreName / choreMax in src/projects/life/model.
-- Integers are checked on their text (no cast, so a malformed value fails the
-- check instead of raising a cast error).

alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin', 'playbook', 'why', 'idea', 'upgrade', 'streak', 'chore'));

alter table public.life_entries
  drop constraint if exists life_entries_chore_value;
alter table public.life_entries
  add constraint life_entries_chore_value
  check (
    kind <> 'chore' or (
      jsonb_typeof(value -> 'name') = 'string'
      and char_length(value ->> 'name') between 1 and 100
      and jsonb_typeof(value -> 'repeat') = 'boolean'
      and jsonb_typeof(value -> 'done') = 'boolean'
      and jsonb_typeof(value -> 'count') = 'number'
      and value ->> 'count' ~ '^(0|[1-9][0-9]{0,4}|100000)$'
      and (not (value ? 'last') or (
        jsonb_typeof(value -> 'last') = 'string'
        and value ->> 'last' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      ))
      and jsonb_typeof(value -> 'asOf') = 'string'
      and value ->> 'asOf' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    )
  );
