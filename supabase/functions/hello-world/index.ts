console.log("hello-world function loaded");

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Parse JSON body
    let requestData = {};
    
    try {
      if (req.body) {
        const bodyText = await req.text();
        if (bodyText) {
          requestData = JSON.parse(bodyText);
        }
      }
    } catch (parseErr) {
      console.warn("Could not parse request body:", parseErr);
    }

    const name = (requestData as { name?: string }).name || "World";

    const responseData = {
      message: `Hello ${name}!`,
      name: name,
      timestamp: new Date().toISOString(),
      features: [
        "Secure backend code",
        "Call external APIs",
        "Send emails",
        "Process payments",
        "Heavy computations",
        "Webhook handlers",
      ],
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Function error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
