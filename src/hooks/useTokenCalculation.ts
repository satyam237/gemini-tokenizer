
import { useState, useEffect, useCallback } from 'react';
import { calculateTokens, calculateTokensWithDefaultKey, estimateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

export function useTokenCalculation(apiKey: string, isKeyValid: boolean, setIsLoading: (loading: boolean) => void) {
    const [text, setText] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [apiError, setApiError] = useState<Error | null>(null);

    // Use memoized calculation function to prevent unnecessary renders
    const handleTokenCalculation = useCallback(async (textToCount: string): Promise<void> => {
        if (!textToCount) return;

        setIsLoading(true);
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
            
            // Clear any previous errors
            setApiError(null);
        } catch (error: any) {
            console.error('Error counting tokens:', error);
            
            // Store the error for potential handling by parent components
            setApiError(error instanceof Error ? error : new Error(String(error)));
            
            // Only show toast for non-network errors to reduce noise
            if (error.message && !error.message.includes('network')) {
                toast({
                    title: "API Error",
                    description: error instanceof Error ? error.message : "Failed to connect to the Gemini API",
                    variant: "destructive"
                });
            }

            // Use fallback estimation
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
            throw error; // Rethrow to handle API key validation in the parent component
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, setIsLoading]);

    // Efficient debouncing mechanism
    useEffect(() => {
        if (!text || !isKeyValid) return;
        
        // Clear any existing timer
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Set a new timer
        const timer = setTimeout(() => {
            handleTokenCalculation(text).catch(error => {
                console.error("Token calculation failed:", error);
                // Fall back to estimation when API fails
                const estimate = estimateTokens(text);
                setTokenCount(estimate);
            });
        }, 300); // Reduced debounce time for faster response
        
        setDebounceTimer(timer);
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [text, isKeyValid, handleTokenCalculation]);

    const handleTextChange = (newText: string): void => {
        setText(newText);
        if (!isKeyValid) {
            const estimate = estimateTokens(newText);
            setTokenCount(estimate);
        }
    };

    const handleClear = (): void => {
        setText('');
        setTokenCount(0);
    };

    const handleShowExample = (): void => {
        const exampleText = "Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.";
        setText(exampleText);

        if (!isKeyValid) {
            setTokenCount(estimateTokens(exampleText));
        }
    };

    return {
        text,
        tokenCount,
        apiError,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    };
}
