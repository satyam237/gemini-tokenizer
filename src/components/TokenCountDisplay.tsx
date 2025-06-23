
import React, { useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { CircleHelp, Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [copiedTokens, setCopiedTokens] = useState(false);
  const [copiedChars, setCopiedChars] = useState(false);

  const handleCopyTokens = async () => {
    try {
      await navigator.clipboard.writeText(tokenCount.toString());
      setCopiedTokens(true);
      toast({
        title: "Copied!",
        description: "Token count copied to clipboard",
      });
      setTimeout(() => setCopiedTokens(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy token count",
        variant: "destructive",
      });
    }
  };

  const handleCopyChars = async () => {
    try {
      await navigator.clipboard.writeText(characterCount.toString());
      setCopiedChars(true);
      toast({
        title: "Copied!",
        description: "Character count copied to clipboard",
      });
      setTimeout(() => setCopiedChars(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy character count",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Tokens Card */}
        <div className={`relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 hover:border-blue-600/50' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTokens}
              disabled={!tokenCount}
              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
            >
              {copiedTokens ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-baseline gap-2">
            <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {isLoading ? '...' : (typeof tokenCount === 'number' ? tokenCount.toLocaleString() : '0')}
            </div>
            {!isKeyValid && <span className="text-sm text-amber-500 font-medium">(est.)</span>}
          </div>
        </div>

        {/* Characters Card */}
        <div className={`relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 hover:border-purple-600/50' : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Characters
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyChars}
              disabled={!characterCount}
              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
            >
              {copiedChars ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {characterCount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} bg-opacity-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
        {isKeyValid ? 
          "🎯 Token counts are provided by the official Gemini API for maximum accuracy." :
          "📊 Token counts are estimated based on advanced text analysis patterns."
        }
      </div>
    </div>
  );
};
