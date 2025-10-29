// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, input } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Allow empty input for prompts that don't need it
    const inputText = input || '';
    
    const response = await generateAIResponse(prompt, inputText);
    
    // Return both 'response' and 'result' for compatibility
    return NextResponse.json({ 
      response,
      result: response 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
