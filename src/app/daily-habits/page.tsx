
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Trash2 } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { DailyHabit } from "@/lib/types";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const HABIT_COUNT = 20;

export default function DailyHabitsPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const habitsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/dailyHabits`);
  }, [firestore, user]);

  const { data: habitsData, isLoading } = useCollection<DailyHabit>(habitsCollection);

  const dailyHabits = React.useMemo(() => {
    const habits = Array(HABIT_COUNT).fill(null).map((_, index) => {
        const habit = habitsData?.find(h => h.order === index);
        return habit || { id: `new-${index}`, text: "", order: index, sessionID: 'default' };
    });
    return habits;
  }, [habitsData]);

  const handleHabitChange = (
    index: number,
    value: string,
  ) => {
    const habit = dailyHabits[index];
    if (!habitsCollection) return;
    
    if (habit.id.startsWith('new-')) {
        if(value.trim() !== "") {
            addDocumentNonBlocking(habitsCollection, { text: value, order: index, sessionID: 'default' });
        }
    } else {
        const docRef = doc(habitsCollection, habit.id);
        if (value.trim() === "") {
            deleteDocumentNonBlocking(docRef);
        } else {
            updateDocumentNonBlocking(docRef, { text: value });
        }
    }
  };

  const handleSave = () => {
    toast({
      title: "Daily Habits Saved",
      description: "Your daily habits have been successfully saved.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Daily Habits"
        description="Your daily routine is the foundation of your success. List up to 20 habits you want to practice each day."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            My Daily Habits
          </CardTitle>
          <CardDescription>List up to 20 habits to practice daily. These will appear in your Daily Plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? <p>Loading habits...</p> : dailyHabits.map((habit, index) => (
            <div key={habit.id || index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
              <Input
                type="text"
                defaultValue={habit.text}
                onBlur={(e) => handleHabitChange(index, e.target.value)}
                placeholder={`e.g., Meditate for 10 minutes`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Daily Habits
        </Button>
      </div>
    </div>
  );
}
