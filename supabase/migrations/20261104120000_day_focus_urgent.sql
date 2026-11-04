-- life_day_focus: "Urgenze" subsection. Slots 0-2 stay the 3-line daily focus;
-- slots 3-8 hold urgent lines (e.g. a house visit) outside that cap. Re-runnable.
alter table public.life_day_focus drop constraint if exists life_day_focus_id_check;
alter table public.life_day_focus drop constraint if exists life_day_focus_slot_check;
alter table public.life_day_focus
  add constraint life_day_focus_id_check check (id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}:[0-8]$');
alter table public.life_day_focus
  add constraint life_day_focus_slot_check check (slot between 0 and 8);
