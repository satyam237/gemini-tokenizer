
// This is a server-side function that handles token counting
// In a real deployment, this would be a serverless function or API route

export async function onRequest(context) {
  try {
    // CORS headers
    const headers = {
      "Access-Control-Allow-Origin": context.request.headers.get("Origin") || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key, X-Requested-With",
      "Content-Type": "application/json"
    };

    // Handle preflight requests
    if (context.request.method === "OPTIONS") {
      return new Response(null, { headers, status: 204 });
    }

    // Only allow POST requests
    if (context.request.method !== "POST") {
      return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
        status: 405,
        headers
      });
    }

    // Get request data
    const requestData = await context.request.json();
    const content = requestData.content;
    
    // Get API key from environment variable or from request header (for user's personal key)
    const DEFAULT_API_KEY = context.env.VITE_DEFAULT_API_KEY;
    const clientApiKey = context.request.headers.get("X-API-Key");
    
    // Decide which API key to use (default from environment or user's personal key)
    const apiKey = clientApiKey === DEFAULT_API_KEY ? DEFAULT_API_KEY : clientApiKey;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "API key is required" } }), {
        status: 401,
        headers
      });
    }

    if (!content) {
      return new Response(JSON.stringify({ error: { message: "Content is required" } }), {
        status: 400,
        headers
      });
    }

    // Call the Gemini API server-side
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:countTokens?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: content
                }
              ]
            }
          ]
        })
      }
    );

    // Get response from Gemini API
    const geminiData = await geminiResponse.json();
    
    // Pass the response back to the client
    return new Response(JSON.stringify(geminiData), {
      status: geminiResponse.status,
      headers
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Server error: " + error.message
        }
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
