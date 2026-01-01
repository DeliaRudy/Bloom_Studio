'use server';

import { aiProgressReflections } from '@/ai/flows/ai-progress-reflections';
import { z } from 'zod';

const schema = z.object({
  allData: z.string().min(1, { message: 'Application data is required.' }),
});

export type AnalysisState = {
  summary: string | null;
  detailed: string | null;
  error: string | null;
};

export async function getProductivityAnalysis(
  input: { allData: string }
): Promise<AnalysisState> {
  const validatedFields = schema.safeParse(input);

  if (!validatedFields.success) {
    return {
      summary: null,
      detailed: null,
      error: 'Invalid input provided.',
    };
  }

  try {
    const allData = JSON.parse(validatedFields.data.allData);
    // Use a broad date range to analyze all data
    const startDate = new Date(0).toISOString();
    const endDate = new Date().toISOString();

    const result = await aiProgressReflections({
      startDate,
      endDate,
      allData: JSON.stringify(allData, null, 2),
    });

    return {
      summary: result.summaryReflection,
      detailed: result.detailedReflection,
      error: null,
    };
  } catch (e: any) {
    console.error('Error in getProductivityAnalysis:', e);
    return {
      summary: null,
      detailed: null,
      error:
        e.message ||
        'An unexpected error occurred while generating the analysis.',
    };
  }
}
