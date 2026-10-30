-- life_day_focus: a line can be cancelled (Things-style: kept, struck through,
-- restorable) instead of deleted. Re-runnable.
alter table public.life_day_focus add column if not exists cancelled boolean not null default false;
