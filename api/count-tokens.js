import { GoogleGenerativeAI } from "@google/generative-ai";

// Secure server-side API endpoint for token counting
// This keeps the default API key secure and never exposes it to the client

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, model = 'gemini-1.5-flash' } = req.body;
    console.log('API DEBUG: Received model:', model, '| Received text length:', text ? text.length : 0);
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid text is required' });
    }

    // Validate model - ensure all models match exactly
    const validModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-pro-preview-05-06'
    ];

    if (!validModels.includes(model)) {
      console.error(`Invalid model specified: ${model}. Valid models: ${validModels.join(', ')}`);
      return res.status(400).json({ error: `Invalid model specified: ${model}` });
    }

    // Security: Limit text length
    const limitedText = text.substring(0, 100000);
    
    // Get the default API key from environment (server-side only)
    const DEFAULT_API_KEY = process.env.VITE_DEFAULT_API_KEY;
    
    if (!DEFAULT_API_KEY) {
      return res.status(500).json({ error: 'Default API key not configured' });
    }

    console.log(`Server: Making secure API call to Gemini with model: ${model}`);

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(DEFAULT_API_KEY);

    // Get the model instance
    const geminiModel = genAI.getGenerativeModel({ model: model });

    try {
      // Use the countTokens method from the client library
      const { totalTokens } = await geminiModel.countTokens(limitedText);
      console.log(`Token calculation successful for model ${model}: ${totalTokens} tokens`);

      // Return the token count
      return res.status(200).json({
        totalTokens: totalTokens || 0
      });
    } catch (apiError) {
      console.error(`Gemini API error during countTokens:`, apiError);
      return res.status(500).json({
        error: `Error counting tokens: ${apiError.message || apiError}`
      });
    }

  } catch (error) {
    console.error('Server error in count-tokens:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
