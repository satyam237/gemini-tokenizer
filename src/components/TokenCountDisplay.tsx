
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";

interface TokenCountDisplayProps {
  tokenCount: number;
  characterCount: number;
  isLoading: boolean;
  isKeyValid: boolean;
}

export const TokenCountDisplay = ({ 
  tokenCount, 
  characterCount, 
  isLoading, 
  isKeyValid 
}: TokenCountDisplayProps) => {
  const { theme } = useTheme();

  return (
    <>
      <div className={`mt-4 flex gap-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tokens</div>
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
        {isKeyValid ? 
          "Token counts are provided by the official Gemini API." :
          "Note: Without an API key, token counting is approximated. For accurate counts, please enter your Gemini API key."
        }
      </div>
    </>
  );
};
