-- Audit fixes (ROADMAP "Full audit (2026-10-07)"): M2, L4, L5 and the
-- join_area half of L6. Re-runnable.

-- ===========================================================================
-- M2: removed guests could still sign in and rejoin.
-- ===========================================================================
-- Removing a guest deletes their allowed_emails row, but their auth account
-- and any live session survive. join_project / join_area only required a
-- session, so a removed guest holding a (not yet rotated, or freshly
-- re-shared) token could put themselves back. Both now require the caller's
-- JWT email to be on the whitelist. (redeem_invite / redeem_project_invite
-- are the anon "the link is the invitation" path and re-whitelist on purpose;
-- removing a guest rotates the token, which kills that path.)
--
-- L6: join_area also inserted the owner as an area member; it now skips the
-- owner like join_project does (the owner already reaches every area).

create or replace function public.join_project(token uuid)
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
  if not exists (
    select 1 from public.allowed_emails where email = public.jwt_email()
  ) then
    raise exception 'This account is not invited any more.';
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

-- Token lookup against public.shop_area_tokens (20261008100000_area_tokens.sql).
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
  if not exists (
    select 1 from public.allowed_emails where email = public.jwt_email()
  ) then
    raise exception 'This account is not invited any more.';
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

-- ===========================================================================
-- L4: date columns lack a format check.
-- ===========================================================================
-- Same approach as 20260930160100_text_caps.sql: add NOT VALID (checks only
-- rows written from now on, so the push can't fail on hosted data), then try
-- to validate; if an existing row doesn't match it stays NOT VALID with a
-- NOTICE. The client always writes local-date 'YYYY-MM-DD' strings.

do $$
declare
  c record;
  cname text;
begin
  for c in
    select * from (values
      ('climb_sessions', 'date'),
      ('climbs',         'date'),
      ('habit_checks',   'day')
    ) as t(tbl, col)
  loop
    cname := format('%s_%s_format', c.tbl, c.col);
    execute format('alter table public.%I drop constraint if exists %I', c.tbl, cname);
    execute format(
      'alter table public.%I add constraint %I check (%I ~ %L) not valid',
      c.tbl, cname, c.col, '^\d{4}-\d{2}-\d{2}$');
    begin
      execute format('alter table public.%I validate constraint %I', c.tbl, cname);
    exception when check_violation then
      raise notice '% left NOT VALID: existing rows are not YYYY-MM-DD', cname;
    end;
  end loop;
end;
$$;

-- ===========================================================================
-- L5: pin jwt_email()'s search_path (it is used inside every RLS policy).
-- ===========================================================================
alter function public.jwt_email() set search_path = public;
