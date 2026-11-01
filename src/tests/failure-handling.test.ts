import { test } from 'node:test';
import assert from 'node:assert';
import { OllamaClient } from '../lib/ollama/client';

test('Failure Handling: OllamaClient returns graceful fallback when daemon is offline', async () => {
  // Test with invalid unreachable port
  const client = new OllamaClient();
  // Override baseUrl to test unreachable offline behavior
  (client as unknown as { baseUrl: string }).baseUrl = 'http://127.0.0.1:59999';

  const health = await client.checkHealth();
  assert.strictEqual(health.available, false, 'Should report unavailable');
  assert.ok(health.error?.includes('Could not connect'), 'Should provide helpful setup error message');

  const chatRes = await client.chat([
    { role: 'user', content: 'Hello' }
  ]);
  assert.strictEqual(chatRes.isFallback, true, 'Should mark as fallback');
  assert.ok(chatRes.response.includes('offline'), 'Should provide diagnostic fallback text');
});
