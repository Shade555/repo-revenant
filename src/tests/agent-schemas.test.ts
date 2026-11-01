import { test } from 'node:test';
import assert from 'node:assert';
import {
  HistorianOutputSchema,
  ArchaeologistOutputSchema,
  ExorcistOutputSchema,
  RevivalistOutputSchema,
  HealthScoreSchema,
} from '../lib/validation/schemas';
import { SAMPLE_DOSSIERS } from '../lib/sample-data';

test('Agent Schemas: Sample dossiers satisfy Zod validation contracts', () => {
  const three20 = SAMPLE_DOSSIERS['facebookarchive/three20'];
  assert.ok(three20, 'Three20 sample dossier must exist');

  // Validate HealthScore
  const healthValid = HealthScoreSchema.safeParse(three20.healthScore);
  assert.strictEqual(healthValid.success, true, 'HealthScore schema must be valid');

  // Validate Historian
  const histValid = HistorianOutputSchema.safeParse(three20.historian);
  assert.strictEqual(histValid.success, true, 'Historian schema must be valid');

  // Validate Archaeologist
  const archValid = ArchaeologistOutputSchema.safeParse(three20.archaeologist);
  assert.strictEqual(archValid.success, true, 'Archaeologist schema must be valid');

  // Validate Exorcist
  const exorValid = ExorcistOutputSchema.safeParse(three20.exorcist);
  assert.strictEqual(exorValid.success, true, 'Exorcist schema must be valid');

  // Validate Revivalist
  const revValid = RevivalistOutputSchema.safeParse(three20.revivalist);
  assert.strictEqual(revValid.success, true, 'Revivalist schema must be valid');
});
