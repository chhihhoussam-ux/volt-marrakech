-- ═════════════════��═════════════════════════════════════
-- Almone — Supabase Updates
-- ══════════════════════════════���════════════════════════

-- 1. Rename site to Almone
UPDATE settings SET value = 'Almone' WHERE key = 'site_name';
UPDATE settings SET value = '#FF6700' WHERE key = 'accent_color';

-- 2. Table locations
CREATE TABLE IF NOT EXISTS locations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  description text,
  is_active boolean default true,
  created_at timestamp default now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations visibles par tous" ON locations FOR SELECT USING (true);
CREATE POLICY "Locations modifiables admin" ON locations FOR ALL USING (true);

-- 3. Seed locations
INSERT INTO locations (name, address, lat, lng, description) VALUES
('Almone — Guéliz', 'Avenue Mohammed V, Guéliz, Marrakech', 31.6295, -7.9811, 'Agence principale'),
('Almone — Médina', 'Place Jemaa el-Fna, Marrakech', 31.6258, -7.9892, 'Point de retrait médina');

-- 4. New settings keys
INSERT INTO settings (key, value) VALUES
  ('marker_icon_url', ''),
  ('formule1_image_url', ''),
  ('formule2_image_url', ''),
  ('formule3_image_url', ''),
  ('etape1_image_url', ''),
  ('etape2_image_url', ''),
  ('etape3_image_url', ''),
  ('faq_image_url', '')
ON CONFLICT (key) DO NOTHING;

-- 5. Ensure hero_image_url exists
INSERT INTO settings (key, value) VALUES
  ('hero_image_url', '')
ON CONFLICT (key) DO NOTHING;
