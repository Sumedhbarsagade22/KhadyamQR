-- Add Categories Feature to KhadyamQR
-- Run this SQL in Supabase SQL Editor after UPDATE_SCHEMA.sql

BEGIN;

-- 1. Add category column to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Main Course';

-- 2. Add display_order column for sorting items within categories
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);

-- 4. Add helpful comment
COMMENT ON COLUMN menu_items.category IS 'Menu item category (e.g., Starters, Main Course, Desserts, Beverages)';
COMMENT ON COLUMN menu_items.display_order IS 'Order of item within its category (lower numbers appear first)';

COMMIT;

-- Common categories to use:
-- - Starters / Appetizers
-- - Soups & Salads
-- - Main Course
-- - Desserts
-- - Beverages
-- - Sides
-- - Specials

-- Verification query (run separately to check)
-- SELECT category, COUNT(*) as item_count FROM menu_items GROUP BY category ORDER BY category;
