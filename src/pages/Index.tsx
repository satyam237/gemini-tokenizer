
import React from 'react';
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

const Index: React.FC = () => {
    const { theme } = useTheme();
    
    const {
        storedApiKey,
        isKeyValid,
        isLoading,
        usingDefaultKey,
        setIsLoading,
        handleSetApiKey,
        handleResetApiKey,
        verifyDefaultApiKey
    } = useApiKeyManagement();

    const {
        text,
        tokenCount,
        handleTextChange,
        handleClear,
        handleShowExample,
        handleTokenCalculation
    } = useTokenCalculation(storedApiKey, isKeyValid, setIsLoading);

    const [defaultKeyFailed, setDefaultKeyFailed] = React.useState(false);

    // Security-focused error handler
    const handleApiError = (error: any) => {
        // Check if this is a key validation error
        if (usingDefaultKey && 
            (error instanceof Error && 
             (error.message.includes('API key not authorized') || 
              error.message.includes('PERMISSION_DENIED') ||
              error.message.includes('INVALID_ARGUMENT')))) {
            localStorage.removeItem('geminiApiKey');
            handleResetApiKey();
            setDefaultKeyFailed(true);
        }
    };

    const retryDefaultKey = async () => {
        setDefaultKeyFailed(false);
        const success = await verifyDefaultApiKey(true);
        if (!success) {
            setDefaultKeyFailed(true);
        }
    };

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
        "author": {
            "@type": "Person",
            "name": "Satyam Jadhav",
            "url": "https://github.com/satyam237"
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
            <Helmet>
                <title>Gemini Tokenizer - Count Tokens for Gemini AI Models</title>
                <meta name="description" content="An accurate token counter for Gemini AI models. Calculate token usage for your Gemini prompts and responses to optimize your AI applications." />
                <meta name="referrer" content="no-referrer" />
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <div className="max-w-4xl mx-auto space-y-8">
                <PageHeader />
                <Introduction />

                {!isKeyValid ? (
                    <ApiKeyInput 
                        onApiKeySet={handleSetApiKey} 
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
            <PageFooter />
        </div>
    );
};

export default Index;
