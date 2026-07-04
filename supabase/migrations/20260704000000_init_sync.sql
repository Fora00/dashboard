-- Dashboard cloud sync: email whitelist, per-project membership, shop_items,
-- storage bucket for local-transfer. See ROADMAP.md.

-- ---------------------------------------------------------------------------
-- Whitelist: only these emails may sign in (magic link / OTP).
-- Managed by the owner in Studio (Table Editor or SQL).
-- ---------------------------------------------------------------------------
create table public.allowed_emails (
  email text primary key check (email = lower(email)),
  role text not null default 'guest' check (role in ('owner', 'guest')),
  created_at timestamptz not null default now()
);

alter table public.allowed_emails enable row level security;
-- No policies: clients can never read or write the whitelist.

insert into public.allowed_emails (email, role)
values ('franzmito@gmail.com', 'owner');

-- Reject sign-ups from non-whitelisted emails.
create function public.enforce_email_whitelist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.allowed_emails where email = lower(new.email)
  ) then
    raise exception 'email % is not on the whitelist', new.email;
  end if;
  return new;
end;
$$;

create trigger before_user_created
  before insert on auth.users
  for each row execute function public.enforce_email_whitelist();

-- ---------------------------------------------------------------------------
-- Per-project access: a row here grants read/write on that project's data.
-- project_id matches the ids in src/lib/projects.ts.
-- ---------------------------------------------------------------------------
create table public.project_members (
  project_id text not null,
  email text not null check (email = lower(email)),
  created_at timestamptz not null default now(),
  primary key (project_id, email)
);

alter table public.project_members enable row level security;

insert into public.project_members (project_id, email)
values
  ('shop-list', 'franzmito@gmail.com'),
  ('local-transfer', 'franzmito@gmail.com');

create function public.jwt_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create function public.is_member(pid text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members
    where project_id = pid and email = public.jwt_email()
  )
$$;

create function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.allowed_emails
    where email = public.jwt_email() and role = 'owner'
  )
$$;

-- Users can see their own memberships; only the owner manages them.
create policy "read own memberships" on public.project_members
  for select using (email = public.jwt_email() or public.is_owner());
create policy "owner manages memberships" on public.project_members
  for all using (public.is_owner()) with check (public.is_owner());

-- ---------------------------------------------------------------------------
-- shop-list: one shared list, realtime.
-- Timestamps are epoch milliseconds to match the client (Dexie) schema.
-- ---------------------------------------------------------------------------
create table public.shop_items (
  id uuid primary key,
  text text not null,
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

alter table public.shop_items enable row level security;

create policy "members full access" on public.shop_items
  for all
  using (public.is_member('shop-list'))
  with check (public.is_member('shop-list'));

alter publication supabase_realtime add table public.shop_items;

-- ---------------------------------------------------------------------------
-- local-transfer: private storage bucket (client sync not wired yet).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('transfer', 'transfer', false);

create policy "transfer members read" on storage.objects
  for select using (bucket_id = 'transfer' and public.is_member('local-transfer'));
create policy "transfer members insert" on storage.objects
  for insert with check (bucket_id = 'transfer' and public.is_member('local-transfer'));
create policy "transfer members update" on storage.objects
  for update using (bucket_id = 'transfer' and public.is_member('local-transfer'));
create policy "transfer members delete" on storage.objects
  for delete using (bucket_id = 'transfer' and public.is_member('local-transfer'));
