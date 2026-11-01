export type ConfidenceLevel = 'verified' | 'inferred' | 'unknown';

export interface EvidenceReference {
  id: string;
  type: 'commit' | 'file' | 'issue' | 'pr' | 'readme' | 'manifest' | 'release';
  title: string;
  ref: string;
  url?: string;
  snippet?: string;
  confidence: ConfidenceLevel;
}

export interface CategoryScore {
  id: string;
  name: string;
  score: number; // 0-100
  maxScore: number;
  weight: number;
  verdict: string;
  rationale: string;
}

export interface HealthScore {
  total: number; // 0-100
  status: 'Critical Bitrot' | 'Severe Decay' | 'Moderate Stagnation' | 'Dormant Classic' | 'Preserved';
  color: string;
  categories: CategoryScore[];
  calculationFormula: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'creation' | 'milestone' | 'shift' | 'abandonment' | 'last_pulse';
  commitSha?: string;
  commitUrl?: string;
  confidence: ConfidenceLevel;
  evidenceText?: string;
}

export interface ContributorStat {
  name: string;
  commits: number;
  avatarUrl?: string;
  percentage: number;
}

export interface HistorianOutput {
  creationDate: string;
  lastCommitDate: string;
  dormantDays: number;
  totalCommitsEstimated: number;
  peakActivityYear: string;
  primaryContributors: ContributorStat[];
  timeline: TimelineEvent[];
  abandonmentSignals: string[];
  historicalSummary: string;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color?: string;
}

export interface EntryPoint {
  path: string;
  type: string;
  description: string;
}

export interface DirectoryItem {
  path: string;
  purpose: string;
  health: 'intact' | 'incomplete' | 'deprecated';
}

export interface FeatureItem {
  name: string;
  status: 'completed' | 'partial' | 'stub' | 'broken';
  evidence: string;
}

export interface DocumentationAssessment {
  score: number;
  readmeQuality: 'Excellent' | 'Adequate' | 'Minimal' | 'Missing';
  hasLicense: boolean;
  hasContributingGuide: boolean;
  hasChangelog: boolean;
  strengths: string[];
  missingElements: string[];
}

export interface ArchaeologistOutput {
  originalIntent: string;
  architectureOverview: string;
  primaryLanguage: string;
  languages: LanguageStat[];
  frameworks: string[];
  entryPoints: EntryPoint[];
  directoryStructure: DirectoryItem[];
  featureInventory: FeatureItem[];
  documentationAssessment: DocumentationAssessment;
}

export interface OutdatedDependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  risk: 'High' | 'Medium' | 'Low';
  notes: string;
}

export interface TodoMarker {
  file: string;
  line: number;
  type: 'TODO' | 'FIXME' | 'HACK' | 'XXX';
  comment: string;
}

export interface TestCoverageStatus {
  hasTests: boolean;
  testFramework?: string;
  hasCi: boolean;
  ciPlatform?: string;
  notes: string;
}

export interface GitHubIssueSummary {
  number: number;
  title: string;
  url: string;
  state: 'open' | 'closed';
  createdDate: string;
}

export interface ExorcistOutput {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  summary: string;
  outdatedDependencies: OutdatedDependency[];
  todoMarkers: TodoMarker[];
  missingConfig: string[];
  testCoverageStatus: TestCoverageStatus;
  knownBugsOrIssues: GitHubIssueSummary[];
}

export interface PriorityTask {
  rank: number;
  title: string;
  category: 'stabilization' | 'security' | 'modernization' | 'feature' | 'docs';
  difficulty: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  impact: 'High' | 'Critical' | 'Medium';
  description: string;
  implementationSteps: string[];
  supportingEvidence: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  timeframe: string;
  tasks: string[];
}

export interface NewcomerGuide {
  summary: string;
  prerequisites: string[];
  setupSteps: string[];
  firstVerificationCommand: string;
  gotchas: string[];
}

export interface GoodFirstContribution {
  title: string;
  description: string;
  filesToTouch: string[];
}

export interface RevivalistOutput {
  vision: string;
  topPriorities: PriorityTask[];
  suggestedRoadmap: RoadmapPhase[];
  newcomerGuide: NewcomerGuide;
  goodFirstContributions: GoodFirstContribution[];
}

export interface AgentExecutionRecord {
  agentName: 'The Summoner' | 'The Historian' | 'The Archaeologist' | 'The Exorcist' | 'The Revivalist';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  model: string;
  tokensUsed?: number;
  summary: string;
  evidenceItemsCount: number;
}

export interface DossierReport {
  id: string;
  repoUrl: string;
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  license: string;
  createdAt: string;
  analyzedAt: string;
  healthScore: HealthScore;
  historian: HistorianOutput;
  archaeologist: ArchaeologistOutput;
  exorcist: ExorcistOutput;
  revivalist: RevivalistOutput;
  evidenceLedger: EvidenceReference[];
  executionRecords: AgentExecutionRecord[];
  isDemo?: boolean;
}

export interface SeanceMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  confidence?: ConfidenceLevel;
  citations?: EvidenceReference[];
  inferredCaveat?: string;
}

export interface InvestigationLog {
  id: string;
  timestamp: string;
  agent: 'SUMMONER' | 'HISTORIAN' | 'ARCHAEOLOGIST' | 'EXORCIST' | 'REVIVALIST';
  phase: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'evidence';
}
