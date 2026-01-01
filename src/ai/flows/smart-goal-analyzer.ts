
'use server';
/**
 * @fileOverview This file defines the SMART goal analysis flow.
 *
 * - smartGoalAnalyzer - A function that analyzes a goal against SMART criteria.
 * - SmartGoalAnalyzerInput - The input type for the smartGoalAnalyzer function.
 * - SmartGoalAnalyzerOutput - The return type for the smartGoalAnalyzer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartGoalAnalyzerInputSchema = z.object({
  goal: z.string().describe('The user goal to analyze.'),
});
export type SmartGoalAnalyzerInput = z.infer<typeof SmartGoalAnalyzerInputSchema>;

const SmartGoalAnalyzerOutputSchema = z.object({
  isSmart: z.boolean().describe('Whether the goal meets all SMART criteria.'),
  analysis: z.string().describe('A summary of how the goal measures up against each SMART principle.'),
  suggestions: z.string().describe('Suggestions for rephrasing the goal to make it smarter.'),
});
export type SmartGoalAnalyzerOutput = z.infer<typeof SmartGoalAnalyzerOutputSchema>;

const smartGoalAnalyzerFlow = ai.defineFlow(
  {
    name: 'smartGoalAnalyzerFlow',
    inputSchema: SmartGoalAnalyzerInputSchema,
    outputSchema: SmartGoalAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function smartGoalAnalyzer(input: SmartGoalAnalyzerInput): Promise<SmartGoalAnalyzerOutput> {
    return smartGoalAnalyzerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'smartGoalAnalyzerPrompt',
  input: {schema: SmartGoalAnalyzerInputSchema},
  output: {schema: SmartGoalAnalyzerOutputSchema},
  prompt: `You are an expert in goal setting. Analyze the following goal based on the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).

  Goal: "{{{goal}}}"

  Provide a concise analysis of how the goal meets or fails each of the SMART criteria.
  Then, offer concrete suggestions for how to rephrase the goal to make it align better with the SMART framework. If the goal is already a good SMART goal, acknowledge that and explain why.

  Your analysis should be encouraging and constructive.
  `,
});
