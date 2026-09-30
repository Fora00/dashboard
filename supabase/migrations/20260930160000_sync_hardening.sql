-- Sync hardening: (1) server-side last-writer-wins, (2) EXECUTE grants on
-- public functions. No client change needed. Re-runnable.

-- ===========================================================================
-- (1) Server-side last-writer-wins.
-- ===========================================================================
-- The sync engine (src/lib/cloudSync.ts pushEntry) does a blind upsert with a
-- client-supplied bigint updated_at (epoch ms). Without this, a phone that was
-- offline for two days flushes its outbox on reconnect and overwrites newer
-- edits made meanwhile on the laptop.
--
-- The trigger keeps the stored row when the incoming write is OLDER than it
-- (new.updated_at < old.updated_at). It returns OLD rather than raising, so:
--   * the upsert succeeds, the engine deletes the outbox entry (no dead
--     letter, no retry loop);
--   * the no-op UPDATE is still emitted on realtime carrying the newer row,
--     so an online stale writer converges immediately; an offline one
--     converges on the pull that follows every flush in syncNow().
-- Equal timestamps are applied (a re-push of the same edit, or an owner edit
-- in Studio that doesn't touch updated_at). Inserts never fire it, so the
-- INSERT half of an upsert, and an Undo that re-creates a deleted row, are
-- unaffected.
--
-- Life: life_weeks is replaced wholesale on re-import with updated_at = now,
-- and life_entries keyed toggles (focus/sent/sunday/checkin, updated in place
-- and never deleted) bump updated_at = Date.now() on every write, so LWW is
-- exactly the semantics they already assume client-side (lifeSync.ts header).
-- Tracker +1s are fresh-uuid inserts and never hit the trigger.
--
-- Caveat (inherent to LWW on client clocks): a device whose clock runs behind
-- loses ties it "should" win. That was already true of the client's realtime
-- LWW; the server now just agrees with it.
--
-- Tables WITHOUT updated_at are skipped (insert/delete-only or not edited in
-- a way that races): shop_areas, climb_sessions, climbs, habits,
-- habit_checks.
create or replace function public.ignore_stale_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end;
$$;

comment on function public.ignore_stale_update() is
  'BEFORE UPDATE trigger: keep the stored row when the incoming updated_at is older (server-side last-writer-wins). Attach to every synced table with an updated_at column.';

drop trigger if exists ignore_stale_update on public.shop_items;
create trigger ignore_stale_update before update on public.shop_items
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.todos;
create trigger ignore_stale_update before update on public.todos
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.book_ideas;
create trigger ignore_stale_update before update on public.book_ideas
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.boardgame_ideas;
create trigger ignore_stale_update before update on public.boardgame_ideas
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.links;
create trigger ignore_stale_update before update on public.links
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.life_weeks;
create trigger ignore_stale_update before update on public.life_weeks
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.life_entries;
create trigger ignore_stale_update before update on public.life_entries
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.trip_companions;
create trigger ignore_stale_update before update on public.trip_companions
  for each row execute function public.ignore_stale_update();

drop trigger if exists ignore_stale_update on public.trip_ideas;
create trigger ignore_stale_update before update on public.trip_ideas
  for each row execute function public.ignore_stale_update();

-- ===========================================================================
-- (2) EXECUTE hardening.
-- ===========================================================================
-- Postgres grants EXECUTE to PUBLIC on every new function, and Supabase's
-- default privileges also grant it to anon explicitly, so every security
-- definer RPC here was anon-callable, guarded only by its in-body is_owner()
-- check. Make "authenticated only" the default and allow anon exactly what a
-- signed-out client needs.

revoke execute on all functions in schema public from public, anon;
grant execute on all functions in schema public to authenticated, service_role;

-- Signed-out invite flows (src/projects/shop-list/JoinArea.tsx,
-- src/projects/join/JoinProject.tsx): look up + redeem a link before the
-- guest has an account. join_area/join_project need a session, so they stay
-- authenticated-only.
grant execute on function public.get_invite(uuid) to anon;
grant execute on function public.redeem_invite(uuid, text) to anon;
grant execute on function public.get_project_invite(uuid) to anon;
grant execute on function public.redeem_project_invite(uuid, text) to anon;

-- RLS helpers. Policy expressions run with the privileges of the querying
-- role, so if anon lost EXECUTE here, any anon read of a synced table, the
-- transfer bucket or a realtime channel would turn from "0 rows" into
-- "permission denied for function is_member". They only answer questions
-- about the caller (anon: '' / false), so they're safe to leave callable.
grant execute on function public.jwt_email() to anon;
grant execute on function public.is_member(text) to anon;
grant execute on function public.is_owner() to anon;
grant execute on function public.can_access_area(uuid) to anon;

-- Pure IMMUTABLE validators used inside CHECK constraints (evaluated as the
-- writing role). Harmless, and keeps anon writes failing on RLS rather than
-- on a function permission.
grant execute on function public.links_tags_within_length(text[]) to anon;
grant execute on function public.trips_ids_within_length(text[]) to anon;

-- Future functions: safe by default. PUBLIC's EXECUTE is a *global* default
-- (it can't be revoked per schema), hence the first line without IN SCHEMA;
-- anon's is Supabase's per-schema default. Both apply to functions created
-- by the role running migrations (postgres). A future function that must be
-- anon-callable needs an explicit `grant execute ... to anon` in its
-- migration (see docs/NEW_PROJECT.md step 5).
alter default privileges revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;
alter default privileges in schema public grant execute on functions to authenticated, service_role;
