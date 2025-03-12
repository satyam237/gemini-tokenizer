
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const [text, setText] = useState('');
  
  // This is a temporary implementation since we can't directly use the Python function
  // In a real implementation, this would be connected to a backend service
  const calculateTokens = (text: string) => {
    // Simple approximation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  };

  const handleClear = () => {
    setText('');
  };

  const handleShowExample = () => {
    setText("Gemini language models use tokens to process text. Tokens are common sequences of characters found in text. These models learn to predict the next token in a sequence, enabling them to understand and generate human-like text.");
  };

  const { theme } = useTheme();

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

        <div>
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
            </div>
          </Card>

          <div className={`mt-4 flex gap-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tokens</div>
              <div className="text-2xl font-semibold">{calculateTokens(text)}</div>
            </div>
            <div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Characters</div>
              <div className="text-2xl font-semibold">{text.length}</div>
            </div>
          </div>
        </div>

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
          Note: This is an approximation. For accurate counts, please use the official Gemini API.
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
