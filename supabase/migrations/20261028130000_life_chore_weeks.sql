-- life: chore weekly history. The chore value gains an optional `wk`: 12 chars
-- of 0/1, oldest -> newest, ending on the snapshot's week ("done at least once
-- that week"), read by the Mac from Things; the progress chart's "Casa" line
-- is built from it. Replaces life_entries_chore_value (20261028120000) with the
-- same checks plus one for wk. Re-runnable. Mirrors LIFE_CAPS.choreWeeks.

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
      and (not (value ? 'wk') or (
        jsonb_typeof(value -> 'wk') = 'string'
        and value ->> 'wk' ~ '^[01]{12}$'
      ))
      and jsonb_typeof(value -> 'asOf') = 'string'
      and value ->> 'asOf' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    )
  );
