-- events: a third mark state, 'going' ("I'm going to this one"), next to
-- 'saved' and 'hidden'. States stay mutually exclusive (one row per event);
-- going shows in the Saved view and counts as saved for the interest score.
alter table public.event_marks drop constraint event_marks_state_check;
alter table public.event_marks
  add constraint event_marks_state_check check (state in ('saved', 'going', 'hidden'));
