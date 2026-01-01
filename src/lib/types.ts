
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

// Add other types from backend.json here as needed
