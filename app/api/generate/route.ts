import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, input } = await request.json();

    if (!prompt || !input) {
      return NextResponse.json(
        { error: 'Prompt and input are required' },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(prompt, input);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}