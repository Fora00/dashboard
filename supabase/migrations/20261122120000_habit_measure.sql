-- habits: verification from data (M1). measure = 'app-limits' checks a "don't"
-- habit against the Sunday "App più usate" answer of the Life week: an app's
-- weekly minutes past 7 x its daily limit prove extensions (one per 15 min).
-- measure_limits = [{ "app": text, "minutes": integer }] (daily minutes per
-- app; caps in src/lib/habitCaps.ts, validated by the client). Both nullable
-- (every existing habit stays checked by hand). Re-runnable.
-- RLS is unchanged: habits is already gated by is_member('habits').
alter table public.habits add column if not exists measure text;
alter table public.habits add column if not exists measure_limits jsonb;

alter table public.habits drop constraint if exists habits_measure_check;
alter table public.habits
  add constraint habits_measure_check check (measure is null or measure in ('app-limits'));

alter table public.habits drop constraint if exists habits_measure_limits_check;
alter table public.habits
  add constraint habits_measure_limits_check check (
    measure_limits is null
    or (jsonb_typeof(measure_limits) = 'array' and jsonb_array_length(measure_limits) <= 12)
  );
