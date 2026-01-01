"use server";

import { aiProgressReflections } from "@/ai/flows/ai-progress-reflections";
import { z } from "zod";

const schema = z.object({
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().min(1, { message: "End date is required." }),
    allData: z.string().min(1, { message: "Application data is required." }),
});

export type ReflectionState = {
    summaryReflection: string | null;
    detailedReflection: string | null;
    error: string | null;
};

export async function getAIReflection(
  prevState: ReflectionState,
  formData: FormData
): Promise<ReflectionState> {
  const validatedFields = schema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    allData: formData.get("allData"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      summaryReflection: null,
      detailedReflection: null,
      error: fieldErrors.startDate?.[0] || fieldErrors.endDate?.[0] || fieldErrors.allData?.[0] || "Invalid input provided.",
    };
  }
  
  try {
    const allData = JSON.parse(validatedFields.data.allData);
    const result = await aiProgressReflections({
        startDate: validatedFields.data.startDate,
        endDate: validatedFields.data.endDate,
        allData: JSON.stringify(allData, null, 2), // Pass as a stringified JSON
    });

    // In a real app, we would save this to Firestore
    // For now, it just returns to the client state
    console.log("Generated reflection:", result);

    return {
      summaryReflection: result.summaryReflection,
      detailedReflection: result.detailedReflection,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      summaryReflection: null,
      detailedReflection: null,
      error: e.message || "An unexpected error occurred while generating the reflection.",
    };
  }
}
