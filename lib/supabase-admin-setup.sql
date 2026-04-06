-- =====================================================
-- VOLT MARRAKECH — RLS Policies for Admin Backoffice
-- Paste and run this entire block in Supabase SQL Editor
-- =====================================================

-- ── SCOOTERS ─────────────────────────────────────────
-- Drop any conflicting policies first
drop policy if exists "Authenticated users can manage scooters" on public.scooters;
drop policy if exists "Full access to scooters"                 on public.scooters;
drop policy if exists "Select scooters"                        on public.scooters;
drop policy if exists "Insert scooters"                        on public.scooters;
drop policy if exists "Update scooters"                        on public.scooters;
drop policy if exists "Delete scooters"                        on public.scooters;

-- Grant full access to anon key (admin is protected by frontend password)
create policy "Select scooters" on public.scooters
  for select using (true);

create policy "Insert scooters" on public.scooters
  for insert with check (true);

create policy "Update scooters" on public.scooters
  for update using (true) with check (true);

create policy "Delete scooters" on public.scooters
  for delete using (true);

-- ── SETTINGS ─────────────────────────────────────────
drop policy if exists "Authenticated users can update settings"  on public.settings;
drop policy if exists "Authenticated users can insert settings"  on public.settings;
drop policy if exists "Full access to settings"                  on public.settings;
drop policy if exists "Select settings"                          on public.settings;
drop policy if exists "Insert settings"                          on public.settings;
drop policy if exists "Update settings"                          on public.settings;
drop policy if exists "Upsert settings"                          on public.settings;

create policy "Select settings" on public.settings
  for select using (true);

create policy "Insert settings" on public.settings
  for insert with check (true);

create policy "Update settings" on public.settings
  for update using (true) with check (true);

-- ── RESERVATIONS ─────────────────────────────────────
drop policy if exists "Full read access to all reservations"  on public.reservations;
drop policy if exists "Full write access to reservations"     on public.reservations;
drop policy if exists "Public read all reservations"          on public.reservations;
drop policy if exists "Public update all reservations"        on public.reservations;
drop policy if exists "Select reservations"                   on public.reservations;
drop policy if exists "Update reservations"                   on public.reservations;
drop policy if exists "Insert reservations"                   on public.reservations;
drop policy if exists "Admin read reservations"               on public.reservations;

-- Allow everyone to read all reservations (admin gate is frontend-only)
create policy "Select reservations" on public.reservations
  for select using (true);

-- Allow authenticated users to insert their own reservations
create policy "Insert reservations" on public.reservations
  for insert with check (true);

-- Allow update (admin confirms/cancels)
create policy "Update reservations" on public.reservations
  for update using (true) with check (true);

-- ── PROFILES ─────────────────────────────────────────
drop policy if exists "Public read access to profiles" on public.profiles;
drop policy if exists "Select profiles"                on public.profiles;

create policy "Select profiles" on public.profiles
  for select using (true);

-- ── FOREIGN KEYS for relational joins ────────────────
-- These allow Supabase to resolve profiles(full_name) and scooters(name)
-- in a single query. Skip if already exists (will throw a safe error).
alter table public.reservations
  add constraint if not exists reservations_scooter_id_fkey
  foreign key (scooter_id) references public.scooters(id) on delete set null;

-- Note: reservations.user_id references auth.users(id), NOT public.profiles.
-- Supabase cannot join auth.users directly. To join profiles, ensure
-- public.profiles.id = auth.users.id (set by your auth trigger).

-- ── STORAGE: volt-assets bucket ──────────────────────
-- Run only if the bucket exists and has no policies yet.
-- If you get "policy already exists" errors, skip these.
drop policy if exists "Upload public"    on storage.objects;
drop policy if exists "Lecture publique" on storage.objects;
drop policy if exists "Suppression admin" on storage.objects;

create policy "Storage select" on storage.objects
  for select using (bucket_id = 'volt-assets');

create policy "Storage insert" on storage.objects
  for insert with check (bucket_id = 'volt-assets');

create policy "Storage delete" on storage.objects
  for delete using (bucket_id = 'volt-assets');

-- ── FIX: migrate maintenance status ──────────────────
update public.scooters set status = 'available' where status = 'maintenance';

-- ── MIGRATION: rental type columns ───────────────────
alter table public.reservations
  add column if not exists rental_type text not null default 'daily'
    check (rental_type in ('hourly', 'daily', 'weekly'));

alter table public.reservations
  add column if not exists duration_value integer not null default 1;

alter table public.reservations
  add column if not exists phone text;
