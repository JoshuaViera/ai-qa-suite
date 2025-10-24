'use client';
import { LoadingSkeleton } from './LoadingSkeleton';
import { CodeBlock } from './CodeBlock';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { BUG_FORMATTER_PROMPT } from '@/app/lib/prompts';
import { BUG_FORMATTER_EXAMPLE } from '@/app/lib/examples';

export function BugFormatterTab() {
  const [messyInput, setMessyInput] = useState('');
  const [formattedReport, setFormattedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);

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
      toast.success('Bug report formatted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to format bug report');
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    setMessyInput(BUG_FORMATTER_EXAMPLE);
    setShowExamples(false);
    toast.info('Example loaded');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedReport);
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
          <h2 className="text-xl font-semibold mb-2">Bug Formatter</h2>
          <p className="text-sm text-muted-foreground">
            Paste messy feedback from Slack, email, or user reports to get a perfectly structured bug report.
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
              {showExamples ? 'Hide' : 'Show'} Example Feedback
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
                  Click to load a sample messy feedback:
                </p>
                <Button
                  onClick={handleTryExample}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  type="button"
                >
                  Load Example Feedback
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Messy Feedback</label>
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

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Formatting Bug Report...</label>
            <div className="bg-muted p-4 rounded-lg">
              <LoadingSkeleton />
            </div>
          </div>
        )}

        {/* Output Section */}
        {!isLoading && formattedReport && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Formatted Bug Report</label>
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
                    Copy as Markdown
                  </>
                )}
              </Button>
            </div>
            <CodeBlock
              code={formattedReport}
              language="markdown"
            />
          </div>
        )}
      </div>
    </Card>
  );
}