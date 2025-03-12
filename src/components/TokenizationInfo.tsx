
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";

export const TokenizationInfo = () => {
  const { theme } = useTheme();

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-left text-sm`}>
      <p className="font-medium">Understanding Gemini Token Counting:</p>
      <p>
        For Gemini models, token counting aligns closely with standard subword tokenization methods. While the "one token ~ 4 characters" rule of thumb for common English text often applies, precise token counts can vary based on language, content complexity, and the specific Gemini model used.
      </p>
      
      <div className="space-y-2">
        <p className="font-medium">To accurately determine token counts for Gemini:</p>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Google AI Studio and Vertex AI API:</span> When using Google AI Studio or the Vertex AI API, the response from the API will provide you with the token count for both the prompt and the generated response. This is the most reliable method.
          </li>
          <li>
            <span className="font-medium">Google AI Python SDK:</span> The Google AI Python SDK provides tools to directly interact with Gemini models, and the API responses will include token counts.
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Considerations:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Code, non-English languages, and complex formatting may result in different token counts.</li>
          <li>The tokenization process can evolve with model updates. Therefore, relying on API-provided token counts is recommended for accurate usage.</li>
          <li>Currently, there is no publicly available, separate, official python or javascript tokenization library, specifically for Gemini models, as is the case with tiktoken for other LLMs. Rely on the API response to provide the token count.</li>
        </ul>
      </div>
    </div>
  );
};
