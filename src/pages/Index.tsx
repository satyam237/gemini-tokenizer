
import React, { useState, useEffect } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { TokenizerInput } from "@/components/TokenizerInput";
import { TokenCountDisplay } from "@/components/TokenCountDisplay";
import { TokenizationInfo } from "@/components/TokenizationInfo";
import { Introduction } from "@/components/Introduction";
import { PageHeader } from "@/components/PageHeader";
import { PageFooter } from "@/components/PageFooter";
import { useApiKeyManagement } from "@/hooks/useApiKeyManagement";
import { useTokenCalculation } from "@/hooks/useTokenCalculation";
import { Helmet } from 'react-helmet';
import { toast } from "@/components/ui/use-toast";
import { estimateTokens } from "@/utils/tokenCalculation";

const Index: React.FC = () => {
    const { theme } = useTheme();
    const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
    
    const {
        storedApiKey,
        isKeyValid,
        isLoading,
        usingDefaultKey,
        setIsLoading,
        handleSetApiKey,
        handleResetApiKey,
        verifyDefaultApiKey,
        verifyExistingApiKey
    } = useApiKeyManagement();

    const {
        text,
        tokenCount,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    } = useTokenCalculation(storedApiKey, isKeyValid, setIsLoading);

    const [defaultKeyFailed, setDefaultKeyFailed] = useState(false);
    const [estimatedTokenCount, setEstimatedTokenCount] = useState(0);

    // Try to verify API key on load
    useEffect(() => {
        const verifyKey = async () => {
            // First check if there's a locally stored key
            const savedKey = localStorage.getItem('geminiApiKey');
            if (savedKey) {
                const success = await verifyExistingApiKey(savedKey);
                if (success) {
                    return;
                }
            }
            
            // If no saved key or saved key failed, try the default key
            const success = await verifyDefaultApiKey(false);
            if (!success) {
                setDefaultKeyFailed(true);
                setShowApiKeyInput(true);
                toast({
                    title: "API Key Required",
                    description: "Please provide your own Gemini API key to use the tokenizer",
                    variant: "destructive"
                });
            }
        };
        
        verifyKey();
    }, []);

    // Always provide estimated counts even when API is not available
    useEffect(() => {
        if (text && !isKeyValid) {
            setEstimatedTokenCount(estimateTokens(text));
        }
    }, [text, isKeyValid]);

    const retryDefaultKey = async () => {
        setDefaultKeyFailed(false);
        const success = await verifyDefaultApiKey(true);
        if (!success) {
            setDefaultKeyFailed(true);
            setShowApiKeyInput(true);
        } else {
            setShowApiKeyInput(false);
        }
    };

    const handleApiKeySubmit = (key: string) => {
        handleSetApiKey(key);
        setShowApiKeyInput(false);
    };

    const handleKeyResetRequest = () => {
        handleResetApiKey();
        setShowApiKeyInput(true);
    };

    // Structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Gemini Tokenizer",
        "description": "An accurate token counter tool for Gemini AI models to help calculate token usage for prompts and responses.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "keywords": "gemini tokenizer, gemini token counter, gemini token count, gemini tokens, gemini AI, token calculator, AI tokens, gemini text to tokens, count tokens for gemini, gemini token usage, gemini API tokens",
        "author": {
            "@type": "Person",
            "name": "Satyam Jadhav",
            "url": "https://github.com/satyam237"
        },
        "url": "https://gemini-tokenizer.com/",
        "datePublished": "2023-10-01",
        "dateModified": "2024-07-20"
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
            <Helmet>
                <title>Gemini Tokenizer - Accurate Token Counter for Gemini AI Models</title>
                <meta name="description" content="Free online tool to accurately count tokens for Gemini AI models. Calculate token usage for your Gemini prompts and responses to optimize your AI applications and API costs." />
                <meta name="keywords" content="gemini tokenizer, gemini token counter, gemini token count, gemini tokens, gemini AI, token calculator, AI tokens, gemini text to tokens, count tokens for gemini, gemini token usage, gemini API tokens" />
                <meta name="referrer" content="no-referrer" />
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <div className="max-w-4xl mx-auto space-y-8">
                <PageHeader />
                <Introduction />

                {showApiKeyInput ? (
                    <ApiKeyInput 
                        onApiKeySet={handleApiKeySubmit} 
                        defaultKeyFailed={defaultKeyFailed}
                        onRetryDefaultKey={retryDefaultKey}
                    />
                ) : (
                    <>
                        <TokenizerInput
                            text={text}
                            onTextChange={handleTextChange}
                            onClear={handleClear}
                            onShowExample={handleShowExample}
                            onResetApiKey={handleKeyResetRequest}
                        />

                        <TokenCountDisplay
                            tokenCount={isKeyValid ? tokenCount : estimatedTokenCount}
                            characterCount={text.length}
                            isLoading={isLoading}
                            isKeyValid={isKeyValid}
                        />
                    </>
                )}

                <TokenizationInfo />
            </div>
            <PageFooter />
        </div>
    );
};

export default Index;
