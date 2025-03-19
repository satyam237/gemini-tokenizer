
import { useState, useEffect } from 'react';
import { calculateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

// We don't directly access the environment variable from the client
// This will be handled server-side
const DEFAULT_API_KEY = "DEFAULT_KEY"; // Just a placeholder indicator

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
        } else {
            // Try the default key flow with a shorter timeout
            console.log("Trying default API key");
            verifyDefaultApiKey(false);
        }
    }, []);

    const verifyDefaultApiKey = async (showSuccessToast = false) => {
        setIsLoading(true);
        try {
            // Use shortest possible text for verification
            const testText = "Test";
            // Use the placeholder default key - our server will handle this securely
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
            // Don't show error toast during initial load to reduce notification spam
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
            
            // Use shortest possible text for quicker verification
            const testText = "Test";
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
