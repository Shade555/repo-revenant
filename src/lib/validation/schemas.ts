import { z } from 'zod';

export const ConfidenceLevelSchema = z.enum(['verified', 'inferred', 'unknown']);

export const EvidenceReferenceSchema = z.object({
  id: z.string(),
  type: z.enum(['commit', 'file', 'issue', 'pr', 'readme', 'manifest', 'release']),
  title: z.string(),
  ref: z.string(),
  url: z.string().optional(),
  snippet: z.string().optional(),
  confidence: ConfidenceLevelSchema,
});

export const CategoryScoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100),
  maxScore: z.number(),
  weight: z.number(),
  verdict: z.string(),
  rationale: z.string(),
});

export const HealthScoreSchema = z.object({
  total: z.number().min(0).max(100),
  status: z.enum([
    'Critical Bitrot',
    'Severe Decay',
    'Moderate Stagnation',
    'Dormant Classic',
    'Preserved',
  ]),
  color: z.string(),
  categories: z.array(CategoryScoreSchema),
  calculationFormula: z.string(),
});

export const TimelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['creation', 'milestone', 'shift', 'abandonment', 'last_pulse']),
  commitSha: z.string().optional(),
  commitUrl: z.string().optional(),
  confidence: ConfidenceLevelSchema,
  evidenceText: z.string().optional(),
});

export const HistorianOutputSchema = z.object({
  creationDate: z.string(),
  lastCommitDate: z.string(),
  dormantDays: z.number(),
  totalCommitsEstimated: z.number(),
  peakActivityYear: z.string(),
  primaryContributors: z.array(
    z.object({
      name: z.string(),
      commits: z.number(),
      avatarUrl: z.string().optional(),
      percentage: z.number(),
    })
  ),
  timeline: z.array(TimelineEventSchema),
  abandonmentSignals: z.array(z.string()),
  historicalSummary: z.string(),
});

export const ArchaeologistOutputSchema = z.object({
  originalIntent: z.string(),
  architectureOverview: z.string(),
  primaryLanguage: z.string(),
  languages: z.array(
    z.object({
      name: z.string(),
      percentage: z.number(),
      color: z.string().optional(),
    })
  ),
  frameworks: z.array(z.string()),
  entryPoints: z.array(
    z.object({
      path: z.string(),
      type: z.string(),
      description: z.string(),
    })
  ),
  directoryStructure: z.array(
    z.object({
      path: z.string(),
      purpose: z.string(),
      health: z.enum(['intact', 'incomplete', 'deprecated']),
    })
  ),
  featureInventory: z.array(
    z.object({
      name: z.string(),
      status: z.enum(['completed', 'partial', 'stub', 'broken']),
      evidence: z.string(),
    })
  ),
  documentationAssessment: z.object({
    score: z.number(),
    readmeQuality: z.enum(['Excellent', 'Adequate', 'Minimal', 'Missing']),
    hasLicense: z.boolean(),
    hasContributingGuide: z.boolean(),
    hasChangelog: z.boolean(),
    strengths: z.array(z.string()),
    missingElements: z.array(z.string()),
  }),
});

export const ExorcistOutputSchema = z.object({
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  summary: z.string(),
  outdatedDependencies: z.array(
    z.object({
      name: z.string(),
      currentVersion: z.string(),
      latestVersion: z.string(),
      risk: z.enum(['High', 'Medium', 'Low']),
      notes: z.string(),
    })
  ),
  todoMarkers: z.array(
    z.object({
      file: z.string(),
      line: z.number(),
      type: z.enum(['TODO', 'FIXME', 'HACK', 'XXX']),
      comment: z.string(),
    })
  ),
  missingConfig: z.array(z.string()),
  testCoverageStatus: z.object({
    hasTests: z.boolean(),
    testFramework: z.string().optional(),
    hasCi: z.boolean(),
    ciPlatform: z.string().optional(),
    notes: z.string(),
  }),
  knownBugsOrIssues: z.array(
    z.object({
      number: z.number(),
      title: z.string(),
      url: z.string(),
      state: z.enum(['open', 'closed']),
      createdDate: z.string(),
    })
  ),
});

export const PriorityTaskSchema = z.object({
  rank: z.number(),
  title: z.string(),
  category: z.enum(['stabilization', 'security', 'modernization', 'feature', 'docs']),
  difficulty: z.enum(['Novice', 'Intermediate', 'Advanced', 'Expert']),
  impact: z.enum(['High', 'Critical', 'Medium']),
  description: z.string(),
  implementationSteps: z.array(z.string()),
  supportingEvidence: z.string(),
});

export const RevivalistOutputSchema = z.object({
  vision: z.string(),
  topPriorities: z.array(PriorityTaskSchema),
  suggestedRoadmap: z.array(
    z.object({
      phase: z.string(),
      title: z.string(),
      timeframe: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  newcomerGuide: z.object({
    summary: z.string(),
    prerequisites: z.array(z.string()),
    setupSteps: z.array(z.string()),
    firstVerificationCommand: z.string(),
    gotchas: z.array(z.string()),
  }),
  goodFirstContributions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      filesToTouch: z.array(z.string()),
    })
  ),
});

export const InvestigateRequestSchema = z.object({
  target: z.string().min(1, 'Target repository is required'),
  forceRefresh: z.boolean().optional(),
});

export const SeanceRequestSchema = z.object({
  dossierId: z.string().min(1),
  question: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});
