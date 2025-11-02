# Restaurant User Interface Setup

## Database Changes Required

Run this SQL in Supabase SQL Editor:

```sql
-- Add owner_email column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS owner_email text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_email 
ON restaurants(owner_email);

-- Add RLS policy for restaurants to read their own data
CREATE POLICY "Restaurant owners can read their own restaurant"
ON restaurants
FOR SELECT
TO authenticated
USING (owner_email = auth.jwt() ->> 'email');

-- Add RLS policy for menu_items
CREATE POLICY "Restaurant owners can manage their menu items"
ON menu_items
FOR ALL
TO authenticated
USING (
  restaurant_id IN (
    SELECT id FROM restaurants 
    WHERE owner_email = auth.jwt() ->> 'email'
  )
);
```

## How to Set Up a Restaurant User

### 1. Create Supabase Auth User
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Email: `restaurant@example.com`
4. Password: Set a secure password
5. Click "Create user"

### 2. Assign Restaurant to User
Run this SQL (replace with actual restaurant ID and email):

```sql
UPDATE restaurants 
SET owner_email = 'restaurant@example.com'
WHERE slug = 'your-restaurant-slug';
```

Or if creating a new restaurant:

```sql
INSERT INTO restaurants (name, slug, owner_email)
VALUES ('My Restaurant', 'my-restaurant', 'restaurant@example.com');
```

## Restaurant User Features

### Login
- URL: http://localhost:8080/restaurant-login
- Credentials: Email + Password (created in Supabase Auth)

### Dashboard Features
✅ View restaurant info and QR code
✅ Download QR code
✅ Add menu items with images
✅ Edit menu item availability (Available/Unavailable)
✅ Delete menu items
✅ View public menu link
✅ Sign out

### Security
- Restaurant owners can only see/edit their own restaurant
- RLS policies enforce data isolation
- Separate login from admin panel

## Testing

1. **Create test restaurant user:**
```sql
-- Create restaurant
INSERT INTO restaurants (name, slug, owner_email)
VALUES ('Test Restaurant', 'test-restaurant', 'test@restaurant.com');

-- Then create auth user in Supabase Dashboard with email: test@restaurant.com
```

2. **Login:**
- Go to: http://localhost:8080/restaurant-login
- Email: test@restaurant.com
- Password: (what you set)

3. **Test features:**
- Add menu items
- Toggle availability
- Download QR code
- View public menu

## Admin vs Restaurant User

| Feature | Admin | Restaurant User |
|---------|-------|-----------------|
| Login URL | /login | /restaurant-login |
| Dashboard | /admin | /restaurant-dashboard |
| Manage all restaurants | ✅ | ❌ |
| Manage own menu | ✅ | ✅ |
| Generate QR codes | ✅ | ❌ (admin generates) |
| Enable/disable restaurants | ✅ | ❌ |
| Delete restaurants | ✅ | ❌ |

## Future Enhancements

- [ ] Restaurant profile editing
- [ ] Menu categories
- [ ] Bulk menu import
- [ ] Analytics (views, popular items)
- [ ] Custom QR code styles
- [ ] Multi-language menus
- [ ] Table management
- [ ] Order notifications
