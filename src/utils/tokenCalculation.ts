
export const calculateTokens = async (textToCount: string, apiKey: string): Promise<number> => {
  if (!textToCount || !apiKey) return 0;
  
  try {
    console.log("Calling Gemini API with text:", textToCount.substring(0, 50) + (textToCount.length > 50 ? "..." : ""));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:countTokens?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      })
    });

    const data = await response.json();
    console.log("API Response:", data);
    
    if (data.error) {
      throw new Error(data.error.message || "Failed to count tokens");
    }
    
    // Fix: Use `totalTokens` instead of `totalTokenCount`
    return data.totalTokens || 0;
    
  } catch (error) {
    console.error("Error in calculateTokens:", error);
    throw error;
  }
};

// Fallback estimation when API is not available
export const estimateTokens = (text: string): number => {
  // Simple approximation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
};
