-- links: add free-form tags. Mirrors `tags: string[]` on LinkItem in
-- src/lib/db.ts (normalized to lowercase and deduped client-side by
-- normalizeTag() in src/lib/linksSync.ts). NOT NULL with a '{}' default, so
-- the rows already on the hosted project stay valid without a backfill and an
-- older client that never sends the column keeps working.
--
-- Capped the same way the text columns are, so a client bypass can't blow past
-- what the UI enforces: at most 10 tags, each at most 30 chars. Two named
-- constraints rather than one, because the per-element length check needs
-- `unnest` and a CHECK expression may not contain a subquery — it lives in an
-- IMMUTABLE helper (immutability is required for a function used in a CHECK)
-- that the constraint calls instead. Deliberately NOT written as
-- `char_length(array_to_string(tags, ','))`: array_to_string is only STABLE,
-- since it calls the element type's output function.

create or replace function public.links_tags_within_length(tags text[])
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  select coalesce(max(char_length(t)), 0) <= 30 from unnest(tags) as t;
$$;

alter table public.links
  add column tags text[] not null default '{}';

alter table public.links
  add constraint links_tags_max_count
    check (coalesce(array_length(tags, 1), 0) <= 10);

alter table public.links
  add constraint links_tags_max_length
    check (public.links_tags_within_length(tags));
