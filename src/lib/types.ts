
export type ActionPlanItem = {
    id: string;
    itemText: string;
    isCompleted: boolean;
    sessionID: string;
};

export type SuccessDefinition = {
    id: string;
    definitionText: string;
    facets: string[];
    sessionID: string;
};

export type CycleDay = {
    id: string; // YYYY-MM-DD
    flow: 'none' | 'light' | 'medium' | 'heavy';
    notes: CycleNote[];
};

export type CycleNote = {
    id: string;
    text: string;
    createdAt: string; // ISO string
};

// Add other types from backend.json here as needed
