
import { useState, useEffect } from 'react';
import { calculateTokens } from "@/utils/tokenCalculation";
import { toast } from "@/components/ui/use-toast";

export function useApiKeyManagement() {
    const [storedApiKey, setStoredApiKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(false);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('geminiApiKey');
        if (savedApiKey) {
            verifyExistingApiKey(savedApiKey);
        }
    }, []);

    const verifyExistingApiKey = async (key: string) => {
        setIsLoading(true);
        try {
            const testText = "Verify saved key";
            await calculateTokens(testText, key);
            setStoredApiKey(key);
            setIsKeyValid(true);
        } catch (error) {
            console.error('Error verifying saved API key:', error);
            localStorage.removeItem('geminiApiKey');
            toast({
                title: "Invalid Saved API Key",
                description: "Your previously saved API key is no longer valid. Please enter a new one.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetApiKey = (newApiKey: string): void => {
        setStoredApiKey(newApiKey);
        setIsKeyValid(true);
    };

    const handleResetApiKey = (): void => {
        localStorage.removeItem('geminiApiKey');
        setStoredApiKey('');
        setIsKeyValid(false);
        toast({
            title: "API Key Removed",
            description: "Your API key has been removed"
        });
    };

    return {
        storedApiKey,
        isKeyValid,
        isLoading,
        setIsLoading,
        handleSetApiKey,
        handleResetApiKey
    };
}
