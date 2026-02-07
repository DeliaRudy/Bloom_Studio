'use server';
/**
 * @fileOverview An AI flow to process spoken monthly goals for a year.
 * - processMonthlyGoalsInterview - A function that takes a transcript and extracts goals for each month.
 * - MonthlyGoalsInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonthlyGoalsInterviewOutputSchema = z.record(z.string()).describe("A dictionary where keys are month names (e.g., 'January', 'February') and values are the goal for that month.");
export type MonthlyGoalsInterviewOutput = z.infer<typeof MonthlyGoalsInterviewOutputSchema>;

const MonthlyGoalsInterviewInputSchema = z.object({
  transcript: z.string().describe('The full text transcript of the user\'s spoken response about their goals for each month of the year.'),
});
export type MonthlyGoalsInterviewInput = z.infer<typeof MonthlyGoalsInterviewInputSchema>;

export async function processMonthlyGoalsInterview(input: MonthlyGoalsInterviewInput): Promise<MonthlyGoalsInterviewOutput> {
  return monthlyGoalsInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'monthlyGoalsInterviewPrompt',
  input: {schema: MonthlyGoalsInterviewInputSchema},
  output: {schema: MonthlyGoalsInterviewOutputSchema},
  prompt: `You are an AI assistant helping a user fill out their yearly plan. The user will state their primary goal for several months. Analyze the transcript and extract the goal for each month mentioned.

  The output must be a JSON object where the key is the full month name (e.g., "January", "March", "December") and the value is the corresponding goal text.

  Transcript:
  """
  {{{transcript}}}
  """
  `,
});

const monthlyGoalsInterviewFlow = ai.defineFlow(
  {
    name: 'monthlyGoalsInterviewFlow',
    inputSchema: MonthlyGoalsInterviewInputSchema,
    outputSchema: MonthlyGoalsInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
