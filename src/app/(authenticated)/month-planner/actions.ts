'use server';
import { processMonthPlannerInterview, type MonthPlannerInterviewOutput } from '@/ai/flows/month-planner-interview';

export async function processMonthPlannerTranscript(
  transcript: string
): Promise<{ data?: MonthPlannerInterviewOutput; error?: string }> {
  if (!transcript) {
    return { error: 'Transcript is empty.' };
  }
  try {
    const result = await processMonthPlannerInterview({ transcript });
    return { data: result };
  } catch (e: any) {
    console.error('Error processing month planner transcript:', e);
    return { error: e.message || 'Failed to process transcript.' };
  }
}
