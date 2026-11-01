import {
  ArchaeologistOutput,
  EntryPoint,
  DirectoryItem,
  FeatureItem,
  LanguageStat,
  DocumentationAssessment,
} from '@/types';
import { ExtractedRepoData } from '@/lib/github/types';
import { ollamaClient } from '@/lib/ollama/client';

export class ArchaeologistAgent {
  public name = 'The Archaeologist';
  public role = 'Understand the repository architecture and original intentions';

  public async investigate(data: ExtractedRepoData): Promise<ArchaeologistOutput> {
    const { metadata, tree, languages, readmeContent, manifestFiles } = data;

    // 1. Language Percentage Breakdown
    const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const languageStats: LanguageStat[] = Object.entries(languages).map(([name, bytes]) => ({
      name,
      percentage: totalLangBytes > 0 ? Math.round((bytes / totalLangBytes) * 1000) / 10 : 0,
      color: this.getLanguageColor(name),
    }));

    if (languageStats.length === 0) {
      languageStats.push({ name: 'Unknown / Text', percentage: 100, color: '#888888' });
    }

    const primaryLanguage = languageStats[0]?.name || 'Unknown';

    // 2. Framework & Runtime Detection
    const frameworks: string[] = [];
    const allManifestsContent = Object.values(manifestFiles).join('\n');

    if (allManifestsContent.includes('react') || tree.some((f) => f.path.includes('react'))) frameworks.push('React');
    if (allManifestsContent.includes('next') || tree.some((f) => f.path.includes('next.config'))) frameworks.push('Next.js');
    if (allManifestsContent.includes('express') || allManifestsContent.includes('koa')) frameworks.push('Node.js / Express');
    if (allManifestsContent.includes('torch') || allManifestsContent.includes('tensorflow')) frameworks.push('PyTorch / ML');
    if (allManifestsContent.includes('django') || allManifestsContent.includes('flask')) frameworks.push('Python Web');
    if (allManifestsContent.includes('tokio') || allManifestsContent.includes('serde')) frameworks.push('Tokio Async Rust');
    if (tree.some((f) => f.path.includes('.xcodeproj') || f.path.includes('.podspec') || f.path.includes('Package.swift'))) frameworks.push('Apple Cocoa / UIKit');
    if (tree.some((f) => f.path === 'Makefile' || f.path.endsWith('.c') || f.path.endsWith('.h'))) frameworks.push('POSIX C / Makefile');
    if (frameworks.length === 0) frameworks.push(primaryLanguage);

    // 3. Application Entry Points
    const entryPoints: EntryPoint[] = [];
    const entryCandidates = [
      { path: 'src/index.ts', type: 'TypeScript Main', description: 'Primary module export' },
      { path: 'src/index.js', type: 'JavaScript Main', description: 'Primary entry point' },
      { path: 'index.js', type: 'Root Entry', description: 'Node.js main script' },
      { path: 'main.py', type: 'Python Main', description: 'Executable script entry point' },
      { path: 'src/main.rs', type: 'Rust Binary', description: 'CLI executable entry' },
      { path: 'main.go', type: 'Go Main', description: 'Go application entry point' },
      { path: 'src/mon.c', type: 'C Core Loop', description: 'Main POSIX supervisor process loop' },
      { path: 'src/Three20/Three20.h', type: 'Objective-C Header', description: 'Umbrella framework import header' },
    ];

    for (const ec of entryCandidates) {
      if (tree.some((f) => f.path === ec.path)) {
        entryPoints.push(ec);
      }
    }

    if (entryPoints.length === 0) {
      const topBlob = tree.find((f) => f.type === 'blob' && !f.path.startsWith('.') && !f.path.includes('/'));
      if (topBlob) {
        entryPoints.push({
          path: topBlob.path,
          type: 'Root File',
          description: 'Primary root source artifact',
        });
      }
    }

    // 4. Directory Structure Anatomy
    const topDirs = new Set<string>();
    for (const f of tree) {
      const parts = f.path.split('/');
      if (parts.length > 1) {
        topDirs.add(parts[0]);
      }
    }

    const directoryStructure: DirectoryItem[] = Array.from(topDirs).slice(0, 8).map((dir) => {
      let purpose = 'Subdirectory containing repository assets';
      let health: DirectoryItem['health'] = 'intact';

      if (/src|source|lib/i.test(dir)) purpose = 'Core source code implementation';
      else if (/test|spec|tests/i.test(dir)) purpose = 'Test harnesses and unit fixtures';
      else if (/doc|docs/i.test(dir)) purpose = 'Project documentation and guides';
      else if (/script|scripts|bin/i.test(dir)) purpose = 'Build, release, and maintenance scripts';
      else if (/example|examples|demo/i.test(dir)) purpose = 'Integration examples and demonstration apps';

      if (/legacy|deprecated|old|archived/i.test(dir)) health = 'deprecated';

      return { path: dir, purpose, health };
    });

    // 5. Documentation Quality Assessment
    const hasReadme = Boolean(readmeContent && readmeContent.length > 50);
    const hasLicense = Boolean(metadata.license);
    const hasContributing = tree.some((f) => /contributing\.(md|txt)$/i.test(f.path));
    const hasChangelog = tree.some((f) => /changelog|history\.(md|txt)$/i.test(f.path));

    let docScore = 30;
    if (hasReadme) docScore += 35;
    if (hasLicense) docScore += 15;
    if (hasContributing) docScore += 10;
    if (hasChangelog) docScore += 10;

    const documentationAssessment: DocumentationAssessment = {
      score: docScore,
      readmeQuality: hasReadme ? (readmeContent!.length > 1500 ? 'Excellent' : 'Adequate') : 'Minimal',
      hasLicense,
      hasContributingGuide: hasContributing,
      hasChangelog,
      strengths: [
        ...(hasReadme ? ['Clear README file present at root'] : []),
        ...(hasLicense ? [`Valid ${metadata.license?.name || 'license'} distributed`] : []),
        ...(hasChangelog ? ['Historical release changelog maintained'] : []),
      ],
      missingElements: [
        ...(!hasContributing ? ['Missing CONTRIBUTING.md guide for new maintainers'] : []),
        ...(!hasLicense ? ['Missing explicit open-source LICENSE file'] : []),
        ...(!hasChangelog ? ['Missing formal CHANGELOG.md'] : []),
      ],
    };

    // 6. Feature Inventory
    const featureInventory: FeatureItem[] = [];
    if (readmeContent) {
      const headingMatches = readmeContent.match(/^#{1,3}\s+(.+)$/gm);
      if (headingMatches) {
        for (const h of headingMatches.slice(0, 5)) {
          const cleanH = h.replace(/^#{1,3}\s+/, '').trim();
          if (!/install|license|author|contribut/i.test(cleanH)) {
            featureInventory.push({
              name: cleanH,
              status: 'completed',
              evidence: `Documented as core capability in README`,
            });
          }
        }
      }
    }

    if (featureInventory.length === 0) {
      featureInventory.push({
        name: 'Core Application Engine',
        status: 'completed',
        evidence: `Primary implementation in ${entryPoints[0]?.path || 'root codebase'}`,
      });
    }

    // 7. Original Intent & Architecture Overview Synthesis
    let originalIntent = metadata.description || `Provide an open-source ${primaryLanguage} library for developers.`;
    let architectureOverview = `The project is structured predominantly in ${primaryLanguage} (${languageStats[0]?.percentage}%), organized around ${directoryStructure.map((d) => d.path).join(', ') || 'root files'}. Core dependencies and build mechanisms are defined in ${Object.keys(manifestFiles).join(', ') || 'standard build configuration'}.`;

    // Attempt AI synthesis via Gemma 3
    try {
      const gemmaPrompt = `Analyze this GitHub repository's architectural structure:
Name: ${metadata.full_name}
Description: ${metadata.description || 'None provided'}
Primary Language: ${primaryLanguage}
Languages: ${languageStats.map((l) => `${l.name} (${l.percentage}%)`).join(', ')}
Frameworks: ${frameworks.join(', ')}
Directory roots: ${directoryStructure.map((d) => d.path).join(', ')}
README excerpt: ${(readmeContent || '').slice(0, 1000)}

Please return two items:
1. Reconstructed Original Intent (2 sentences on what the author sought to solve)
2. Architecture Overview (2 sentences on how the codebase is structured)`;

      const aiRes = await ollamaClient.chat([
        { role: 'system', content: 'You are The Archaeologist, an expert software architecture investigator.' },
        { role: 'user', content: gemmaPrompt },
      ]);

      if (!aiRes.isFallback && aiRes.response && aiRes.response.length > 50) {
        const text = aiRes.response.trim();
        const parts = text.split('\n\n');
        if (parts.length >= 2) {
          originalIntent = parts[0].replace(/^1\.\s*|Original Intent:\s*/i, '').trim();
          architectureOverview = parts[1].replace(/^2\.\s*|Architecture Overview:\s*/i, '').trim();
        } else {
          architectureOverview = text;
        }
      }
    } catch {
      // Retain heuristic overview
    }

    return {
      originalIntent,
      architectureOverview,
      primaryLanguage,
      languages: languageStats,
      frameworks,
      entryPoints,
      directoryStructure,
      featureInventory,
      documentationAssessment,
    };
  }

  private getLanguageColor(lang: string): string {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3572A5',
      Rust: '#dea584',
      Go: '#00ADD8',
      'C++': '#f34b7d',
      C: '#555555',
      'Objective-C': '#438eff',
      Java: '#b07219',
      Ruby: '#701516',
      Shell: '#89e051',
    };
    return colors[lang] || '#8b5cf6';
  }
}

export const archaeologistAgent = new ArchaeologistAgent();
