import { NextResponse } from 'next/server';
import { ollamaClient } from '@/lib/ollama/client';
import { isMongoConfigured } from '@/lib/mongodb/client';

export async function GET() {
  const ollamaHealth = await ollamaClient.checkHealth();
  const mongoConfigured = isMongoConfigured();
  const githubTokenConfigured = Boolean(process.env.GITHUB_TOKEN);

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RepoRevenant AI Repository Resurrection Harness',
    version: '1.0.0',
    hacktoberfest: 'Week 4: Ghost in the Machine',
    components: {
      ollama: {
        configuredModel: ollamaClient.getModelName(),
        available: ollamaHealth.available,
        installedModels: ollamaHealth.models || [],
        warning: ollamaHealth.error,
      },
      mongodb: {
        configured: mongoConfigured,
        mode: mongoConfigured ? 'MongoDB Atlas' : 'In-Memory Persistence Fallback (Active)',
      },
      github: {
        authenticated: githubTokenConfigured,
        rateLimitTier: githubTokenConfigured ? '5,000 req/hr (Token)' : '60 req/hr (Public)',
      },
    },
  });
}
