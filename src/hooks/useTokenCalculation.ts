
import { useState, useEffect, useCallback } from 'react';
import { calculateTokens, calculateTokensWithDefaultKey, estimateTokens } from "@/utils/tokenCalculation";

export function useTokenCalculation(apiKey: string, isKeyValid: boolean, setIsLoading: (loading: boolean) => void) {
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
            const sanitizedText = textToCount.slice(0, 100000); // Reasonable limit
            
            let count: number;
            
            // Use server-side secure endpoint if using default key
            if (apiKey === '__DEFAULT_KEY__') {
                count = await calculateTokensWithDefaultKey(sanitizedText);
            } else if (apiKey) {
                count = await calculateTokens(sanitizedText, apiKey);
            } else {
                throw new Error("No API key available");
            }
            
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            setTokenCount(isNaN(numericCount) ? 0 : numericCount);
            
        } catch (error: any) {
            console.error('Error counting tokens:', error);
            
            // Use fallback estimation silently
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
        }
    }, [apiKey]);

    // Instant token calculation with very short debounce for performance
    useEffect(() => {
        if (!text) {
            setTokenCount(0);
            return;
        }

        if (!isKeyValid) {
            // Instant estimation for no API key
            const estimate = estimateTokens(text);
            setTokenCount(estimate);
            return;
        }
        
        // Clear any existing timer
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Very short debounce for API calls (100ms for instant feel)
        const timer = setTimeout(() => {
            handleTokenCalculation(text).catch(() => {
                // Silent fallback to estimation
                const estimate = estimateTokens(text);
                setTokenCount(estimate);
            });
        }, 100);
        
        setDebounceTimer(timer);
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [text, isKeyValid, handleTokenCalculation]);

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
