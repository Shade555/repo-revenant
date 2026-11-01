import { test } from 'node:test';
import assert from 'node:assert';
import { calculateRepositoryHealth } from '../lib/scoring/health-calculator';
import { ExtractedRepoData } from '../lib/github/types';

test('Health Calculator: calculates 6-category score within 0-100 bounds', () => {
  const mockData: ExtractedRepoData = {
    metadata: {
      id: 12345,
      name: 'ancient-lib',
      full_name: 'ghost/ancient-lib',
      owner: { login: 'ghost', avatar_url: '', html_url: '' },
      html_url: 'https://github.com/ghost/ancient-lib',
      description: 'An ancient library that once shone brightly',
      fork: false,
      created_at: '2010-01-01T00:00:00Z',
      updated_at: '2012-01-01T00:00:00Z',
      pushed_at: '2012-01-01T00:00:00Z',
      size: 450,
      stargazers_count: 500,
      watchers_count: 500,
      forks_count: 80,
      open_issues_count: 24,
      license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
      default_branch: 'master',
      archived: true,
      disabled: false,
    },
    commits: [
      {
        sha: 'abc1234',
        commit: {
          author: { name: 'Alice', email: 'a@example.com', date: '2012-01-01T00:00:00Z' },
          committer: { name: 'Alice', email: 'a@example.com', date: '2012-01-01T00:00:00Z' },
          message: 'Final archival commit',
        },
        author: { login: 'ghost', avatar_url: '' },
        html_url: '',
      },
    ],
    tree: [
      { path: 'README.md', mode: '100644', type: 'blob', sha: '1', url: '' },
      { path: 'LICENSE', mode: '100644', type: 'blob', sha: '2', url: '' },
      { path: 'src/index.js', mode: '100644', type: 'blob', sha: '3', url: '' },
      { path: 'test/index.test.js', mode: '100644', type: 'blob', sha: '4', url: '' },
    ],
    languages: { JavaScript: 15000 },
    issues: [],
    releases: [],
    readmeContent: '# Ancient Lib\n\nThis library is now archived.',
    manifestFiles: {
      'package.json': '{"name": "ancient-lib", "dependencies": {"react": "15.0.0"}}',
    },
    ciFiles: {},
  };

  const health = calculateRepositoryHealth(mockData, 3, 2);

  assert.ok(health.total >= 0 && health.total <= 100, 'Score should be between 0 and 100');
  assert.strictEqual(health.categories.length, 6, 'Should have exactly 6 transparent categories');

  // Verify category names
  const categoryIds = health.categories.map((c) => c.id);
  assert.deepStrictEqual(categoryIds, [
    'maintenance',
    'documentation',
    'dependencies',
    'issues',
    'testing',
    'completeness',
  ]);

  // Because it is archived and 10+ years old, it should be Critical Bitrot or Severe Decay
  assert.ok(
    health.status === 'Critical Bitrot' || health.status === 'Severe Decay' || health.status === 'Dormant Classic',
    `Expected dormant status, got ${health.status}`
  );
});
