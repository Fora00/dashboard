-- project_prefs.layout: where the blocks of a project's screen sit, synced
-- across one user's devices. Only the Life week screen uses it today (row
-- id 'life'): an array of columns, each an array of block ids; the client
-- validates and repairs it (sanitizeLayout in src/projects/life/week/blockLayout.ts).
-- null = the default layout. Same per-user RLS and last-writer-wins trigger
-- as the rest of the table (20261009120000_project_prefs.sql).

alter table public.project_prefs
  add column layout jsonb
    check (layout is null or (jsonb_typeof(layout) = 'array' and pg_column_size(layout) <= 4096));

comment on column public.project_prefs.layout is
  'Block layout of the project screen (Life: columns of block ids). null = default.';

-- The updated_at = 0 merge (choices that predate sync) keeps a stored layout.
create or replace function public.project_prefs_merge()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.updated_at = 0 then
    new.starred := old.starred or new.starred;
    new.hidden := coalesce(old.hidden, new.hidden);
    new.layout := coalesce(old.layout, new.layout);
    new.updated_at := old.updated_at;
    return new;
  end if;
  if new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end;
$$;
