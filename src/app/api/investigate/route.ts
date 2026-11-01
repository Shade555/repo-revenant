import { NextRequest, NextResponse } from 'next/server';
import { InvestigateRequestSchema } from '@/lib/validation/schemas';
import { summonerOrchestrator } from '@/mastra/agents/summoner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InvestigateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid target repository format',
        },
        { status: 400 }
      );
    }

    const { target } = parsed.data;

    // Run the multi-agent investigation harness
    const result = await summonerOrchestrator.orchestrateInvestigation(target);

    if (!result.success || !result.dossier) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Investigation failed to complete',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      dossierId: result.dossier.id,
      dossier: result.dossier,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: `Internal harness orchestration error: ${message}`,
      },
      { status: 500 }
    );
  }
}
