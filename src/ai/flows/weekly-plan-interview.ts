'use server';
/**
 * @fileOverview An AI flow to process a user's spoken weekly plan.
 * - processWeeklyPlanInterview - A function that takes a transcript and extracts structured data.
 * - WeeklyPlanInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklyPlanInterviewOutputSchema = z.object({
  bigGoal: z.string().optional().describe("The user's main, single goal for the entire week."),
  goals: z.array(z.string()).describe("A list of smaller, specific goals or tasks for the week."),
  peopleToConnect: z.array(z.string()).describe("A list of names of people the user wants to connect with during the week."),
  affirmations: z.array(z.string()).describe("A list of affirmations the user wants to focus on for the week."),
});
export type WeeklyPlanInterviewOutput = z.infer<typeof WeeklyPlanInterviewOutputSchema>;

const WeeklyPlanInterviewInputSchema = z.object({
  transcript: z.string().describe('The full text transcript of the user\'s spoken response about their weekly plan.'),
});
export type WeeklyPlanInterviewInput = z.infer<typeof WeeklyPlanInterviewInputSchema>;

export async function processWeeklyPlanInterview(input: WeeklyPlanInterviewInput): Promise<WeeklyPlanInterviewOutput> {
  return weeklyPlanInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weeklyPlanInterviewPrompt',
  input: {schema: WeeklyPlanInterviewInputSchema},
  output: {schema: WeeklyPlanInterviewOutputSchema},
  prompt: `You are an AI assistant helping a user fill out their weekly planner. Analyze the following transcript and extract the key information into a structured JSON format.

  Transcript:
  """
  {{{transcript}}}
  """

  From the transcript, identify and extract the following:
  1.  **bigGoal**: The user's single most important goal for the week.
  2.  **goals**: A list of smaller tasks or objectives for the week.
  3.  **peopleToConnect**: The names of any individuals the user plans to contact.
  4.  **affirmations**: Any affirmations the user mentions for their weekly focus.
  `,
});

const weeklyPlanInterviewFlow = ai.defineFlow(
  {
    name: 'weeklyPlanInterviewFlow',
    inputSchema: WeeklyPlanInterviewInputSchema,
    outputSchema: WeeklyPlanInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
