-- book-ideas: writing ideas for books, a title plus optional free-text notes.
-- Columns mirror the Dexie shape in src/lib/db.ts; timestamps are epoch
-- milliseconds (bigint) to match the client.

create table public.book_ideas (
  id uuid primary key,
  text text not null,
  notes text not null default '',
  created_at bigint not null,
  updated_at bigint not null
);

alter table public.book_ideas enable row level security;

-- One policy for all ops. WITH CHECK on the write side is required so a guest
-- can't insert/update rows for a project she isn't a member of.
create policy "members full access" on public.book_ideas
  for all
  using (public.is_member('book-ideas'))
  with check (public.is_member('book-ideas'));

-- Realtime, so edits reach other devices live.
alter publication supabase_realtime add table public.book_ideas;
