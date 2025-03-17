
import { useState, useEffect } from 'react';
import { calculateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

const DEFAULT_API_KEY = import.meta.env.VITE_DEFAULT_API_KEY;

export function useApiKeyManagement() {
    const [storedApiKey, setStoredApiKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
    const [usingDefaultKey, setUsingDefaultKey] = useState<boolean>(false);

    // Check for a saved API key on component mount
    useEffect(() => {
        const savedApiKey = localStorage.getItem('geminiApiKey');
        if (savedApiKey) {
            // Set the key but don't verify yet, to avoid showing API key input
            setStoredApiKey(savedApiKey);
            setIsKeyValid(true);
            setUsingDefaultKey(savedApiKey === DEFAULT_API_KEY);
        }
    }, []);

    const verifyDefaultApiKey = async (showSuccessToast = false) => {
        setIsLoading(true);
        try {
            const testText = "Verify default key";
            await calculateTokens(testText, DEFAULT_API_KEY);
            setStoredApiKey(DEFAULT_API_KEY);
            setIsKeyValid(true);
            setUsingDefaultKey(true);
            localStorage.setItem('geminiApiKey', DEFAULT_API_KEY);
            
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
        setIsLoading(true);
        try {
            // Security: Validate key format before use
            if (!key || typeof key !== 'string' || key.length < 10) {
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
