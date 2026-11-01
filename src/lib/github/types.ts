export interface GitHubRepoMetadata {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
}

export interface GitHubCommitItem {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubIssueItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  pull_request?: Record<string, unknown>;
  body: string | null;
}

export interface GitHubReleaseItem {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string | null;
}

export interface ExtractedRepoData {
  metadata: GitHubRepoMetadata;
  commits: GitHubCommitItem[];
  tree: GitHubTreeItem[];
  languages: Record<string, number>;
  issues: GitHubIssueItem[];
  releases: GitHubReleaseItem[];
  readmeContent: string | null;
  manifestFiles: Record<string, string>; // path -> content
  ciFiles: Record<string, string>;
}
