
'use server';
/**
 * @fileOverview This file defines the AI flow for syncing with Google Calendar.
 *
 * - syncWithGoogleCalendar - A function to interact with Google Calendar.
 * - CalendarSyncInput - The input type for the sync function.
 * - CalendarSyncOutput - The return type for the sync function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define placeholder tools for Google Calendar actions.
// In a real application, these would make authenticated API calls to Google Calendar.

const listCalendarEvents = ai.defineTool(
  {
    name: 'listCalendarEvents',
    description: 'Lists events from the user\'s Google Calendar for a specific day.',
    inputSchema: z.object({
      day: z.string().describe('The date to fetch events for, in YYYY-MM-DD format.'),
    }),
    outputSchema: z.array(z.object({
        title: z.string(),
        startTime: z.string().describe('Event start time in ISO 8601 format'),
        endTime: z.string().describe('Event end time in ISO 8601 format'),
    })),
  },
  async ({ day }) => {
    console.log(`[Tool] Simulating fetching calendar events for ${day}`);
    // This is a mock response. A real implementation would call the Google Calendar API.
    return [
      { title: 'Morning Stand-up', startTime: `${day}T09:00:00Z`, endTime: `${day}T09:30:00Z` },
      { title: 'Design Review', startTime: `${day}T11:00:00Z`, endTime: `${day}T12:00:00Z` },
      { title: 'Lunch with Alex', startTime: `${day}T12:30:00Z`, endTime: `${day}T13:30:00Z` },
    ];
  }
);


const createCalendarEvent = ai.defineTool(
    {
        name: 'createCalendarEvent',
        description: 'Creates a new event on the user\'s Google Calendar.',
        inputSchema: z.object({
            title: z.string().describe("The title of the event."),
            startTime: z.string().describe("The start time for the event in ISO 8601 format."),
            endTime: z.string().describe("The end time for the event in ISO 8601 format."),
            description: z.string().optional().describe("A description for the event."),
        }),
        outputSchema: z.object({
            eventId: z.string(),
            status: z.string(),
        }),
    },
    async (input) => {
        console.log(`[Tool] Simulating creating calendar event: "${input.title}"`);
        // This is a mock response.
        return {
            eventId: `evt_${Date.now()}`,
            status: 'confirmed',
        };
    }
);


// Define the main flow for calendar synchronization
const CalendarSyncInputSchema = z.object({
    action: z.enum(['read', 'write']).describe("The action to perform: 'read' to fetch events, 'write' to add an event."),
    day: z.string().describe('The target date in YYYY-MM-DD format.'),
    event: z.object({
        title: z.string(),
        time: z.string().describe("The time of the event, e.g., '14:00'"),
    }).optional().describe("The event to write to the calendar. Required if action is 'write'."),
});
export type CalendarSyncInput = z.infer<typeof CalendarSyncInputSchema>;

const CalendarSyncOutputSchema = z.object({
  status: z.string(),
  message: z.string(),
  events: z.array(z.object({
        title: z.string(),
        startTime: z.string(),
        endTime: z.string(),
    })).optional(),
});
export type CalendarSyncOutput = z.infer<typeof CalendarSyncOutputSchema>;


export async function syncWithGoogleCalendar(input: CalendarSyncInput): Promise<CalendarSyncOutput> {
    return googleCalendarSyncFlow(input);
}


const prompt = ai.definePrompt({
    name: 'googleCalendarSyncPrompt',
    input: { schema: CalendarSyncInputSchema },
    system: `You are an assistant that helps users sync their schedule with Google Calendar.
- If the user wants to 'read', use the listCalendarEvents tool for the specified day.
- If the user wants to 'write', use the createCalendarEvent tool to add the event.
- Provide a clear, concise summary of the action taken.`,
    tools: [listCalendarEvents, createCalendarEvent],
});


const googleCalendarSyncFlow = ai.defineFlow(
    {
        name: 'googleCalendarSyncFlow',
        inputSchema: CalendarSyncInputSchema,
        outputSchema: CalendarSyncOutputSchema,
    },
    async (input) => {
        // This is a simple flow that just calls the LLM. 
        // A more complex flow could involve multiple steps or direct tool calls.
        const llmResponse = await prompt(input);
        const llmOutput = llmResponse.output();
        
        if (!llmOutput) {
            return { status: "error", message: "The AI did not produce a valid response." };
        }
        
        return {
            status: 'success',
            message: llmResponse.text(),
            events: input.action === 'read' ? (llmOutput.tool_outputs?.[0]?.result as any) : undefined
        }
    }
);
