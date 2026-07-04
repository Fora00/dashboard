-- Sharing hardening: audit fixes for guest revocation, invite-link scope,
-- transfer storage per-user paths, and a missing WITH CHECK. See ROADMAP.md
-- "Urgent bugs".

-- ---------------------------------------------------------------------------
-- (2) redeem_invite scope: track which whitelist rows were auto-created by an
-- invite redemption, so removing the guest (or rotating the token) can undo
-- them. Owner-invited rows (auto_whitelisted = false) are never auto-removed.
-- ---------------------------------------------------------------------------
alter table public.allowed_emails
  add column auto_whitelisted boolean not null default false;

-- Harden redeem_invite: normalise + sanity-check the email, and mark rows we
-- create so they can be cleaned up. Still anon-callable — the link IS the
-- invitation — but a leaked link no longer grants a *permanent* whitelist:
-- removing the guest reverses it, and rotating the token kills the link.
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
  select id into aid from public.shop_areas where share_token = token;
  if aid is null then
    -- Token was rotated/revoked: the link is dead.
    raise exception 'This invite link is not valid.';
  end if;
  insert into public.allowed_emails (email, role, auto_whitelisted)
    values (e, 'guest', true)
    on conflict (email) do nothing;
  insert into public.shop_area_members (area_id, email) values (aid, e)
    on conflict do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- (1) Guest removal must actually revoke: rotate the area's share_token so any
-- outstanding #/join/<token> link dies immediately (join_area / redeem_invite
-- both look the area up by token, so they now raise "not valid").
-- ---------------------------------------------------------------------------
create function public.rotate_area_token(aid uuid)
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
  update public.shop_areas
    set share_token = gen_random_uuid()
    where id = aid
    returning share_token into new_token;
  if new_token is null then
    raise exception 'Area not found.';
  end if;
  return new_token;
end;
$$;

-- Owner-only guest removal for an area: drop the membership, undo the
-- auto-whitelist if this email has no access left anywhere, then rotate the
-- token so the old invite link can't re-add them. Returns the fresh token.
create function public.revoke_area_guest(aid uuid, guest_email text)
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

  -- Only clean up rows we auto-created via an invite, and only when the guest
  -- has no other project/area membership left.
  delete from public.allowed_emails a
  where a.email = e
    and a.role = 'guest'
    and a.auto_whitelisted
    and not exists (select 1 from public.project_members m where m.email = e)
    and not exists (select 1 from public.shop_area_members sm where sm.email = e);

  update public.shop_areas
    set share_token = gen_random_uuid()
    where id = aid
    returning share_token into new_token;
  return new_token;
end;
$$;

-- ---------------------------------------------------------------------------
-- (4) shop_areas UPDATE policy was missing a WITH CHECK: an owner update could
-- otherwise move a row to a state the USING clause would forbid. Recreate it
-- with a matching WITH CHECK.
-- ---------------------------------------------------------------------------
drop policy "owner updates areas" on public.shop_areas;
create policy "owner updates areas" on public.shop_areas
  for update using (public.is_owner()) with check (public.is_owner());

-- ---------------------------------------------------------------------------
-- (3) transfer storage scoping. Members may read/list everything, but may only
-- write/overwrite/delete objects under their own "<auth.uid()>/" folder. The
-- owner keeps full control, including legacy flat-path objects created before
-- this migration (their folder segment is empty, so only is_owner() matches).
-- ---------------------------------------------------------------------------
drop policy "transfer members read" on storage.objects;
drop policy "transfer members insert" on storage.objects;
drop policy "transfer members update" on storage.objects;
drop policy "transfer members delete" on storage.objects;

create policy "transfer members read" on storage.objects
  for select using (
    bucket_id = 'transfer' and public.is_member('local-transfer')
  );

create policy "transfer own insert" on storage.objects
  for insert with check (
    bucket_id = 'transfer'
    and public.is_member('local-transfer')
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_owner())
  );

create policy "transfer own update" on storage.objects
  for update using (
    bucket_id = 'transfer'
    and public.is_member('local-transfer')
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_owner())
  ) with check (
    bucket_id = 'transfer'
    and public.is_member('local-transfer')
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_owner())
  );

create policy "transfer own delete" on storage.objects
  for delete using (
    bucket_id = 'transfer'
    and public.is_member('local-transfer')
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_owner())
  );
