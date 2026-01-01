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
  journalEntries: z.string().describe('The user journal entries.'),
  visionBoardElements: z.string().describe('The user vision board elements.'),
  userActivity: z.string().describe('The description of recent user activity related to their goals.'),
});
export type AIProgressReflectionsInput = z.infer<typeof AIProgressReflectionsInputSchema>;

const AIProgressReflectionsOutputSchema = z.object({
  reflection: z.string().describe('The AI-generated progress reflection.'),
});
export type AIProgressReflectionsOutput = z.infer<typeof AIProgressReflectionsOutputSchema>;

export async function aiProgressReflections(input: AIProgressReflectionsInput): Promise<AIProgressReflectionsOutput> {
  return aiProgressReflectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProgressReflectionsPrompt',
  input: {schema: AIProgressReflectionsInputSchema},
  output: {schema: AIProgressReflectionsOutputSchema},
  prompt: `You are an AI assistant providing daily progress reflections to the user to keep them motivated towards their goals.

  Here are the user's journal entries: {{{journalEntries}}}

  Here are the user's vision board elements: {{{visionBoardElements}}}

  Here is a description of recent user activity: {{{userActivity}}}

  Generate a short, motivational progress reflection based on the information above. Focus on providing encouragement and suggesting adjustments where necessary. Incorporate vision elements if the user activity shows progress toward achieving elements of the vision board.
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
