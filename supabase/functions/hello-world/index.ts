import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Hello World function called');

    // Parse request body
    let name = 'World';
    try {
      const body = await req.json();
      if (body && body.name) {
        name = body.name;
      }
    } catch {
      // If no body or invalid JSON, use default name
    }

    const response = {
      message: `Hello ${name} from Supabase Edge Functions!`,
      timestamp: new Date().toISOString(),
      name: name,
      features: [
        'Serverless execution',
        'Fast cold starts',
        'Deno runtime',
        'Global edge network'
      ]
    };

    console.log('Response:', response);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in hello-world function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
