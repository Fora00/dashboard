-- Shop list areas: items live in sub-areas, and sharing is per-area.
-- Owner sees every area; guests see only areas they were granted (by the
-- owner, or by redeeming an invite link that carries the area's share token).

create table public.shop_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  share_token uuid not null default gen_random_uuid(),
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);
alter table public.shop_areas enable row level security;

create table public.shop_area_members (
  area_id uuid not null references public.shop_areas(id) on delete cascade,
  email text not null check (email = lower(email)),
  created_at timestamptz not null default now(),
  primary key (area_id, email)
);
alter table public.shop_area_members enable row level security;

create function public.can_access_area(aid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_owner() or exists (
    select 1 from public.shop_area_members
    where area_id = aid and email = public.jwt_email()
  )
$$;

-- Default area with a fixed id: the client uses the same id when migrating
-- pre-area local data, so local and remote merge instead of duplicating.
insert into public.shop_areas (id, name, created_at)
values ('00000000-0000-0000-0000-000000000001', 'Groceries',
        (extract(epoch from now()) * 1000)::bigint);

alter table public.shop_items add column area_id uuid;
update public.shop_items set area_id = '00000000-0000-0000-0000-000000000001';
alter table public.shop_items alter column area_id set not null;
alter table public.shop_items
  add constraint shop_items_area_fk
  foreign key (area_id) references public.shop_areas(id) on delete cascade;

-- Policies: members read their areas, only the owner manages areas.
create policy "read accessible areas" on public.shop_areas
  for select using (public.can_access_area(id));
create policy "owner creates areas" on public.shop_areas
  for insert with check (public.is_owner());
create policy "owner updates areas" on public.shop_areas
  for update using (public.is_owner());
create policy "owner deletes areas" on public.shop_areas
  for delete using (public.is_owner());

create policy "read area members" on public.shop_area_members
  for select using (public.is_owner() or email = public.jwt_email());
create policy "owner manages area members" on public.shop_area_members
  for all using (public.is_owner()) with check (public.is_owner());

-- Items are now gated per-area instead of per-project.
drop policy "members full access" on public.shop_items;
create policy "area access" on public.shop_items
  for all
  using (public.can_access_area(area_id))
  with check (public.can_access_area(area_id));

-- The share token is a capability: never expose it via normal selects.
-- (Clients must select explicit columns on shop_areas; the owner gets the
-- token only through the RPC below.)
revoke select (share_token) on public.shop_areas from anon, authenticated;

create function public.area_share_token(aid uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select share_token from public.shop_areas
  where id = aid and public.is_owner()
$$;

-- Invite-link flow. get_invite/redeem_invite are callable by anon: the link
-- itself is the invitation, so whoever holds it may whitelist their email for
-- that one area. Revoke by removing the guest in the app.
create function public.get_invite(token uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select name from public.shop_areas where share_token = token
$$;

create function public.redeem_invite(token uuid, guest_email text)
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
  select id into aid from public.shop_areas where share_token = token;
  if aid is null then
    raise exception 'This invite link is not valid.';
  end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.';
  end if;
  insert into public.allowed_emails (email, role) values (e, 'guest')
    on conflict (email) do nothing;
  insert into public.shop_area_members (area_id, email) values (aid, e)
    on conflict do nothing;
end;
$$;

-- Signed-in users can also join directly with the token.
create function public.join_area(token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aid uuid;
begin
  select id into aid from public.shop_areas where share_token = token;
  if aid is null then
    raise exception 'This invite link is not valid.';
  end if;
  if public.jwt_email() = '' then
    raise exception 'Sign in first.';
  end if;
  insert into public.shop_area_members (area_id, email)
  values (aid, public.jwt_email())
  on conflict do nothing;
end;
$$;
