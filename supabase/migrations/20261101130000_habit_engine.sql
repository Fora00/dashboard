-- habits: the one Life Engine a habit feeds (EN2). One of the seven engine
-- keys of life_engines (src/projects/life/model/engines.ts), or null =
-- untagged (every existing habit starts untagged). Nullable, re-runnable.
-- RLS is unchanged: habits is already gated by is_member('habits').
alter table public.habits add column if not exists engine text;

alter table public.habits drop constraint if exists habits_engine_check;
alter table public.habits
  add constraint habits_engine_check check (
    engine is null
    or engine in ('physical-health', 'emotions', 'mind', 'relationships', 'career', 'money', 'environment')
  );
