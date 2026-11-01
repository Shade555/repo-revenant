import { NextRequest, NextResponse } from 'next/server';
import { SeanceRequestSchema } from '@/lib/validation/schemas';
import { getInvestigation, saveSeanceMessage } from '@/lib/mongodb/client';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';
import { EvidenceRetriever } from '@/lib/retrieval/vector-search';
import { ollamaClient, OllamaChatMessage } from '@/lib/ollama/client';
import { ConfidenceLevel, SeanceMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SeanceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request body' },
        { status: 400 }
      );
    }

    const { dossierId, question, history = [] } = parsed.data;

    // 1. Retrieve the dossier
    let dossier = await getInvestigation(dossierId);
    if (!dossier) {
      dossier = Object.values(SAMPLE_DOSSIERS).find(
        (s) => s.id === dossierId || s.name === dossierId || `${s.owner}/${s.name}` === dossierId
      ) || null;
    }

    if (!dossier) {
      return NextResponse.json({ error: 'Target dossier not found' }, { status: 404 });
    }

    // 2. Retrieve relevant evidence using EvidenceRetriever
    const retriever = new EvidenceRetriever(dossier.evidenceLedger);
    const retrieved = retriever.search(question, 4);
    const citations = retrieved.map((r) => r.evidence);

    // Save user question
    const userMsg: SeanceMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };
    await saveSeanceMessage(dossier.id, userMsg);

    // 3. Construct Grounded Prompt for Gemma 3
    const evidenceContext = citations.length > 0
      ? citations
          .map(
            (c) =>
              `[${c.type.toUpperCase()}] ${c.title} (Ref: ${c.ref}):\n${c.snippet || 'No excerpt available'}`
          )
          .join('\n\n')
      : 'No specific snippet indexed. Rely on overall repository facts.';

    const systemPrompt = `You are the reconstructed digital phantom of the open-source repository "${dossier.owner}/${dossier.name}".
Tagline: "The AI Agent That Brings Abandoned Code Back to Life."
Strict Truth Protocol:
1. Ground your answers strictly in the provided repository facts and evidence citations.
2. NEVER claim to know why the developer abandoned the project unless there is explicit textual evidence in the git log or issues.
3. Clearly distinguish between:
   - VERIFIED: directly supported by repository artifacts.
   - INFERRED: a reasonable interpretation based on multiple observations.
   - UNKNOWN: insufficient evidence.
4. Speak with respectful, atmospheric archaeological tone, but remain technical, concrete, and helpful.

Repository Facts:
- Original Intent: ${dossier.archaeologist.originalIntent}
- Primary Language: ${dossier.archaeologist.primaryLanguage}
- Days Dormant: ${dossier.historian.dormantDays}
- Last Commit Date: ${dossier.historian.lastCommitDate}
- Abandonment Signals: ${dossier.historian.abandonmentSignals.join('; ')}
- Technical Debt Summary: ${dossier.exorcist.summary}
- Top Recommended Action: ${dossier.revivalist.topPriorities[0]?.title || 'Establish automated CI'}

Retrieved Evidence Artifacts:
${evidenceContext}`;

    const chatMessages: OllamaChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ];

    const aiRes = await ollamaClient.chat(chatMessages, 0.25);

    let confidence: ConfidenceLevel = 'inferred';
    const lowerText = aiRes.response.toLowerCase();

    if (
      citations.some((c) => c.confidence === 'verified') &&
      (lowerText.includes('verified') || lowerText.includes('commit') || lowerText.includes('file'))
    ) {
      confidence = 'verified';
    } else if (lowerText.includes('insufficient') || lowerText.includes('unknown') || lowerText.includes('no record')) {
      confidence = 'unknown';
    }

    const botMessage: SeanceMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: aiRes.response,
      timestamp: new Date().toLocaleTimeString(),
      confidence,
      citations,
    };

    // Save assistant reply
    await saveSeanceMessage(dossier.id, botMessage);

    return NextResponse.json({
      success: true,
      message: botMessage,
      isFallback: aiRes.isFallback,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Séance communication failed: ${message}` },
      { status: 500 }
    );
  }
}
