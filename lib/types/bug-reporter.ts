/**
 * Bug Reporter Types
 * Type definitions for the Smart Bug Reporter feature
 */

export interface BugReport {
  id?: string;
  session_id: string;
  title: string;
  description: string;
  steps_to_reproduce: string[];
  page_url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  screenshot_url?: string;
  browser?: string;
  os?: string;
  created_at?: string;
  formatted_report: string;
}

export interface BugReporterFormState {
  title: string;
  description: string;
  steps: string[];
  pageUrl: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  screenshotFile: File | null;
  screenshotUrl: string;
}

export interface AIValidationResult {
  isValid: boolean;
  suggestions: string[];
  generatedTitle?: string;
}

export const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-blue-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical', color: 'text-red-600' },
] as const;