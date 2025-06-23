
import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateTokensWithDefaultKey, estimateTokens } from "@/utils/tokenCalculation";

export function useTokenCalculation(selectedModel: string) {
    const [text, setText] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Instant token calculation with very short debounce
    const handleTokenCalculation = useCallback(async (textToCount: string): Promise<void> => {
        if (!textToCount) {
            setTokenCount(0);
            setIsLoading(false);
            return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setIsLoading(true);

        try {
            // Security: Validate input before sending to API
            const trimmedText = textToCount.trim();
            const sanitizedText = trimmedText.slice(0, 100000);
            
            console.log('Calculating tokens for model:', selectedModel, 'text length:', sanitizedText.length);
            
            const count = await calculateTokensWithDefaultKey(sanitizedText, selectedModel);
            
            // Check if request was aborted
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }
            
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            const finalCount = isNaN(numericCount) ? 0 : numericCount;
            
            setTokenCount(finalCount);
            console.log('Token count result:', finalCount);
            
        } catch (error: any) {
            // Check if error is due to abort
            if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
                return;
            }
            
            console.error('Error counting tokens with API:', error);
            
            // Fallback to estimation
            const estimate = estimateTokens(textToCount);
            setTokenCount(estimate);
            console.log('Using estimated token count:', estimate);
        } finally {
            setIsLoading(false);
        }
    }, [selectedModel]);

    // Instant token calculation with minimal debounce (20ms for near-instant feel)
    useEffect(() => {
        if (!text) {
            setTokenCount(0);
            setIsLoading(false);
            return;
        }
        
        // Clear existing debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        // Very short debounce for instant feel while preventing excessive API calls
        debounceRef.current = setTimeout(() => {
            handleTokenCalculation(text);
        }, 20);
        
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [text, selectedModel, handleTokenCalculation]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleTextChange = (newText: string): void => {
        setText(newText);
    };

    const handleClear = (): void => {
        setText('');
        setTokenCount(0);
        setIsLoading(false);
    };

    const handleShowExample = (): void => {
        const exampleText = "Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.";
        setText(exampleText);
    };

    return {
        text,
        tokenCount,
        isLoading,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    };
}
