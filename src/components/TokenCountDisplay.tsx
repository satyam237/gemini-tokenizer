
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
            Tokens
            {!isKeyValid && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelp className="h-4 w-4 cursor-help text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This is an estimated count based on text analysis.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            {typeof tokenCount === 'number' ? tokenCount : 0}
            {!isKeyValid && <span className="text-xs text-amber-500">(est.)</span>}
          </div>
        </div>
        <div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Characters</div>
          <div className="text-2xl font-semibold">{characterCount}</div>
        </div>
      </div>

      <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
        {isKeyValid ? 
          "Token counts are provided by the official Gemini API." :
          "Token counts are estimated based on text analysis patterns."
        }
      </div>
    </>
  );
};
