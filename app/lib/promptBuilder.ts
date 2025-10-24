// app/lib/promptBuilder.ts

import { TEST_GENERATOR_PROMPTS, BACKEND_TEST_PROMPTS } from './prompts';

export type TestFramework = 'jest' | 'vitest' | 'pytest' | 'go-testing' | 'junit' | 'rspec' | 'phpunit' | 'mocha';
export type ComponentFramework = 'react' | 'vue' | 'svelte';
export type BackendLanguage = 'python' | 'node' | 'go' | 'java' | 'ruby' | 'php';
export type TestingMode = 'frontend' | 'backend';

export function buildTestGeneratorPrompt(
  mode: TestingMode,
  testFramework: TestFramework,
  componentFramework?: ComponentFramework,
  backendLanguage?: BackendLanguage
): string {
  // Backend testing
  if (mode === 'backend' && backendLanguage) {
    const key = `${testFramework}-${backendLanguage}` as keyof typeof BACKEND_TEST_PROMPTS;
    return BACKEND_TEST_PROMPTS[key] || BACKEND_TEST_PROMPTS['pytest-python'];
  }
  
  // Frontend testing
  if (mode === 'frontend' && componentFramework) {
    const key = `${testFramework}-${componentFramework}` as keyof typeof TEST_GENERATOR_PROMPTS;
    return TEST_GENERATOR_PROMPTS[key] || TEST_GENERATOR_PROMPTS['jest-react'];
  }
  
  // Fallback
  return TEST_GENERATOR_PROMPTS['jest-react'];
}