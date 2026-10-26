-- life: Spock test. Adds two entry kinds to life_entries:
--   why   keyed, id `${week}:why:${trackerId}`; value {reason}: why a habit
--         missed its weekly target (asked in the Sunday check).
--   idea  random uuid id, ref = tracker id; value {text, status}: an idea to
--         make the habit work, kept across weeks next to the habit's history.
-- Only the kind check widens and two value checks are added; no column.
-- Re-runnable. RLS unchanged (is_owner() policies cover every kind).
-- The caps mirror LIFE_CAPS.whyReason / ideaText in src/projects/life/model.

alter table public.life_entries
  drop constraint if exists life_entries_kind_check;
alter table public.life_entries
  add constraint life_entries_kind_check
  check (kind in ('focus', 'tracker', 'sunday', 'sent', 'checkin', 'playbook', 'why', 'idea'));

alter table public.life_entries
  drop constraint if exists life_entries_why_idea_value;
alter table public.life_entries
  add constraint life_entries_why_idea_value
  check (
    (kind <> 'why' or (
      jsonb_typeof(value -> 'reason') = 'string'
      and char_length(value ->> 'reason') <= 500
    ))
    and
    (kind <> 'idea' or (
      jsonb_typeof(value -> 'text') = 'string'
      and char_length(value ->> 'text') <= 300
      and value ->> 'status' in ('open', 'trying', 'done', 'dropped')
    ))
  );
