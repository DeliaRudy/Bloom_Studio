'use server';
/**
 * @fileOverview An AI flow to process a user's spoken daily plan.
 * - processDailyPlanInterview - A function that takes a transcript and extracts structured data.
 * - DailyPlanInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyPlanInterviewOutputSchema = z.object({
  priorities: z.array(z.string()).describe("A list of the user's top 3-5 priorities for the day."),
  schedule: z.record(z.string()).describe('A dictionary where keys are times (e.g., "10:00", "14:30") and values are the scheduled task descriptions.'),
  gratitude: z.string().optional().describe("The user's gratitude statement for the day."),
  reflection: z.string().optional().describe("The user's reflection on the day."),
});
export type DailyPlanInterviewOutput = z.infer<typeof DailyPlanInterviewOutputSchema>;

const DailyPlanInterviewInputSchema = z.object({
  transcript: z.string().describe('The full text transcript of the user\'s spoken response about their daily plan.'),
});
export type DailyPlanInterviewInput = z.infer<typeof DailyPlanInterviewInputSchema>;

export async function processDailyPlanInterview(input: DailyPlanInterviewInput): Promise<DailyPlanInterviewOutput> {
  return dailyPlanInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyPlanInterviewPrompt',
  input: {schema: DailyPlanInterviewInputSchema},
  output: {schema: DailyPlanInterviewOutputSchema},
  prompt: `You are an AI assistant helping a user fill out their daily planner. Analyze the following transcript and extract the key information into a structured JSON format.

  Transcript:
  """
  {{{transcript}}}
  """

  From the transcript, identify and extract the following:
  1.  **priorities**: A list of the user's main tasks or priorities for the day.
  2.  **schedule**: A dictionary of scheduled events. The key should be the time (e.g., "09:00", "15:00") and the value should be the event description. Be precise with the times mentioned.
  3.  **gratitude**: If the user mentions something they are grateful for, extract that sentence.
  4.  **reflection**: If the user reflects on their day, extract that summary.
  `,
});

const dailyPlanInterviewFlow = ai.defineFlow(
  {
    name: 'dailyPlanInterviewFlow',
    inputSchema: DailyPlanInterviewInputSchema,
    outputSchema: DailyPlanInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
