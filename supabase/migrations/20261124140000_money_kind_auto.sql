-- money_totals: a fifth kind, 'auto'. ~/life/_sync/money-totals.py now fixes
-- the kind only for the stable categories (income = the salaries, oneoff,
-- pass); every other category is 'auto', and the dashboard counts it as income
-- or spend by the sign of its total over the period it shows (a year, a
-- month). Mirrors MONEY_KINDS in src/projects/money/moneyCsv.ts.
--
-- Only the CHECK changes: no data is touched (rows get the new kind from the
-- next import link, which replaces the months it covers). Re-runnable.

alter table public.money_totals drop constraint if exists money_totals_kind_check;
alter table public.money_totals add constraint money_totals_kind_check
  check (kind in ('income', 'spend', 'oneoff', 'pass', 'auto'));
