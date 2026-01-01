
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

export type CycleSymptom = {
  id: string;
  name: string;
};

export type CycleDay = {
    id: string; // YYYY-MM-DD
    flow: 'none' | 'light' | 'medium' | 'heavy';
    note?: string;
    symptoms?: string[];
};

export type CycleNote = {
    id: string;
    text: string;
    createdAt: string; // ISO string
};

// Add other types from backend.json here as needed
