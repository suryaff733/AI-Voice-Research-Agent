import { NextRequest, NextResponse } from 'next/server';
import { executeResearch } from '@/lib/researchEngine';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing query parameter' },
        { status: 400 }
      );
    }

    const report = await executeResearch(query);
    return NextResponse.json(report);

  } catch (error: any) {
    console.error('Research API orchestration failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
