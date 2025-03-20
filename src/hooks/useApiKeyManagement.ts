
import { useState, useEffect } from 'react';
import { calculateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

// Access environment variable correctly
const DEFAULT_API_KEY = import.meta.env.VITE_DEFAULT_API_KEY || '';

export function useApiKeyManagement() {
    const [storedApiKey, setStoredApiKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
    const [usingDefaultKey, setUsingDefaultKey] = useState<boolean>(false);

    // Check for a saved API key on component mount
    useEffect(() => {
        const savedApiKey = localStorage.getItem('geminiApiKey');
        if (savedApiKey) {
            // Set the key but verify it
            setStoredApiKey(savedApiKey);
            verifyExistingApiKey(savedApiKey);
        } else if (DEFAULT_API_KEY) {
            // If no saved key but default key exists, try that
            console.log("Trying default API key");
            verifyDefaultApiKey(false);
        } else {
            console.log("No default API key available");
        }
    }, []);

    const verifyDefaultApiKey = async (showSuccessToast = false) => {
        if (!DEFAULT_API_KEY) {
            console.log("No default API key available");
            return false;
        }

        setIsLoading(true);
        try {
            const testText = "Verify default key";
            await calculateTokens(testText, DEFAULT_API_KEY);
            setStoredApiKey(DEFAULT_API_KEY);
            setIsKeyValid(true);
            setUsingDefaultKey(true);
            localStorage.setItem('geminiApiKey', DEFAULT_API_KEY);
            
            console.log("Default API key validation successful");
            
            // Only show success toast if explicitly requested
            if (showSuccessToast) {
                toast({
                    title: "Using Default API Key",
                    description: "Connected with the default Gemini API key"
                });
            }
            return true;
        } catch (error) {
            console.error('Default API key not working:', error);
            setIsKeyValid(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyExistingApiKey = async (key: string) => {
        if (!key) {
            console.error('No API key provided for verification');
            setIsKeyValid(false);
            return false;
        }

        setIsLoading(true);
        try {
            // Security: Basic validation before use
            if (typeof key !== 'string' || key.length < 10) {
                throw new Error("Invalid API key format");
            }
            
            const testText = "Verify saved key";
            await calculateTokens(testText, key);
            setStoredApiKey(key);
            setIsKeyValid(true);
            setUsingDefaultKey(key === DEFAULT_API_KEY);
            return true;
        } catch (error) {
            console.error('Error verifying saved API key:', error);
            // Don't clear the stored key here, just mark it as invalid
            setIsKeyValid(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetApiKey = (newApiKey: string): void => {
        // Security: Sanitize input
        const sanitizedKey = (newApiKey || '').trim();
        if (!sanitizedKey) return;
        
        localStorage.setItem('geminiApiKey', sanitizedKey);
        setStoredApiKey(sanitizedKey);
        setIsKeyValid(true);
        setUsingDefaultKey(sanitizedKey === DEFAULT_API_KEY);
    };

    const handleResetApiKey = (): void => {
        localStorage.removeItem('geminiApiKey');
        setStoredApiKey('');
        setIsKeyValid(false);
        setUsingDefaultKey(false);
        toast({
            title: "API Key Removed",
            description: "Your API key has been removed"
        });
    };

    return {
        storedApiKey,
        isKeyValid,
        isLoading,
        usingDefaultKey,
        setIsLoading,
        handleSetApiKey,
        handleResetApiKey,
        verifyDefaultApiKey,
        verifyExistingApiKey
    };
}
