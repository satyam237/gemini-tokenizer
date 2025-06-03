import React, { useState, useEffect } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { TokenizerInput } from "@/components/TokenizerInput";
import { TokenCountDisplay } from "@/components/TokenCountDisplay";
import { TokenizationInfo } from "@/components/TokenizationInfo";
import { Introduction } from "@/components/Introduction";
import { PageHeader } from "@/components/PageHeader";
import { PageFooter } from "@/components/PageFooter";
import { ModelSelector } from "@/components/ModelSelector";
import { useTokenCalculation } from "@/hooks/useTokenCalculation";
import { Helmet } from 'react-helmet';
import { estimateTokens } from "@/utils/tokenCalculation";

const Index: React.FC = () => {
    const { theme } = useTheme();
    const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');

    const {
        text,
        tokenCount,
        handleTextChange,
        handleClear,
        handleShowExample
    } = useTokenCalculation(selectedModel);

    const [estimatedTokenCount, setEstimatedTokenCount] = useState(0);

    // Always provide estimated counts as fallback
    useEffect(() => {
        if (text) {
            setEstimatedTokenCount(estimateTokens(text));
        }
    }, [text]);

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

                <ModelSelector 
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                />

                <TokenizerInput
                    text={text}
                    onTextChange={handleTextChange}
                    onClear={handleClear}
                    onShowExample={handleShowExample}
                />

                <TokenCountDisplay
                    tokenCount={tokenCount}
                    characterCount={text.length}
                    isLoading={false}
                    isKeyValid={true}
                />

                <TokenizationInfo />
            </div>
            <PageFooter />
        </div>
    );
};

export default Index;
