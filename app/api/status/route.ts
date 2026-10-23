import { NextResponse } from 'next/server';
import { mirofishClient } from '@/lib/mirofish/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const runId = searchParams.get('runId');

    if (!runId) {
      return NextResponse.json(
        { success: false, error: 'runId query parameter is required' },
        { status: 400 }
      );
    }

    const state = await mirofishClient.pollRunStatus(runId);
    return NextResponse.json({
      success: true,
      ...state
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
