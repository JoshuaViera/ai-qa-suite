'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ERROR_EXPLAINER_PROMPT } from '@/app/lib/prompts';
import { ERROR_EXPLAINER_EXAMPLE } from '@/app/lib/examples';

export function ErrorExplainerTab() {
  const [brokenCode, setBrokenCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleGenerate = async () => {
    if (!brokenCode.trim() || !errorMessage.trim()) {
      setError('Please provide both the code and the error message');
      return;
    }

    if (cooldown) return;

    try {
      setIsLoading(true);
      setError(null);
      setCooldown(true);
      setExplanation('');

      // Combine code and error for the AI
      const combinedInput = `CODE:\n${brokenCode}\n\nERROR:\n${errorMessage}`;

      // Call the API route
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: ERROR_EXPLAINER_PROMPT,
          input: combinedInput,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to explain error');
      }

      const data = await apiResponse.json();
      setExplanation(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    setBrokenCode(ERROR_EXPLAINER_EXAMPLE.code);
    setErrorMessage(ERROR_EXPLAINER_EXAMPLE.error);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Error Explainer</h2>
          <p className="text-sm text-muted-foreground">
            Paste your broken code and error message to get a clear explanation, fix, and prevention test.
          </p>
        </div>

        {/* Try Example Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTryExample}
            type="button"
          >
            Try Example
          </Button>
        </div>

        {/* Code Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Code</label>
          <Textarea
            value={brokenCode}
            onChange={(e) => setBrokenCode(e.target.value)}
            placeholder="Paste your broken code here..."
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        {/* Error Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Error Message / Stack Trace</label>
          <Textarea
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="Paste the error message or stack trace..."
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || cooldown}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : cooldown ? 'Please wait...' : 'Explain & Fix'}
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Output Section */}
        {explanation && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Explanation & Fix</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                type="button"
              >
                Copy
              </Button>
            </div>
            <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap">{explanation}</pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}