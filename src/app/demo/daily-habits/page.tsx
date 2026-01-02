
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList } from "lucide-react";
import { demoDailyHabits } from "@/lib/demo-data";

const HABIT_COUNT = 20;

export default function DemoDailyHabitsPage() {
  const { toast } = useToast();

  const dailyHabits = React.useMemo(() => {
    const habits = Array(HABIT_COUNT).fill('');
    demoDailyHabits.forEach((h, i) => { if (i < HABIT_COUNT) habits[i] = h; });
    return habits;
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
          {dailyHabits.map((habit, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
              <Input
                type="text"
                defaultValue={habit}
                placeholder={index >= demoDailyHabits.length ? `Habit #${index + 1}` : ''}
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
