import React, { useState, useEffect } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "@/components/ui/use-toast";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { TokenizerInput } from "@/components/TokenizerInput";
import { TokenCountDisplay } from "@/components/TokenCountDisplay";
import { TokenizationInfo } from "@/components/TokenizationInfo";
import { calculateTokens, estimateTokens } from "@/utils/tokenCalculation";
import { FaGithub, FaEnvelope } from "react-icons/fa";

const Index: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [storedApiKey, setStoredApiKey] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(false);

    const { theme } = useTheme();

    useEffect(() => {
        const savedApiKey = localStorage.getItem('geminiApiKey');
        if (savedApiKey) {
            // Verify the saved API key on page load
            verifyExistingApiKey(savedApiKey);
        }
    }, []);

    const verifyExistingApiKey = async (key: string) => {
        setIsLoading(true);
        try {
            // Use a simple test string to verify the API key works
            const testText = "Verify saved key";
            await calculateTokens(testText, key);
            
            // If no error was thrown, the API key is valid
            setStoredApiKey(key);
            setIsKeyValid(true);
        } catch (error) {
            console.error('Error verifying saved API key:', error);
            localStorage.removeItem('geminiApiKey');
            toast({
                title: "Invalid Saved API Key",
                description: "Your previously saved API key is no longer valid. Please enter a new one.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

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
            const count = await calculateTokens(textToCount, storedApiKey);
            console.log("handleTokenCalculation: API returned token count:", count);
            
            // Ensure count is a number - convert to number if it's a string
            const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;
            setTokenCount(isNaN(numericCount) ? 0 : numericCount);
        } catch (error: any) { // Type 'any' for error as it can be different types.
            console.error('Error counting tokens:', error);
            toast({
                title: "API Error",
                description: error instanceof Error ? error.message : "Failed to connect to the Gemini API",
                variant: "destructive"
            });

            if (error instanceof Error &&
                (error.message.includes('INVALID_ARGUMENT') ||
                    error.message.includes('PERMISSION_DENIED'))) {
                setIsKeyValid(false);
                localStorage.removeItem('geminiApiKey');
                setStoredApiKey('');
            }

            setTokenCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetApiKey = (newApiKey: string): void => {
        setStoredApiKey(newApiKey);
        setIsKeyValid(true);

        if (text) {
            handleTokenCalculation(text);
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

    const handleResetApiKey = (): void => {
        localStorage.removeItem('geminiApiKey');
        setStoredApiKey('');
        setIsKeyValid(false);
        setTokenCount(0);
        toast({
            title: "API Key Removed",
            description: "Your API key has been removed"
        });
    };

    const handleShowExample = (): void => {
        const exampleText = "Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.";
        setText(exampleText);

        if (!isKeyValid) {
            setTokenCount(estimateTokens(exampleText));
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Gemini Tokenizer
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Learn about language model tokenization
                    </p>
                </div>

                <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p>
                        Gemini language models process text using <span className="font-medium">tokens</span>, which are common sequences of
                        characters found in a set of text. The models learn to understand the statistical relationships
                        between these tokens, and excel at producing the next token in a sequence of tokens.
                    </p>

                    <p>
                        This tool uses the <span className="font-medium">Gemini 2.0 Flash</span> model to accurately count tokens.
                        You can use it to understand how a piece of text might be tokenized by a language
                        model, and the total count of tokens in that piece of text.
                    </p>
                </div>

                {!isKeyValid ? (
                    <ApiKeyInput onApiKeySet={handleSetApiKey} />
                ) : (
                    <>
                        <TokenizerInput
                            text={text}
                            onTextChange={handleTextChange}
                            onClear={handleClear}
                            onShowExample={handleShowExample}
                            onResetApiKey={handleResetApiKey}
                        />

                        <TokenCountDisplay
                            tokenCount={tokenCount}
                            characterCount={text.length}
                            isLoading={isLoading}
                            isKeyValid={isKeyValid}
                        />
                    </>
                )}

                <TokenizationInfo />
            </div>
            <footer className="mt-10 text-center text-sm text-gray-500">
                <p>Made with <span className="font-bold">lovable.ai</span> by Satyam Jadhav | <a href="mailto:satyam2373@gmail.com" className="text-blue-500 hover:underline">satyam2373@gmail.com</a></p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="https://github.com/satyam237" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="w-5 h-5 text-gray-600 hover:text-black" />
                    </a>
                    <a href="mailto:satyam2373@gmail.com">
                        <FaEnvelope className="w-5 h-5 text-gray-600 hover:text-red-600" />
                    </a>
                </div>
                <p className="mt-2">Feel free to contribute!</p>
            </footer>
        </div>
    );
};

export default Index;
