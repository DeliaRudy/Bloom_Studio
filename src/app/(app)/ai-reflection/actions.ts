"use server";

import { aiProgressReflections } from "@/ai/flows/ai-progress-reflections";
import { z } from "zod";

const schema = z.object({
    journalEntries: z.string().min(1, { message: "Journal entries are required." }),
    visionBoardElements: z.string().min(1, { message: "Vision board elements are required." }),
    userActivity: z.string().min(1, { message: "User activity is required." }),
});

type State = {
    reflection: string;
    error: string | null;
};

export async function getAIReflection(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = schema.safeParse({
    journalEntries: formData.get("journalEntries"),
    visionBoardElements: formData.get("visionBoardElements"),
    userActivity: formData.get("userActivity"),
  });

  if (!validatedFields.success) {
    return {
      reflection: "",
      error: validatedFields.error.flatten().fieldErrors.journalEntries?.[0] ||
             validatedFields.error.flatten().fieldErrors.visionBoardElements?.[0] ||
             validatedFields.error.flatten().fieldErrors.userActivity?.[0] ||
             "Invalid input provided."
    };
  }
  
  try {
    const result = await aiProgressReflections(validatedFields.data);
    return {
      reflection: result.reflection,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      reflection: "",
      error: e.message || "An unexpected error occurred while generating the reflection.",
    };
  }
}
