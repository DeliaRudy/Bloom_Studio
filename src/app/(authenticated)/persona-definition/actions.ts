'use server';

import { processPersonaInterview, type PersonaInterviewInput, type PersonaInterviewOutput } from '@/ai/flows/persona-interview-flow';

export async function processTranscriptAction(
  transcript: string
): Promise<{ data?: PersonaInterviewOutput; error?: string }> {
  if (!transcript) {
    return { error: 'Transcript is empty.' };
  }
  try {
    const result = await processPersonaInterview({ transcript });
    return { data: result };
  } catch (e: any) {
    console.error('Error processing transcript:', e);
    return { error: e.message || 'Failed to process transcript.' };
  }
}
