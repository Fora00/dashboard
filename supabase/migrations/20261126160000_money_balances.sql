-- money: "Patrimonio" (/soldi/patrimonio, MO17), month-end balances per
-- GreenBooks account. A mirror of ~/life/money/data/account-balances.csv (the
-- source of truth, written by ~/life/_sync/money-balances.py), written only by
-- the import link (npm run life:money-balances-link → /soldi/patrimonio/import):
-- one row per month and account, replaced wholesale per imported month, never
-- edited by hand. Balances only, never single transactions.
--
-- OWNER ONLY, like money_totals: is_owner(), never is_member().
--
-- The id is `${month}:${account}`, so a month can never hold an account twice;
-- the check ties id, month and account together. grp is the account's group:
-- liquidita | risparmi | investimenti (investments are what went in, not the
-- market value). balance_cents is signed integer cents. Caps mirror
-- MAX_CATEGORY_LENGTH and MAX_ABS_CENTS in src/projects/money/moneyCsv.ts
-- (src/projects/money/balancesCsv.ts reuses them). Timestamps are epoch
-- milliseconds (bigint) like every other synced table.
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.money_balances (
  id text primary key,
  month text not null
    check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  account text not null
    check (char_length(account) between 1 and 100 and account = btrim(account)),
  grp text not null
    check (grp in ('liquidita', 'risparmi', 'investimenti')),
  balance_cents bigint not null
    check (abs(balance_cents) <= 100000000000),
  updated_at bigint not null,
  constraint money_balances_id_is_month_account check (id = month || ':' || account)
);

create index if not exists money_balances_month_idx on public.money_balances (month);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as money_totals in 20261124120000_money_totals.sql).
-- ---------------------------------------------------------------------------
alter table public.money_balances enable row level security;

drop policy if exists "owner select" on public.money_balances;
create policy "owner select" on public.money_balances
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.money_balances;
create policy "owner insert" on public.money_balances
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.money_balances;
create policy "owner update" on public.money_balances
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.money_balances;
create policy "owner delete" on public.money_balances
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.money_balances;
create trigger ignore_stale_update before update on public.money_balances
  for each row execute function public.ignore_stale_update();

-- Realtime, so an import on the Mac shows up on the phone live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'money_balances'
  ) then
    alter publication supabase_realtime add table public.money_balances;
  end if;
end
$$;
