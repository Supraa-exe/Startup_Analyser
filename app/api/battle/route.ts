import { NextResponse } from 'next/server';
import { mirofishClient } from '@/lib/mirofish/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { runAId, strategyBVariable } = body;

    if (!runAId || !strategyBVariable) {
      return NextResponse.json(
        { success: false, error: 'runAId and strategyBVariable are required' },
        { status: 400 }
      );
    }

    const battle = await mirofishClient.runStrategyBattle(runAId, strategyBVariable);

    return NextResponse.json({
      success: true,
      battle
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
