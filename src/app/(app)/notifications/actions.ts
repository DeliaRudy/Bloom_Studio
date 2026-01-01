
"use server";

import { sendEmailNotification } from "@/ai/flows/send-email-notification";
import { z } from "zod";
import { TestNotificationType } from "./page";

const schema = z.object({
  email: z.string().email(),
  notificationType: z.enum([
    "generic",
    "planDay",
    "productivity",
    "habits",
    "reflection",
  ]),
});

type State = {
  success: boolean;
  error: string | null;
};

export async function sendTestEmailNotification(
  input: z.infer<typeof schema>
): Promise<State> {
  const validatedFields = schema.safeParse(input);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      success: false,
      error:
        fieldErrors.email?.[0] ||
        fieldErrors.notificationType?.[0] ||
        "Invalid input provided.",
    };
  }

  try {
    // This flow simulates sending an email by logging it to the console.
    await sendEmailNotification(validatedFields.data);

    return {
      success: true,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      error: e.message || "An unexpected error occurred.",
    };
  }
}

    