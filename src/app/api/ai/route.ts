import { NextRequest, NextResponse } from 'next/server';
import { callAI, AIProvider } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { provider, prompt, context } = await request.json();

    if (!provider || !prompt) {
      return NextResponse.json(
        { error: 'Provider and prompt are required' },
        { status: 400 }
      );
    }

    const validProviders: AIProvider[] = ['deepseek', 'openrouter', 'mimo'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    const response = await callAI(provider as AIProvider, prompt, context);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
