import { NextRequest, NextResponse } from 'next/server';
import { BackgroundParser } from '@fight-sim/core/parser/BackgroundParser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { martialArtsHistory } = body;
    
    if (!martialArtsHistory || typeof martialArtsHistory !== 'string') {
      return NextResponse.json(
        { error: 'martialArtsHistory is required' },
        { status: 400 }
      );
    }
    
    const parser = new BackgroundParser();
    const result = parser.parse(martialArtsHistory);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}