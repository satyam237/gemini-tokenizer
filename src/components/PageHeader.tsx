
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";

export const PageHeader: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="space-y-2">
            <h1 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Gemini Tokenizer
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Accurate token counter for all Gemini AI models | Calculate tokens for your prompts
            </p>
        </div>
    );
};
