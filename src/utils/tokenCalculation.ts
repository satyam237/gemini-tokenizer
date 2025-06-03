
// Security measures and optimization for token calculation

export const calculateTokens = async (textToCount: string, apiKey: string, model: string = 'gemini-1.5-flash'): Promise<number> => {
  if (!textToCount) return 0;
  if (!apiKey) throw new Error("API key is required for token calculation");
  
  try {
    // Security: Prevent API misuse by enforcing reasonable limits
    if (textToCount.length > 100000) {
      textToCount = textToCount.substring(0, 100000);
    }
    
    console.log(`Calling Gemini API for token calculation with model: ${model}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    // Using the specified Gemini API model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:countTokens?key=${apiKey}`, {
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
      console.error(`API response error: ${response.status}`);
      throw new Error(`API error: ${response.status}`);
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

// Server-side token calculation using default key (secure)
export const calculateTokensWithDefaultKey = async (textToCount: string, model: string = 'gemini-1.5-flash'): Promise<number> => {
  if (!textToCount) return 0;
  
  try {
    // Security: Prevent API misuse by enforcing reasonable limits
    if (textToCount.length > 100000) {
      textToCount = textToCount.substring(0, 100000);
    }
    
    console.log(`Using server-side API for token calculation with model: ${model}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Use our secure server-side endpoint
    const response = await fetch('/api/count-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToCount,
        model: model
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server API response error: ${response.status} - ${errorText}`);
      throw new Error(`Server API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Server API returned an error:", data.error);
      throw new Error(data.error);
    }
    
    if (typeof data.totalTokens !== 'number') {
      console.error("Unexpected server response format:", data);
      throw new Error("Unexpected response format from server");
    }
    
    console.log(`Token calculation successful for model ${model}: ${data.totalTokens} tokens`);
    return data.totalTokens || 0;
    
  } catch (error) {
    console.error("Error in calculateTokensWithDefaultKey:", error);
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
