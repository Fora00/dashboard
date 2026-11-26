-- siti: "Siti" (/siti, SI1), every website the owner publishes. Rows with a
-- repo come from GitHub via the import link (npm run sites:link →
-- /siti/import, made on the Mac with the gh CLI: no token ever reaches the
-- page or this table); rows without a repo are added by hand. The import only
-- refreshes the GitHub columns (url, description, private, pushed_at,
-- pages_status, pages_built_at, fetched_at, gone_from_github); the owner
-- columns (name, notes, pinned, status) are edited only on the page. A repo
-- GitHub no longer lists is flagged gone_from_github, never deleted.
--
-- OWNER ONLY, like the Soldi tables: is_owner(), never is_member(). No
-- shareable_projects row (client previews and notes are the owner's own).
--
-- Columns mirror the Dexie `Site` shape in src/lib/db.ts; timestamps are epoch
-- milliseconds (bigint). Caps MUST match src/lib/sitiSync.ts
-- (MAX_NAME_LENGTH 300, MAX_NOTES_LENGTH 2000, MAX_URL_LENGTH 2000) and
-- src/projects/siti/sitesLink.ts (MAX_REPO_LENGTH 200, MAX_DESCRIPTION_LENGTH
-- 2000).
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.sites (
  id uuid primary key,
  repo text
    check (repo is null or (char_length(repo) between 3 and 200 and repo ~ '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$')),
  url text not null
    check (char_length(url) between 1 and 2000 and url ~* '^https?://'),
  name text not null default ''
    check (char_length(name) <= 300),
  description text not null default ''
    check (char_length(description) <= 2000),
  private boolean not null default false,
  pushed_at bigint,
  pages_status text
    check (pages_status is null or pages_status in ('built', 'errored', 'building')),
  pages_built_at bigint,
  fetched_at bigint,
  notes text not null default ''
    check (char_length(notes) <= 2000),
  pinned boolean not null default false,
  status text not null default 'live'
    check (status in ('live', 'preview', 'archived')),
  gone_from_github boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

-- One row per repo (nulls, the manual sites, never collide). GitHub names are
-- case-insensitive, so the key is too. The client derives a repo row's id from
-- the lowercased repo (uuid v5), so two devices importing the same new repo
-- write one row; a manual site adopting a repo on one device while another
-- imports it hits this index and the engine drops the duplicate push
-- (uniqueViolationIsDone).
create unique index if not exists sites_repo_key on public.sites (lower(repo)) where repo is not null;

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as money_balances in 20261126160000_money_balances.sql).
-- ---------------------------------------------------------------------------
alter table public.sites enable row level security;

drop policy if exists "owner select" on public.sites;
create policy "owner select" on public.sites
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.sites;
create policy "owner insert" on public.sites
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.sites;
create policy "owner update" on public.sites
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.sites;
create policy "owner delete" on public.sites
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.sites;
create trigger ignore_stale_update before update on public.sites
  for each row execute function public.ignore_stale_update();

-- Realtime, so an import on the Mac shows up on the phone live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sites'
  ) then
    alter publication supabase_realtime add table public.sites;
  end if;
end
$$;
