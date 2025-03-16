
import { useState, useEffect } from 'react';
import { calculateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

const DEFAULT_API_KEY = 'AIzaSyDtpsYDIKyoODNL0U9wHgxf69PWvI12hXc';

export function useApiKeyManagement() {
    const [storedApiKey, setStoredApiKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
    const [usingDefaultKey, setUsingDefaultKey] = useState<boolean>(false);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('geminiApiKey');
        if (savedApiKey) {
            verifyExistingApiKey(savedApiKey);
        } else {
            // Try using the default key if no saved key exists
            verifyDefaultApiKey();
        }
    }, []);

    const verifyDefaultApiKey = async () => {
        setIsLoading(true);
        try {
            const testText = "Verify default key";
            await calculateTokens(testText, DEFAULT_API_KEY);
            setStoredApiKey(DEFAULT_API_KEY);
            setIsKeyValid(true);
            setUsingDefaultKey(true);
            localStorage.setItem('geminiApiKey', DEFAULT_API_KEY);
            toast({
                title: "Using Default API Key",
                description: "Connected with the default Gemini API key"
            });
        } catch (error) {
            console.error('Default API key not working:', error);
            toast({
                title: "Default API Key Not Working",
                description: "Please provide your own Gemini API key",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const verifyExistingApiKey = async (key: string) => {
        setIsLoading(true);
        try {
            const testText = "Verify saved key";
            await calculateTokens(testText, key);
            setStoredApiKey(key);
            setIsKeyValid(true);
            setUsingDefaultKey(key === DEFAULT_API_KEY);
        } catch (error) {
            console.error('Error verifying saved API key:', error);
            localStorage.removeItem('geminiApiKey');
            // Try using the default key if saved key doesn't work
            verifyDefaultApiKey();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetApiKey = (newApiKey: string): void => {
        setStoredApiKey(newApiKey);
        setIsKeyValid(true);
        setUsingDefaultKey(newApiKey === DEFAULT_API_KEY);
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
        verifyDefaultApiKey
    };
}
