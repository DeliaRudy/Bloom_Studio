
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ListPlus, ListX } from "lucide-react";

const HABIT_COUNT = 12;

export default function HabitsPage() {
  const [startHabits, setStartHabits] = React.useState<string[]>(Array(HABIT_COUNT).fill(""));
  const [stopHabits, setStopHabits] = React.useState<string[]>(Array(HABIT_COUNT).fill(""));
  const { toast } = useToast();

  const handleHabitChange = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleSave = () => {
    console.log("Habits to Start:", startHabits.filter(h => h));
    console.log("Habits to Stop:", stopHabits.filter(h => h));
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
            {startHabits.map((habit, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  value={habit}
                  onChange={(e) => handleHabitChange(index, e.target.value, startHabits, setStartHabits)}
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
            {stopHabits.map((habit, index) => (
              <div key={index} className="flex items-center gap-3">
                 <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  value={habit}
                  onChange={(e) => handleHabitChange(index, e.target.value, stopHabits, setStopHabits)}
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
