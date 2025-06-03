import { useState, useEffect, useCallback } from 'react';
import { calculateTokensWithDefaultKey, estimateTokens } from "@/utils/tokenCalculation";

export function useTokenCalculation(selectedModel: string) {
    const [text, setText] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // Use memoized calculation function to prevent unnecessary renders
    const handleTokenCalculation = useCallback(async (textToCount: string): Promise<void> => {
        if (!textToCount) {
            setTokenCount(0);
            return;
        }

        try {
            // Security: Validate input before sending to API
            const trimmedText = textToCount.trim(); // Trim leading/trailing whitespace
            const sanitizedText = trimmedText.slice(0, 100000); // Reasonable limit
            
            const count = await calculateTokensWithDefaultKey(sanitizedText, selectedModel);
            
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            const finalCount = isNaN(numericCount) ? 0 : numericCount;
            
            setTokenCount(finalCount);
            
        } catch (error: any) {
            console.error('Error counting tokens with API:', error);
            
            // Only use fallback estimation as last resort
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
        }
    }, [selectedModel]);

    // Instant token calculation with very short debounce for performance
    useEffect(() => {
        if (!text) {
            setTokenCount(0);
            return;
        }
        
        // Clear any existing timer
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Very short debounce for API calls (50ms for instant feel)
        const timer = setTimeout(() => {
            handleTokenCalculation(text).catch((error) => {
                console.error('Token calculation failed:', error);
                // Silent fallback to estimation
                const estimate = estimateTokens(text);
                setTokenCount(estimate);
            });
        }, 50);
        
        setDebounceTimer(timer);
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [text, selectedModel, handleTokenCalculation]);

    const handleTextChange = (newText: string): void => {
        setText(newText);
    };

    const handleClear = (): void => {
        setText('');
        setTokenCount(0);
    };

    const handleShowExample = (): void => {
        const exampleText = "Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.";
        setText(exampleText);
    };

    return {
        text,
        tokenCount,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    };
}
