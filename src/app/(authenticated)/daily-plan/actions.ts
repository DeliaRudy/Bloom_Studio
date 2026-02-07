'use server';
import { processDailyPlanInterview, type DailyPlanInterviewOutput } from '@/ai/flows/daily-plan-interview';

export async function processDailyPlanTranscript(
  transcript: string
): Promise<{ data?: DailyPlanInterviewOutput; error?: string }> {
  if (!transcript) {
    return { error: 'Transcript is empty.' };
  }
  try {
    const result = await processDailyPlanInterview({ transcript });
    return { data: result };
  } catch (e: any) {
    console.error('Error processing daily plan transcript:', e);
    return { error: e.message || 'Failed to process transcript.' };
  }
}
