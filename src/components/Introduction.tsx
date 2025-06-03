import React from 'react';
import { useTheme } from "@/components/ThemeProvider";

export const Introduction: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>
                Gemini language models process text using <span className="font-medium">tokens</span>, which are common sequences of
                characters found in a set of text. The models learn to understand the statistical relationships
                between these tokens, and excel at producing the next token in a sequence of tokens.
            </p>

            <p>
                This <span className="font-medium">Gemini token counter</span> uses the selected Gemini AI model to accurately count tokens.
                You can use it to understand how a piece of text might be tokenized by Gemini AI models, and the total count of tokens in that text.
                Optimize your API costs by knowing exactly how many tokens your prompts and responses will use.
            </p>
        </div>
    );
};
