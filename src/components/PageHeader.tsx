
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";

export const PageHeader: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="space-y-2">
            <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Gemini Tokenizer
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Accurate token counter for Gemini AI models | Calculate tokens for your prompts
            </p>
        </div>
    );
};
