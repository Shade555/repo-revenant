import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  });
}

export function captureHarnessError(err: unknown, context?: Record<string, unknown>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  } else {
    console.error('[RepoRevenant Harness Error]:', err, context);
  }
}

export function traceAgentSpan<T>(
  agentName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  return fn().finally(() => {
    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Agent Telemetry] ${agentName} executed in ${duration}ms`);
    }
  });
}
