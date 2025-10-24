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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { buildTestGeneratorPrompt, TestFramework, ComponentFramework, BackendLanguage, TestingMode } from '@/app/lib/promptBuilder';
import { TEST_GENERATOR_EXAMPLES, BACKEND_TEST_EXAMPLES } from '@/app/lib/examples';

export function TestGeneratorTab() {
  const [mode, setMode] = useState<TestingMode>('frontend');
  const [inputCode, setInputCode] = useState('');
  const [testFramework, setTestFramework] = useState<TestFramework>('jest');
  const [componentFramework, setComponentFramework] = useState<ComponentFramework>('react');
  const [backendLanguage, setBackendLanguage] = useState<BackendLanguage>('python');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);

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

      const prompt = buildTestGeneratorPrompt(
        mode,
        testFramework,
        mode === 'frontend' ? componentFramework : undefined,
        mode === 'backend' ? backendLanguage : undefined
      );

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
      toast.success('Tests generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to generate tests');
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleTryExample = () => {
    if (mode === 'frontend') {
      const example = TEST_GENERATOR_EXAMPLES[componentFramework];
      setInputCode(example);
    } else {
      const example = BACKEND_TEST_EXAMPLES[backendLanguage];
      setInputCode(example);
    }
    setShowExamples(false);
    toast.info('Example loaded');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTests);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy');
    }
  };

  const handleModeChange = (newMode: TestingMode) => {
    setMode(newMode);
    setInputCode('');
    setGeneratedTests('');

    if (newMode === 'backend') {
      setTestFramework('pytest');
      setBackendLanguage('python');
    } else {
      setTestFramework('jest');
      setComponentFramework('react');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Test Generator</h2>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive unit tests for frontend components or backend code.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Testing Mode</label>
          <Select value={mode} onValueChange={(value) => handleModeChange(value as TestingMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend (Components)</SelectItem>
              <SelectItem value="backend">Backend (API/Logic)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Framework Selection */}
        {mode === 'frontend' ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Programming Language</label>
              <Select
                value={backendLanguage}
                onValueChange={(value) => {
                  const lang = value as BackendLanguage;
                  setBackendLanguage(lang);
                  if (lang === 'python') setTestFramework('pytest');
                  else if (lang === 'node') setTestFramework('jest');
                  else if (lang === 'go') setTestFramework('go-testing');
                  else if (lang === 'java') setTestFramework('junit');
                  else if (lang === 'ruby') setTestFramework('rspec');
                  else if (lang === 'php') setTestFramework('phpunit');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="node">Node.js</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Test Framework</label>
              <div className="flex items-center h-10 px-3 rounded-md border border-input bg-muted text-sm">
                {backendLanguage === 'python' && 'pytest'}
                {backendLanguage === 'node' && 'Jest / Mocha'}
                {backendLanguage === 'go' && 'testing'}
                {backendLanguage === 'java' && 'JUnit 5'}
                {backendLanguage === 'ruby' && 'RSpec'}
                {backendLanguage === 'php' && 'PHPUnit'}
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Examples Section */}
        <div className="border rounded-lg">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-lg"
            type="button"
          >
            <span className="text-sm font-medium">
              {showExamples ? 'Hide' : 'Show'} Example Code
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
                  Click to load a sample {mode === 'frontend' ? componentFramework : backendLanguage} example:
                </p>
                <Button
                  onClick={handleTryExample}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  type="button"
                >
                  Load {mode === 'frontend'
                    ? `${componentFramework.charAt(0).toUpperCase() + componentFramework.slice(1)} Example`
                    : `${backendLanguage.charAt(0).toUpperCase() + backendLanguage.slice(1)} Example`
                  }
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {mode === 'frontend' ? 'Your Component Code' : 'Your Backend Code'}
          </label>
          <Textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={
              mode === 'frontend'
                ? `Paste your ${componentFramework} component code here...`
                : `Paste your ${backendLanguage} code here...`
            }
            className="min-h-[250px] font-mono text-sm"
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
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generating Tests...</label>
            <div className="bg-muted p-4 rounded-lg">
              <LoadingSkeleton />
            </div>
          </div>
        )}

        {/* Output Section */}
        {!isLoading && generatedTests && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Generated Tests</label>
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
              code={generatedTests}
              language={
                mode === 'frontend'
                  ? (componentFramework === 'react' ? 'typescript' : 'javascript')
                  : (backendLanguage === 'python' ? 'python' :
                    backendLanguage === 'go' ? 'go' :
                      backendLanguage === 'java' ? 'java' :
                        backendLanguage === 'ruby' ? 'ruby' :
                          backendLanguage === 'php' ? 'php' : 'javascript')
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
}