-- life: Upgrade list. Adds one entry kind to life_entries:
--   upgrade  random uuid id, ref 'upgrade'; value {text, size, status, doneAt?}:
--            a small annoyance to fix, kept across weeks (the list belongs to
--            Life, not to a week). size quick|big, status open|done|dropped.
-- Only the kind check widens and one value check is added; no column.
-- Re-runnable. RLS unchanged (is_owner() policies cover every kind).
-- The cap mirrors LIFE_CAPS.upgradeText in src/projects/life/model.

alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin', 'playbook', 'why', 'idea', 'upgrade'));

alter table public.life_entries
  drop constraint if exists life_entries_upgrade_value;
alter table public.life_entries
  add constraint life_entries_upgrade_value
  check (
    kind <> 'upgrade' or (
      jsonb_typeof(value -> 'text') = 'string'
      and char_length(value ->> 'text') <= 200
      and value ->> 'size' in ('quick', 'big')
      and value ->> 'status' in ('open', 'done', 'dropped')
      and (not (value ? 'doneAt') or jsonb_typeof(value -> 'doneAt') = 'string')
    )
  );
