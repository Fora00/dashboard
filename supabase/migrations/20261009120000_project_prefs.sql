-- project_prefs: the home grid's per-project `starred` and `hidden` choices,
-- synced across one user's devices. Open counts and last-opened times stay
-- local-only (Dexie projectStats, per device) and have no remote table.
-- Columns mirror the Dexie ProjectPref shape (src/lib/db.ts); timestamps are
-- epoch milliseconds (bigint) like every other synced table. Client:
-- src/lib/projectPrefsSync.ts.
--
-- PER USER, not per project and not owner-only: the owner and every guest
-- have their own rows, and nobody can read or write anyone else's. Gated by
-- user_id = auth.uid() (not is_member / is_owner); not in shareable_projects.
--
-- Key: primary key (user_id, id), id = the project id from
-- src/lib/projects.ts. The generic engine addresses rows by `id` alone (local
-- Dexie key, delete .eq('id'), keyset paging by id); RLS narrows every
-- statement to the caller's rows, inside which `id` is unique. The client
-- never sends user_id: it defaults to auth.uid(), so PostgREST's upsert
-- (ON CONFLICT on the primary key) resolves against the caller's own row.
--
-- Rows are only ever upserted by the client ("unstar" = starred false,
-- "back to the default" = hidden null), never deleted. hidden is tri-state on
-- purpose: null = unset, the client then applies its defaults
-- (DEFAULT_HIDDEN in src/lib/projectStats.ts), so an explicit choice always
-- beats them.

create table public.project_prefs (
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  id text not null
    check (char_length(id) between 1 and 64 and id ~ '^[a-z0-9][a-z0-9-]*$'),
  starred boolean not null default false,
  hidden boolean,
  updated_at bigint not null,
  primary key (user_id, id)
);

comment on table public.project_prefs is
  'Per-user home grid choices (starred, hidden) per dashboard project. id = project id; hidden null = use the client defaults.';

-- ---------------------------------------------------------------------------
-- RLS: own rows only, every operation, WITH CHECK on the write side.
-- ---------------------------------------------------------------------------
alter table public.project_prefs enable row level security;

create policy "own select" on public.project_prefs
  for select using (user_id = auth.uid());
create policy "own insert" on public.project_prefs
  for insert with check (user_id = auth.uid());
create policy "own update" on public.project_prefs
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own delete" on public.project_prefs
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Last-writer-wins, plus a merge for updated_at = 0.
-- ---------------------------------------------------------------------------
-- A device whose stars/hidden choices predate sync queues them once with
-- updated_at 0 (Dexie v17 upgrade in src/lib/db.ts). There is no real
-- timestamp to compare, so instead of overwriting (or being dropped by) the
-- stored row, the two are merged: a star on either side is kept, and an
-- explicit hidden choice fills an unset one (the stored choice wins when both
-- are set). The stored updated_at is kept; the client then pulls the merged
-- row. Inserts never fire it, so the first device's legacy row goes in as is.
create or replace function public.project_prefs_merge()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.updated_at = 0 then
    new.starred := old.starred or new.starred;
    new.hidden := coalesce(old.hidden, new.hidden);
    new.updated_at := old.updated_at;
    return new;
  end if;
  if new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end;
$$;

comment on function public.project_prefs_merge() is
  'BEFORE UPDATE trigger on project_prefs: last-writer-wins by updated_at, except updated_at = 0 (choices that predate sync), which is merged into the stored row.';

create trigger project_prefs_merge before update on public.project_prefs
  for each row execute function public.project_prefs_merge();

-- Realtime, so starring on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber for inserts/updates; DELETE events
-- reach every subscriber with only the old primary key, so the client ignores
-- them for this table (realtimeDeletes: false in projectPrefsSync.ts).
alter publication supabase_realtime add table public.project_prefs;
