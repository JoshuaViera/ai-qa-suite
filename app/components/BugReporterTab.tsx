'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from './ImageUpload';
import { StepsInput } from './StepsInput';
import { CodeBlock } from './CodeBlock';
import { SEVERITY_OPTIONS } from '@/lib/types/bug-reporter';
import type { BugReporterFormState } from '@/lib/types/bug-reporter';
import { supabase } from '@/lib/supabase/client';
import { saveBugReport } from '@/lib/db/service';

export function BugReporterTab() {
  const [sessionId, setSessionId] = useState<string>('');
  const [formState, setFormState] = useState<BugReporterFormState>({
    title: '',
    description: '',
    steps: [],
    pageUrl: '',
    severity: 'medium',
    screenshotFile: null,
    screenshotUrl: '',
  });
  const [generatedReport, setGeneratedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Get session ID from localStorage
  useEffect(() => {
    const id = localStorage.getItem('sessionId');
    if (id) setSessionId(id);
  }, []);

  // Auto-detect browser and OS
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    return browser;
  };

  const getOSInfo = () => {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    
    return os;
  };

  // Handle image selection
  const handleImageSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('bug-screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('bug-screenshots')
        .getPublicUrl(fileName);

      setFormState((prev) => ({
        ...prev,
        screenshotFile: file,
        screenshotUrl: publicUrl,
      }));

      toast.success('Screenshot uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload screenshot. Please try again.');
      toast.error('Failed to upload screenshot');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    if (formState.screenshotUrl) {
      URL.revokeObjectURL(formState.screenshotUrl);
    }
    setFormState((prev) => ({
      ...prev,
      screenshotFile: null,
      screenshotUrl: '',
    }));
  };

  // AI validation as user types (debounced)
  useEffect(() => {
    if (!formState.description.trim()) {
      setAiSuggestion('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Simple validation suggestions
        if (formState.description.length < 20) {
          setAiSuggestion('💡 Try adding more details to your description');
        } else if (formState.steps.length === 0) {
          setAiSuggestion('💡 Add steps to reproduce to make this report more actionable');
        } else if (!formState.title) {
          setAiSuggestion('💡 AI can generate a title based on your description');
        } else {
          setAiSuggestion('');
        }
      } catch (err) {
        console.error('Validation error:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formState.description, formState.steps, formState.title]);

  const handleGenerate = async () => {
    // Validation
    if (!formState.description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (formState.steps.length === 0) {
      setError('Please add at least one step to reproduce');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setGeneratedReport('');

      const browser = getBrowserInfo();
      const os = getOSInfo();

      // Generate title if not provided
      let title = formState.title;
      if (!title) {
        try {
          const titleResponse = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: 'Generate a concise, descriptive bug title (max 10 words) based on this description:',
              input: formState.description,
            }),
          });

          if (titleResponse.ok) {
            const titleData = await titleResponse.json();
            // Use 'response' field (your API returns this)
            title = (titleData.response || titleData.result || '').toString().trim().replace(/^["']|["']$/g, '');
            console.log('Generated title:', title);
          }
          
          // Fallback if generation fails or returns empty
          if (!title) {
            title = formState.description.substring(0, 50) + '...';
          }
        } catch (titleError) {
          console.error('Title generation error:', titleError);
          // Fallback: use first 50 chars of description
          title = formState.description.substring(0, 50) + '...';
        }
      }

      // Build the formatted report
      const stepsFormatted = formState.steps
        .map((step, i) => `${i + 1}. ${step}`)
        .join('\n');

      const reportPrompt = `You are a senior QA engineer. Format this bug report professionally in Markdown:

Title: ${title}
Description: ${formState.description}
Steps to Reproduce:
${stepsFormatted}
${formState.pageUrl ? `URL: ${formState.pageUrl}` : ''}
Severity: ${formState.severity}
Browser: ${browser}
OS: ${os}
${formState.screenshotUrl ? 'Screenshot: Attached' : ''}

Format it as a professional bug report with sections for:
- Title (as H1)
- Description
- Steps to Reproduce (numbered list)
- Expected Behavior
- Actual Behavior
- Environment Details
- Severity
- Additional Notes (if applicable)`;

      console.log('Generating bug report...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: reportPrompt,
          input: '', // Empty input is now allowed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data = await response.json();
      // Use 'response' field (your API returns this)
      const formattedReport = data.response || data.result || 'Error generating report';
      setGeneratedReport(formattedReport);

      // Save to database
      await saveBugReport({
        session_id: sessionId,
        title,
        description: formState.description,
        steps_to_reproduce: formState.steps,
        page_url: formState.pageUrl || undefined,
        severity: formState.severity,
        screenshot_url: formState.screenshotUrl || undefined,
        browser,
        os,
        formatted_report: formattedReport,
      });

      toast.success('Bug report generated and saved!');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report. Please try again.');
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedReport) {
      await navigator.clipboard.writeText(generatedReport);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setFormState({
      title: '',
      description: '',
      steps: [],
      pageUrl: '',
      severity: 'medium',
      screenshotFile: null,
      screenshotUrl: '',
    });
    setGeneratedReport('');
    setError(null);
    setAiSuggestion('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Bug Reporter
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Bug Title <span className="text-sm text-muted-foreground">(optional - AI can generate)</span>
              </Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Login button not responding on mobile"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formState.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormState((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe the bug in detail..."
                className="min-h-[120px]"
                disabled={isLoading}
              />
              {aiSuggestion && (
                <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
              )}
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-2">
              <Label>Steps to Reproduce *</Label>
              <StepsInput
                steps={formState.steps}
                onStepsChange={(steps) =>
                  setFormState((prev) => ({ ...prev, steps }))
                }
                disabled={isLoading}
              />
            </div>

            {/* Page URL */}
            <div className="space-y-2">
              <Label htmlFor="pageUrl">Page URL (optional)</Label>
              <Input
                id="pageUrl"
                type="url"
                value={formState.pageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, pageUrl: e.target.value }))
                }
                placeholder="https://example.com/page"
                disabled={isLoading}
              />
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={formState.severity}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') =>
                  setFormState((prev) => ({ ...prev, severity: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label>Screenshot (optional)</Label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                imageUrl={formState.screenshotUrl}
                disabled={isLoading || isUploading}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || isUploading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Output */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Bug Report</h3>
            {generatedReport && (
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {generatedReport ? (
            <CodeBlock code={generatedReport} language="markdown" />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Fill out the form and click "Generate Report"</p>
              <p className="text-sm mt-2">
                AI will create a professional bug report with all the details
              </p>
            </div>
          )}
        </Card>

        {/* Auto-detected Info */}
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-2">Auto-Detected Information</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Browser: {getBrowserInfo()}</p>
            <p>OS: {getOSInfo()}</p>
            <p>Timestamp: {new Date().toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
