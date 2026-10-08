-- Audit H1 (ROADMAP "Full audit (2026-10-07)"): shop-area guests could read
-- shop_areas.share_token. The column-level `revoke select (share_token)` from
-- 20260704150000_shop_areas.sql is ineffective while Supabase's default
-- table-level SELECT grant to authenticated is in place, and realtime
-- broadcasts the full row of every shop_areas change to every subscriber
-- (shop_areas is in supabase_realtime since 20260704160000_sync_parity.sql).
-- A guest holding the token can re-share the invite link.
--
-- Fix, mirroring public.project_invites (20260930150000_project_invites.sql):
-- the token moves to an owner-only table that is NOT in the realtime
-- publication, and the column is dropped from shop_areas, so neither a select
-- nor a realtime payload can carry it any more. Every RPC that read or wrote
-- the column is rewritten against the new table (same names, signatures,
-- security definer + pinned search_path, so grants are unchanged).
--
-- Areas created after this migration get their token on demand, the first
-- time the owner asks for a link (area_share_token / rotate_area_token).
-- Until then get_invite/join_area/redeem_invite have nothing to match: no
-- link for that area exists yet.

-- ---------------------------------------------------------------------------
-- Owner-only token table.
-- ---------------------------------------------------------------------------
create table public.shop_area_tokens (
  area_id uuid primary key
    references public.shop_areas(id) on delete cascade,
  share_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.shop_area_tokens enable row level security;

-- The token is a capability: only the owner may ever read or write it.
-- (The app itself goes through the security-definer RPCs below.)
create policy "owner manages area tokens" on public.shop_area_tokens
  for all using (public.is_owner()) with check (public.is_owner());
revoke all on public.shop_area_tokens from anon;

-- Backfill: every existing area keeps its current token, so links already
-- shared keep working.
insert into public.shop_area_tokens (area_id, share_token)
  select id, share_token from public.shop_areas
  on conflict (area_id) do nothing;

-- ---------------------------------------------------------------------------
-- RPCs rewritten against shop_area_tokens.
-- ---------------------------------------------------------------------------

-- Owner: the area's token, created on first use. Was `language sql stable`;
-- it now may insert, so it is volatile plpgsql (same signature).
create or replace function public.area_share_token(aid uuid)
returns uuid
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  t uuid;
begin
  if not public.is_owner() then
    return null;
  end if;
  if not exists (select 1 from public.shop_areas where id = aid) then
    return null;
  end if;
  insert into public.shop_area_tokens (area_id) values (aid)
    on conflict (area_id) do nothing;
  select share_token into t from public.shop_area_tokens where area_id = aid;
  return t;
end;
$$;

-- Anon: which area an invite is for (its name), or null.
create or replace function public.get_invite(token uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select a.name
  from public.shop_area_tokens t
  join public.shop_areas a on a.id = t.area_id
  where t.share_token = token
$$;

-- Anon: whitelist the email (flagged so revoke can undo it) and grant the
-- area. Same behaviour as 20260704170000_sharing_hardening.sql, plus the
-- owner-row skip that redeem_project_invite already had.
create or replace function public.redeem_invite(token uuid, guest_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aid uuid;
  e text;
begin
  e := lower(trim(guest_email));
  if length(e) < 3 or length(e) > 254
     or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.';
  end if;
  select area_id into aid from public.shop_area_tokens where share_token = token;
  if aid is null then
    -- Token was rotated/revoked: the link is dead.
    raise exception 'This invite link is not valid.';
  end if;
  insert into public.allowed_emails (email, role, auto_whitelisted)
    values (e, 'guest', true)
    on conflict (email) do nothing;
  -- The owner already reaches every area; never write an owner row.
  if not exists (
    select 1 from public.allowed_emails where email = e and role = 'owner'
  ) then
    insert into public.shop_area_members (area_id, email) values (aid, e)
      on conflict do nothing;
  end if;
end;
$$;

-- Signed-in user joins directly with the token. The whitelist requirement
-- (audit M2) is added in 20261008110000_join_whitelist_and_checks.sql.
create or replace function public.join_area(token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aid uuid;
begin
  if public.jwt_email() = '' then
    raise exception 'Sign in first.';
  end if;
  select area_id into aid from public.shop_area_tokens where share_token = token;
  if aid is null then
    raise exception 'This invite link is not valid.';
  end if;
  if not public.is_owner() then
    insert into public.shop_area_members (area_id, email)
      values (aid, public.jwt_email())
      on conflict do nothing;
  end if;
end;
$$;

-- Owner: rotate the token so any previously shared link dies.
create or replace function public.rotate_area_token(aid uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_token uuid;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can reset invite links.';
  end if;
  if not exists (select 1 from public.shop_areas where id = aid) then
    raise exception 'Area not found.';
  end if;
  insert into public.shop_area_tokens (area_id) values (aid)
    on conflict (area_id)
    do update set share_token = gen_random_uuid(), created_at = now()
    returning share_token into new_token;
  return new_token;
end;
$$;

-- Owner: remove a guest from an area, undo the auto-whitelist if no access is
-- left anywhere, then rotate the token. Returns the fresh token, or null when
-- the area never had a link (nothing to rotate).
create or replace function public.revoke_area_guest(aid uuid, guest_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  e text;
  new_token uuid;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can remove guests.';
  end if;
  e := lower(trim(guest_email));

  delete from public.shop_area_members where area_id = aid and email = e;

  delete from public.allowed_emails a
  where a.email = e
    and a.role = 'guest'
    and a.auto_whitelisted
    and not exists (select 1 from public.project_members m where m.email = e)
    and not exists (select 1 from public.shop_area_members sm where sm.email = e);

  update public.shop_area_tokens
    set share_token = gen_random_uuid(), created_at = now()
    where area_id = aid
    returning share_token into new_token;
  return new_token;
end;
$$;

-- ---------------------------------------------------------------------------
-- Drop the leaking column. Its column-level revoke goes with it. After this a
-- shop_areas row (select or realtime payload) is just id, name, created_at.
-- ---------------------------------------------------------------------------
alter table public.shop_areas drop column share_token;

-- Belt and braces: the token table must never be broadcast. It was never
-- added to the publication; this only guards against a manual add in Studio.
do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shop_area_tokens'
  ) then
    alter publication supabase_realtime drop table public.shop_area_tokens;
  end if;
end;
$$;
