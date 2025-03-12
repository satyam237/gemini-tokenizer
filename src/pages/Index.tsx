
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
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
      calculateTokens(text);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, storedApiKey]);

  const calculateTokens = async (textToCount: string) => {
    if (!textToCount || !storedApiKey) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:countTokens?key=${storedApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: textToCount
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "API Error",
          description: data.error.message || "Failed to count tokens",
          variant: "destructive"
        });
        setTokenCount(0);
        if (data.error.status === 'INVALID_ARGUMENT' || data.error.status === 'PERMISSION_DENIED') {
          setIsKeyValid(false);
          localStorage.removeItem('geminiApiKey');
          setStoredApiKey('');
        }
      } else {
        setTokenCount(data.totalTokenCount || 0);
      }
    } catch (error) {
      console.error('Error counting tokens:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the Gemini API",
        variant: "destructive"
      });
      setTokenCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('geminiApiKey', apiKey);
    setStoredApiKey(apiKey);
    setIsKeyValid(true);
    setApiKey('');
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved"
    });
    
    if (text) {
      calculateTokens(text);
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
  };

  // Fallback estimation when API is not available
  const estimateTokens = (text: string) => {
    // Simple approximation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
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
          <Card className={`p-6 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Enter your Gemini API Key
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                To count tokens accurately, you need to provide a Gemini API key. This will be stored in your browser's local storage.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Your Gemini API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}
                />
                <Button onClick={handleSetApiKey}>
                  Save Key
                </Button>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                You can get an API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
              </p>
            </div>
          </Card>
        ) : (
          <>
            <Card className={`p-0 overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
              <Textarea
                placeholder="Enter some text"
                className={`min-h-[200px] resize-none rounded-none border-0 focus-visible:ring-0 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              <div className={`p-4 flex justify-between items-center border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClear}
                    className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}`}
                  >
                    Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShowExample}
                    className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}`}
                  >
                    Show example
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleResetApiKey}
                  className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Reset API Key
                </Button>
              </div>
            </Card>

            <div className={`mt-4 flex gap-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tokens</div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  {isLoading ? (
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Calculating...</span>
                  ) : (
                    tokenCount || 0
                  )}
                </div>
              </div>
              <div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Characters</div>
                <div className="text-2xl font-semibold">{text.length}</div>
              </div>
            </div>
          </>
        )}

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
          {isKeyValid ? 
            "Token counts are provided by the official Gemini API." :
            "Note: Without an API key, token counting is approximated. For accurate counts, please enter your Gemini API key."
          }
        </div>

        <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-left text-sm`}>
          <p className="font-medium">Understanding Gemini Token Counting:</p>
          <p>
            For Gemini models, token counting aligns closely with standard subword tokenization methods. While the "one token ~ 4 characters" rule of thumb for common English text often applies, precise token counts can vary based on language, content complexity, and the specific Gemini model used.
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">To accurately determine token counts for Gemini:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Google AI Studio and Vertex AI API:</span> When using Google AI Studio or the Vertex AI API, the response from the API will provide you with the token count for both the prompt and the generated response. This is the most reliable method.
              </li>
              <li>
                <span className="font-medium">Google AI Python SDK:</span> The Google AI Python SDK provides tools to directly interact with Gemini models, and the API responses will include token counts.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Considerations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Code, non-English languages, and complex formatting may result in different token counts.</li>
              <li>The tokenization process can evolve with model updates. Therefore, relying on API-provided token counts is recommended for accurate usage.</li>
              <li>Currently, there is no publicly available, separate, official python or javascript tokenization library, specifically for Gemini models, as is the case with tiktoken for other LLMs. Rely on the API response to provide the token count.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
