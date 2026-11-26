-- siti: "Modifiche e idee" (SI3), a change or an idea for one of the owner's
-- websites, logged on /siti (the floating + sheet or the site's list; nothing
-- is loaded by the websites themselves). Child of public.sites:
-- deleting a site deletes its notes (on delete cascade).
--
-- OWNER ONLY, like sites: is_owner(), never is_member().
--
-- Columns mirror the Dexie `SiteNote` shape in src/lib/db.ts; timestamps are
-- epoch milliseconds (bigint). Caps MUST match src/lib/sitiSync.ts
-- (MAX_NOTE_TEXT_LENGTH 2000, MAX_NOTE_PATH_LENGTH 500).
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.site_notes (
  id uuid primary key,
  site_id uuid not null references public.sites (id) on delete cascade,
  kind text not null
    check (kind in ('change', 'idea')),
  text text not null
    check (char_length(text) between 1 and 2000),
  path text not null default ''
    check (char_length(path) <= 500),
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

create index if not exists site_notes_site_id_idx on public.site_notes (site_id);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as sites in 20261126180000_sites.sql).
-- ---------------------------------------------------------------------------
alter table public.site_notes enable row level security;

drop policy if exists "owner select" on public.site_notes;
create policy "owner select" on public.site_notes
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.site_notes;
create policy "owner insert" on public.site_notes
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.site_notes;
create policy "owner update" on public.site_notes
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.site_notes;
create policy "owner delete" on public.site_notes
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql).
drop trigger if exists ignore_stale_update on public.site_notes;
create trigger ignore_stale_update before update on public.site_notes
  for each row execute function public.ignore_stale_update();

-- Realtime, so a note logged on the phone shows up on the Mac live.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_notes'
  ) then
    alter publication supabase_realtime add table public.site_notes;
  end if;
end
$$;
