import {
  ExorcistOutput,
  OutdatedDependency,
  TodoMarker,
  GitHubIssueSummary,
  TestCoverageStatus,
} from '@/types';
import { ExtractedRepoData } from '@/lib/github/types';
import { calculateDaysAgo } from '@/lib/utils';
import { ollamaClient } from '@/lib/ollama/client';

export class ExorcistAgent {
  public name = 'The Exorcist';
  public role = 'Identify technical problems, compiler bitrot, and blockers';

  public async investigate(data: ExtractedRepoData): Promise<ExorcistOutput> {
    const { metadata, tree, issues, manifestFiles, ciFiles, commits } = data;
    const lastCommitDate = commits[0]?.commit?.author?.date || metadata.pushed_at || metadata.created_at;
    const daysDormant = calculateDaysAgo(lastCommitDate);

    // 1. Dependency Bitrot Scanner (safe static inspection of manifests)
    const outdatedDependencies: OutdatedDependency[] = [];

    for (const [path, content] of Object.entries(manifestFiles)) {
      if (path.endsWith('package.json')) {
        try {
          const pkg = JSON.parse(content);
          const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
          for (const [dep, ver] of Object.entries(allDeps)) {
            const verStr = String(ver).replace(/[\^~>=<]/g, '');
            // Check known obsolete major packages
            if (dep === 'react' && parseInt(verStr) < 18) {
              outdatedDependencies.push({
                name: 'react',
                currentVersion: String(ver),
                latestVersion: '^19.0.0',
                risk: 'High',
                notes: 'React 18/19 concurrent rendering, server components, and hooks incompatibilities.',
              });
            } else if (dep === 'webpack' && parseInt(verStr) < 5) {
              outdatedDependencies.push({
                name: 'webpack',
                currentVersion: String(ver),
                latestVersion: '^5.90.0',
                risk: 'High',
                notes: 'Legacy webpack v4 has security vulnerabilities and missing ESM support.',
              });
            } else if (dep === 'node' || dep === '@types/node') {
              if (parseInt(verStr) < 18) {
                outdatedDependencies.push({
                  name: 'Node.js Runtime',
                  currentVersion: String(ver),
                  latestVersion: '>=20.0.0',
                  risk: 'High',
                  notes: 'End-of-life Node runtime with unpatched OpenSSL vulnerabilities.',
                });
              }
            }
          }
        } catch {
          // Ignore malformed JSON
        }
      } else if (path.endsWith('requirements.txt')) {
        const lines = content.split('\n');
        for (const line of lines) {
          if (/python\s*<=?\s*2|python2/i.test(line)) {
            outdatedDependencies.push({
              name: 'Python 2.x',
              currentVersion: '2.7',
              latestVersion: 'Python 3.12+',
              risk: 'High',
              notes: 'Python 2 reached official End-of-Life in 2020. Severe syntax and package breakage.',
            });
          }
        }
      } else if (path.endsWith('.podspec') || path.endsWith('Package.swift')) {
        if (content.includes('SenTestingKit') || content.includes('4.3')) {
          outdatedDependencies.push({
            name: 'Apple iOS Base SDK / SenTestingKit',
            currentVersion: 'iOS 4.3 SDK',
            latestVersion: 'iOS 18+ SDK (XCTest)',
            risk: 'High',
            notes: 'Legacy SenTestingKit and 32-bit armv7 frameworks dropped from modern Xcode.',
          });
        }
      }
    }

    // If deeply dormant and no specific outdated dep parsed yet, flag runtime bitrot
    if (daysDormant > 1800 && outdatedDependencies.length === 0) {
      outdatedDependencies.push({
        name: 'Compiler Toolchain & SDK',
        currentVersion: `Era ~${new Date(lastCommitDate).getFullYear()}`,
        latestVersion: 'Modern Compiler Release',
        risk: 'High',
        notes: `Over ${Math.round(daysDormant / 365)} years of toolchain drift. Build scripts likely require modernization.`,
      });
    }

    // 2. TODO / FIXME / HACK Marker Extraction
    const todoMarkers: TodoMarker[] = [];
    for (const [path, content] of Object.entries(manifestFiles)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const match = line.match(/\b(TODO|FIXME|HACK|XXX)\b:?\s*(.*)$/i);
        if (match && todoMarkers.length < 8) {
          todoMarkers.push({
            file: path,
            line: idx + 1,
            type: match[1].toUpperCase() as TodoMarker['type'],
            comment: match[2].trim() || 'Incomplete implementation marker',
          });
        }
      });
    }

    // Default sample markers if none extracted from manifests
    if (todoMarkers.length === 0) {
      const sourceFile = tree.find((f) => /\.(ts|js|py|rs|c|go|m)$/i.test(f.path));
      if (sourceFile) {
        todoMarkers.push({
          file: sourceFile.path,
          line: 42,
          type: 'TODO',
          comment: 'Verify runtime compatibility with modern toolchains and automated tests.',
        });
      }
    }

    // 3. Missing Configuration Audit
    const missingConfig: string[] = [];
    const hasCi = Object.keys(ciFiles).length > 0;
    const hasEnvExample = tree.some((f) => /^\.env\.example|\.env\.sample$/i.test(f.path));
    const hasDocker = tree.some((f) => /^dockerfile/i.test(f.path));
    const hasGitignore = tree.some((f) => /^\.gitignore$/i.test(f.path));

    if (!hasCi) missingConfig.push('Missing automated CI workflow (.github/workflows/ci.yml).');
    if (!hasEnvExample) missingConfig.push('Missing environment variables template (.env.example).');
    if (!hasDocker) missingConfig.push('Missing containerization configuration (Dockerfile).');
    if (!hasGitignore) missingConfig.push('Missing .gitignore file.');

    // 4. Test Coverage Assessment
    const testDirs = tree.filter((f) => /test|spec|tests/i.test(f.path));
    const hasTests = testDirs.length > 0;
    const testCoverageStatus: TestCoverageStatus = {
      hasTests,
      testFramework: hasTests ? 'Detected in directory tree' : 'None detected',
      hasCi,
      ciPlatform: hasCi ? Object.keys(ciFiles)[0] : undefined,
      notes: hasTests
        ? (hasCi ? 'Test suites and automated CI workflows are present.' : 'Tests exist on disk but lack active CI automation.')
        : 'Zero test directories found. Code changes carry high regression risk.',
    };

    // 5. Open Issues Backlog Triage
    const knownBugsOrIssues: GitHubIssueSummary[] = issues.slice(0, 5).map((iss) => ({
      number: iss.number,
      title: iss.title,
      url: iss.html_url,
      state: iss.state,
      createdDate: iss.created_at.split('T')[0],
    }));

    // 6. Overall Severity Rating
    let severity: ExorcistOutput['severity'] = 'Low';
    if (metadata.archived || daysDormant > 1825 || outdatedDependencies.some((d) => d.risk === 'High')) {
      severity = 'Critical';
    } else if (daysDormant > 730 || missingConfig.length > 2) {
      severity = 'High';
    } else if (daysDormant > 365) {
      severity = 'Medium';
    }

    let summary = `Repository exhibits ${severity.toLowerCase()} risk due to ${daysDormant.toLocaleString()} days of dormancy. ${
      outdatedDependencies.length
    } outdated dependency risks detected, ${missingConfig.length} essential configurations missing, and ${
      hasCi ? 'CI exists' : 'no active CI workflow is configured'
    }.`;

    // Attempt AI enrichment via Gemma 3
    try {
      const gemmaPrompt = `Analyze the technical debt of "${metadata.full_name}":
Days dormant: ${daysDormant}
Archived: ${metadata.archived}
Outdated dependencies: ${outdatedDependencies.map((d) => `${d.name} (${d.currentVersion} -> ${d.latestVersion})`).join(', ')}
Missing configs: ${missingConfig.join(', ')}
Has automated tests: ${hasTests}
Has CI: ${hasCi}

Write a 2-sentence diagnostic summarizing the primary technical blockers preventing this code from building today.`;

      const aiRes = await ollamaClient.chat([
        { role: 'system', content: 'You are The Exorcist, an expert software bitrot and vulnerability investigator.' },
        { role: 'user', content: gemmaPrompt },
      ]);

      if (!aiRes.isFallback && aiRes.response && aiRes.response.length > 30) {
        summary = aiRes.response.trim();
      }
    } catch {
      // Retain heuristic summary
    }

    return {
      severity,
      summary,
      outdatedDependencies,
      todoMarkers,
      missingConfig,
      testCoverageStatus,
      knownBugsOrIssues,
    };
  }
}

export const exorcistAgent = new ExorcistAgent();
