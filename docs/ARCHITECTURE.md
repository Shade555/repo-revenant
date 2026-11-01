# RepoRevenant System Architecture

## 1. High-Level Architecture Overview

RepoRevenant is structured as an autonomous, multi-agent archaeological harness designed to investigate inactive software repositories and produce actionable resurrection blueprints.

```
                    ┌────────────────────────────┐
                    │    Researcher Browser      │
                    │   (Next.js App Router)     │
                    └─────────────┬──────────────┘
                                  │ HTTPS / JSON / SSE
                                  ▼
                    ┌────────────────────────────┐
                    │        THE SUMMONER        │
                    │   (Central Orchestrator)   │
                    └─────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  THE HISTORIAN   │    │ THE ARCHAEOLOGIST │    │   THE EXORCIST    │
│ (Git Timelines)  │    │  (AST & Intents)  │    │  (Bitrot & Debt)  │
└────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                        ┌───────────────────┐
                        │  THE REVIVALIST   │
                        │(Strategy & Road)  │
                        └─────────┬─────────┘
                                  │
             ┌────────────────────┴────────────────────┐
             ▼                                         ▼
   ┌───────────────────┐                     ┌───────────────────┐
   │  Revival Dossier  │                     │ Developer Séance  │
   │  (Health Scoring) │                     │ (RAG with Gemma)  │
   └─────────┬─────────┘                     └─────────┬─────────┘
             │                                         │
             └────────────────────┬────────────────────┘
                                  ▼
                    ┌────────────────────────────┐
                    │     Persistence Tier       │
                    │  (MongoDB Atlas / Memory)  │
                    └────────────────────────────┘
```

## 2. Agent Responsibilities & Data Contracts

Each agent operates within strict domain boundaries defined using Zod schemas (`src/lib/validation/schemas.ts`):

### 👑 The Summoner (`src/mastra/agents/summoner.ts`)
- **Role**: Coordinates investigation lifecycle, validates input URLs, retrieves raw GitHub trees, dispatches concurrent agent tasks, aggregates findings, and computes the 0–100 Health Score.
- **Security Guardrail**: Treats all external repository code as untrusted data.

### 📜 The Historian (`src/mastra/agents/historian.ts`)
- **Role**: Reconstructs repository timeline, calculates dormant duration, identifies peak development years, and mines abandonment signals.
- **Evidence Sources**: Git commit log, author timestamps, release tags, and issue closure messages.

### ⛏️ The Archaeologist (`src/mastra/agents/archaeologist.ts`)
- **Role**: Decodes architecture and author intentions.
- **Evidence Sources**: README, package manifests (`package.json`, `Cargo.toml`, etc.), directory hierarchy, entry points.

### 🔥 The Exorcist (`src/mastra/agents/exorcist.ts`)
- **Role**: Diagnoses technical debt, outdated dependencies, and `TODO`/`FIXME` comments without running arbitrary scripts on host.
- **Evidence Sources**: Static manifest parsing, comment regex extraction, CI configuration files.

### ✨ The Revivalist (`src/mastra/agents/revivalist.ts`)
- **Role**: Synthesizes findings into a 3-phase roadmap, Top 5 Priority Revivals, and 10-Minute Newcomer Onboarding Guide.
- **Evidence Sources**: Historian timeline, Archaeologist entry points, and Exorcist debt report.

## 3. The Developer Séance Architecture

The Séance chamber (`src/components/seance/SeanceRoom.tsx` + `src/app/api/seance/route.ts`) implements Retrieval-Augmented Generation (RAG):

1. **User Inquiry**: The researcher poses an archaeological question.
2. **Evidence Retrieval**: `EvidenceRetriever` (`src/lib/retrieval/vector-search.ts`) indexes and ranks the top repository artifacts using token matching and stem similarity.
3. **Inference**: Gemma 3 evaluates the retrieved evidence context and responds under strict truth protocols.
4. **Classification**:
   - `VERIFIED OBSERVATION`: Grounded in explicit commit SHAs, file paths, or issue records.
   - `REASONED INFERENCE`: Deductions based on patterns (e.g. naming conventions, commit frequency).
   - `UNKNOWN / INSUFFICIENT DATA`: Acknowledgment when empirical evidence is missing.

## 4. Transparent Health Scoring Algorithm

The 0–100 Health Score is calculated across 6 weighted dimensions:

$$\text{Total Score} = 0.20 \times \text{Maintenance} + 0.15 \times \text{Docs} + 0.20 \times \text{Dependencies} + 0.15 \times \text{Issues} + 0.15 \times \text{Testing} + 0.15 \times \text{Completeness}$$

Missing data does not automatically cause a total failure; baseline defaults and graceful decay ensure fair evaluations.
