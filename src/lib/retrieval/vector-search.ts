import { EvidenceReference } from '@/types';

export interface ScoredEvidence {
  evidence: EvidenceReference;
  score: number;
}

/**
 * Lightweight in-memory evidence search index using term frequency,
 * token stemming, and confidence weighting.
 */
export class EvidenceRetriever {
  private evidenceItems: EvidenceReference[] = [];

  constructor(items: EvidenceReference[]) {
    this.evidenceItems = items;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  private getStem(word: string): string {
    // Simple 4-5 letter root stemming (e.g., archival/archived -> archiv)
    if (word.length >= 6) {
      return word.slice(0, 5);
    }
    return word;
  }

  public search(query: string, limit = 4): ScoredEvidence[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return this.evidenceItems.slice(0, limit).map((evidence) => ({ evidence, score: 1 }));
    }

    const queryStems = queryTokens.map((t) => this.getStem(t));

    const scored = this.evidenceItems.map((evidence) => {
      const docText = `${evidence.title} ${evidence.ref} ${evidence.snippet || ''} ${evidence.type}`;
      const docTokens = this.tokenize(docText);
      const docStems = docTokens.map((t) => this.getStem(t));

      let matches = 0;
      for (let i = 0; i < queryTokens.length; i++) {
        const qt = queryTokens[i];
        const qs = queryStems[i];

        if (docTokens.includes(qt)) {
          matches += 3;
        } else if (docStems.includes(qs)) {
          matches += 2;
        } else if (docTokens.some((dt) => dt.includes(qt) || qt.includes(dt))) {
          matches += 1;
        }
      }

      // Prioritize verified items
      const confidenceBonus = evidence.confidence === 'verified' ? 1.5 : 1.0;
      const score = (matches / Math.max(1, queryTokens.length)) * confidenceBonus;

      return { evidence, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
