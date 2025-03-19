
// Security measures and optimization for token calculation

export const calculateTokens = async (textToCount: string, apiKey: string): Promise<number> => {
  if (!textToCount) return 0;
  if (!apiKey) throw new Error("API key is required for token calculation");
  
  try {
    // Security: Prevent API misuse by enforcing reasonable limits
    if (textToCount.length > 100000) {
      textToCount = textToCount.substring(0, 100000);
    }
    
    // Performance optimization - don't log entire text
    console.log(`Calling Gemini API for token calculation with ${apiKey.substring(0, 3)}...`);
    
    // Use a shorter timeout to avoid long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for faster response
    
    // Make sure we're using the correct path for the API endpoint
    // For Cloudflare Pages, we need to use the full path starting with /api/
    const apiUrl = `${window.location.origin}/api/count-tokens`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        'X-API-Key': apiKey // Send as header instead of query parameter
      },
      body: JSON.stringify({
        content: textToCount
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // More robust error handling for non-JSON responses
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = `API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`;
        } else {
          // Don't attempt to parse HTML or other non-JSON responses
          console.error(`API returned non-JSON response: ${response.status}`);
        }
      } catch (parseError) {
        console.error('Error parsing API error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      const errorMessage = data.error.message || "Unknown API error";
      console.error("API returned an error:", errorMessage);
      throw new Error(errorMessage);
    }
    
    // Validate response format
    if (typeof data.totalTokens !== 'number') {
      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response format from Gemini API");
    }
    
    return data.totalTokens || 0;
    
  } catch (error) {
    console.error("Error in calculateTokens:", error);
    throw error;
  }
};

// Improved token estimation algorithm
export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  
  // More accurate approximation based on character types
  const trimmedText = text.trim();
  
  // Count words (better predictor for English)
  const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
  
  // Count code-specific characters that often map to separate tokens
  const codeTokens = (trimmedText.match(/[{}[\]()=+\-*/<>!|&^%$#@;:,.?]/g) || []).length;
  
  // Count numeric sequences as potential tokens
  const numberTokens = (trimmedText.match(/\d+/g) || []).length;
  
  // Estimate based on a mix of factors
  return Math.max(
    1,
    Math.ceil(wordCount * 1.3) + codeTokens + numberTokens
  );
};
