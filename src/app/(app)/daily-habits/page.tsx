"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList } from "lucide-react";

const HABIT_COUNT = 20;

export default function DailyHabitsPage() {
  const [dailyHabits, setDailyHabits] = React.useState<string[]>(Array(HABIT_COUNT).fill(""));
  const { toast } = useToast();

  React.useEffect(() => {
    const savedHabits = localStorage.getItem("dailyHabits");
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      const fullList = Array(HABIT_COUNT).fill("");
      parsed.forEach((h: string, i: number) => {
        if(i < HABIT_COUNT) fullList[i] = h;
      });
      setDailyHabits(fullList);
    }
  }, []);

  const handleHabitChange = (
    index: number,
    value: string,
  ) => {
    const newList = [...dailyHabits];
    newList[index] = value;
    setDailyHabits(newList);
  };

  const handleSave = () => {
    const filteredHabits = dailyHabits.filter(h => h);
    
    localStorage.setItem("dailyHabits", JSON.stringify(filteredHabits));

    console.log("Daily Habits:", filteredHabits);
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
          <CardDescription>List up to 20 habits to practice daily.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyHabits.map((habit, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
              <Input
                type="text"
                value={habit}
                onChange={(e) => handleHabitChange(index, e.target.value)}
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