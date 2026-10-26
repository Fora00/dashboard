-- life: "Playbook of the week". Adds the entry kind 'playbook' to life_entries.
-- Spec: docs/HANDOFF-life.md (2.1 `playbook`, 2.4 export).
--
--   playbook  append-only (like a tracker +1), random id, ref 'playbook';
--             value {note?}; deleted on Undo
--
-- The plan field `playbook` lives in the existing life_weeks.plan jsonb, so it
-- needs no column. Only the kind check has to widen. Safe on top of the live
-- schema: no row has kind 'playbook' yet. Re-runnable. RLS unchanged
-- (is_owner() policies cover every kind).
--
-- The note cap mirrors LIFE_CAPS.playbookNote in src/projects/life/model.

alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin', 'playbook'));

-- note, when present, is a string of at most 300 characters. Other kinds are
-- untouched.
alter table public.life_entries
  drop constraint if exists life_entries_playbook_value;
alter table public.life_entries
  add constraint life_entries_playbook_value
  check (
    kind <> 'playbook'
    or not (value ? 'note')
    or (
      jsonb_typeof(value -> 'note') = 'string'
      and char_length(value ->> 'note') <= 300
    )
  );
