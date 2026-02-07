'use server';
import { processMonthlyGoalsInterview, type MonthlyGoalsInterviewOutput } from '@/ai/flows/monthly-goals-interview';

export async function processMonthlyGoalsTranscript(
  transcript: string
): Promise<{ data?: MonthlyGoalsInterviewOutput; error?: string }> {
  if (!transcript) {
    return { error: 'Transcript is empty.' };
  }
  try {
    const result = await processMonthlyGoalsInterview({ transcript });
    return { data: result };
  } catch (e: any) {
    console.error('Error processing monthly goals transcript:', e);
    return { error: e.message || 'Failed to process transcript.' };
  }
}
