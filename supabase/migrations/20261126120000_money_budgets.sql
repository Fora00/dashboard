-- money (Soldi, MO8): budgets set from the dashboard, on top of the GreenBooks
-- budgets that arrive with the monthly totals (money_totals.budget_cents).
-- The import link never touches these two tables.
--
--   money_budgets         a rule "category, amount per month, from month,
--                         optional to month". Rules of one category never
--                         overlap (the app truncates the earlier one when a
--                         new one starts inside it). monthly_cents is positive:
--                         the page signs it like the category's rows.
--   money_budget_choices  for a (month, category) where both a GreenBooks
--                         budget and a dashboard rule exist and differ, which
--                         one the owner picked. gb_cents (signed, as in
--                         money_totals) and dash_cents (positive, as in
--                         money_budgets) are the two values at pick time: when
--                         either current value differs, the pick is stale and
--                         the conflict shows again.
--
-- OWNER ONLY, like money_totals: is_owner(), never is_member().
-- Caps mirror MAX_CATEGORY_LENGTH and MAX_ABS_CENTS in
-- src/projects/money/moneyCsv.ts. Timestamps are epoch milliseconds (bigint).
--
-- Re-runnable: every statement is guarded (if not exists / drop if exists /
-- a publication check), so applying it twice is a no-op.

create table if not exists public.money_budgets (
  id text primary key
    check (char_length(id) between 1 and 64),
  category text not null
    check (char_length(category) between 1 and 100 and category = btrim(category)),
  monthly_cents bigint not null
    check (monthly_cents > 0 and monthly_cents <= 100000000000),
  from_month text not null
    check (from_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  to_month text
    check (to_month is null or to_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  updated_at bigint not null,
  constraint money_budgets_to_after_from check (to_month is null or to_month >= from_month)
);

create index if not exists money_budgets_category_idx on public.money_budgets (category);

create table if not exists public.money_budget_choices (
  id text primary key,
  month text not null
    check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  category text not null
    check (char_length(category) between 1 and 100 and category = btrim(category)),
  pick text not null
    check (pick in ('greenbooks', 'dashboard')),
  gb_cents bigint not null
    check (abs(gb_cents) <= 100000000000),
  dash_cents bigint not null
    check (abs(dash_cents) <= 100000000000),
  updated_at bigint not null,
  constraint money_budget_choices_id_is_month_category check (id = month || ':' || category)
);

create index if not exists money_budget_choices_month_idx on public.money_budget_choices (month);

-- ---------------------------------------------------------------------------
-- RLS: owner only, every operation, WITH CHECK on the write side
-- (same shape as money_totals in 20261124120000_money_totals.sql).
-- ---------------------------------------------------------------------------
alter table public.money_budgets enable row level security;

drop policy if exists "owner select" on public.money_budgets;
create policy "owner select" on public.money_budgets
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.money_budgets;
create policy "owner insert" on public.money_budgets
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.money_budgets;
create policy "owner update" on public.money_budgets
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.money_budgets;
create policy "owner delete" on public.money_budgets
  for delete using (public.is_owner());

alter table public.money_budget_choices enable row level security;

drop policy if exists "owner select" on public.money_budget_choices;
create policy "owner select" on public.money_budget_choices
  for select using (public.is_owner());
drop policy if exists "owner insert" on public.money_budget_choices;
create policy "owner insert" on public.money_budget_choices
  for insert with check (public.is_owner());
drop policy if exists "owner update" on public.money_budget_choices;
create policy "owner update" on public.money_budget_choices
  for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner delete" on public.money_budget_choices;
create policy "owner delete" on public.money_budget_choices
  for delete using (public.is_owner());

-- Server-side last-writer-wins (20260930160000_sync_hardening.sql): an update
-- carrying an older updated_at than the stored row is ignored.
drop trigger if exists ignore_stale_update on public.money_budgets;
create trigger ignore_stale_update before update on public.money_budgets
  for each row execute function public.ignore_stale_update();
drop trigger if exists ignore_stale_update on public.money_budget_choices;
create trigger ignore_stale_update before update on public.money_budget_choices
  for each row execute function public.ignore_stale_update();

-- Realtime, so a budget set on the phone shows up on the Mac live. Realtime
-- applies the select policy per subscriber, so a guest's channel gets nothing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'money_budgets'
  ) then
    alter publication supabase_realtime add table public.money_budgets;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'money_budget_choices'
  ) then
    alter publication supabase_realtime add table public.money_budget_choices;
  end if;
end
$$;
