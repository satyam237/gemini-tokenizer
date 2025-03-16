
import { useState, useEffect } from 'react';
import { calculateTokens, estimateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

export function useTokenCalculation(apiKey: string, isKeyValid: boolean, setIsLoading: (loading: boolean) => void) {
    const [text, setText] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);

    useEffect(() => {
        if (!text || !isKeyValid) return;

        const timer = setTimeout(() => {
            handleTokenCalculation(text);
        }, 500);

        return () => clearTimeout(timer);
    }, [text, isKeyValid]);

    const handleTokenCalculation = async (textToCount: string): Promise<void> => {
        if (!textToCount) return;

        setIsLoading(true);
        try {
            console.log("handleTokenCalculation: Calling calculateTokens with text length:", textToCount.length);
            const count = await calculateTokens(textToCount, apiKey);
            console.log("handleTokenCalculation: API returned token count:", count);
            
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            setTokenCount(isNaN(numericCount) ? 0 : numericCount);
        } catch (error: any) {
            console.error('Error counting tokens:', error);
            toast({
                title: "API Error",
                description: error instanceof Error ? error.message : "Failed to connect to the Gemini API",
                variant: "destructive"
            });

            setTokenCount(0);
            throw error; // Rethrow to handle API key validation in the parent component
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextChange = (newText: string): void => {
        setText(newText);
        if (!isKeyValid) {
            const estimate = estimateTokens(newText);
            console.log("Estimated tokens:", estimate);
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
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    };
}
