
import React, { useState, useEffect } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "@/components/ui/use-toast";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { TokenizerInput } from "@/components/TokenizerInput";
import { TokenCountDisplay } from "@/components/TokenCountDisplay";
import { TokenizationInfo } from "@/components/TokenizationInfo";
import { calculateTokens, estimateTokens } from "@/utils/tokenCalculation";

const Index = () => {
  const [text, setText] = useState('');
  const [storedApiKey, setStoredApiKey] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  
  const { theme } = useTheme();

  useEffect(() => {
    // Check localStorage for API key on mount
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setStoredApiKey(savedApiKey);
      setIsKeyValid(true);
    }
  }, []);

  useEffect(() => {
    // Debounce token counting to avoid too many API calls
    if (!text || !isKeyValid) return;
    
    const timer = setTimeout(() => {
      handleTokenCalculation(text);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, storedApiKey]);

  const handleTokenCalculation = async (textToCount: string) => {
    if (!textToCount) return;
    
    setIsLoading(true);
    try {
      const count = await calculateTokens(textToCount, storedApiKey);
      setTokenCount(count);
    } catch (error) {
      console.error('Error counting tokens:', error);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to connect to the Gemini API",
        variant: "destructive"
      });
      
      // If error is due to invalid API key, reset it
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

  const handleSetApiKey = (newApiKey: string) => {
    setStoredApiKey(newApiKey);
    setIsKeyValid(true);
    
    if (text) {
      handleTokenCalculation(text);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (!isKeyValid) {
      // Use fallback estimation when API is not available
      setTokenCount(estimateTokens(newText));
    }
  };

  const handleClear = () => {
    setText('');
    setTokenCount(0);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setStoredApiKey('');
    setIsKeyValid(false);
    setTokenCount(0);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed"
    });
  };

  const handleShowExample = () => {
    setText("Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.");
    
    if (!isKeyValid) {
      // Use fallback estimation when API is not available
      setTokenCount(estimateTokens("Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text."));
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
            You can use the tool below to understand how a piece of text might be tokenized by a language
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
    </div>
  );
};

export default Index;
