
import React, { useState, useEffect } from 'react';
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
  const [displayTokenCount, setDisplayTokenCount] = useState(0);

  // Smooth animation for token count changes
  useEffect(() => {
    if (isLoading) return;
    
    const startCount = displayTokenCount;
    const endCount = tokenCount;
    const duration = 300; // 300ms animation
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(startCount + (endCount - startCount) * easeOutQuart);
      
      setDisplayTokenCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    if (startCount !== endCount) {
      requestAnimationFrame(animate);
    }
  }, [tokenCount, isLoading]);

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Tokens Card */}
        <div className={`relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 hover:border-blue-600/50' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-xs font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              Tokens
              {!isKeyValid && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleHelp className="h-3 w-3 cursor-help text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">This is an estimated count based on text analysis.</p>
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
              className="h-6 w-6 p-0 hover:scale-110 transition-transform"
            >
              {copiedTokens ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          
          <div className="flex items-baseline gap-1">
            <div className={`text-2xl font-bold transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {isLoading ? '...' : displayTokenCount.toLocaleString()}
            </div>
            {!isKeyValid && <span className="text-xs text-amber-500 font-medium">(est.)</span>}
          </div>
        </div>

        {/* Characters Card */}
        <div className={`relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 hover:border-purple-600/50' : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-xs font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Characters
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyChars}
              disabled={!characterCount}
              className="h-6 w-6 p-0 hover:scale-110 transition-transform"
            >
              {copiedChars ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          
          <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {characterCount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className={`text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} bg-opacity-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-3`}>
        {isKeyValid ? 
          "🎯 Token counts are provided by the official Gemini API for maximum accuracy." :
          "📊 Token counts are estimated based on advanced text analysis patterns."
        }
      </div>
    </div>
  );
};
