'use server';
/**
 * @fileOverview An AI flow to process a user's spoken month plan.
 * - processMonthPlannerInterview - A function that takes a transcript and extracts structured data.
 * - MonthPlannerInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonthPlannerInterviewOutputSchema = z.object({
  bigGoal: z.string().optional().describe("The user's main, single goal for the entire month."),
  goals: z.array(z.string()).describe("A list of smaller, specific goals or tasks for the month."),
});
export type MonthPlannerInterviewOutput = z.infer<typeof MonthPlannerInterviewOutputSchema>;

const MonthPlannerInterviewInputSchema = z.object({
  transcript: z.string().describe('The full text transcript of the user\'s spoken response about their month plan.'),
});
export type MonthPlannerInterviewInput = z.infer<typeof MonthPlannerInterviewInputSchema>;

export async function processMonthPlannerInterview(input: MonthPlannerInterviewInput): Promise<MonthPlannerInterviewOutput> {
  return monthPlannerInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'monthPlannerInterviewPrompt',
  input: {schema: MonthPlannerInterviewInputSchema},
  output: {schema: MonthPlannerInterviewOutputSchema},
  prompt: `You are an AI assistant helping a user fill out their month planner. Analyze the following transcript and extract the key information.

  Transcript:
  """
  {{{transcript}}}
  """

  From the transcript, identify and extract:
  1.  **bigGoal**: The user's single most important goal for the month.
  2.  **goals**: A list of smaller tasks or objectives to achieve that big goal.
  `,
});

const monthPlannerInterviewFlow = ai.defineFlow(
  {
    name: 'monthPlannerInterviewFlow',
    inputSchema: MonthPlannerInterviewInputSchema,
    outputSchema: MonthPlannerInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
