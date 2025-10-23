import { TEST_GENERATOR_PROMPTS } from './prompts';

export type TestFramework = 'jest' | 'vitest';
export type ComponentFramework = 'react' | 'vue' | 'svelte';

export function buildTestGeneratorPrompt(
  testFramework: TestFramework,
  componentFramework: ComponentFramework
): string {
  // Build the key for the prompts object
  const key = `${testFramework}-${componentFramework}` as keyof typeof TEST_GENERATOR_PROMPTS;
  
  // Return the appropriate prompt, fallback to jest-react if not found
  return TEST_GENERATOR_PROMPTS[key] || TEST_GENERATOR_PROMPTS['jest-react'];
}