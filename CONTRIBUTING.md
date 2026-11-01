# Contributing to RepoRevenant

Thank you for your interest in contributing to **RepoRevenant** — the open-source AI repository resurrection harness.

This project was created for the **Hacktoberfest 2026 Open-Source AI Challenge, Week 4: "Ghost in the Machine"**.

## Core Philosophy

1. **Truth Over Hallucination**: Agents must strictly distinguish between **Verified Observations** (directly cited in commit SHAs, file paths, and issues), **Reasoned Inferences**, and **Unknown Data**. We never guess why a human developer moved on without empirical evidence.
2. **Sovereignty & Open Weights First**: RepoRevenant defaults to Google's open-weight **Gemma 3** (`gemma3:4b`) via **Ollama**. Closed-source proprietary models are never a mandatory requirement.
3. **Execution Safety**: Repository files are treated strictly as untrusted evidence data. Never execute arbitrary code or package installation scripts from investigated repositories on host machines.

## Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/repo-revenant.git
   cd repo-revenant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run tests:
   ```bash
   npm test
   ```

5. Run linter:
   ```bash
   npm run lint
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Adding or Improving Agents

All specialized agents reside in `src/mastra/agents/`:
- `summoner.ts` — Central orchestrator coordinating parallel branches.
- `historian.ts` — Reconstructs commit epochs, contributor turnover, and abandonment signals.
- `archaeologist.ts` — Analyzes architecture, entry points, language composition, and intent.
- `exorcist.ts` — Diagnoses compiler bitrot, outdated dependencies, and TODO markers safely.
- `revivalist.ts` — Formulates actionable 3-phase roadmaps and newcomer onboarding guides.

Ensure all new tools and agents adhere to typed Zod schemas in `src/lib/validation/schemas.ts`.

## Code Style

- Next.js 16 App Router + React 19 + TypeScript.
- Tailwind CSS v4 for atmospheric styling.
- Framer Motion for subtle, restrained animations.
- Run `npm run lint` and `npm test` before submitting PRs.
