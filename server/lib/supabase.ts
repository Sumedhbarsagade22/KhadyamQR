import { createClient } from "@supabase/supabase-js";

// Get environment variables with fallbacks
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 
            process.env.VITE_SUPABASE_URL || 
            process.env.SUPABASE_URL;
            
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!url) {
  throw new Error(
    'Missing Supabase URL. Please set SUPABASE_URL in your .env file.'
  );
}

if (!serviceKey) {
  throw new Error(
    'Missing Supabase Service Role Key. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.'
  );
}

// Create Supabase client with enhanced error handling
export const supabaseAdmin = (() => {
  try {
    const client = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    // Test the connection
    // Test the connection
    (async () => {
      try {
        const { error } = await client.from('restaurants').select('*').limit(1);
        if (error) {
          console.error('Supabase connection test failed:', error);
          if (error.code === '42501') {
            console.error('Permission denied. Please check if your service role key has the correct permissions.');
          } else if (error.code === '42P01') {
            console.error('Table not found. Please ensure the "restaurants" table exists in your Supabase database.');
          }
        } else {
          // Successfully connected to Supabase
        }
      } catch (err) {
        console.error('Error testing Supabase connection:', err);
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            name: err.name,
            stack: err.stack
          });
        }
      }
    })();
    
    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
})();

// Helper function to get the Supabase URL
export const getSupabaseUrl = () => url;
