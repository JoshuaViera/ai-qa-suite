// app/api/test/route.ts

import { NextResponse } from 'next/server';
import { testAIConnection } from '@/app/lib/test-ai';

export async function GET() {
  try {
    const message = await testAIConnection();
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}