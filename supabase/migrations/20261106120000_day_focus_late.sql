-- life_day_focus: "In ritardo" subsection (Things tag 🐌). Slots 0-2 stay the
-- 3-line daily focus, 3-8 the urgent lines, 9-14 hold overdue lines. Re-runnable.
alter table public.life_day_focus drop constraint if exists life_day_focus_id_check;
alter table public.life_day_focus drop constraint if exists life_day_focus_slot_check;
alter table public.life_day_focus
  add constraint life_day_focus_id_check
  check (id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}:([0-9]|1[0-4])$');
alter table public.life_day_focus
  add constraint life_day_focus_slot_check check (slot between 0 and 14);
