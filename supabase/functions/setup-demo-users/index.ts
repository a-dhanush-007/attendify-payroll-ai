
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const demoUsers = [
      { email: 'admin@example.com', password: 'password123', role: 'admin', name: 'Admin User' },
      { email: 'supervisor@example.com', password: 'password123', role: 'supervisor', name: 'Supervisor User' },
      { email: 'builder@example.com', password: 'password123', role: 'builder', name: 'Builder User' }
    ];

    const results = [];

    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers({
        filters: {
          email: user.email,
        },
      });

      if (searchError) {
        results.push({ email: user.email, status: 'error', message: searchError.message });
        continue;
      }

      if (existingUsers.users.length > 0) {
        results.push({ email: user.email, status: 'exists', message: 'User already exists' });
        continue;
      }

      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        },
      });

      if (error) {
        results.push({ email: user.email, status: 'error', message: error.message });
      } else {
        results.push({ email: user.email, status: 'created', userId: data.user.id });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Demo users setup completed", 
        results 
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
