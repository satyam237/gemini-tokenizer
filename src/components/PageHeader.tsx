
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { Sparkles } from 'lucide-react';

export const PageHeader: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} shadow-lg`}>
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r ${theme === 'dark' ? 'from-white via-blue-100 to-purple-100' : 'from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent`}>
                Gemini Tokenizer
            </h1>
            
            <p className={`text-xl md:text-2xl font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Professional token counter for all Gemini AI models
            </p>
            
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
                Calculate tokens for your prompts with precision and optimize your AI applications
            </p>
        </div>
    );
};
