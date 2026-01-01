

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

export type JournalEntry = {
    id: string;
    sessionID: string;
    entryType: 'affirmation' | 'gratitude' | 'reason' | 'philosophy' | 'trait_word' | 'trait_meaning' | 'habit_start_focus' | 'habit_stop_focus';
    text: string;
    relatedId?: string; // For trait_meaning, this links to the trait_word entry
};

export type DailyHabit = {
    id: string;
    sessionID: string;
    text: string;
    order: number;
};

export type CategoryGoal = {
    id: string;
    sessionID: string;
    category: string;
    shortTermGoal: string;
    longTermGoal: string;
}

export type HabitToManage = {
    id: string;
    sessionID: string;
    text: string;
    type: 'start' | 'stop';
}

export type MonthlyGoal = {
    id: string; // YYYY-MM
    sessionID: string;
    goals: { id: string; text: string; completed: boolean }[];
    bigGoal: string;
}

export type WeeklyPlan = {
    id: string; // YYYY-WW (e.g., 2024-28)
    sessionID: string;
    bigGoal: string;
    goals: { id: string; text: string; priority: boolean }[];
    affirmations: string[];
    peopleToConnect: { id: string; name: string; connected: boolean }[];
    schedule: Record<string, { morning: string, afternoon: string, evening: string }>;
}

export type DailyPlan = {
    id: string; // YYYY-MM-DD
    sessionID: string;
    todaysBigGoal: string;
    priorities: { id: string, text: string, completed: boolean }[];
    schedule: Record<string, { task: string, priority: 'High' | 'Medium' | 'Low', notes: string }>;
    habits: Record<string, boolean>;
    gratitude: string;
    reflection: string;
}

export type VisionStatement = {
    id: string;
    sessionID: string;
    statementText: string;
    goalText: string;
}

export type VisionBoardImage = {
    id: string;
    sessionID: string;
    imageUrl: string;
    caption: string;
    imageHint: string;
}

// Add other types from backend.json here as needed
