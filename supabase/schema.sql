-- Pando — Supabase schema. Run this once in the Supabase SQL editor.
-- Model: each trip folder is one row; `data` is the whole trip JSON document,
-- synced live to every signed-in member (last write wins — fine for a small group).

create table if not exists public.trips (
  id          text primary key,
  data        jsonb        not null,
  updated_at  timestamptz  not null default now()
);

alter table public.trips enable row level security;

-- Closed friend group: any signed-in user can read & write every trip.
drop policy if exists "trips read"   on public.trips;
drop policy if exists "trips insert" on public.trips;
drop policy if exists "trips update" on public.trips;
drop policy if exists "trips delete" on public.trips;

create policy "trips read"   on public.trips for select using (auth.uid() is not null);
create policy "trips insert" on public.trips for insert with check (auth.uid() is not null);
create policy "trips update" on public.trips for update using (auth.uid() is not null);
create policy "trips delete" on public.trips for delete using (auth.uid() is not null);

-- Live updates so everyone sees edits in real time.
alter publication supabase_realtime add table public.trips;
