'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BUG_FORMATTER_PROMPT } from '@/app/lib/prompts';
import { BUG_FORMATTER_EXAMPLE } from '@/app/lib/examples';

export function BugFormatterTab() {
  const [messyInput, setMessyInput] = useState('');
  const [formattedReport, setFormattedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleGenerate = async () => {
    if (!messyInput.trim()) {
      setError('Please enter some feedback to format');
      return;
    }

    if (cooldown) return;

    try {
      setIsLoading(true);
      setError(null);
      setCooldown(true);
      setFormattedReport('');

      // Call the API route
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: BUG_FORMATTER_PROMPT,
          input: messyInput,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to format bug report');
      }

      const data = await apiResponse.json();
      setFormattedReport(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    setMessyInput(BUG_FORMATTER_EXAMPLE);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedReport);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Bug Formatter</h2>
          <p className="text-sm text-muted-foreground">
            Paste messy feedback from Slack, email, or user reports to get a perfectly structured bug report.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Messy Feedback</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTryExample}
              type="button"
            >
              Try Example
            </Button>
          </div>
          <Textarea
            value={messyInput}
            onChange={(e) => setMessyInput(e.target.value)}
            placeholder="Paste your messy feedback, bug report, or user complaint here..."
            className="min-h-[200px]"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || cooldown}
          className="w-full"
        >
          {isLoading ? 'Formatting...' : cooldown ? 'Please wait...' : 'Format Bug Report'}
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Output Section */}
        {formattedReport && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Formatted Bug Report</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                type="button"
              >
                Copy as Markdown
              </Button>
            </div>
            <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap">{formattedReport}</pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}