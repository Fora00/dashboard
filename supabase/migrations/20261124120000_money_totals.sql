-- money: "Soldi" (/soldi), monthly totals per GreenBooks category. A mirror of
-- ~/life/money/data/monthly-totals.csv (the source of truth), written only by
-- the import link (npm run life:money-link → /soldi/import): one row per month
-- and category, replaced wholesale per imported month, never edited by hand.
-- Totals only, never single transactions.
--
-- OWNER ONLY, like the Life tables: is_owner(), never is_member().
--
-- The id is `${month}:${category}`, so a month can never hold a category
-- twice; the check ties id, month and category together. Amounts are integer
-- cents, signed (+ in, - out); budget_cents is that month's limit, signed like
-- the amount, null when there is none. kind: income | spend | oneoff | pass
-- (pass = loans/refunds, never counted as income or spend). Caps mirror
-- MAX_CATEGORY_LENGTH and MAX_ABS_CENTS in src/projects/money/moneyCsv.ts.
-- Timestamps are epoch milliseconds (bigint) like every other synced table.
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.money_totals (
  id text primary key,
  month text not null
    check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  category text not null
    check (char_length(category) between 1 and 100 and category = btrim(category)),
  kind text not null
    check (kind in ('income', 'spend', 'oneoff', 'pass')),
  amount_cents bigint not null
    check (abs(amount_cents) <= 100000000000),
  budget_cents bigint
    check (budget_cents is null or abs(budget_cents) <= 100000000000),
  updated_at bigint not null,
  constraint money_totals_id_is_month_category check (id = month || ':' || category)
);

create index if not exists money_totals_month_idx on public.money_totals (month);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as life_engines in 20261101120000_life_engines.sql).
-- ---------------------------------------------------------------------------
alter table public.money_totals enable row level security;

drop policy if exists "owner select" on public.money_totals;
create policy "owner select" on public.money_totals
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.money_totals;
create policy "owner insert" on public.money_totals
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.money_totals;
create policy "owner update" on public.money_totals
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.money_totals;
create policy "owner delete" on public.money_totals
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.money_totals;
create trigger ignore_stale_update before update on public.money_totals
  for each row execute function public.ignore_stale_update();

-- Realtime, so an import on the Mac shows up on the phone live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'money_totals'
  ) then
    alter publication supabase_realtime add table public.money_totals;
  end if;
end
$$;
