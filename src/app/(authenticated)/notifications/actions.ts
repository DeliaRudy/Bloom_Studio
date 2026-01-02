
'use server';

import { sendEmailNotification, type SendEmailNotificationInput } from '@/ai/flows/send-email-notification';

export async function sendTestEmailNotification(input: SendEmailNotificationInput): Promise<{ error?: string }> {
    try {
        await sendEmailNotification(input);
        return {};
    } catch(e: any) {
        console.error("Failed to send test notification:", e);
        return { error: e.message || "An unknown error occurred." };
    }
}
