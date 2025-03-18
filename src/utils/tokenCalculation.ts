
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
    const logText = textToCount.substring(0, 20) + (textToCount.length > 20 ? "..." : "");
    console.log(`Calling Gemini API for token calculation with ${apiKey.substring(0, 3)}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    // Using the current Gemini API version - gemini-1.5-flash is the current model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:countTokens?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // CSRF protection
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: textToCount
              }
            ]
          }
        ]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API response error: ${response.status} - ${errorText}`);
      throw new Error(`API error: ${response.status} - ${errorText}`);
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
