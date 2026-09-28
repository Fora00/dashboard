-- life: actionable check-ins. Adds the entry kind 'checkin' to life_entries.
-- Spec: docs/HANDOFF-life.md (keyed toggles, stable ids).
--
--   checkin  keyed toggle, id `${week}:checkin:${ref}`; value {done, note?}
--
-- `ref` is the check-in's stable id in the plan (plans imported before this
-- carry none; the client derives a deterministic one from date + label). Like
-- the other keyed toggles the row is updated in place and never deleted.
--
-- Safe on top of the live 20260928120000_life.sql schema: no existing row has
-- kind 'checkin', so the new value check holds for every row already there,
-- and the kind check only gets wider. Re-runnable (drop ... if exists first).
-- RLS is unchanged: the table's is_owner() policies cover the new kind.
--
-- The note cap mirrors LIFE_CAPS.checkinNote in src/projects/life/model.ts.
-- The client counts UTF-16 units (>= code points), so it is the stricter side.

-- The kind check was declared inline in 20260928120000_life.sql, so Postgres
-- named it <table>_<column>_check = life_entries_kind_check.
alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin'));

-- Shape of a check-in's value: done is a boolean; note, when present, is a
-- string of at most 1000 characters. Other kinds are untouched. The
-- coalesce matters: a missing `done` makes jsonb_typeof NULL, and a CHECK
-- that evaluates to NULL passes.
alter table public.life_entries
  drop constraint if exists life_entries_checkin_value;
alter table public.life_entries
  add constraint life_entries_checkin_value
  check (
    kind <> 'checkin'
    or coalesce(
      jsonb_typeof(value -> 'done') = 'boolean'
      and (
        not (value ? 'note')
        or (
          jsonb_typeof(value -> 'note') = 'string'
          and char_length(value ->> 'note') <= 1000
        )
      ),
      false
    )
  );
