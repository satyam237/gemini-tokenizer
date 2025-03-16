
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { calculateTokens } from "@/utils/tokenCalculation";
import { Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
}

export const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme } = useTheme();

  const verifyApiKey = async (key: string) => {
    if (!key.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return false;
    }

    setIsVerifying(true);

    try {
      // Use a simple test string to verify the API key works
      const testText = "Test verification";
      await calculateTokens(testText, key);
      
      // If no error was thrown, the API key is valid
      localStorage.setItem('geminiApiKey', key);
      toast({
        title: "API Key Verified",
        description: "Your API key has been verified and saved"
      });
      setIsVerifying(false);
      return true;
    } catch (error) {
      console.error('Error verifying API key:', error);
      setIsVerifying(false);
      toast({
        title: "Invalid API Key",
        description: "The API key could not be verified. Please check and try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleVerifyAndSave = async () => {
    const isValid = await verifyApiKey(apiKey);
    if (isValid) {
      onApiKeySet(apiKey);
      setApiKey('');
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Card className={`p-6 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Enter your Gemini API Key
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          To count tokens accurately, you need to provide a Gemini API key. This will be stored in your browser's local storage.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="Your Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} pr-10`}
              disabled={isVerifying}
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
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          You can get an API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
        </p>
      </div>
    </Card>
  );
};
