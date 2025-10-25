'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ERROR_EXPLAINER_PROMPT } from '@/app/lib/prompts';
import { ERROR_EXPLAINER_EXAMPLE } from '@/app/lib/examples';
import { CodeBlock } from './CodeBlock';
import { LoadingSkeleton } from './LoadingSkeleton';
import { saveGeneration } from '@/lib/db/service';

export function ErrorExplainerTab() {
  const [brokenCode, setBrokenCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!brokenCode.trim() || !errorMessage.trim()) {
      setError('Please provide both the code and the error message');
      return;
    }

    if (cooldown) return;

    const startTime = Date.now();

    try {
      setIsLoading(true);
      setError(null);
      setCooldown(true);
      setExplanation('');

      const combinedInput = `CODE:\n${brokenCode}\n\nERROR:\n${errorMessage}`;

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
      const endTime = Date.now();
      setExplanation(data.response);

      // Save to database
      try {
        await saveGeneration({
          feature_type: 'error-explainer',
          input_code: combinedInput,
          output_result: data.response,
          input_length: combinedInput.length,
          output_length: data.response.length,
          generation_time_ms: endTime - startTime,
        });
      } catch (dbError) {
        console.error('Failed to save to database:', dbError);
      }

      toast.success('Error explained successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to explain error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    setBrokenCode(ERROR_EXPLAINER_EXAMPLE.code);
    setErrorMessage(ERROR_EXPLAINER_EXAMPLE.error);
    setShowExamples(false);
    toast.info('Example loaded');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy');
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

        {/* Collapsible Examples Section */}
        <div className="border rounded-lg">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-lg"
            type="button"
          >
            <span className="text-sm font-medium">
              {showExamples ? 'Hide' : 'Show'} Example Error
            </span>
            {showExamples ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showExamples && (
            <div className="p-4 border-t bg-muted/30">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Click to load a sample error scenario:
                </p>
                <Button
                  onClick={handleTryExample}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  type="button"
                >
                  Load Example Error
                </Button>
              </div>
            </div>
          )}
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

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Analyzing Error...</label>
            <div className="bg-muted p-4 rounded-lg">
              <LoadingSkeleton />
            </div>
          </div>
        )}

        {/* Output Section */}
        {!isLoading && explanation && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Explanation & Fix</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                type="button"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <CodeBlock 
              code={explanation}
              language="typescript"
            />
          </div>
        )}
      </div>
    </Card>
  );
}