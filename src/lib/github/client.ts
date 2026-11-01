import {
  GitHubRepoMetadata,
  GitHubCommitItem,
  GitHubTreeItem,
  GitHubIssueItem,
  GitHubReleaseItem,
  ExtractedRepoData,
} from './types';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';

const GITHUB_API_BASE = 'https://api.github.com';
const MAX_FILE_SIZE = 80 * 1024; // 80 KB cap to prevent context explosion

export class GitHubClient {
  private token: string | undefined;

  constructor() {
    this.token = process.env.GITHUB_TOKEN?.trim();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoRevenant-Archaeological-Harness/1.0',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async fetchApi<T>(path: string): Promise<{ data: T | null; status: number; error?: string }> {
    const url = `${GITHUB_API_BASE}${path}`;
    try {
      const res = await fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: 3600 }, // Cache 1 hour
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          return {
            data: null,
            status: res.status,
            error: 'GitHub API rate limit exceeded. Set GITHUB_TOKEN in .env.local for 5,000 requests/hr.',
          };
        }
        if (res.status === 404) {
          return { data: null, status: 404, error: 'Repository not found or private.' };
        }
        return { data: null, status: res.status, error: `GitHub API error: ${res.statusText}` };
      }

      const json = await res.json();
      return { data: json as T, status: res.status };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { data: null, status: 500, error: `Network error connecting to GitHub: ${message}` };
    }
  }

  public async fetchRawFile(owner: string, repo: string, path: string, branch = 'master'): Promise<string | null> {
    // Try raw.githubusercontent.com safely
    const cleanOwner = encodeURIComponent(owner);
    const cleanRepo = encodeURIComponent(repo);
    const cleanPath = path.replace(/^\//, '');

    const candidates = [
      `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${encodeURIComponent(branch)}/${cleanPath}`,
      `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/main/${cleanPath}`,
      `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/master/${cleanPath}`,
    ];

    for (const url of candidates) {
      try {
        const headers: Record<string, string> = {
          'User-Agent': 'RepoRevenant-Archaeological-Harness/1.0',
        };
        if (this.token) {
          headers.Authorization = `Bearer ${this.token}`;
        }

        const res = await fetch(url, { headers });
        if (res.ok) {
          const text = await res.text();
          if (text.length > MAX_FILE_SIZE) {
            return text.slice(0, MAX_FILE_SIZE) + '\n\n... [TRUNCATED DUE TO FILE SIZE LIMIT]';
          }
          return text;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  public async extractRepositoryArtifacts(owner: string, repo: string): Promise<{
    data: ExtractedRepoData | null;
    error?: string;
    isFallback?: boolean;
  }> {
    // 1. Fetch Repository Metadata
    const metaRes = await this.fetchApi<GitHubRepoMetadata>(`/repos/${owner}/${repo}`);
    if (!metaRes.data) {
      // Check if this repository is one of our rich sample repositories
      const key = `${owner}/${repo}`;
      if (SAMPLE_DOSSIERS[key]) {
        return {
          data: null,
          isFallback: true,
          error: metaRes.error || 'Repository accessed via cached archaeological demonstration artifact.',
        };
      }
      return { data: null, error: metaRes.error || 'Failed to retrieve repository metadata' };
    }

    const metadata = metaRes.data;
    const defaultBranch = metadata.default_branch || 'main';

    // 2. Fetch Commits (recent 50)
    const commitsRes = await this.fetchApi<GitHubCommitItem[]>(
      `/repos/${owner}/${repo}/commits?per_page=50`
    );
    const commits = commitsRes.data || [];

    // 3. Fetch Languages
    const langRes = await this.fetchApi<Record<string, number>>(
      `/repos/${owner}/${repo}/languages`
    );
    const languages = langRes.data || {};

    // 4. Fetch Issues (includes PRs)
    const issuesRes = await this.fetchApi<GitHubIssueItem[]>(
      `/repos/${owner}/${repo}/issues?state=all&per_page=30`
    );
    const issues = issuesRes.data || [];

    // 5. Fetch Releases
    const releasesRes = await this.fetchApi<GitHubReleaseItem[]>(
      `/repos/${owner}/${repo}/releases?per_page=15`
    );
    const releases = releasesRes.data || [];

    // 6. Fetch Git Tree recursively (up to 1,000 items)
    const treeRes = await this.fetchApi<{ tree: GitHubTreeItem[]; truncated: boolean }>(
      `/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
    );
    const tree = treeRes.data?.tree || [];

    // 7. Extract README content
    let readmeContent: string | null = null;
    const readmeFile = tree.find((f) => /^readme\.(md|txt|markdown|rst)$/i.test(f.path));
    if (readmeFile) {
      readmeContent = await this.fetchRawFile(owner, repo, readmeFile.path, defaultBranch);
    }

    // 8. Extract Manifest and Config files safely
    const manifestCandidates = [
      'package.json',
      'Cargo.toml',
      'go.mod',
      'requirements.txt',
      'pyproject.toml',
      'Gemfile',
      'pom.xml',
      'build.gradle',
      'Makefile',
      'CMakeLists.txt',
      'Three20.podspec',
      'Package.swift',
    ];

    const manifestFiles: Record<string, string> = {};
    for (const candidate of manifestCandidates) {
      const match = tree.find((f) => f.path.toLowerCase() === candidate.toLowerCase() || f.path.endsWith('/' + candidate));
      if (match) {
        const content = await this.fetchRawFile(owner, repo, match.path, defaultBranch);
        if (content) {
          manifestFiles[match.path] = content;
        }
      }
    }

    // 9. Extract CI / Workflow configurations
    const ciFiles: Record<string, string> = {};
    const ciMatches = tree.filter(
      (f) =>
        f.path.startsWith('.github/workflows/') ||
        f.path === '.travis.yml' ||
        f.path === 'circle.yml' ||
        f.path === '.gitlab-ci.yml'
    );

    for (const ciMatch of ciMatches.slice(0, 5)) {
      const content = await this.fetchRawFile(owner, repo, ciMatch.path, defaultBranch);
      if (content) {
        ciFiles[ciMatch.path] = content;
      }
    }

    return {
      data: {
        metadata,
        commits,
        tree,
        languages,
        issues,
        releases,
        readmeContent,
        manifestFiles,
        ciFiles,
      },
    };
  }
}

export const githubClient = new GitHubClient();
