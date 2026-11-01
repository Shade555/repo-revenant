import { NextRequest, NextResponse } from 'next/server';
import { getInvestigation } from '@/lib/mongodb/client';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing dossier ID' }, { status: 400 });
    }

    // Try DB / cache
    let dossier = await getInvestigation(id);

    // Fallback to sample dossiers
    if (!dossier) {
      dossier = Object.values(SAMPLE_DOSSIERS).find(
        (s) => s.id === id || s.name === id || `${s.owner}/${s.name}` === id
      ) || null;
    }

    if (!dossier) {
      return NextResponse.json({ error: 'Dossier not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, dossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to retrieve dossier: ${message}` },
      { status: 500 }
    );
  }
}
