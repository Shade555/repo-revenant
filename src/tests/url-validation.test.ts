import { test } from 'node:test';
import assert from 'node:assert';
import { parseAndValidateGithubTarget } from '../lib/validation/url';

test('GitHub URL Validation: valid HTTPS URL', () => {
  const result = parseAndValidateGithubTarget('https://github.com/facebookarchive/three20');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.target?.owner, 'facebookarchive');
  assert.strictEqual(result.target?.repo, 'three20');
  assert.strictEqual(result.target?.cleanUrl, 'https://github.com/facebookarchive/three20');
});

test('GitHub URL Validation: shorthand owner/repo', () => {
  const result = parseAndValidateGithubTarget('visionmedia/mon');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.target?.owner, 'visionmedia');
  assert.strictEqual(result.target?.repo, 'mon');
});

test('GitHub URL Validation: strip .git suffix', () => {
  const result = parseAndValidateGithubTarget('https://github.com/richhickey/clojure-clr.git');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.target?.owner, 'richhickey');
  assert.strictEqual(result.target?.repo, 'clojure-clr');
});

test('GitHub URL Validation: reject SSRF and arbitrary URLs', () => {
  const resLocal = parseAndValidateGithubTarget('http://localhost:3000/owner/repo');
  assert.strictEqual(resLocal.success, false);

  const resFile = parseAndValidateGithubTarget('file:///etc/passwd');
  assert.strictEqual(resFile.success, false);

  const resEvil = parseAndValidateGithubTarget('https://evil.com/owner/repo');
  assert.strictEqual(resEvil.success, false);

  const resEmpty = parseAndValidateGithubTarget('');
  assert.strictEqual(resEmpty.success, false);
});
