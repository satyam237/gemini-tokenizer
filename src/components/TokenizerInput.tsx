
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import { Copy, Check, Trash2, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TokenizerInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onClear: () => void;
  onShowExample: () => void;
}

export const TokenizerInput = ({ 
  text, 
  onTextChange, 
  onClear, 
  onShowExample
}: TokenizerInputProps) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`overflow-hidden border-0 shadow-none ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="relative">
        <Textarea
          placeholder="Enter your text here to calculate tokens..."
          className={`min-h-[300px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg leading-relaxed ${theme === 'dark' ? 'bg-gray-800/50 text-white placeholder:text-gray-400' : 'bg-gray-50/50 text-gray-900 placeholder:text-gray-500'} rounded-xl`}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
        
        {text && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyText}
            className={`absolute top-4 right-4 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-all duration-200`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      <div className={`p-6 flex flex-wrap gap-3 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClear}
          disabled={!text}
          className={`transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 hover:border-red-500' : 'hover:border-red-300 hover:bg-red-50'} group`}
        >
          <Trash2 className="h-4 w-4 mr-2 group-hover:text-red-500 transition-colors" />
          Clear
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShowExample}
          className={`transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 hover:border-blue-500' : 'hover:border-blue-300 hover:bg-blue-50'} group`}
        >
          <FileText className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
          Show Example
        </Button>
      </div>
    </Card>
  );
};
