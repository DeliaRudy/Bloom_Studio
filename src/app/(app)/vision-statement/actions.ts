
"use server";

import { smartGoalAnalyzer } from "@/ai/flows/smart-goal-analyzer";
import { z } from "zod";

const schema = z.object({
  goal: z.string().min(1, { message: "Goal is required." }),
});

type State = {
  isSmart: boolean;
  analysis: string | null;
  suggestions: string | null;
  error: string | null;
};

export async function analyzeGoal(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = schema.safeParse({
    goal: formData.get("goal"),
  });

  if (!validatedFields.success) {
    return {
      isSmart: false,
      analysis: null,
      suggestions: null,
      error: validatedFields.error.flatten().fieldErrors.goal?.[0] || "Invalid input."
    };
  }

  try {
    const result = await smartGoalAnalyzer({ goal: validatedFields.data.goal });
    return {
      ...result,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      isSmart: false,
      analysis: null,
      suggestions: null,
      error: e.message || "An unexpected error occurred while analyzing the goal.",
    };
  }
}
