
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { Zap, Target } from 'lucide-react';

export const Introduction: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="space-y-6">
            <div className={`space-y-4 text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="flex items-start gap-3">
                    <Zap className={`h-6 w-6 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span>
                        Gemini language models process text using <span className={`font-semibold px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>tokens</span>, which are common sequences of
                        characters found in a set of text. The models learn to understand the statistical relationships
                        between these tokens, and excel at producing the next token in a sequence of tokens.
                    </span>
                </p>

                <p className="flex items-start gap-3">
                    <Target className={`h-6 w-6 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                    <span>
                        This <span className={`font-semibold px-2 py-1 rounded ${theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'}`}>Gemini token counter</span> uses the selected Gemini AI model to accurately count tokens.
                        You can use it to understand how a piece of text might be tokenized by Gemini AI models, and the total count of tokens in that text.
                        Optimize your API costs by knowing exactly how many tokens your prompts and responses will use.
                    </span>
                </p>
            </div>
        </div>
    );
};
