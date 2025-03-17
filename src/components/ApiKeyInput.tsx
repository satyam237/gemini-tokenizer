
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { calculateTokens } from "@/utils/tokenCalculation";
import { Eye, EyeOff, AlertTriangle, ShieldCheck } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  defaultKeyFailed?: boolean;
  onRetryDefaultKey?: () => void;
}

export const ApiKeyInput = ({ onApiKeySet, defaultKeyFailed = false, onRetryDefaultKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme } = useTheme();

  // Auto-focus the input field when component mounts
  useEffect(() => {
    const inputEl = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (inputEl) inputEl.focus();
  }, []);

  const verifyApiKey = async (key: string) => {
    // Security: Validate and sanitize input
    const sanitizedKey = (key || '').trim();
    if (!sanitizedKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return false;
    }

    // Validate minimum key length (typical for API keys)
    if (sanitizedKey.length < 10) {
      toast({
        title: "Invalid API Key Format",
        description: "The API key appears to be too short",
        variant: "destructive"
      });
      return false;
    }

    setIsVerifying(true);

    try {
      // Use a simple test string to verify the API key works
      const testText = "Test verification";
      await calculateTokens(testText, sanitizedKey);
      
      // If no error was thrown, the API key is valid
      localStorage.setItem('geminiApiKey', sanitizedKey);
      toast({
        title: "API Key Verified",
        description: "Your API key has been verified and saved securely"
      });
      return true;
    } catch (error) {
      console.error('Error verifying API key:', error);
      toast({
        title: "Invalid API Key",
        description: "The API key could not be verified. Please check and try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyAndSave = async () => {
    const isValid = await verifyApiKey(apiKey);
    if (isValid) {
      onApiKeySet(apiKey);
      setApiKey(''); // Clear for security
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && apiKey.trim()) {
      handleVerifyAndSave();
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleRetryDefault = () => {
    if (onRetryDefaultKey) {
      onRetryDefaultKey();
    }
  };

  return (
    <Card className={`p-6 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      <div className="space-y-4">
        {defaultKeyFailed && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription className="flex items-center gap-2">
              <span>Please provide your own Gemini API key or</span>
              <Button variant="link" onClick={handleRetryDefault} className="px-1 h-auto">
                try again with default key
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Enter your Gemini API Key
          </h3>
          <ShieldCheck className="h-5 w-5 text-green-500" />
        </div>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Your key will be stored securely in your browser's local storage and is only used to count tokens.
        </p>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="Your Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyUp={handleKeyPress}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} pr-10`}
              disabled={isVerifying}
              autoComplete="off"
              spellCheck="false"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <button
              type="button"
              onClick={toggleShowApiKey}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button 
            onClick={handleVerifyAndSave} 
            disabled={isVerifying || !apiKey.trim()}
          >
            {isVerifying ? 'Verifying...' : 'Verify Key'}
          </Button>
        </div>
        
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>Get an API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></p>
          <p className="mt-1">Your API key never leaves your browser and is not sent to our servers.</p>
        </div>
      </div>
    </Card>
  );
};
