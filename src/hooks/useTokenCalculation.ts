
import { useState, useEffect, useCallback } from 'react';
import { calculateTokens, estimateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

export function useTokenCalculation(apiKey: string, isKeyValid: boolean, setIsLoading: (loading: boolean) => void) {
    const [text, setText] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [apiError, setApiError] = useState<Error | null>(null);
    const [usingEstimate, setUsingEstimate] = useState<boolean>(false);

    // Use memoized calculation function to prevent unnecessary renders
    const handleTokenCalculation = useCallback(async (textToCount: string): Promise<void> => {
        if (!textToCount) {
            setTokenCount(0);
            return;
        }
        
        if (!apiKey || !isKeyValid) {
            // If no valid API key, use estimation instead
            setUsingEstimate(true);
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
            return;
        }

        setIsLoading(true);
        setUsingEstimate(false);
        
        try {
            // Security: Validate input before sending to API
            const sanitizedText = textToCount.slice(0, 100000); // Reasonable limit
            
            const count = await calculateTokens(sanitizedText, apiKey);
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            setTokenCount(isNaN(numericCount) ? 0 : numericCount);
            
            // Clear any previous errors
            setApiError(null);
        } catch (error: any) {
            console.error('Error counting tokens:', error);
            
            // Store the error for potential handling by parent components
            setApiError(error instanceof Error ? error : new Error(String(error)));
            
            // Only show toast for specific API errors, not network issues
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('API key not valid') || 
                errorMessage.includes('PERMISSION_DENIED') ||
                errorMessage.includes('API key expired')) {
                
                toast({
                    title: "API Key Error",
                    description: "Your API key appears to be invalid or expired. Please check your key.",
                    variant: "destructive"
                });
            }

            // Use fallback estimation
            setUsingEstimate(true);
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isKeyValid, setIsLoading]);

    // Efficient debouncing mechanism
    useEffect(() => {
        if (!text) {
            setTokenCount(0);
            return;
        }
        
        // Clear any existing timer
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Set a new timer
        const timer = setTimeout(() => {
            handleTokenCalculation(text).catch(error => {
                console.error("Token calculation failed:", error);
                // Fall back to estimation when API fails
                setUsingEstimate(true);
                const estimate = estimateTokens(text);
                setTokenCount(estimate);
            });
        }, 300); // Reduced debounce time for faster response
        
        setDebounceTimer(timer);
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [text, isKeyValid, apiKey, handleTokenCalculation]);

    const handleTextChange = (newText: string): void => {
        setText(newText);
        if (!isKeyValid || !apiKey) {
            setUsingEstimate(true);
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

        if (!isKeyValid || !apiKey) {
            setUsingEstimate(true);
            setTokenCount(estimateTokens(exampleText));
        }
    };

    return {
        text,
        tokenCount,
        apiError,
        usingEstimate,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    };
}
