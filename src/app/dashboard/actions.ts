
'use server';

import { aiProgressReflections } from "@/ai/flows/ai-progress-reflections";

export type AnalysisState = {
    summary: string | null;
    detailed: string | null;
    error: string | null;
};

export async function getProductivityAnalysis({ allData }: { allData: string }): Promise<AnalysisState> {
    try {
        const result = await aiProgressReflections({
            startDate: '', // These are not used by the current prompt but are part of the schema
            endDate: '',
            allData: allData,
        });
        
        if (!result.summaryReflection) {
            return {
                summary: 'Could not generate a summary. Try adding more data to your plans and goals.',
                detailed: null,
                error: null
            };
        }

        return {
            summary: result.summaryReflection,
            detailed: result.detailedReflection,
            error: null,
        };

    } catch (e: any) {
        console.error("Error getting productivity analysis:", e);
        return {
            summary: null,
            detailed: null,
            error: e.message || "An unknown error occurred while generating the analysis.",
        };
    }
}
