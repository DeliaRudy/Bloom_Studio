
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
  message: string | null;
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
      message: null,
      error:
        fieldErrors.email?.[0] ||
        fieldErrors.notificationType?.[0] ||
        "Invalid input provided.",
    };
  }

  try {
    const result = await sendEmailNotification(validatedFields.data);

    return {
      success: true,
      message: result.delivery.info,
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      message: null,
      error: e.message || "An unexpected error occurred.",
    };
  }
}
