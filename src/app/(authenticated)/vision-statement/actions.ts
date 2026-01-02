
'use server';

import { smartGoalAnalyzer } from "@/ai/flows/smart-goal-analyzer";

export type GoalAnalysisState = {
    isSmart: boolean;
    analysis: string | null;
    suggestions: string | null;
    error: string | null;
}

const initialState: GoalAnalysisState = {
    isSmart: false,
    analysis: null,
    suggestions: null,
    error: null,
};

export async function analyzeGoal(
  previousState: GoalAnalysisState,
  formData: FormData
): Promise<GoalAnalysisState> {
    const goal = formData.get('goal') as string;
    
    if (!goal || goal.trim().length < 10) {
        return { ...initialState, error: "Please enter a more detailed goal to analyze." };
    }
    
    try {
        const result = await smartGoalAnalyzer({ goal });
        return {
            isSmart: result.isSmart,
            analysis: result.analysis,
            suggestions: result.suggestions,
            error: null
        };
    } catch (e: any) {
        console.error("Error analyzing goal:", e);
        return {
            ...initialState,
            error: e.message || "An unknown error occurred while analyzing the goal.",
        };
    }
}
