import { CategoryScore, HealthScore } from '@/types';
import { ExtractedRepoData } from '@/lib/github/types';
import { calculateDaysAgo } from '@/lib/utils';

export function calculateRepositoryHealth(
  data: ExtractedRepoData,
  todoCount: number,
  outdatedDepCount: number
): HealthScore {
  const { metadata, commits, tree, readmeContent, ciFiles } = data;

  // 1. Maintenance Activity (Weight 0.20)
  const lastCommitDate = commits[0]?.commit?.author?.date || metadata.pushed_at || metadata.created_at;
  const daysDormant = calculateDaysAgo(lastCommitDate);

  let maintenanceScore = 100;
  let maintenanceVerdict = 'Active and Maintained';
  if (daysDormant > 3650) { // > 10 years
    maintenanceScore = 5;
    maintenanceVerdict = 'Deeply Dormant Decade';
  } else if (daysDormant > 1825) { // > 5 years
    maintenanceScore = 15;
    maintenanceVerdict = 'Long-Term Dormancy';
  } else if (daysDormant > 730) { // > 2 years
    maintenanceScore = 35;
    maintenanceVerdict = 'Prolonged Stagnation';
  } else if (daysDormant > 365) { // > 1 year
    maintenanceScore = 55;
    maintenanceVerdict = 'Inactive Over 1 Year';
  } else if (daysDormant > 180) {
    maintenanceScore = 75;
    maintenanceVerdict = 'Slightly Inactive';
  }

  if (metadata.archived) {
    maintenanceScore = Math.min(maintenanceScore, 10);
    maintenanceVerdict = 'Officially Archived by Owner';
  }

  // 2. Documentation Quality (Weight 0.15)
  let docScore = 40; // Base score
  const hasReadme = Boolean(readmeContent && readmeContent.length > 50);
  const readmeLength = readmeContent?.length || 0;
  const hasLicense = Boolean(metadata.license);
  const hasContributing = tree.some((f) => /contributing\.(md|txt)$/i.test(f.path));
  const hasChangelog = tree.some((f) => /changelog|history\.(md|txt)$/i.test(f.path));

  if (hasReadme) docScore += Math.min(30, Math.floor(readmeLength / 200));
  if (hasLicense) docScore += 15;
  if (hasContributing) docScore += 10;
  if (hasChangelog) docScore += 5;
  docScore = Math.min(100, Math.max(10, docScore));

  const docVerdict =
    docScore >= 80 ? 'Comprehensive Documentation' : docScore >= 50 ? 'Adequate Reference Docs' : 'Sparse Documentation';

  // 3. Dependency Health (Weight 0.20)
  let depScore = 80;
  if (outdatedDepCount > 10) depScore = 20;
  else if (outdatedDepCount > 5) depScore = 40;
  else if (outdatedDepCount > 2) depScore = 60;
  else if (outdatedDepCount === 0) depScore = 90;

  if (daysDormant > 1825) {
    depScore = Math.min(depScore, 35); // Long dormancy implies severe bitrot
  }

  const depVerdict =
    depScore >= 75 ? 'Clean Modern Runtime' : depScore >= 45 ? 'Moderate Version Decay' : 'Severe Bitrot & Deprecations';

  // 4. Issue Management (Weight 0.15)
  const openCount = metadata.open_issues_count;
  let issueScore = 60;
  if (openCount > 200) issueScore = 25;
  else if (openCount > 50) issueScore = 45;
  else if (openCount > 10) issueScore = 65;
  else issueScore = 85;

  const issueVerdict =
    issueScore >= 70 ? 'Controlled Issue Queue' : issueScore >= 40 ? 'Stale Issue Backlog' : 'Unresolved Issue Graveyard';

  // 5. Testing & CI Rigor (Weight 0.15)
  let testScore = 25;
  const hasCiWorkflows = Object.keys(ciFiles).length > 0;
  const hasTestsDir = tree.some((f) => /test|spec|tests|t\//i.test(f.path));

  if (hasTestsDir) testScore += 40;
  if (hasCiWorkflows) testScore += 35;
  testScore = Math.min(100, testScore);

  const testVerdict =
    testScore >= 70 ? 'Modern Automated CI & Tests' : testScore >= 40 ? 'Legacy Test Suite' : 'No Automated Tests Found';

  // 6. Project Completeness (Weight 0.15)
  let completenessScore = 70;
  if (todoCount > 15) completenessScore -= 25;
  else if (todoCount > 5) completenessScore -= 10;

  if (tree.length > 50) completenessScore += 15;
  else if (tree.length < 5) completenessScore -= 20;
  completenessScore = Math.min(100, Math.max(20, completenessScore));

  const completenessVerdict =
    completenessScore >= 75 ? 'Feature-Complete Baseline' : 'Incomplete Prototypes or Stubs Detected';

  const categories: CategoryScore[] = [
    {
      id: 'maintenance',
      name: 'Maintenance Activity',
      score: maintenanceScore,
      maxScore: 100,
      weight: 0.2,
      verdict: maintenanceVerdict,
      rationale: `Last commit was recorded ${daysDormant.toLocaleString()} days ago.${
        metadata.archived ? ' Repository is in official archived state.' : ''
      }`,
    },
    {
      id: 'documentation',
      name: 'Documentation Quality',
      score: docScore,
      maxScore: 100,
      weight: 0.15,
      verdict: docVerdict,
      rationale: `README detected (${readmeLength.toLocaleString()} chars). License: ${
        hasLicense ? metadata.license?.name : 'Missing'
      }. Contributing guide: ${hasContributing ? 'Present' : 'Missing'}.`,
    },
    {
      id: 'dependencies',
      name: 'Dependency Health',
      score: depScore,
      maxScore: 100,
      weight: 0.2,
      verdict: depVerdict,
      rationale: `${outdatedDepCount} outdated or vulnerable packages identified relative to modern runtime ecosystem standards.`,
    },
    {
      id: 'issues',
      name: 'Issue Management',
      score: issueScore,
      maxScore: 100,
      weight: 0.15,
      verdict: issueVerdict,
      rationale: `${openCount} open issue threads recorded on GitHub.`,
    },
    {
      id: 'testing',
      name: 'Testing & CI Rigor',
      score: testScore,
      maxScore: 100,
      weight: 0.15,
      verdict: testVerdict,
      rationale: `Automated CI workflows: ${hasCiWorkflows ? 'Detected' : 'None'}. Dedicated test suites: ${
        hasTestsDir ? 'Found in directory tree' : 'None detected'
      }.`,
    },
    {
      id: 'completeness',
      name: 'Project Completeness',
      score: completenessScore,
      maxScore: 100,
      weight: 0.15,
      verdict: completenessVerdict,
      rationale: `Excavated ${tree.length} tree nodes and flagged ${todoCount} unfinished TODO/FIXME markers.`,
    },
  ];

  const total = Math.round(
    categories.reduce((acc, cat) => acc + cat.score * cat.weight, 0)
  );

  let status: HealthScore['status'] = 'Moderate Stagnation';
  let color = '#fbbf24';

  if (total >= 75) {
    status = 'Preserved';
    color = '#10b981';
  } else if (total >= 50) {
    status = 'Dormant Classic';
    color = '#fbbf24';
  } else if (total >= 30) {
    status = 'Severe Decay';
    color = '#f97316';
  } else {
    status = 'Critical Bitrot';
    color = '#ef4444';
  }

  return {
    total,
    status,
    color,
    categories,
    calculationFormula:
      'Weighted score = (Maintenance × 0.20) + (Docs × 0.15) + (Dependencies × 0.20) + (Issues × 0.15) + (Testing × 0.15) + (Completeness × 0.15)',
  };
}
