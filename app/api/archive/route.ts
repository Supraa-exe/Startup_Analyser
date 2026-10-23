import { NextResponse } from 'next/server';
import { archiveStore } from '@/lib/persistence/archive_store';

export async function GET() {
  try {
    const runs = await archiveStore.listRuns();
    const battles = await archiveStore.listBattles();
    return NextResponse.json({
      success: true,
      runs,
      battles
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
