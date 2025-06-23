
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
        "description": "An accurate token counter tool for all Gemini AI models including 1.5, 2.0, and 2.5 series to help calculate token usage for prompts and responses.",
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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            <Helmet>
                <title>Gemini Tokenizer - Accurate Token Counter for All Gemini AI Models</title>
                <meta name="description" content="Free online tool to accurately count tokens for all Gemini AI models including 1.5 Flash, 1.5 Pro, 2.0 Flash, 2.0 Flash Lite, and 2.5 models. Calculate token usage for your Gemini prompts and responses to optimize your AI applications and API costs." />
                <meta name="keywords" content="gemini tokenizer, gemini token counter, gemini token count, gemini tokens, gemini AI, token calculator, AI tokens, gemini text to tokens, count tokens for gemini, gemini token usage, gemini API tokens" />
                <meta name="referrer" content="no-referrer" />
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-200'} blur-3xl`}></div>
                    <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-200'} blur-3xl`}></div>
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-12">
                    <PageHeader />
                    
                    <div className={`backdrop-blur-sm bg-opacity-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-2xl p-8`}>
                        <Introduction />
                    </div>

                    <div className={`backdrop-blur-sm bg-opacity-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-2xl p-8`}>
                        <ModelSelector 
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                        />
                    </div>

                    <div className={`backdrop-blur-sm bg-opacity-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-2xl overflow-hidden`}>
                        <TokenizerInput
                            text={text}
                            onTextChange={handleTextChange}
                            onClear={handleClear}
                            onShowExample={handleShowExample}
                        />
                        
                        <div className="p-8 pt-6">
                            <TokenCountDisplay
                                tokenCount={tokenCount}
                                characterCount={text.length}
                                isLoading={false}
                                isKeyValid={true}
                            />
                        </div>
                    </div>

                    <div className={`backdrop-blur-sm bg-opacity-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-2xl p-8`}>
                        <TokenizationInfo />
                    </div>
                </div>
            </div>
            
            <PageFooter />
        </div>
    );
};

export default Index;
