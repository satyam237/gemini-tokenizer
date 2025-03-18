
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { AlertCircle } from "lucide-react";

interface TokenCountDisplayProps {
  tokenCount: number;
  characterCount: number;
  isLoading: boolean;
  isKeyValid: boolean;
  usingEstimate?: boolean;
}

export const TokenCountDisplay = ({ 
  tokenCount, 
  characterCount, 
  isLoading, 
  isKeyValid,
  usingEstimate = false
}: TokenCountDisplayProps) => {
  const { theme } = useTheme();

  return (
    <>
      <div className={`mt-4 flex gap-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
            Tokens
            {usingEstimate && (
              <span title="This is an estimated count" className="inline-flex items-center">
                <AlertCircle className="h-3 w-3 text-yellow-500 ml-1" />
              </span>
            )}
          </div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            {isLoading ? (
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Calculating...</span>
            ) : (
              // Ensure tokenCount is a number
              typeof tokenCount === 'number' ? tokenCount : 0
            )}
          </div>
        </div>
        <div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Characters</div>
          <div className="text-2xl font-semibold">{characterCount}</div>
        </div>
      </div>

      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
        {isKeyValid && !usingEstimate ? 
          "Token counts are provided by the official Gemini API." :
          usingEstimate ? 
          "Token count is estimated. For accurate counts, please provide a valid Gemini API key." :
          "Note: Without an API key, token counting is approximated. For accurate counts, please enter your Gemini API key."
        }
      </div>
    </>
  );
};
