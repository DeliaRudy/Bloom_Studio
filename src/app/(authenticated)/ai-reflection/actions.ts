
'use server';

import { aiProgressReflections, type AIProgressReflectionsInput } from "@/ai/flows/ai-progress-reflections";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

export type ReflectionState = {
    summaryReflection: string | null;
    detailedReflection: string | null;
    error: string | null;
};


export async function getAIReflection(
  previousState: ReflectionState,
  formData: FormData
): Promise<ReflectionState> {
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const allData = formData.get('allData') as string;
    
    if (!startDate || !endDate || !allData) {
        return { ...initialState, error: "Missing required data for reflection." };
    }
    
    try {
        const result = await aiProgressReflections({
            startDate,
            endDate,
            allData: JSON.parse(allData),
        });

        if (!result.summaryReflection) {
            return {
                ...initialState,
                error: "Could not generate a reflection. Try expanding the date range or adding more data to your plans.",
            };
        }

        return {
            summaryReflection: result.summaryReflection,
            detailedReflection: result.detailedReflection,
            error: null,
        };

    } catch (e: any) {
        console.error("Error getting AI reflection:", e);
        return {
            ...initialState,
            error: e.message || "An unknown error occurred.",
        };
    }
}

const initialState = {
  summaryReflection: null,
  detailedReflection: null,
  error: null,
};
