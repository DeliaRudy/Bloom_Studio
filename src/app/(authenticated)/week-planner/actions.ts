'use server';
import { processWeeklyPlanInterview, type WeeklyPlanInterviewOutput } from '@/ai/flows/weekly-plan-interview';

export async function processWeeklyPlanTranscript(
  transcript: string
): Promise<{ data?: WeeklyPlanInterviewOutput; error?: string }> {
  if (!transcript) {
    return { error: 'Transcript is empty.' };
  }
  try {
    const result = await processWeeklyPlanInterview({ transcript });
    return { data: result };
  } catch (e: any) {
    console.error('Error processing weekly plan transcript:', e);
    return { error: e.message || 'Failed to process transcript.' };
  }
}
