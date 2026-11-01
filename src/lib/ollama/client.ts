/**
 * Local Open-Weight Model Client (Ollama / Gemma 3)
 * Default model: gemma3:4b
 * Sovereign AI - Zero proprietary API dependencies.
 */

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaGenerateResponse {
  response: string;
  done: boolean;
  totalDurationMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  isFallback?: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
    this.model = process.env.OLLAMA_MODEL || 'gemma3:4b';
  }

  public getModelName(): string {
    return this.model;
  }

  public async checkHealth(): Promise<{ available: boolean; error?: string; models?: string[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        return { available: false, error: `Ollama returned HTTP ${res.status}` };
      }

      const data = await res.json();
      const models = Array.isArray(data?.models) ? data.models.map((m: { name: string }) => m.name) : [];
      const hasConfiguredModel = models.some((m: string) => m.startsWith(this.model.split(':')[0]));

      return {
        available: true,
        models,
        error: !hasConfiguredModel
          ? `Ollama is running, but "${this.model}" was not found. Run 'ollama run ${this.model}' to download.`
          : undefined,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        available: false,
        error: `Could not connect to Ollama at ${this.baseUrl}. Start Ollama locally with 'ollama serve' or check network: ${message}`,
      };
    }
  }

  public async chat(
    messages: OllamaChatMessage[],
    temperature = 0.2
  ): Promise<OllamaGenerateResponse> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Ollama returned status ${res.status}`);
      }

      const data = await res.json();
      const duration = Date.now() - startTime;

      return {
        response: data.message?.content || '',
        done: true,
        totalDurationMs: duration,
        promptTokens: data.prompt_eval_count,
        completionTokens: data.eval_count,
      };
    } catch (err: unknown) {
      const duration = Date.now() - startTime;
      const message = err instanceof Error ? err.message : String(err);

      // Graceful fallback response when Ollama is offline
      return {
        response: `[Local Gemma 3 Model Notice]: Ollama at ${this.baseUrl} is currently offline or timed out (${message}). Harness proceeded using grounded deterministic AST and commit archaeology.`,
        done: true,
        totalDurationMs: duration,
        isFallback: true,
      };
    }
  }

  /**
   * Safe JSON extraction from Gemma response
   */
  public async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    fallbackValue: T
  ): Promise<{ data: T; durationMs: number; isFallback: boolean }> {
    const messages: OllamaChatMessage[] = [
      {
        role: 'system',
        content: `${systemPrompt}\n\nIMPORTANT: You must respond ONLY with a valid JSON object matching the requested schema. Do not enclose in markdown blocks, do not include preamble or conversational text.`,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    const result = await this.chat(messages, 0.1);

    if (result.isFallback || !result.response) {
      return { data: fallbackValue, durationMs: result.totalDurationMs || 0, isFallback: true };
    }

    try {
      // Clean possible markdown code fences if model output them
      let cleaned = result.response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      const parsed = JSON.parse(cleaned);
      return { data: parsed as T, durationMs: result.totalDurationMs || 0, isFallback: false };
    } catch {
      return { data: fallbackValue, durationMs: result.totalDurationMs || 0, isFallback: true };
    }
  }
}

export const ollamaClient = new OllamaClient();
