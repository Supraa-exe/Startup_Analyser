import { NextResponse } from 'next/server';
import { mirofishClient } from '@/lib/mirofish/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenario, stakeholders, strategyVariable, maxRounds } = body;

    if (!scenario || !scenario.name || !scenario.keyAssumption) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory scenario fields' },
        { status: 400 }
      );
    }

    const runId = await mirofishClient.startSimulation(
      scenario,
      stakeholders || [],
      strategyVariable || '15-minute emergency delivery guarantee',
      maxRounds || 10
    );

    return NextResponse.json({
      success: true,
      runId,
      status: 'RUNNING'
    }, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
