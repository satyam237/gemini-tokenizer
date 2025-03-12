
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";

interface TokenizerInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onClear: () => void;
  onShowExample: () => void;
  onResetApiKey: () => void;
}

export const TokenizerInput = ({ 
  text, 
  onTextChange, 
  onClear, 
  onShowExample, 
  onResetApiKey 
}: TokenizerInputProps) => {
  const { theme } = useTheme();

  return (
    <Card className={`p-0 overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      <Textarea
        placeholder="Enter some text"
        className={`min-h-[200px] resize-none rounded-none border-0 focus-visible:ring-0 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
      
      <div className={`p-4 flex justify-between items-center border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClear}
            className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}`}
          >
            Clear
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShowExample}
            className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}`}
          >
            Show example
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onResetApiKey}
          className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Reset API Key
        </Button>
      </div>
    </Card>
  );
};
