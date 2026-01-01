'use server';
/**
 * @fileOverview This file defines the AI flow for predicting menstrual cycle phases.
 *
 * - predictCyclePhases - A function that takes a start date and returns the predicted dates for each cycle phase.
 * - PredictCyclePhasesInput - The input type for the predictCyclePhases function.
 * - PredictCyclePhasesOutput - The return type for the predictCyclePhases function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addDays, format, parseISO } from 'date-fns';

const PredictCyclePhasesInputSchema = z.object({
  lastPeriodStartDate: z.string().describe('The start date of the last period in ISO format (e.g., "2024-01-15").'),
});
export type PredictCyclePhasesInput = z.infer<typeof PredictCyclePhasesInputSchema>;

const PhaseSchema = z.object({
  startDate: z.string().describe('Start date of the phase (YYYY-MM-DD)'),
  endDate: z.string().describe('End date of the phase (YYYY-MM-DD)'),
});

const PredictCyclePhasesOutputSchema = z.object({
  menstruation: PhaseSchema,
  follicular: PhaseSchema,
  ovulation: PhaseSchema,
  luteal: PhaseSchema,
});
export type PredictCyclePhasesOutput = z.infer<typeof PredictCyclePhasesOutputSchema>;


export async function predictCyclePhases(input: PredictCyclePhasesInput): Promise<PredictCyclePhasesOutput> {
  // This flow is simple date math, so we can implement it directly without an LLM call.
  // This is faster, more reliable, and cheaper.
  const startDate = parseISO(input.lastPeriodStartDate);

  const menstruationStartDate = startDate;
  const menstruationEndDate = addDays(startDate, 6); // Day 1-7

  const follicularStartDate = addDays(startDate, 7); // Day 8
  const follicularEndDate = addDays(startDate, 13); // Day 14

  const ovulationStartDate = addDays(startDate, 14); // Day 15
  const ovulationEndDate = addDays(startDate, 16); // Day 17

  const lutealStartDate = addDays(startDate, 17); // Day 18
  const lutealEndDate = addDays(startDate, 27); // Day 28

  return {
    menstruation: {
      startDate: format(menstruationStartDate, 'yyyy-MM-dd'),
      endDate: format(menstruationEndDate, 'yyyy-MM-dd'),
    },
    follicular: {
      startDate: format(follicularStartDate, 'yyyy-MM-dd'),
      endDate: format(follicularEndDate, 'yyyy-MM-dd'),
    },
    ovulation: {
      startDate: format(ovulationStartDate, 'yyyy-MM-dd'),
      endDate: format(ovulationEndDate, 'yyyy-MM-dd'),
    },
    luteal: {
      startDate: format(lutealStartDate, 'yyyy-MM-dd'),
      endDate: format(lutealEndDate, 'yyyy-MM-dd'),
    },
  };
}

// We define a flow so it's registered with Genkit, but the logic is pure TypeScript.
ai.defineFlow(
  {
    name: 'predictCyclePhasesFlow',
    inputSchema: PredictCyclePhasesInputSchema,
    outputSchema: PredictCyclePhasesOutputSchema,
  },
  async (input) => predictCyclePhases(input)
);
