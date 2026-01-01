"use server";

import { generateAvatar } from "@/ai/flows/generate-avatar";
import { z } from "zod";

const generateAvatarSchema = z.object({
    prompt: z.string().min(1, { message: "Prompt is required." }),
});

type GenerateAvatarState = {
    imageUrl: string | null;
    error: string | null;
};

export async function generateAvatarAction(
  input: { prompt: string }
): Promise<GenerateAvatarState> {
  const validatedFields = generateAvatarSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      imageUrl: null,
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] || "Invalid input provided."
    };
  }
  
  try {
    const result = await generateAvatar(validatedFields.data);
    return {
      imageUrl: result.imageUrl,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      imageUrl: null,
      error: e.message || "An unexpected error occurred while generating the avatar.",
    };
  }
}
