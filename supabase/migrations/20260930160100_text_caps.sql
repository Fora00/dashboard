-- Length caps retrofit for the tables created before caps were the rule
-- (links, trips and life already have theirs). Without them a guest or a
-- buggy client can push unbounded text into a shared table. Re-runnable.
--
-- Caps (char_length = code points). The client mirrors each as the input's
-- maxLength (UTF-16 units, so the client is always the stricter side):
--   todos.text              300
--   shop_items.text         300
--   shop_areas.name         300
--   book_ideas.text         300    book_ideas.notes       2000
--   boardgame_ideas.text    300    boardgame_ideas.notes  2000
--   habits.name             300    habits.emoji             8  (as trip_companions.emoji)
--   climb_sessions.location 300    climb_sessions.notes   2000
--   climbs.grade             20    (picked from GRADES in src/projects/climbing/grades.ts)
--
-- Every constraint is added NOT VALID: Postgres then checks only rows written
-- from now on (inserts AND updates), never the rows already there, so this
-- migration can't fail on the hosted data. Each one is then validated inside
-- its own exception block: if no existing row exceeds the cap it becomes a
-- fully validated constraint; if one does, it stays NOT VALID (a NOTICE
-- names it) and the push still succeeds. Note that an UPDATE to such an old
-- oversized row is checked, so editing it requires shortening it.

do $$
declare
  c record;
  cname text;
begin
  for c in
    select * from (values
      ('todos',           'text',     300),
      ('shop_items',      'text',     300),
      ('shop_areas',      'name',     300),
      ('book_ideas',      'text',     300),
      ('book_ideas',      'notes',   2000),
      ('boardgame_ideas', 'text',     300),
      ('boardgame_ideas', 'notes',   2000),
      ('habits',          'name',     300),
      ('habits',          'emoji',      8),
      ('climb_sessions',  'location', 300),
      ('climb_sessions',  'notes',   2000),
      ('climbs',          'grade',     20)
    ) as t(tbl, col, cap)
  loop
    cname := format('%s_%s_max_length', c.tbl, c.col);
    execute format('alter table public.%I drop constraint if exists %I', c.tbl, cname);
    execute format(
      'alter table public.%I add constraint %I check (char_length(%I) <= %s) not valid',
      c.tbl, cname, c.col, c.cap);
    begin
      execute format('alter table public.%I validate constraint %I', c.tbl, cname);
    exception when check_violation then
      raise notice '% left NOT VALID: existing rows exceed % characters', cname, c.cap;
    end;
  end loop;
end;
$$;
