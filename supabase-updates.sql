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

-- 6. Add client_email column to reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_email text;

-- 6b. Backfill client_email for existing reservations
UPDATE reservations r
SET client_email = (
  SELECT email FROM auth.users WHERE id = r.user_id
)
WHERE r.client_email IS NULL;

-- 7. Email settings
INSERT INTO settings (key, value) VALUES
  ('admin_email', 'admin@almone-scooter.com')
ON CONFLICT (key) DO NOTHING;

-- ══════════════════════════════════════════════════════
-- SUPABASE EMAIL TEMPLATES (HTML à coller dans Supabase
-- → Authentication → Email Templates)
-- ══════════════════════════════════════════════════════

-- Template "Confirm signup"
-- Sujet : Confirmez votre email — Almone
/*
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:32px;text-align:center;">
    <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;">almone.</span>
  </div>
  <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
    <h1 style="font-size:28px;font-weight:700;margin:0 0 16px;">Bienvenue chez Almone !</h1>
    <p>Votre compte Almone est créé. Confirmez votre email pour commencer à réserver des scooters électriques à Marrakech.</p>
    <div style="margin:32px 0;text-align:center;">
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#FF6700;color:#ffffff;border-radius:8px;padding:14px 28px;font-weight:600;font-size:15px;text-decoration:none;">Confirmer mon email</a>
    </div>
    <p style="color:#757575;font-size:13px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
  </div>
  <div style="background:#F5F5F5;padding:28px 40px;text-align:center;font-size:12px;color:#757575;">
    <p style="margin:0 0 4px;">© 2025 Almone Scooter Rental — Marrakech, Maroc</p>
    <p style="margin:0;">En cas de problème contactez-nous sur WhatsApp</p>
  </div>
</div>
</body>
</html>
*/

-- Template "Reset password"
-- Sujet : Réinitialisation mot de passe — Almone
/*
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:32px;text-align:center;">
    <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;">almone.</span>
  </div>
  <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
    <h1 style="font-size:28px;font-weight:700;margin:0 0 16px;">Réinitialisation du mot de passe</h1>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
    <div style="margin:32px 0;text-align:center;">
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#FF6700;color:#ffffff;border-radius:8px;padding:14px 28px;font-weight:600;font-size:15px;text-decoration:none;">Réinitialiser mon mot de passe</a>
    </div>
    <p style="color:#757575;font-size:13px;">Ce lien expire dans 24h. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
  </div>
  <div style="background:#F5F5F5;padding:28px 40px;text-align:center;font-size:12px;color:#757575;">
    <p style="margin:0 0 4px;">© 2025 Almone Scooter Rental — Marrakech, Maroc</p>
    <p style="margin:0;">En cas de problème contactez-nous sur WhatsApp</p>
  </div>
</div>
</body>
</html>
*/
