import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment from .env or .env.test if present
dotenv.config();

function parseArg(name: string) {
  const prefix = `--${name}=`;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith(prefix)) return a.slice(prefix.length);
  }
  return undefined;
}

async function main() {
  const email = parseArg('email') || process.env.RESET_EMAIL;
  const password = parseArg('password') || process.env.RESET_PASSWORD;

  if (!email || !password) {
    console.error('Usage: pnpm exec tsx server/scripts/resetRestaurantPassword.ts --email=you@example.com --password=newpass123');
    process.exit(2);
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase URL or service role key not set in environment. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(3);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  console.log(`Looking up user by email: ${email}`);

  // Use admin.listUsers and search for matching email (works across SDK versions)
  const listRes: any = await supabaseAdmin.auth.admin.listUsers();
  if (listRes.error) {
    console.error('Error listing users:', listRes.error);
    process.exit(4);
  }

  let users: any[] = [];
  if (Array.isArray(listRes.data)) {
    users = listRes.data;
  } else if (Array.isArray((listRes.data ?? listRes).users)) {
    users = (listRes.data ?? listRes).users;
  } else if ((listRes.data ?? listRes)?.user) {
    users = [(listRes.data ?? listRes).user];
  }

  const authUser = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());

  if (!authUser) {
    console.error('Auth user not found for email:', email);
    process.exit(5);
  }

  console.log('Found auth user id:', authUser.id);

  const updateRes: any = await supabaseAdmin.auth.admin.updateUserById(authUser.id, { password });
  if (updateRes.error) {
    console.error('Error updating password:', updateRes.error);
    process.exit(6);
  }

  console.log('Password updated successfully for user', authUser.email);
  process.exit(0);
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(99);
});
