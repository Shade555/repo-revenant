import { DossierReport, AgentExecutionRecord, EvidenceReference } from '@/types';
import { parseAndValidateGithubTarget } from '@/lib/validation/url';
import { githubClient } from '@/lib/github/client';
import { historianAgent } from './historian';
import { archaeologistAgent } from './archaeologist';
import { exorcistAgent } from './exorcist';
import { revivalistAgent } from './revivalist';
import { calculateRepositoryHealth } from '@/lib/scoring/health-calculator';
import { saveInvestigation, getInvestigation } from '@/lib/mongodb/client';
import { ollamaClient } from '@/lib/ollama/client';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';

export class SummonerOrchestrator {
  public name = 'The Summoner';
  public role = 'Master Multi-Agent Orchestrator';

  public async orchestrateInvestigation(
    rawTarget: string,
    onProgress?: (agent: string, phase: string, message: string) => void
  ): Promise<{ success: boolean; dossier?: DossierReport; error?: string }> {
    const startTime = Date.now();
    const model = `${ollamaClient.getModelName()} (via Ollama)`;
    const executionRecords: AgentExecutionRecord[] = [];

    // Step 1: Validate repository URL / target
    const validation = parseAndValidateGithubTarget(rawTarget);
    if (!validation.success || !validation.target) {
      return { success: false, error: validation.error || 'Invalid target format' };
    }

    const { owner, repo, cleanUrl } = validation.target;
    const targetKey = `${owner}/${repo}`.toLowerCase();

    onProgress?.('SUMMONER', 'VALIDATE', `Target validated: ${owner}/${repo}`);

    // Check if already in cache or database
    const existing = await getInvestigation(targetKey);
    if (existing && !existing.isDemo) {
      onProgress?.('SUMMONER', 'CACHE_HIT', `Retrieved existing excavation dossier #${existing.id}`);
      return { success: true, dossier: existing };
    }

    // Step 2 & 3: Extract repository artifacts from GitHub
    onProgress?.('SUMMONER', 'FETCH_META', `Connecting to GitHub API for ${owner}/${repo}...`);
    const summonerStart = Date.now();

    const extraction = await githubClient.extractRepositoryArtifacts(owner, repo);

    // If API returned fallback notice or failed, check if it's one of our rich sample repositories
    if (!extraction.data) {
      const sampleMatch = Object.values(SAMPLE_DOSSIERS).find(
        (s) => s.owner.toLowerCase() === owner.toLowerCase() && s.name.toLowerCase() === repo.toLowerCase()
      );

      if (sampleMatch) {
        onProgress?.('SUMMONER', 'DEMO_FALLBACK', `Loaded verified archaeological demonstration dossier.`);
        await saveInvestigation(sampleMatch);
        return { success: true, dossier: sampleMatch };
      }

      return {
        success: false,
        error: extraction.error || 'Unable to retrieve repository data from GitHub API.',
      };
    }

    const repoData = extraction.data;

    executionRecords.push({
      agentName: 'The Summoner',
      status: 'completed',
      startedAt: new Date(summonerStart).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - summonerStart,
      model,
      summary: `Validated target, extracted ${repoData.commits.length} commits and ${repoData.tree.length} tree nodes from GitHub.`,
      evidenceItemsCount: repoData.tree.length,
    });

    // Step 4 & 5: Run Historian and Archaeologist in parallel
    onProgress?.('SUMMONER', 'PARALLEL_DISPATCH', `Dispatching concurrent excavation branches to Historian and Archaeologist.`);

    const histStart = Date.now();
    const archStart = Date.now();

    const [historianResult, archaeologistResult] = await Promise.all([
      (async () => {
        onProgress?.('HISTORIAN', 'TIMELINE_MINE', `Excavating commit logs, release tags, and author turnover.`);
        const res = await historianAgent.investigate(repoData);
        onProgress?.('HISTORIAN', 'COMPLETE', `Reconstructed ${res.timeline.length} epochs and ${res.abandonmentSignals.length} abandonment signals.`);
        return res;
      })(),
      (async () => {
        onProgress?.('ARCHAEOLOGIST', 'AST_EXPLORE', `Parsing directory tree, manifests, and primary entry points.`);
        const res = await archaeologistAgent.investigate(repoData);
        onProgress?.('ARCHAEOLOGIST', 'COMPLETE', `Mapped ${res.languages.length} languages, ${res.entryPoints.length} entry points, and original intent.`);
        return res;
      })(),
    ]);

    executionRecords.push({
      agentName: 'The Historian',
      status: 'completed',
      startedAt: new Date(histStart).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - histStart,
      model,
      summary: `Reconstructed timeline with ${historianResult.timeline.length} milestones and identified ${historianResult.abandonmentSignals.length} abandonment signals.`,
      evidenceItemsCount: historianResult.timeline.length,
    });

    executionRecords.push({
      agentName: 'The Archaeologist',
      status: 'completed',
      startedAt: new Date(archStart).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - archStart,
      model,
      summary: `Audited ${archaeologistResult.directoryStructure.length} directories, ${archaeologistResult.entryPoints.length} entry points, and documentation.`,
      evidenceItemsCount: archaeologistResult.entryPoints.length + archaeologistResult.directoryStructure.length,
    });

    // Step 6: Run Exorcist (Technical Debt & Bitrot Hunter)
    onProgress?.('EXORCIST', 'BITROT_AUDIT', `Scanning for outdated dependencies, unfinished TODO markers, and missing CI.`);
    const exorStart = Date.now();
    const exorcistResult = await exorcistAgent.investigate(repoData);
    onProgress?.('EXORCIST', 'COMPLETE', `Isolated ${exorcistResult.outdatedDependencies.length} package risks and ${exorcistResult.todoMarkers.length} TODO markers.`);

    executionRecords.push({
      agentName: 'The Exorcist',
      status: 'completed',
      startedAt: new Date(exorStart).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - exorStart,
      model,
      summary: `Detected ${exorcistResult.severity} debt severity with ${exorcistResult.outdatedDependencies.length} package warnings.`,
      evidenceItemsCount: exorcistResult.outdatedDependencies.length + exorcistResult.todoMarkers.length,
    });

    // Step 7: Pass findings to Revivalist
    onProgress?.('REVIVALIST', 'BLUEPRINT_SYNTHESIS', `Synthesizing 3-phase resurrection roadmap and Top 5 Priority Revivals.`);
    const revStart = Date.now();
    const revivalistResult = await revivalistAgent.investigate(
      repoData,
      historianResult,
      archaeologistResult,
      exorcistResult
    );
    onProgress?.('REVIVALIST', 'COMPLETE', `Generated 5 prioritized fixes and a 10-minute newcomer onboarding guide.`);

    executionRecords.push({
      agentName: 'The Revivalist',
      status: 'completed',
      startedAt: new Date(revStart).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - revStart,
      model,
      summary: `Formulated 3-phase roadmap with ${revivalistResult.topPriorities.length} prioritized tasks.`,
      evidenceItemsCount: revivalistResult.topPriorities.length,
    });

    // Step 8: Calculate transparent Health Score
    const healthScore = calculateRepositoryHealth(
      repoData,
      exorcistResult.todoMarkers.length,
      exorcistResult.outdatedDependencies.length
    );

    // Step 9: Assemble Grounded Evidence Ledger
    const evidenceLedger: EvidenceReference[] = [];

    // Add first/last commit evidence
    if (repoData.commits[0]) {
      evidenceLedger.push({
        id: `ev-commit-last`,
        type: 'commit',
        title: `Last recorded commit (${repoData.commits[0].sha.slice(0, 7)})`,
        ref: repoData.commits[0].sha,
        url: repoData.commits[0].html_url,
        snippet: repoData.commits[0].commit.message,
        confidence: 'verified',
      });
    }

    // Add manifest evidence
    Object.entries(repoData.manifestFiles).forEach(([filePath, content], idx) => {
      evidenceLedger.push({
        id: `ev-manifest-${idx}`,
        type: 'manifest',
        title: `Package configuration: ${filePath}`,
        ref: filePath,
        snippet: content.slice(0, 300),
        confidence: 'verified',
      });
    });

    // Add TODO markers evidence
    exorcistResult.todoMarkers.slice(0, 3).forEach((todo, idx) => {
      evidenceLedger.push({
        id: `ev-todo-${idx}`,
        type: 'file',
        title: `${todo.type} comment in ${todo.file}`,
        ref: `${todo.file}:${todo.line}`,
        snippet: todo.comment,
        confidence: 'verified',
      });
    });

    // Step 10: Generate structured Revival Dossier
    const dossierId = `dossier-${owner}-${repo}-${Date.now().toString(36)}`;
    const dossier: DossierReport = {
      id: dossierId,
      repoUrl: cleanUrl,
      owner,
      name: repo,
      description: repoData.metadata.description || 'Open source software repository',
      stars: repoData.metadata.stargazers_count,
      forks: repoData.metadata.forks_count,
      openIssues: repoData.metadata.open_issues_count,
      license: repoData.metadata.license?.name || 'No formal license detected',
      createdAt: repoData.metadata.created_at,
      analyzedAt: new Date().toISOString(),
      healthScore,
      historian: historianResult,
      archaeologist: archaeologistResult,
      exorcist: exorcistResult,
      revivalist: revivalistResult,
      evidenceLedger,
      executionRecords,
    };

    // Step 11: Persist investigation to MongoDB or in-memory
    await saveInvestigation(dossier);

    onProgress?.('SUMMONER', 'DONE', `Revival Dossier synthesized successfully in ${Date.now() - startTime}ms.`);

    return { success: true, dossier };
  }
}

export const summonerOrchestrator = new SummonerOrchestrator();
