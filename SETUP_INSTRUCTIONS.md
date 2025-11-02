# Database Setup Instructions

## Step 1: Run SQL Schema

1. Open Supabase SQL Editor:
   https://supabase.com/dashboard/project/dshrfgqoarhwpbhbdobt/sql/new

2. Copy and paste the entire contents of `supabase/khadyamqr.sql`

3. Click "Run" to execute

## Step 2: Verify Tables Created

Go to: https://supabase.com/dashboard/project/dshrfgqoarhwpbhbdobt/editor

You should see:
- `restaurants` table
- `menu_items` table
- `admin_users` table

## Step 3: Verify Storage Bucket

Go to: https://supabase.com/dashboard/project/dshrfgqoarhwpbhbdobt/storage/buckets

You should see:
- `khadyamqr` bucket (public)

## Step 4: Test Adding Restaurant

1. Go to http://localhost:8080/admin
2. Enter restaurant name
3. Optionally upload logo
4. Click "Add Restaurant"

If you see an error, check the browser console (F12) for details.

## Common Issues

**Error: "relation 'restaurants' does not exist"**
- Run the SQL schema from `supabase/khadyamqr.sql`

**Error: "Bucket not found"**
- The SQL script creates it automatically. Re-run the SQL.

**Error: "new row violates row level security policy"**
- The server uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS
- Make sure your `.env` has the correct service role key
