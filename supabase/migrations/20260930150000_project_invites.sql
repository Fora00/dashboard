-- Per-project invite links (#/join/p/<token>), generalising the shop-area
-- invite (20260704150000_shop_areas.sql + 20260704170000_sharing_hardening.sql).
-- The link IS the invitation: whoever holds it may whitelist their email for
-- THAT project only (a project_members row). Removing the guest undoes an
-- auto-whitelist when no access is left anywhere, and rotates the token so
-- the old link dies.

-- ---------------------------------------------------------------------------
-- Which projects may be granted through project_members (and so get an
-- invite link). project_members.project_id itself is unconstrained, so this
-- is the server-side allowlist. Keep in sync with isInvitable() in
-- src/lib/projects.ts: every project whose tables are gated by
-- is_member('<id>'). NOT listed on purpose:
--   shop-list  gated per area by shop_area_members (use the area invite link)
--   events     public, local-only data — no login, no invite needed
--   settings   device-only, no cloud data
--   life, sharing  owner-only (life RLS is is_owner(), never is_member())
-- A new synced project adds itself with one insert in its own migration
-- (see docs/NEW_PROJECT.md step 5).
-- ---------------------------------------------------------------------------
create table public.shareable_projects (
  id text primary key check (id ~ '^[a-z0-9-]{1,40}$')
);
alter table public.shareable_projects enable row level security;
-- No policies: only the security-definer RPCs below read it.

insert into public.shareable_projects (id) values
  ('local-transfer'),
  ('todo'),
  ('climbing'),
  ('habits'),
  ('book-ideas'),
  ('boardgame-ideas'),
  ('links'),
  ('trips');

-- ---------------------------------------------------------------------------
-- One invite token per project, created on demand by the owner.
-- ---------------------------------------------------------------------------
create table public.project_invites (
  project_id text primary key
    references public.shareable_projects(id) on delete cascade,
  share_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.project_invites enable row level security;

-- The token is a capability: only the owner may ever read it, and nobody
-- writes the table except through the RPCs below.
create policy "owner reads invites" on public.project_invites
  for select using (public.is_owner());
revoke all on public.project_invites from anon;
revoke insert, update, delete on public.project_invites from authenticated;

-- ---------------------------------------------------------------------------
-- Anonymous lookups (the link works signed out).
-- ---------------------------------------------------------------------------

-- Which project an invite is for, or null when the token is unknown/rotated.
create function public.get_project_invite(token uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select i.project_id
  from public.project_invites i
  join public.shareable_projects s on s.id = i.project_id
  where i.share_token = token
$$;

-- New guest: whitelist the email (flagged auto_whitelisted so revoke can undo
-- it) and grant this one project. Same normalisation as redeem_invite.
create function public.redeem_project_invite(token uuid, guest_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  pid text;
  e text;
begin
  e := lower(trim(guest_email));
  if length(e) < 3 or length(e) > 254
     or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.';
  end if;
  pid := public.get_project_invite(token);
  if pid is null then
    -- Token was rotated/revoked: the link is dead.
    raise exception 'This invite link is not valid.';
  end if;
  insert into public.allowed_emails (email, role, auto_whitelisted)
    values (e, 'guest', true)
    on conflict (email) do nothing;
  -- The owner already reaches every project; never write an owner row.
  if not exists (
    select 1 from public.allowed_emails where email = e and role = 'owner'
  ) then
    insert into public.project_members (project_id, email) values (pid, e)
      on conflict do nothing;
  end if;
  return pid;
end;
$$;

-- Signed-in (already whitelisted) user joins directly with the token.
create function public.join_project(token uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  pid text;
begin
  if public.jwt_email() = '' then
    raise exception 'Sign in first.';
  end if;
  pid := public.get_project_invite(token);
  if pid is null then
    raise exception 'This invite link is not valid.';
  end if;
  if not public.is_owner() then
    insert into public.project_members (project_id, email)
      values (pid, public.jwt_email())
      on conflict do nothing;
  end if;
  return pid;
end;
$$;

-- ---------------------------------------------------------------------------
-- Owner-only management.
-- ---------------------------------------------------------------------------

-- The project's invite token, created on first use.
create function public.project_invite_token(pid text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  t uuid;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can share invite links.';
  end if;
  if not exists (select 1 from public.shareable_projects where id = pid) then
    raise exception 'This project can''t be shared by link.';
  end if;
  insert into public.project_invites (project_id) values (pid)
    on conflict (project_id) do nothing;
  select share_token into t from public.project_invites where project_id = pid;
  return t;
end;
$$;

-- Rotate the token: any previously shared link stops working.
create function public.rotate_project_invite(pid text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  t uuid;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can reset invite links.';
  end if;
  if not exists (select 1 from public.shareable_projects where id = pid) then
    raise exception 'This project can''t be shared by link.';
  end if;
  insert into public.project_invites (project_id) values (pid)
    on conflict (project_id)
    do update set share_token = gen_random_uuid()
    returning share_token into t;
  return t;
end;
$$;

-- Remove a guest from one project: drop the membership, undo the
-- auto-whitelist if the guest has no access left ANYWHERE (projects or shop
-- areas), then rotate the project's token so the old link can't re-add them.
-- Works for any project id (so stale rows can be cleaned up); rotates only
-- when the project has an invite. Returns the fresh token, or null.
create function public.revoke_project_guest(pid text, guest_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  e text;
  t uuid;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can remove guests.';
  end if;
  e := lower(trim(guest_email));

  delete from public.project_members where project_id = pid and email = e;

  delete from public.allowed_emails a
  where a.email = e
    and a.role = 'guest'
    and a.auto_whitelisted
    and not exists (select 1 from public.project_members m where m.email = e)
    and not exists (select 1 from public.shop_area_members sm where sm.email = e);

  update public.project_invites
    set share_token = gen_random_uuid()
    where project_id = pid
    returning share_token into t;
  return t;
end;
$$;
