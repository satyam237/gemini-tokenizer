
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const GEMINI_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
  { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash Preview' },
  { value: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro Preview' },
];

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Model:
      </label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className={`w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
          {GEMINI_MODELS.map((model) => (
            <SelectItem 
              key={model.value} 
              value={model.value}
              className={theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}
            >
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
