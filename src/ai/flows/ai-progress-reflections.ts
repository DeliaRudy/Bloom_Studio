'use server';
/**
 * @fileOverview This file defines the AI progress reflection flow.
 *
 * - aiProgressReflections - A function that generates AI-driven progress reflections.
 * - AIProgressReflectionsInput - The input type for the aiProgressReflections function.
 * - AIProgressReflectionsOutput - The return type for the aiProgressReflections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProgressReflectionsInputSchema = z.object({
  startDate: z.string().describe('The start date for the reflection period.'),
  endDate: z.string().describe('The end date for the reflection period.'),
  allData: z.any().describe('A JSON object containing all user data (goals, plans, etc.).'),
});
export type AIProgressReflectionsInput = z.infer<typeof AIProgressReflectionsInputSchema>;

const AIProgressReflectionsOutputSchema = z.object({
  summaryReflection: z.string().describe('A concise, summary version of the AI-generated progress reflection.'),
  detailedReflection: z.string().describe('A detailed, in-depth version of the AI-generated progress reflection.'),
});
export type AIProgressReflectionsOutput = z.infer<typeof AIProgressReflectionsOutputSchema>;

export async function aiProgressReflections(input: AIProgressReflectionsInput): Promise<AIProgressReflectionsOutput> {
  return aiProgressReflectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProgressReflectionsPrompt',
  input: {schema: AIProgressReflectionsInputSchema},
  output: {schema: AIProgressReflectionsOutputSchema},
  prompt: `You are an AI assistant providing progress reflections to a user to keep them motivated towards their goals. The user has provided a JSON object with all of their data from the app and a date range for the reflection.

  Date Range for this reflection: {{{startDate}}} to {{{endDate}}}

  User Data:
  \`\`\`json
  {{{allData}}}
  \`\`\`

  Analyze all the provided data within the given date range. Look for patterns, progress, and areas for improvement in their daily plans, habit tracking, goal completion, and gratitude entries.

  Based on your analysis, generate two versions of the reflection:
  1.  **Summary Reflection**: A short, motivational paragraph (2-3 sentences) that highlights a key achievement or offers a piece of encouragement.
  2.  **Detailed Reflection**: A more comprehensive analysis (3-5 paragraphs) that breaks down their progress. It should:
      - Acknowledge specific goals or habits they worked on.
      - Connect their daily activities to their larger vision (e.g., vision board, 5-year plan).
      - Identify potential challenges or inconsistencies.
      - Offer actionable suggestions for the upcoming period.

  Your tone should be encouraging, insightful, and supportive.
  `,
});

const aiProgressReflectionsFlow = ai.defineFlow(
  {
    name: 'aiProgressReflectionsFlow',
    inputSchema: AIProgressReflectionsInputSchema,
    outputSchema: AIProgressReflectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
