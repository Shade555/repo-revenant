import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { summonerOrchestrator } from '../agents/summoner';

const investigationInputSchema = z.object({
  target: z.string(),
});

const investigationOutputSchema = z.object({
  success: z.boolean(),
  dossierId: z.string().optional(),
  error: z.string().optional(),
});

const orchestrateStep = createStep({
  id: 'orchestrate-excavation',
  inputSchema: investigationInputSchema,
  outputSchema: investigationOutputSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (params: any) => {
    const target = params?.inputData?.target || params?.input?.target || '';
    const result = await summonerOrchestrator.orchestrateInvestigation(target);
    return {
      success: result.success,
      dossierId: result.dossier?.id,
      error: result.error,
    };
  },
});

/**
 * Mastra Workflow: Repository Resurrection Pipeline
 * Coordinates The Summoner, Historian, Archaeologist, Exorcist, and Revivalist.
 */
export const resurrectionWorkflow = createWorkflow({
  id: 'repository-resurrection-pipeline',
  inputSchema: investigationInputSchema,
  outputSchema: investigationOutputSchema,
})
  .then(orchestrateStep)
  .commit();
