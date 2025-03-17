
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TokenizerInput } from "@/components/TokenizerInput";
import { TokenCountDisplay } from "@/components/TokenCountDisplay";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { useApiKeyManagement } from "@/hooks/useApiKeyManagement";
import { useTokenCalculation } from "@/hooks/useTokenCalculation";
import { Introduction } from "@/components/Introduction";
import { TokenizationInfo } from "@/components/TokenizationInfo";
import { PageHeader } from "@/components/PageHeader";

export default function Index() {
  const {
    storedApiKey,
    isKeyValid,
    isLoading,
    usingDefaultKey,
    setIsLoading,
    handleSetApiKey,
    handleResetApiKey,
    verifyDefaultApiKey
  } = useApiKeyManagement();

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const {
    text,
    tokenCount,
    handleTextChange,
    handleClear,
    handleShowExample
  } = useTokenCalculation(storedApiKey, isKeyValid, setIsLoading);

  // Effect to manage API key input visibility
  useEffect(() => {
    // Only show API key input if verification has failed
    if (!isKeyValid && !isLoading) {
      setShowApiKeyInput(true);
    } else {
      setShowApiKeyInput(false);
    }
  }, [isKeyValid, isLoading]);

  return (
    <div className="container max-w-3xl py-8 px-4 mx-auto">
      <PageHeader />
      
      <div className="mt-6">
        <Introduction />
      </div>
      
      {showApiKeyInput ? (
        <ApiKeyInput 
          onApiKeySet={handleSetApiKey} 
          defaultKeyFailed={true}
          onRetryDefaultKey={() => verifyDefaultApiKey(true)}
        />
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

          <TokenizationInfo />
        </>
      )}
    </div>
  );
}
