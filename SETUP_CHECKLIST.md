# KhadyamQR Setup Checklist

## ✅ Complete Setup Guide

### 1. Database Setup

**Run in Supabase SQL Editor:**
```sql
-- Option A: Fresh install
-- Run: supabase/khadyamqr.sql (full schema)

-- Option B: Update existing database
-- Run: supabase/UPDATE_SCHEMA.sql (adds missing columns)
```

**Verify tables exist:**
- ✅ `restaurants` (with `active` column)
- ✅ `restaurant_users`
- ✅ `menu_items`
- ✅ `admin_users`

### 2. Environment Variables

**Check `.env` file has:**
```env
VITE_SUPABASE_URL=https://dshrfgqoarhwpbhbdobt.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://dshrfgqoarhwpbhbdobt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PING_MESSAGE=ping pong
```

### 3. Storage Bucket

**Verify in Supabase:**
- Bucket name: `khadyamqr`
- Public: ✅ Yes
- Policies: Read (public), Write (authenticated)

### 4. Admin User Setup

**Verify admin exists:**
```sql
SELECT * FROM admin_users WHERE email = 'sbarsagade.s22@gmail.com';
```

**Create Supabase Auth user:**
1. Go to: Authentication → Users
2. Add user with email: `sbarsagade.s22@gmail.com`
3. Set password
4. Confirm email

### 5. Test Admin Login

1. Start dev server: `pnpm dev`
2. Go to: http://localhost:8080/login
3. Login with admin credentials
4. Should see admin dashboard

### 6. Create Test Restaurant

**In Admin Panel:**
1. Add restaurant name: "Test Cafe"
2. Upload logo (optional)
3. Click "Add Restaurant"
4. Click "✨ Generate QR"
5. Verify QR appears with logo in center

### 7. Create Restaurant Login

**In Admin Panel:**
1. Find restaurant card
2. Click "🔑 Create Login"
3. Enter email: `testcafe@restaurant.com`
4. Enter password: `Test123!`
5. Copy credentials

**Create Auth User:**
1. Go to Supabase → Authentication → Users
2. Add user with email from step 3
3. Use password from step 4

### 8. Test Restaurant Login

1. Go to: http://localhost:8080/restaurant-login
2. Login with restaurant credentials
3. Should see restaurant dashboard
4. Add a test menu item

### 9. Test Public Menu

1. Scan QR code OR
2. Go to: http://localhost:8080/menu/test-cafe
3. Should see menu items

### 10. Test Enable/Disable

**In Admin Panel:**
1. Click ⏸️ to disable restaurant
2. Try to login as restaurant owner → Should be blocked
3. Visit public menu → Should show "disabled" message
4. Click ▶️ to enable
5. Everything works again

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module '@/lib/supabase'"
**Fix:** TypeScript lint error - harmless, app works fine

### Issue: Enable/Disable button not working
**Fix:** Run `UPDATE_SCHEMA.sql` to add `active` column

### Issue: Restaurant login fails
**Fix:** 
1. Check `restaurant_users` table exists
2. Verify email in both `restaurant_users` AND Supabase Auth

### Issue: QR code has no logo
**Fix:** 
1. Check `/khadyamqr-logo.svg` exists in `public/` folder
2. Clear browser cache
3. Regenerate QR

### Issue: "Access denied. You are not an admin"
**Fix:**
1. Run: `ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;`
2. Or create proper RLS policy (see UPDATE_SCHEMA.sql)

### Issue: Images not uploading
**Fix:**
1. Check storage bucket `khadyamqr` exists
2. Verify bucket is public
3. Check RLS policies on storage.objects

## 📊 Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | ✅ | Email + password |
| Restaurant Login | ✅ | Email + password |
| Add Restaurant | ✅ | With logo upload |
| Generate QR | ✅ | One-time with logo |
| Enable/Disable | ✅ | Subscription control |
| Create Login | ✅ | Admin creates credentials |
| Menu Management | ✅ | Add/edit/delete items |
| Toggle Availability | ✅ | Available/Unavailable |
| Public Menu | ✅ | Customer view |
| Disabled Message | ✅ | Subscription payment |

## 🚀 Deployment Checklist

- [ ] Run UPDATE_SCHEMA.sql in production Supabase
- [ ] Set environment variables in Netlify
- [ ] Test admin login in production
- [ ] Test restaurant login in production
- [ ] Test QR code generation
- [ ] Test enable/disable functionality
- [ ] Verify public menus work
- [ ] Check all images load correctly

## 📝 Next Steps

1. **Test everything locally** using this checklist
2. **Fix any issues** before deploying
3. **Deploy to Netlify** following DEPLOY.md
4. **Test in production**
5. **Share credentials** with restaurant owners

## 🆘 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Supabase logs
3. Verify all SQL has been run
4. Ensure environment variables are set
5. Clear browser cache and try again
