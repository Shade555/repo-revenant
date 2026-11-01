/**
 * Strict GitHub URL and repository validation with SSRF protection.
 */

export interface ParsedRepoTarget {
  owner: string;
  repo: string;
  cleanUrl: string;
}

const SAFE_NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

export function parseAndValidateGithubTarget(input: string): {
  success: boolean;
  target?: ParsedRepoTarget;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { success: false, error: 'Target repository input cannot be empty' };
  }

  const trimmed = input.trim();

  // Guard against arbitrary URL schemes or local hosts (SSRF prevention)
  if (
    trimmed.startsWith('file:') ||
    trimmed.startsWith('ftp:') ||
    trimmed.startsWith('http://localhost') ||
    trimmed.startsWith('http://127.0.0.1')
  ) {
    return { success: false, error: 'Restricted target. Only public github.com repositories are allowed.' };
  }

  let owner = '';
  let repo = '';

  // Check if full URL
  const githubUrlRegex = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/i;
  const matchUrl = trimmed.match(githubUrlRegex);

  if (matchUrl) {
    owner = matchUrl[1];
    repo = matchUrl[2].replace(/\.git$/i, '');
  } else {
    // Check shorthand format "owner/repo"
    const shorthandRegex = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;
    const matchShort = trimmed.match(shorthandRegex);

    if (matchShort) {
      owner = matchShort[1];
      repo = matchShort[2].replace(/\.git$/i, '');
    } else {
      return {
        success: false,
        error: 'Invalid GitHub repository format. Use "https://github.com/owner/repo" or "owner/repo".',
      };
    }
  }

  // Ensure owner and repo contain only safe alphanumeric characters, dashes, dots, and underscores
  if (!SAFE_NAME_REGEX.test(owner) || !SAFE_NAME_REGEX.test(repo)) {
    return { success: false, error: 'Repository owner or name contains illegal characters.' };
  }

  // Guard against directory traversal or reserved names
  if (owner === '.' || owner === '..' || repo === '.' || repo === '..') {
    return { success: false, error: 'Invalid path segments.' };
  }

  const cleanUrl = `https://github.com/${owner}/${repo}`;

  return {
    success: true,
    target: {
      owner,
      repo,
      cleanUrl,
    },
  };
}
