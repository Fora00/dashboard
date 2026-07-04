-- Owner manages guest sharing from inside the app (Sharing project), and the
-- owner has access to every project without needing membership rows — only
-- guests are granular.

-- Owner bypasses membership checks entirely.
create or replace function public.is_member(pid text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_owner() or exists (
    select 1 from public.project_members
    where project_id = pid and email = public.jwt_email()
  )
$$;

-- Owner membership rows are redundant now.
delete from public.project_members
where email in (select email from public.allowed_emails where role = 'owner');

-- Let the owner manage the whitelist from the client (guests only; the owner
-- row can never be touched through the API).
create policy "owner reads whitelist" on public.allowed_emails
  for select using (public.is_owner());
create policy "owner invites guests" on public.allowed_emails
  for insert with check (public.is_owner() and role = 'guest');
create policy "owner removes guests" on public.allowed_emails
  for delete using (public.is_owner() and role = 'guest');
