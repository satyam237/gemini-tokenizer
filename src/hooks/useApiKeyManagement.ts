
import { useState, useEffect } from 'react';
import { calculateTokens, calculateTokensWithDefaultKey } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

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
            // Try to use server-side default key
            console.log("Trying server-side default API key");
            verifyDefaultApiKey(false);
        }
    }, []);

    const verifyDefaultApiKey = async (showSuccessToast = false) => {
        setIsLoading(true);
        try {
            const testText = "Test";
            // Use secure server-side endpoint that doesn't expose the API key
            await calculateTokensWithDefaultKey(testText);
            
            // Set a placeholder to indicate we're using default key
            setStoredApiKey('__DEFAULT_KEY__');
            setIsKeyValid(true);
            setUsingDefaultKey(true);
            
            console.log("Default API key validation successful (server-side)");
            
            if (showSuccessToast) {
                toast({
                    title: "Using Default API Key",
                    description: "Connected with the secure default Gemini API key"
                });
            }
            return true;
        } catch (error) {
            console.error('Default API key not working:', error);
            setIsKeyValid(false);
            setUsingDefaultKey(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyExistingApiKey = async (key: string) => {
        if (!key || key === '__DEFAULT_KEY__') {
            return verifyDefaultApiKey(false);
        }

        setIsLoading(true);
        try {
            // Security: Basic validation before use
            if (typeof key !== 'string' || key.length < 10) {
                throw new Error("Invalid API key format");
            }
            
            const testText = "Test";
            await calculateTokens(testText, key);
            setStoredApiKey(key);
            setIsKeyValid(true);
            setUsingDefaultKey(false);
            return true;
        } catch (error) {
            console.error('Error verifying saved API key:', error);
            // Fall back to default key if user key fails
            return await verifyDefaultApiKey(false);
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
        setUsingDefaultKey(false);
    };

    const handleResetApiKey = (): void => {
        localStorage.removeItem('geminiApiKey');
        // Reset to default key instead of no key
        verifyDefaultApiKey(true);
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
