
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { Bot } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const GEMINI_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
  { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash Preview' },
  { value: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro Preview' },
];

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const { theme } = useTheme();

  return (
    <div className={`relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30 hover:border-green-600/50' : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:border-green-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 text-xs font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
          <Bot className="h-3 w-3" />
          Model
        </div>
      </div>
      
      <div className="w-full">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className={`w-full text-sm h-8 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-600 text-white hover:border-gray-500' : 'bg-white/80 border-gray-300 hover:border-gray-400'} shadow-sm hover:shadow-md`}>
            <SelectValue placeholder="Choose a model..." />
          </SelectTrigger>
          <SelectContent className={`${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} shadow-xl`}>
            {GEMINI_MODELS.map((model) => (
              <SelectItem 
                key={model.value} 
                value={model.value}
                className={`text-sm py-2 px-3 cursor-pointer transition-all duration-200 ${theme === 'dark' ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100'}`}
              >
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
