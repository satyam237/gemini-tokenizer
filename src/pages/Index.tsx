
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');

  // This is a temporary implementation since we can't directly use the Python function
  // In a real implementation, this would be connected to a backend service
  const calculateTokens = (text: string) => {
    // Simple approximation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gemini Token Counter
          </h1>
          <p className="text-gray-500">
            Enter your text below to see the token count for different Gemini models
          </p>
        </div>

        <Card className="p-6 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Model
              </label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                  <SelectItem value="gemini-1.0-ultra">Gemini 1.0 Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Text
              </label>
              <Textarea
                placeholder="Enter your text here..."
                className="min-h-[200px] resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Token count:</span>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {calculateTokens(text)}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-sm text-gray-500 text-center">
          Note: This is an approximation. For accurate counts, please use the official Gemini API.
        </div>
      </div>
    </div>
  );
};

export default Index;
