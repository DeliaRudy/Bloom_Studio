'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-progress-reflections.ts';
import '@/ai/flows/smart-goal-analyzer.ts';
import '@/ai/flows/generate-avatar.ts';
import '@/ai/flows/predict-cycle-phases.ts';
import '@/ai/flows/send-email-notification.ts';
import '@/ai/flows/google-calendar-sync.ts';
import '@/ai/flows/narrate-text-flow.ts';
import '@/ai/flows/persona-interview-flow.ts';
import '@/ai/flows/daily-plan-interview.ts';
import '@/ai/flows/weekly-plan-interview.ts';
import '@/ai/flows/month-planner-interview.ts';
import '@/ai/flows/monthly-goals-interview.ts';
    
