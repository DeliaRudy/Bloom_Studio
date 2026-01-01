
'use server';
/**
 * @fileOverview This file defines a flow for sending (simulated) email notifications.
 *
 * - sendEmailNotification - A function that generates an email and logs it to the console.
 * - SendEmailNotificationInput - The input type for the function.
 * - SendEmailNotificationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SendEmailNotificationInputSchema = z.object({
  email: z.string().email().describe('The email address of the recipient.'),
  notificationType: z
    .enum(['generic', 'planDay', 'productivity', 'habits', 'reflection'])
    .describe('The type of notification to send.'),
});
export type SendEmailNotificationInput = z.infer<
  typeof SendEmailNotificationInputSchema
>;

const SendEmailNotificationOutputSchema = z.object({
  to: z.string(),
  subject: z.string(),
  body: z.string(),
});
export type SendEmailNotificationOutput = z.infer<
  typeof SendEmailNotificationOutputSchema
>;

export async function sendEmailNotification(
  input: SendEmailNotificationInput
): Promise<SendEmailNotificationOutput> {
  return sendEmailNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendEmailNotificationPrompt',
  input: { schema: SendEmailNotificationInputSchema },
  output: { schema: SendEmailNotificationOutputSchema },
  prompt: `You are an AI assistant for an app called BloomVision. Your task is to generate the content for an email notification. The user wants to receive a notification of type '{{notificationType}}'.

Based on the notification type, generate an appropriate subject line and a concise, motivating email body.

Here are some guidelines for each type:
- **generic**: A simple test notification.
- **planDay**: A morning reminder (8am) to plan the day. Be encouraging.
- **productivity**: A mid-day reminder with a sample "Productivity Matrix". Create a fictional but realistic list of tasks for the user, categorized into: "High Impact/Urgent", "High Impact/Not Urgent", "Low Impact/Urgent", "Low Impact/Not Urgent". Also, suggest a "2-Minute Task" they can do quickly.
- **habits**: A reminder to focus on their "why" and connect it to their daily tasks. Be inspirational.
- **reflection**: An evening reminder (8pm) to reflect on their day. Be gentle and calming.

The user's email is {{email}}. You must set the 'to' field in the output to this email address. The output format must be a valid JSON object matching the output schema.
`,
});

const sendEmailNotificationFlow = ai.defineFlow(
  {
    name: 'sendEmailNotificationFlow',
    inputSchema: SendEmailNotificationInputSchema,
    outputSchema: SendEmailNotificationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    const emailContent = output!;

    // In a real application, you would integrate with an email service like SendGrid or Nodemailer here.
    // For this simulation, we will log the email content to the console.
    console.log('--- SIMULATED EMAIL ---');
    console.log(`To: ${emailContent.to}`);
    console.log(`Subject: ${emailContent.subject}`);
    console.log('---');
    console.log(emailContent.body);
    console.log('--- END OF EMAIL ---');

    return emailContent;
  }
);

    