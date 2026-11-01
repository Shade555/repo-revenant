import {
  RevivalistOutput,
  PriorityTask,
  RoadmapPhase,
  NewcomerGuide,
  GoodFirstContribution,
  HistorianOutput,
  ArchaeologistOutput,
  ExorcistOutput,
} from '@/types';
import { ExtractedRepoData } from '@/lib/github/types';
import { ollamaClient } from '@/lib/ollama/client';

export class RevivalistAgent {
  public name = 'The Revivalist';
  public role = 'Turn the investigation into an actionable revival strategy';

  public async investigate(
    data: ExtractedRepoData,
    historian: HistorianOutput,
    archaeologist: ArchaeologistOutput,
    exorcist: ExorcistOutput
  ): Promise<RevivalistOutput> {
    const { metadata } = data;

    // 1. Formulate 5 Highest-Priority Revivals
    const topPriorities: PriorityTask[] = [];

    // Priority 1: Automated CI & Build Verification
    topPriorities.push({
      rank: 1,
      title: 'Scaffold Modern Automated CI Pipeline & Build Harness',
      category: 'stabilization',
      difficulty: 'Novice',
      impact: 'Critical',
      description: 'Establish a GitHub Actions workflow to verify build and test results on every push, halting further silent bitrot.',
      implementationSteps: [
        'Create `.github/workflows/ci.yml`.',
        'Configure build matrix for current LTS language runtimes.',
        'Run existing unit test fixtures in an isolated runner.',
      ],
      supportingEvidence: exorcist.missingConfig.find((c) => c.includes('CI')) || 'Absence of automated testing workflows in repository.',
    });

    // Priority 2: Modernize Outdated Dependencies & Compiler Settings
    if (exorcist.outdatedDependencies.length > 0) {
      const topDep = exorcist.outdatedDependencies[0];
      topPriorities.push({
        rank: 2,
        title: `Upgrade ${topDep.name} to Modern LTS Standards`,
        category: 'modernization',
        difficulty: 'Intermediate',
        impact: 'Critical',
        description: `Migrate ${topDep.name} from ${topDep.currentVersion} to ${topDep.latestVersion} to eliminate security vulnerabilities and deprecated compiler warnings.`,
        implementationSteps: [
          `Audit imports of ${topDep.name} across the codebase.`,
          `Bump version specifier in package manifest.`,
          `Resolve breaking API changes introduced since ${topDep.currentVersion}.`,
        ],
        supportingEvidence: topDep.notes,
      });
    } else {
      topPriorities.push({
        rank: 2,
        title: 'Modernize Compiler Toolchain Flags',
        category: 'modernization',
        difficulty: 'Intermediate',
        impact: 'High',
        description: 'Update build scripts and compiler flags to support 64-bit architectures and strict linting.',
        implementationSteps: [
          'Enable modern compiler flags (`-Wall -Wextra` or equivalent).',
          'Audit pointer sizes and memory alignments.',
        ],
        supportingEvidence: 'Archaeologist finding: build configuration dates to original repository era.',
      });
    }

    // Priority 3: Address Critical TODO / FIXME Comments
    if (exorcist.todoMarkers.length > 0) {
      const topTodo = exorcist.todoMarkers[0];
      topPriorities.push({
        rank: 3,
        title: `Resolve Unfinished Implementation: ${topTodo.file}:${topTodo.line}`,
        category: 'stabilization',
        difficulty: 'Intermediate',
        impact: 'High',
        description: `Complete the flagged incomplete implementation: "${topTodo.comment}".`,
        implementationSteps: [
          `Open ${topTodo.file} at line ${topTodo.line}.`,
          `Refactor the stubbed function to handle edge cases safely.`,
          `Add regression test verifying behavior.`,
        ],
        supportingEvidence: `${topTodo.type} marker at ${topTodo.file}:${topTodo.line}: "${topTodo.comment}"`,
      });
    } else {
      topPriorities.push({
        rank: 3,
        title: 'Expand Unit Test Coverage Across Entry Points',
        category: 'stabilization',
        difficulty: 'Intermediate',
        impact: 'High',
        description: 'Write integration tests covering primary entry points to protect core functionality.',
        implementationSteps: [
          `Target entry point: ${archaeologist.entryPoints[0]?.path || 'main module'}.`,
          'Write parameterized unit tests for primary inputs.',
        ],
        supportingEvidence: 'Archaeologist entry point cataloging.',
      });
    }

    // Priority 4: Documentation & Architecture Overhaul
    topPriorities.push({
      rank: 4,
      title: 'Update README with Modern Quickstart & Architecture Diagram',
      category: 'docs',
      difficulty: 'Novice',
      impact: 'Medium',
      description: 'Replace obsolete installation instructions with verified, modern setup steps and document the directory structure.',
      implementationSteps: [
        'Add prerequisites section specifying modern LTS runtimes.',
        'Document environment configuration variables.',
        'Add a clear ASCII architecture diagram.',
      ],
      supportingEvidence: archaeologist.documentationAssessment.missingElements.join('; ') || 'Documentation quality audit.',
    });

    // Priority 5: Containerization / Reproducible Dev Environment
    topPriorities.push({
      rank: 5,
      title: 'Add Multi-Stage Dockerfile / DevContainer',
      category: 'feature',
      difficulty: 'Novice',
      impact: 'Medium',
      description: 'Provide an isolated, reproducible container environment so any contributor can build the project without local environment friction.',
      implementationSteps: [
        'Write minimal, secure multi-stage Dockerfile.',
        'Provide docker-compose.yml for local debugging.',
        'Verify single-command execution (`docker build`).',
      ],
      supportingEvidence: 'Exorcist audit: Missing containerization configuration.',
    });

    // 2. Formulate 3-Phase Strategic Roadmap
    const suggestedRoadmap: RoadmapPhase[] = [
      {
        phase: 'Phase 1',
        title: 'The Exorcism (Stabilization & Tooling)',
        timeframe: 'Weeks 1-2',
        tasks: [
          'Scaffold GitHub Actions automated CI testing workflow',
          'Upgrade baseline dependencies and compiler flags to modern LTS',
          'Audit and fix highest-risk TODO and FIXME comments',
        ],
      },
      {
        phase: 'Phase 2',
        title: 'Modernization & Decoupling',
        timeframe: 'Weeks 3-4',
        tasks: [
          'Modernize legacy runtime APIs and eliminate deprecation warnings',
          'Decouple core modules from monolithic dependencies',
          'Add comprehensive test fixtures across primary entry points',
        ],
      },
      {
        phase: 'Phase 3',
        title: 'Rebirth & Community Launch',
        timeframe: 'Weeks 5-6',
        tasks: [
          'Publish refreshed documentation and newcomer onboarding guide',
          'Create multi-stage container target for zero-friction evaluation',
          'Cut resurrection release tag on GitHub and invite community contributors',
        ],
      },
    ];

    // 3. Newcomer Onboarding Guide (10 Minutes)
    const newcomerGuide: NewcomerGuide = {
      summary: `To revive ${metadata.name}, start by isolating the build environment. This guide gets you from git clone to a verified local build in under 10 minutes.`,
      prerequisites: [
        `Git 2.40+`,
        `${archaeologist.primaryLanguage} modern toolchain`,
        `Docker (optional, for sandboxed builds)`,
      ],
      setupSteps: [
        `git clone https://github.com/${metadata.full_name}.git`,
        `cd ${metadata.name}`,
        `# Inspect excavated entry points: ${archaeologist.entryPoints.map((e) => e.path).join(', ') || 'root'}`,
      ],
      firstVerificationCommand: archaeologist.primaryLanguage === 'JavaScript' || archaeologist.primaryLanguage === 'TypeScript'
        ? 'npm install && npm test'
        : archaeologist.primaryLanguage === 'Python'
        ? 'pip install -r requirements.txt && pytest'
        : archaeologist.primaryLanguage === 'Rust'
        ? 'cargo test'
        : archaeologist.primaryLanguage === 'Go'
        ? 'go test ./...'
        : 'make test',
      gotchas: [
        `Do not attempt to execute arbitrary unvetted scripts in the repository without inspecting them first.`,
        `Be aware of ${exorcist.outdatedDependencies.length} outdated packages identified during excavation.`,
      ],
    };

    // 4. Good First Contributions
    const goodFirstContributions: GoodFirstContribution[] = [
      {
        title: `Create CONTRIBUTING.md Guidelines`,
        description: `Help future developers by authoring a comprehensive guide on branching, code style, and PR expectations.`,
        filesToTouch: ['CONTRIBUTING.md'],
      },
      {
        title: `Add Automated CI Matrix in .github/workflows/ci.yml`,
        description: `Set up automated GitHub Actions workflow to run on every pull request.`,
        filesToTouch: ['.github/workflows/ci.yml'],
      },
    ];

    // 5. Reconstructed Project Vision
    let vision = `Resurrect ${metadata.name} as a modern, high-performance ${archaeologist.primaryLanguage} tool, preserving the author's original architectural insights while upgrading it to contemporary runtime standards, strict types, and automated testing.`;

    // Attempt AI synthesis via Gemma 3
    try {
      const gemmaPrompt = `You are The Revivalist. Formulate a 2-sentence inspirational vision for resurrecting "${metadata.full_name}".
Original purpose: ${archaeologist.originalIntent}
Primary language: ${archaeologist.primaryLanguage}
Days dormant: ${historian.dormantDays}
Severity of debt: ${exorcist.severity}
Top priority: ${topPriorities[0].title}

State what this project could become if revived today.`;

      const aiRes = await ollamaClient.chat([
        { role: 'system', content: 'You are The Revivalist, an expert software resurrection strategist.' },
        { role: 'user', content: gemmaPrompt },
      ]);

      if (!aiRes.isFallback && aiRes.response && aiRes.response.length > 40) {
        vision = aiRes.response.trim();
      }
    } catch {
      // Retain heuristic vision
    }

    return {
      vision,
      topPriorities,
      suggestedRoadmap,
      newcomerGuide,
      goodFirstContributions,
    };
  }
}

export const revivalistAgent = new RevivalistAgent();
