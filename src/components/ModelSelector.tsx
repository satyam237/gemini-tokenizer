
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { Bot } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const GEMINI_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Advanced reasoning' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', description: 'Latest fast model' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite', description: 'Lightweight version' },
  { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash Preview', description: 'Preview release' },
  { value: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro Preview', description: 'Latest preview' },
];

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const { theme } = useTheme();
  
  const selectedModelInfo = GEMINI_MODELS.find(model => model.value === selectedModel);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} shadow-md`}>
          <Bot className="h-4 w-4 text-white" />
        </div>
        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Model:
        </label>
      </div>
      
      <div className="flex-1 min-w-0">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className={`w-full text-sm h-9 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-600 text-white hover:border-gray-500' : 'bg-white/80 border-gray-300 hover:border-gray-400'} shadow-sm hover:shadow-md`}>
            <SelectValue placeholder="Choose a model..." />
          </SelectTrigger>
          <SelectContent className={`${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} shadow-xl`}>
            {GEMINI_MODELS.map((model) => (
              <SelectItem 
                key={model.value} 
                value={model.value}
                className={`text-sm py-2 px-3 cursor-pointer transition-all duration-200 ${theme === 'dark' ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100'}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{model.label}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {model.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
