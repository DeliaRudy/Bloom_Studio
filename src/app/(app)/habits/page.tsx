
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ListPlus, ListX } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { HabitToManage } from "@/lib/types";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const HABIT_COUNT = 12;

export default function HabitsPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const habitsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/habitsToManage`);
  }, [firestore, user]);

  const { data: habitsData, isLoading } = useCollection<HabitToManage>(habitsCollection);

  const startHabits = React.useMemo(() => {
    const habits = habitsData?.filter(h => h.type === 'start') || [];
    const padded = Array(HABIT_COUNT).fill({ id: '', text: '' });
    habits.forEach((h, i) => { if (i < HABIT_COUNT) padded[i] = h; });
    return padded;
  }, [habitsData]);

  const stopHabits = React.useMemo(() => {
    const habits = habitsData?.filter(h => h.type === 'stop') || [];
    const padded = Array(HABIT_COUNT).fill({ id: '', text: '' });
    habits.forEach((h, i) => { if (i < HABIT_COUNT) padded[i] = h; });
    return padded;
  }, [habitsData]);

  const handleHabitChange = (
    habit: Partial<HabitToManage>,
    value: string,
    type: 'start' | 'stop'
  ) => {
    if (!habitsCollection) return;

    if (habit.id) { // Existing habit
      const docRef = doc(habitsCollection, habit.id);
      if (value.trim() === "") {
        deleteDocumentNonBlocking(docRef);
      } else {
        updateDocumentNonBlocking(docRef, { text: value });
      }
    } else { // New habit
      if (value.trim() !== "") {
        addDocumentNonBlocking(habitsCollection, { text: value, type, sessionID: 'default' });
      }
    }
  };

  const handleSave = () => {
    toast({
      title: "Habits Saved",
      description: "Your new habits have been successfully saved.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Habit Tracker"
        description="The secret to your future is hidden in your daily routine. Define the habits you want to build and those you want to break."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListPlus className="h-6 w-6 text-green-500" />
              Habits to Start
            </CardTitle>
            <CardDescription>List up to 12 habits you want to cultivate this year.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {isLoading ? <p>Loading...</p> : startHabits.map((habit, index) => (
              <div key={habit.id || `start-${index}`} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  defaultValue={habit.text}
                  onBlur={(e) => handleHabitChange(habit, e.target.value, 'start')}
                  placeholder="e.g., Read for 30 minutes every day"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListX className="h-6 w-6 text-red-500" />
              Habits to Stop
            </CardTitle>
            <CardDescription>List up to 12 habits you want to break this year.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? <p>Loading...</p> : stopHabits.map((habit, index) => (
              <div key={habit.id || `stop-${index}`} className="flex items-center gap-3">
                 <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  defaultValue={habit.text}
                  onBlur={(e) => handleHabitChange(habit, e.target.value, 'stop')}
                  placeholder="e.g., Stop scrolling social media after 9 PM"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save My Habits
        </Button>
      </div>
    </div>
  );
}
