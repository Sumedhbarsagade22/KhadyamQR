import { createClient } from "@supabase/supabase-js";

// Support multiple env var names (Vite prefix VITE_ or NEXT_PUBLIC_, or a runtime-injected __env)
const getEnv = (name: string) => {
  try {
    // import.meta.env works at build time, check common keys
    const meta: any = import.meta as any;
    if (meta && meta.env && meta.env[name]) return String(meta.env[name]);
  } catch {}
  try {
    // runtime global injected vars (optional)
    const gw: any = (globalThis as any).__env;
    if (gw && gw[name]) return String(gw[name]);
  } catch {}
  try {
    const win: any = window as any;
    if (win && win.__env && win.__env[name]) return String(win.__env[name]);
  } catch {}
  try {
    // last resort for SSR env (unlikely for client bundle)
    if (typeof process !== "undefined" && (process as any).env && (process as any).env[name])
      return String((process as any).env[name]);
  } catch {}
  return undefined;
};

// Get Supabase configuration from environment
const supabaseUrl = getEnv("VITE_SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase configuration. Please check your environment variables.';
  console.error(errorMessage, { 
    supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing', 
    supabaseAnonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
    env: {
      VITE_SUPABASE_URL: getEnv("VITE_SUPABASE_URL") ? '✅ Set' : '❌ Missing',
      VITE_SUPABASE_ANON_KEY: getEnv("VITE_SUPABASE_ANON_KEY") ? '✅ Set' : '❌ Missing'
    }
  });
  throw new Error(errorMessage);
}

// Supabase client initialized

// Helper function to get the base URL for API requests
export function getBaseUrl() {
  // In development, use the current host and port
  if (process.env.NODE_ENV === 'development') {
    return ''; // Use relative URLs in development (same origin)
  }
  
  // Get the base URL from environment variables or use the current origin
  const env = (import.meta as any).env || {};
  return env.VITE_BASE_URL || 
         env.NEXT_PUBLIC_BASE_URL || 
         (globalThis as any).__env?.NEXT_PUBLIC_BASE_URL || 
         (supabaseUrl ? new URL(supabaseUrl).origin : window.location.origin);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
