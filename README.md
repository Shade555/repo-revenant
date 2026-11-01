# 💀 RepoRevenant

> **"The AI Agent That Brings Abandoned Code Back to Life."**  
> *Some code deserves a second life.*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Week%204-orange?style=flat-square&logo=github)](https://hacktoberfest.com/)
[![Theme: Ghost in the Machine](https://img.shields.io/badge/Theme-Ghost%20in%20the%20Machine-purple?style=flat-square)](https://dev.to)
[![Model: Gemma 3](https://img.shields.io/badge/Model-Gemma%203%20(Open--Weight)-blue?style=flat-square)](https://ai.google.dev/gemma)
[![Orchestrator: Mastra](https://img.shields.io/badge/Orchestrator-Mastra%20AI-emerald?style=flat-square)](https://mastra.ai)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-yellow?style=flat-square)](./LICENSE)

---

## 🏛️ 1. Product Vision

Every day, pioneering software repositories fall dormant. Maintainers move on, companies pivot, and compiler paradigms shift—leaving invaluable architectural wisdom buried beneath layers of bitrot.

**RepoRevenant** is an open-source archaeological AI harness designed for the **Hacktoberfest 2026 Open-Source AI Challenge, Week 4: "Ghost in the Machine"**.

A developer supplies any public GitHub repository URL. A council of specialized autonomous agents investigates the repository's history, architecture, and technical debt, producing a verified **Revival Dossier** and summoning the signature **Developer Séance** to speak directly to the digital phantom of the codebase.

### Core Archaeological Questions Answered:
- **What was this project originally intended to accomplish?**
- **What happened during its development lifecycle?**
- **When and why did development appear to stop?** *(Strictly evidence-backed)*
- **What compiler bitrot, broken dependencies, and technical blockers exist?**
- **Which features remain incomplete or half-implemented?**
- **What are the top 5 highest-priority actions a new maintainer must take?**
- **How can a newcomer clone and verify the project in 10 minutes?**

> **Strict Truth Protocol:** RepoRevenant clearly separates **Verified Observations** (directly cited commit SHAs, file lines, issues), **Reasoned Inferences**, and **Unknown Data**. It never hallucinates personal developer motives.

---

## 🔮 2. The Multi-Agent Council

RepoRevenant is coordinated by **THE SUMMONER**, dispatching specialized agents with distinct data contracts:

```
                      ┌────────────────────────┐
                      │      THE SUMMONER      │
                      │  (Master Orchestrator) │
                      └───────────┬────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
       ┌───────────────────┐             ┌───────────────────┐
       │   THE HISTORIAN   │             │ THE ARCHAEOLOGIST │
       │ (Timeline & Logs) │             │  (AST & Intents)  │
       └─────────┬─────────┘             └─────────┬─────────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  ▼
                         ┌─────────────────┐
                         │   THE EXORCIST  │
                         │ (Bitrot & Debt) │
                         └────────┬────────┘
                                  ▼
                         ┌─────────────────┐
                         │  THE REVIVALIST │
                         │(Strategy & Road)│
                         └────────┬────────┘
                                  ▼
                ┌───────────────────────────────────┐
                │          REVIVAL DOSSIER          │
                │     + THE DEVELOPER SÉANCE        │
                └───────────────────────────────────┘
```

1. **👑 THE SUMMONER**: Validates target repository endpoints, schedules parallel execution pipelines, enforces data contracts, and synthesizes the final report.
2. **📜 THE HISTORIAN**: Reconstructs chronological commit epochs, peak development years, author frequency distribution, and verified abandonment markers.
3. **⛏️ THE ARCHAEOLOGIST**: Explores repository directory trees, package manifests, entry points, and source files to map original author intent vs actual completion.
4. **🔥 THE EXORCIST**: Diagnoses compiler bitrot, obsolete dependency matrices, abandoned `TODO`/`FIXME` comments, and missing CI pipelines—safely without running untrusted code.
5. **✨ THE REVIVALIST**: Turns archaeological evidence into a 3-Phase Resurrection Roadmap, Top 5 Priority Revivals, a 10-Minute Newcomer Guide, and Good First Contributions.

---

## 🕯️ 3. Signature Feature: The Developer Séance

> *"Speak to the Ghost of This Repository."*

After excavation, researchers can enter an interactive retrieval-augmented séance chamber with the codebase's reconstructed persona.

### Inquiry Examples:
- *"Why did this project stop evolving in 2012?"*
- *"What was the original developer trying to accomplish with TTURLMap?"*
- *"What is the single most dangerous technical blocker to running this code today?"*
- *"Explain this project to a new contributor in 3 minutes."*

Every answer features:
- **Confidence Badges**: `VERIFIED OBSERVATION` (Emerald), `REASONED INFERENCE` (Marigold), `UNKNOWN / INSUFFICIENT DATA` (Violet).
- **Direct Citations**: Clickable commit SHAs, file path line numbers, and issue links.
- **Ether Resonance Visualizer**: Audio waveform frequency visualizer matching the eerie digital occult aesthetic.

---

## 🎨 4. Visual Identity & Aesthetic Direction

RepoRevenant rejects generic SaaS dashboards in favor of an **Atmospheric Archaeological Research Station**:
- **Backgrounds**: Abyssal charcoal (`#07090e`, `#0a0d14`).
- **Accents**: Muted ethereal marigold (`#e5a93c`, `#fbbf24`) and ghostly spectral violet (`#8b5cf6`, `#a78bfa`).
- **Phosphors**: Terminal emerald indicators (`#10b981`, `#34d399`).
- **Atmospheric Effects**: Ambient floating spectral canvas embers, CRT scanlines, and an archaeological sonar radar sweep.

---

## ⚡ 5. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Agent Orchestrator**: Mastra AI multi-agent workflow framework.
- **Open-Weight AI**: Gemma 3 (4B parameters) running locally via **Ollama**.
- **Persistence**: MongoDB Atlas (optional for local development).
- **Data Source**: GitHub REST API (supports unauthenticated public analysis or personal access tokens for higher limits).
- **Observability**: Sentry error tracing & agent execution telemetry.

---

## 🚀 6. Quickstart Guide

### Prerequisites:
- **Node.js**: v20+ (tested on Node v24)
- **npm** or **pnpm**
- *(Optional)* **Ollama** with `gemma3:4b` (`ollama run gemma3:4b`)

### 1. Clone the repository:
```bash
git clone https://github.com/Shade555/repo-revenant.git
cd repo-revenant
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Environment configuration:
```bash
cp .env.example .env.local
```

### 4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to begin summoning!

---

## 🏺 7. Pre-Excavated Historical Demonstrations

To experience the harness immediately without configuring local Ollama or GitHub tokens:
- **[Three20 (iOS Framework)](http://localhost:3000/dashboard/dossier-three20-archived)**: Joe Hewitt's pioneering 2009 Facebook iOS library that invented URL routing and photo viewports before being archived in 2012.
- **[mon (C Process Monitor)](http://localhost:3000/dashboard/dossier-mon-archived)**: TJ Holowaychuk's minimalist UNIX supervisor from the early Node.js era before systemd dominance.

---

## 🛡️ 8. Security & Sandbox Guarantees

- **Zero Host Code Execution**: Repository code, test suites, and install scripts are **never** executed on the host.
- **Prompt Injection Defense**: Repository text and comments are treated exclusively as passive evidence data.
- **Privacy First**: Secrets, tokens, and credentials are never stored in databases or exposed in logs.

---

## 📜 9. License

Open-source licensed under the [Apache License 2.0](./LICENSE). Created for the **Hacktoberfest 2026 Open-Source AI Challenge**.
