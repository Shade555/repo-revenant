import { test } from 'node:test';
import assert from 'node:assert';
import { EvidenceRetriever } from '../lib/retrieval/vector-search';
import { EvidenceReference } from '../types';

test('Evidence Retriever: ranks relevant citations', () => {
  const mockEvidence: EvidenceReference[] = [
    {
      id: '1',
      type: 'commit',
      title: 'Archival notice commit',
      ref: '9c5df02',
      snippet: 'README: Three20 is no longer maintained. Migrate to Nimbus.',
      confidence: 'verified',
    },
    {
      id: '2',
      type: 'file',
      title: 'Memory leak in photo viewer',
      ref: 'src/Three20UI/TTPhotoViewController.m:412',
      snippet: 'FIXME: Memory leak when paging between high-res images',
      confidence: 'verified',
    },
    {
      id: '3',
      type: 'file',
      title: 'Core navigation header',
      ref: 'src/Three20UINavigator/TTNavigator.h',
      snippet: 'URL dispatch system mapping URL strings to view controllers',
      confidence: 'verified',
    },
  ];

  const retriever = new EvidenceRetriever(mockEvidence);

  // Search for archival
  const resultsArchival = retriever.search('why was the project archived?');
  assert.ok(resultsArchival.length > 0);
  assert.strictEqual(resultsArchival[0].evidence.id, '1', 'Archival commit should rank #1 for archival query');

  // Search for memory leak
  const resultsLeak = retriever.search('memory leak in images');
  assert.ok(resultsLeak.length > 0);
  assert.strictEqual(resultsLeak[0].evidence.id, '2', 'Photo controller leak should rank #1');

  // Search for navigation
  const resultsNav = retriever.search('URL navigation mapping');
  assert.ok(resultsNav.length > 0);
  assert.strictEqual(resultsNav[0].evidence.id, '3', 'TTNavigator should rank #1');
});
