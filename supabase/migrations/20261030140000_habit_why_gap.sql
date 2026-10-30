-- habits: a "why" line (what the habit serves, what it costs) and whether it
-- is done with a person or alone; habit_checks: a short note (the gap reason
-- after a missed day: anchor / energy / plan / other). Nullable, re-runnable.
-- Caps mirror MAX_TEXT_LENGTH / MAX_NOTE_LENGTH in src/lib/habitSync.ts.
alter table public.habits
  add column if not exists why text,
  add column if not exists social text;
alter table public.habit_checks add column if not exists note text;

alter table public.habits drop constraint if exists habits_why_social_check;
alter table public.habits
  add constraint habits_why_social_check check (
    (why is null or char_length(why) <= 300)
    and (social is null or social in ('person', 'alone'))
  );

alter table public.habit_checks drop constraint if exists habit_checks_note_check;
alter table public.habit_checks
  add constraint habit_checks_note_check check (note is null or char_length(note) <= 100);
