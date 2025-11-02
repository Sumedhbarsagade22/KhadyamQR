-- KhadyamQR Database Schema Updates
-- Run this SQL in Supabase SQL Editor to add all missing features

BEGIN;

-- 1. Add active column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- 2. Create restaurant_users table for restaurant owner logins
CREATE TABLE IF NOT EXISTS restaurant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(active);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurant_users_email ON restaurant_users(email);
CREATE INDEX IF NOT EXISTS idx_restaurant_users_restaurant_id ON restaurant_users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);

-- 4. Enable RLS on restaurant_users
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Users can read their own record
DROP POLICY IF EXISTS "Users can read their own record" ON restaurant_users;
CREATE POLICY "Users can read their own record"
ON restaurant_users FOR SELECT TO authenticated
USING (email = auth.jwt() ->> 'email');

-- 6. RLS Policy: Restaurant owners can read their own restaurant
DROP POLICY IF EXISTS "Restaurant owners can read their own restaurant" ON restaurants;
CREATE POLICY "Restaurant owners can read their own restaurant"
ON restaurants FOR SELECT TO authenticated
USING (
  id IN (
    SELECT restaurant_id FROM restaurant_users 
    WHERE email = auth.jwt() ->> 'email'
  )
  OR
  EXISTS(SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);

-- 7. RLS Policy: Restaurant owners can manage their menu items
DROP POLICY IF EXISTS "Restaurant owners can manage their menu items" ON menu_items;
CREATE POLICY "Restaurant owners can manage their menu items"
ON menu_items FOR ALL TO authenticated
USING (
  restaurant_id IN (
    SELECT restaurant_id FROM restaurant_users 
    WHERE email = auth.jwt() ->> 'email'
  )
  OR
  EXISTS(SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
);

-- 8. Storage policy: Restaurant owners can upload images
DROP POLICY IF EXISTS "khadyamqr_restaurant_write" ON storage.objects;
CREATE POLICY "khadyamqr_restaurant_write" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'khadyamqr' 
  AND (
    EXISTS(SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email')
    OR
    EXISTS(SELECT 1 FROM restaurant_users WHERE email = auth.jwt() ->> 'email')
  )
);

-- 9. Verify admin user exists
INSERT INTO admin_users (email, role) 
VALUES ('sbarsagade.s22@gmail.com', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- 10. Add helpful comments
COMMENT ON TABLE restaurants IS 'Stores restaurant information and QR codes';
COMMENT ON TABLE restaurant_users IS 'Maps restaurant owners to their restaurants';
COMMENT ON TABLE menu_items IS 'Menu items for each restaurant';
COMMENT ON TABLE admin_users IS 'System administrators';

COMMENT ON COLUMN restaurants.active IS 'Controls if restaurant is enabled (subscription status)';
COMMENT ON COLUMN restaurants.qr_url IS 'Generated QR code URL - generated only once';
COMMENT ON COLUMN menu_items.available IS 'Controls if menu item is currently available';

COMMIT;

-- Verification queries (run these separately to check)
-- SELECT * FROM restaurants;
-- SELECT * FROM restaurant_users;
-- SELECT * FROM menu_items;
-- SELECT * FROM admin_users;
