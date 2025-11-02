import { supabase } from "./supabase";

export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { isAuthenticated: false, isAdmin: false };
  }

  // Check if user is in admin_users table
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", session.user.email)
    .single();

  return {
    isAuthenticated: true,
    isAdmin: !!adminData,
    user: session.user,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}
