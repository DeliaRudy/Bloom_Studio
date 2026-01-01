
'use server';
/**
 * @fileOverview This file defines a flow for sending email notifications by writing to Firestore.
 *
 * - sendEmailNotification - A function that generates an email and writes it to the /mail collection.
 * - SendEmailNotificationInput - The input type for the function.
 * - SendEmailNotificationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
  delivery: z.object({
    startTime: z.string(),
    state: z.string(), // e.g., 'PROCESSING', 'COMPLETED', 'ERROR'
    info: z.string(),
  }),
});

export type SendEmailNotificationOutput = z.infer<
  typeof SendEmailNotificationOutputSchema
>;

export async function sendEmailNotification(
  input: SendEmailNotificationInput
): Promise<SendEmailNotificationOutput> {
  return sendEmailNotificationFlow(input);
}

const emailContentSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

const prompt = ai.definePrompt({
  name: 'sendEmailNotificationPrompt',
  input: { schema: SendEmailNotificationInputSchema },
  output: { schema: emailContentSchema },
  prompt: `You are an AI assistant for an app called BloomVision. Your task is to generate the content for an email notification. The user wants to receive a notification of type '{{notificationType}}'.

Based on the notification type, generate an appropriate subject line and a concise, motivating email body.

Here are some guidelines for each type:
- **generic**: A simple test notification.
- **planDay**: A morning reminder (8am) to plan the day. Be encouraging.
- **productivity**: A mid-day reminder with a sample "Productivity Matrix". Create a fictional but realistic list of tasks for the user, categorized into: "High Impact/Urgent", "High Impact/Not Urgent", "Low Impact/Urgent", "Low Impact/Not Urgent". Also, suggest a "2-Minute Task" they can do quickly.
- **habits**: A reminder to focus on their "why" and connect it to their daily tasks. Be inspirational.
- **reflection**: An evening reminder (8pm) to reflect on their day. Be gentle and calming.

The output format must be a valid JSON object matching the output schema. Do not include the 'to' field.
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

    // This now writes to Firestore instead of logging to the console.
    const { firestore } = initializeFirebase();
    const mailCollection = collection(firestore, 'mail');

    const emailDoc = {
      to: [input.email],
      message: {
        subject: emailContent.subject,
        html: emailContent.body.replace(/\n/g, '<br>'), // Convert newlines to HTML breaks
      },
    };
    
    const docRef = await addDoc(mailCollection, emailDoc);

    return {
      delivery: {
        startTime: new Date().toISOString(),
        state: 'COMPLETED',
        info: `Email document created in Firestore with ID: ${docRef.id}`,
      },
    };
  }
);
