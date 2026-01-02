
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ListPlus, ListX } from "lucide-react";
import { demoPersona } from "@/lib/demo-data";

const HABIT_COUNT = 12;

export default function DemoHabitsPage() {
  const { toast } = useToast();

  const startHabits = React.useMemo(() => {
    const padded = Array(HABIT_COUNT).fill('');
    demoPersona.habitsToStart.forEach((h, i) => { if (i < HABIT_COUNT) padded[i] = h; });
    return padded;
  }, []);

  const stopHabits = React.useMemo(() => {
    const padded = Array(HABIT_COUNT).fill('');
    demoPersona.habitsToStop.forEach((h, i) => { if (i < HABIT_COUNT) padded[i] = h; });
    return padded;
  }, []);


  const handleSave = () => {
    toast({
      title: "Demo Mode",
      description: "Your changes are not saved in the demo.",
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
              <div key={`start-${index}`} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  defaultValue={habit}
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
              <div key={`stop-${index}`} className="flex items-center gap-3">
                 <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  defaultValue={habit}
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
