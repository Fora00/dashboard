-- life: "Focus di oggi", up to 3 free-text lines per day, typed or pasted by
-- hand on /life and ticked done. Spec: docs/HANDOFF-life.md. Per DAY, not per
-- week, and kept out of life_entries on purpose: it must not reach the week
-- summary or export. Timestamps are epoch milliseconds (bigint) like every
-- other synced table.
--
-- OWNER ONLY, like the other Life tables: is_owner(), never is_member().
--
-- The id is `${day}:${slot}` with slot 0-2, so a day can never hold more than
-- 3 rows, even when two devices add at the same time (they would pick the same
-- slot and last-writer-wins settles it). The checks tie id, day and slot
-- together. The title cap mirrors LIFE_CAPS.dayFocusTitle in
-- src/projects/life/model/constants.ts (the client counts UTF-16 units, the
-- stricter side). A deleted line is a real delete; its slot becomes free.

create table public.life_day_focus (
  id text primary key
    check (id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}:[0-2]$'),
  day date not null,
  slot smallint not null
    check (slot between 0 and 2),
  title text not null
    check (char_length(title) between 1 and 200),
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null,
  constraint life_day_focus_id_is_day_slot check (id = day::text || ':' || slot::text)
);

create index life_day_focus_day_idx on public.life_day_focus (day);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as life_weeks / life_entries in 20260928120000_life.sql).
-- ---------------------------------------------------------------------------
alter table public.life_day_focus enable row level security;

create policy "owner select" on public.life_day_focus
  for select using (public.is_owner());
create policy "owner insert" on public.life_day_focus
  for insert with check (public.is_owner());
create policy "owner update" on public.life_day_focus
  for update using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.life_day_focus
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
create trigger ignore_stale_update before update on public.life_day_focus
  for each row execute function public.ignore_stale_update();

-- Realtime, so a line added on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
alter publication supabase_realtime add table public.life_day_focus;
