'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { buildTestGeneratorPrompt, TestFramework, ComponentFramework } from '@/app/lib/promptBuilder';
import { TEST_GENERATOR_EXAMPLES } from '@/app/lib/examples';

export function TestGeneratorTab() {
  const [inputCode, setInputCode] = useState('');
  const [testFramework, setTestFramework] = useState<TestFramework>('jest');
  const [componentFramework, setComponentFramework] = useState<ComponentFramework>('react');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleGenerate = async () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to generate tests for');
      return;
    }

    if (cooldown) return;

    try {
      setIsLoading(true);
      setError(null);
      setCooldown(true);
      setGeneratedTests('');

      // Build the appropriate prompt based on selected frameworks
      const prompt = buildTestGeneratorPrompt(testFramework, componentFramework);

      // Call the API route
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          input: inputCode,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to generate tests');
      }

      const data = await apiResponse.json();
      setGeneratedTests(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      // Reset cooldown after 3 seconds
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    const example = TEST_GENERATOR_EXAMPLES[componentFramework];
    setInputCode(example);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTests);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Test Generator</h2>
          <p className="text-sm text-muted-foreground">
            Paste your component code and select your framework to generate comprehensive unit tests.
          </p>
        </div>

        {/* Framework Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Framework</label>
            <Select
              value={testFramework}
              onValueChange={(value) => setTestFramework(value as TestFramework)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jest">Jest</SelectItem>
                <SelectItem value="vitest">Vitest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Component Framework</label>
            <Select
              value={componentFramework}
              onValueChange={(value) => setComponentFramework(value as ComponentFramework)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Your Component Code</label>
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
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`Paste your ${componentFramework} component code here...`}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || cooldown}
          className="w-full"
        >
          {isLoading ? 'Generating...' : cooldown ? 'Please wait...' : 'Generate Tests'}
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Output Section */}
        {generatedTests && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Generated Tests</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                type="button"
              >
                Copy
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{generatedTests}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}