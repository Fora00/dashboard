-- links: a shared link stash — a URL plus an editable title and optional
-- notes, with a read/unread flag. Columns mirror the Dexie shape in
-- src/lib/db.ts; timestamps are epoch milliseconds (bigint) to match the
-- client.

create table public.links (
  id uuid primary key,
  url text not null check (char_length(url) <= 2000),
  title text not null default '' check (char_length(title) <= 300),
  notes text not null default '' check (char_length(notes) <= 2000),
  read boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

alter table public.links enable row level security;

-- One policy for all ops. WITH CHECK on the write side is required so a guest
-- can't insert/update rows for a project she isn't a member of.
create policy "members full access" on public.links
  for all
  using (public.is_member('links'))
  with check (public.is_member('links'));

-- Realtime, so edits reach other devices live.
alter publication supabase_realtime add table public.links;
