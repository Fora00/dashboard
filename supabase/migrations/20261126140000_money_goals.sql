-- money (Soldi, MO13): the yearly savings goal, as a rate of income kept
-- ("messo da parte" / entrate), set from /soldi.
--
--   money_goals  one row per year that has its own goal. id is the year
--                'YYYY'. rate_bp is the rate in basis points (3000 = 30%).
--                A year without a row inherits the latest earlier year's goal
--                (decided in the app, src/projects/money/moneyGoals.ts goalFor).
--
-- OWNER ONLY, like money_totals and money_budgets: is_owner(), never
-- is_member(). Timestamps are epoch milliseconds (bigint).
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.money_goals (
  id text primary key
    check (id ~ '^[0-9]{4}$'),
  rate_bp integer not null
    check (rate_bp between 0 and 10000),
  updated_at bigint not null
);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as money_budgets in 20261126120000_money_budgets.sql).
-- ---------------------------------------------------------------------------
alter table public.money_goals enable row level security;

drop policy if exists "owner select" on public.money_goals;
create policy "owner select" on public.money_goals
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.money_goals;
create policy "owner insert" on public.money_goals
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.money_goals;
create policy "owner update" on public.money_goals
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.money_goals;
create policy "owner delete" on public.money_goals
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.money_goals;
create trigger ignore_stale_update before update on public.money_goals
  for each row execute function public.ignore_stale_update();

-- Realtime, so a goal set on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'money_goals'
  ) then
    alter publication supabase_realtime add table public.money_goals;
  end if;
end
$$;
