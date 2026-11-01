import { HistorianOutput, TimelineEvent, ContributorStat } from '@/types';
import { ExtractedRepoData } from '@/lib/github/types';
import { ollamaClient } from '@/lib/ollama/client';
import { calculateDaysAgo, formatDate } from '@/lib/utils';

export class HistorianAgent {
  public name = 'The Historian';
  public role = 'Reconstruct the history of the repository';

  public async investigate(data: ExtractedRepoData): Promise<HistorianOutput> {
    const { metadata, commits, releases, issues } = data;

    const creationDate = metadata.created_at;
    const lastCommitDate = commits[0]?.commit?.author?.date || metadata.pushed_at || metadata.created_at;
    const dormantDays = calculateDaysAgo(lastCommitDate);
    const totalCommitsEstimated = Math.max(commits.length, metadata.size > 0 ? Math.round(metadata.size / 15) : commits.length);

    // 1. Calculate Contributor Distribution
    const authorCounts: Record<string, number> = {};
    for (const c of commits) {
      const authorName = c.author?.login || c.commit?.author?.name || 'Unknown Contributor';
      authorCounts[authorName] = (authorCounts[authorName] || 0) + 1;
    }

    const sortedAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
    const totalSampledCommits = Math.max(1, commits.length);
    const primaryContributors: ContributorStat[] = sortedAuthors.slice(0, 5).map(([name, count]) => ({
      name,
      commits: count,
      percentage: Math.round((count / totalSampledCommits) * 100),
    }));

    // If no authors could be sampled, add the repo owner
    if (primaryContributors.length === 0) {
      primaryContributors.push({
        name: metadata.owner.login,
        commits: totalCommitsEstimated,
        percentage: 100,
      });
    }

    // 2. Determine Peak Activity Year
    const yearCounts: Record<string, number> = {};
    for (const c of commits) {
      const dateStr = c.commit?.author?.date;
      if (dateStr) {
        const yr = new Date(dateStr).getFullYear().toString();
        yearCounts[yr] = (yearCounts[yr] || 0) + 1;
      }
    }
    const sortedYears = Object.entries(yearCounts).sort((a, b) => b[1] - a[1]);
    const peakActivityYear = sortedYears[0]?.[0] || new Date(creationDate).getFullYear().toString();

    // 3. Factual Abandonment Signals
    const abandonmentSignals: string[] = [];
    if (metadata.archived) {
      abandonmentSignals.push(`Repository explicitly placed into read-only archived state by ${metadata.owner.login}.`);
    }
    if (dormantDays > 365) {
      abandonmentSignals.push(`Zero commits or code pushes recorded in ${dormantDays.toLocaleString()} days.`);
    }

    // Check last commit message for clues
    const lastCommitMsg = commits[0]?.commit?.message?.trim() || '';
    if (/archive|deprecat|abandon|sunset|end of life|eol|discontinued|moved to|unmaintained/i.test(lastCommitMsg)) {
      abandonmentSignals.push(`Final commit (${commits[0].sha.slice(0, 7)}) message: "${lastCommitMsg.split('\n')[0]}"`);
    }

    // Check open issues for abandonment discussions
    const abandonmentIssues = issues.filter((i) =>
      /is this (project )?(dead|abandoned|maintained)|unmaintained|status of/i.test(i.title)
    );
    if (abandonmentIssues.length > 0) {
      abandonmentSignals.push(`Community inquiries logged (e.g. Issue #${abandonmentIssues[0].number}: "${abandonmentIssues[0].title}").`);
    }

    if (abandonmentSignals.length === 0) {
      abandonmentSignals.push(`Commit frequency steadily tapered off following ${peakActivityYear}. No explicit farewell notice found in git log.`);
    }

    // 4. Reconstruct Milestones Timeline
    const timeline: TimelineEvent[] = [];

    // Milestone 1: Genesis
    timeline.push({
      id: 'ml-genesis',
      date: creationDate.split('T')[0],
      title: `Genesis of ${metadata.name}`,
      description: `Repository initialized by ${metadata.owner.login}. Original purpose: "${metadata.description || 'Open source project'}"`,
      type: 'creation',
      commitSha: commits[commits.length - 1]?.sha?.slice(0, 7),
      confidence: 'verified',
      evidenceText: `GitHub repository created on ${formatDate(creationDate)}.`,
    });

    // Milestone 2: Releases or Peak Era
    if (releases.length > 0) {
      const firstRel = releases[releases.length - 1];
      timeline.push({
        id: `ml-rel-${firstRel.tag_name}`,
        date: firstRel.published_at.split('T')[0],
        title: `Release Milestone: ${firstRel.name || firstRel.tag_name}`,
        description: `Official version tagged and distributed to the developer community.`,
        type: 'milestone',
        confidence: 'verified',
        evidenceText: `Tag: ${firstRel.tag_name}`,
      });
    } else {
      timeline.push({
        id: 'ml-peak',
        date: `${peakActivityYear}-06-01`,
        title: `Peak Development Era (${peakActivityYear})`,
        description: `Concentrated development activity with primary contributions from ${primaryContributors[0]?.name}.`,
        type: 'milestone',
        confidence: 'inferred',
        evidenceText: `Commit velocity concentrated in calendar year ${peakActivityYear}.`,
      });
    }

    // Milestone 3: Final Commit / Abandonment
    timeline.push({
      id: 'ml-abandonment',
      date: lastCommitDate.split('T')[0],
      title: metadata.archived ? 'Repository Archival & Cessation' : 'Last Recorded Commit Pulse',
      description: lastCommitMsg
        ? `Final commit recorded: "${lastCommitMsg.split('\n')[0]}". Activity subsequently halted.`
        : `Terminal commit activity recorded on ${formatDate(lastCommitDate)}.`,
      type: 'abandonment',
      commitSha: commits[0]?.sha?.slice(0, 7),
      confidence: 'verified',
      evidenceText: commits[0]?.sha ? `Commit SHA: ${commits[0].sha}` : undefined,
    });

    // 5. Historical Summary (synthesized with Gemma 3 if available)
    let historicalSummary = `${metadata.name} was initiated on ${formatDate(creationDate)} by ${metadata.owner.login}. Development flourished during ${peakActivityYear}, accumulating an estimated ${totalCommitsEstimated} commits with key leadership by ${primaryContributors[0]?.name}. Active development ceased around ${formatDate(lastCommitDate)}, leaving the repository dormant for ${dormantDays.toLocaleString()} days.`;

    // Attempt enrichment with Gemma 3
    try {
      const gemmaPrompt = `Summarize the developmental history of the GitHub repository "${metadata.full_name}".
Created: ${creationDate}
Last Commit: ${lastCommitDate} (${dormantDays} days dormant)
Archived: ${metadata.archived}
Primary contributors: ${primaryContributors.map((c) => `${c.name} (${c.percentage}%)`).join(', ')}
Last commit message: "${lastCommitMsg}"
Abandonment signals: ${abandonmentSignals.join('; ')}

Write a concise, factual 3-sentence historical summary. Do NOT speculate on personal developer reasons without evidence.`;

      const aiRes = await ollamaClient.chat([
        { role: 'system', content: 'You are The Historian, an archaeological software historian.' },
        { role: 'user', content: gemmaPrompt },
      ]);

      if (!aiRes.isFallback && aiRes.response && aiRes.response.length > 40) {
        historicalSummary = aiRes.response.trim();
      }
    } catch {
      // Retain heuristic summary
    }

    return {
      creationDate,
      lastCommitDate,
      dormantDays,
      totalCommitsEstimated,
      peakActivityYear,
      primaryContributors,
      timeline,
      abandonmentSignals,
      historicalSummary,
    };
  }
}

export const historianAgent = new HistorianAgent();
