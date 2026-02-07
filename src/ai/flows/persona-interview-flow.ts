'use server';
/**
 * @fileOverview An AI flow to process a user's spoken response about their persona.
 *
 * - processPersonaInterview - A function that takes a transcript and extracts structured data.
 * - PersonaInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaInterviewOutputSchema = z.object({
  reasons: z.array(z.string()).describe("A list of the user's reasons for their ambition, their 'Why's."),
  traits: z.array(z.object({
    word: z.string().describe("A single word defining a trait the user wants to become."),
    meaning: z.string().describe("The user's personal definition of what that trait word means to them."),
  })).describe("A list of traits the user wants to embody."),
  philosophy: z.string().describe("The user's overall personal philosophy, summarized from their response."),
});
export type PersonaInterviewOutput = z.infer<typeof PersonaInterviewOutputSchema>;

const PersonaInterviewInputSchema = z.object({
  transcript: z.string().describe('The full text transcript of the user\'s spoken response.'),
});
export type PersonaInterviewInput = z.infer<typeof PersonaInterviewInputSchema>;

export async function processPersonaInterview(input: PersonaInterviewInput): Promise<PersonaInterviewOutput> {
  return personaInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personaInterviewPrompt',
  input: {schema: PersonaInterviewInputSchema},
  output: {schema: PersonaInterviewOutputSchema},
  prompt: `You are an expert life coach conducting an interview. The user has provided a spoken response about their persona, including their 'Why', the 'Who' they need to become, and their personal philosophies.

  Your task is to analyze the following transcript and extract the key information into a structured JSON format.

  Transcript:
  """
  {{{transcript}}}
  """

  From the transcript, identify and extract the following:
  1.  **reasons**: A list of distinct reasons the user gives for pursuing their goals. These are their 'Why's.
  2.  **traits**: A list of personality traits the user wants to embody. For each trait, extract the single word for the trait and the user's personal explanation of what that word means to them.
  3.  **philosophy**: A single string that summarizes the user's core beliefs or philosophies about life and success.

  Pay close attention to the user's language. For example, if they say "I need to be more brave, and by brave I mean not being afraid to fail", you should extract the trait word 'Brave' and its meaning. If they list reasons like "I want financial freedom, and I also want to inspire others", extract both reasons.
  `,
});

const personaInterviewFlow = ai.defineFlow(
  {
    name: 'personaInterviewFlow',
    inputSchema: PersonaInterviewInputSchema,
    outputSchema: PersonaInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
