-- =====================================================
-- VOLT MARRAKECH — Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLE: scooters
-- =====================================================
create table if not exists public.scooters (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  model text not null,
  autonomy_km integer not null,
  price_per_hour numeric(10,2) not null,
  price_per_day numeric(10,2) not null,
  price_per_week numeric(10,2) not null,
  status text not null default 'available' check (status in ('available', 'rented')),
  image_url text,
  description text,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: profiles
-- =====================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- TABLE: reservations
-- =====================================================
create table if not exists public.reservations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scooter_id uuid references public.scooters on delete restrict not null,
  start_date date not null,
  end_date date not null,
  total_price numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz default now(),
  constraint valid_dates check (end_date >= start_date)
);

-- =====================================================
-- TABLE: settings
-- =====================================================
create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

-- Seed default settings
insert into public.settings (key, value) values
  ('site_name', 'Volt'),
  ('accent_color', '#C8FF00'),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('hero_image_url', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1600&q=80'),
  ('about_text', 'Nous sommes une équipe locale avec plus de 5 ans d''expérience dans la mobilité urbaine à Marrakech. Notre flotte de scooters électriques premium vous permet d''explorer la ville rouge à votre rythme, en toute liberté et de manière responsable. Chaque scooter est entretenu quotidiennement et livré avec casque et assistance 7j/7.')
on conflict (key) do nothing;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Settings: public read, authenticated write
alter table public.settings enable row level security;
create policy "Settings are publicly readable" on public.settings
  for select using (true);
create policy "Authenticated users can update settings" on public.settings
  for update using (auth.role() = 'authenticated');
create policy "Authenticated users can insert settings" on public.settings
  for insert with check (auth.role() = 'authenticated');

-- Scooters: public read, authenticated write
alter table public.scooters enable row level security;
create policy "Scooters are publicly readable" on public.scooters
  for select using (true);
create policy "Authenticated users can manage scooters" on public.scooters
  for all using (auth.role() = 'authenticated');

-- Profiles: own row only
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Reservations: own rows only
alter table public.reservations enable row level security;
create policy "Users can view their own reservations" on public.reservations
  for select using (auth.uid() = user_id);
create policy "Users can create reservations" on public.reservations
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own reservations" on public.reservations
  for update using (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: 4 demo scooters
-- =====================================================
insert into public.scooters (name, model, autonomy_km, price_per_hour, price_per_day, price_per_week, status, image_url, description)
values
  (
    'Yadea C1S',
    'Yadea C1S Pro',
    80,
    35.00,
    200.00,
    1100.00,
    'available',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'Scooter élégant et silencieux, idéal pour explorer la médina et les ruelles de Marrakech. Autonomie confortable pour une journée complète.'
  ),
  (
    'NIU MQi GT',
    'NIU MQi GT EVO',
    100,
    45.00,
    250.00,
    1400.00,
    'available',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
    'Notre modèle premium avec la plus grande autonomie. Parfait pour des excursions vers la Palmeraie ou les villages des alentours.'
  ),
  (
    'Segway E110S',
    'Segway E110S',
    65,
    30.00,
    170.00,
    950.00,
    'available',
    'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80',
    'Le choix économique sans compromis sur la qualité. Agile et compact, parfait pour circuler dans le souk et les artères animées.'
  ),
  (
    'Vmoto Super Soco',
    'Vmoto TC Max',
    120,
    55.00,
    300.00,
    1700.00,
    'rented',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Notre flagship haute performance. Vitesse de pointe et autonomie record pour les aventuriers qui veulent aller au-delà de Marrakech.'
  );
