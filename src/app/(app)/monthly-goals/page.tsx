
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MonthlyGoalsPage() {
  const [bigGoal, setBigGoal] = React.useState("");
  const [monthlyGoals, setMonthlyGoals] = React.useState<string[]>(Array(12).fill(""));
  const { toast } = useToast();

  React.useEffect(() => {
    const savedBigGoal = localStorage.getItem("bigGoal");
    if (savedBigGoal) {
      setBigGoal(savedBigGoal);
    }
  }, []);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...monthlyGoals];
    newGoals[index] = value;
    setMonthlyGoals(newGoals);
  };

  const handleSave = () => {
    console.log("Saving Monthly Goals:", monthlyGoals);
    toast({
      title: "Monthly Goals Saved",
      description: "Your goals for the year have been updated.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Monthly Goals"
        description="Define the goals for each month that will help you get to the 1 big goal and get you closer to your 5-year vision and lifetime goals."
      />

      {bigGoal && (
        <Card className="mb-8 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="font-headline text-amber-900">Your 12-Month "Big Goal"</CardTitle>
            <CardDescription className="text-amber-800">
              This is your north star. Your monthly goals should be stepping stones to achieve this.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-amber-900">{bigGoal}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Monthly Breakdown</CardTitle>
          <CardDescription>
            What do you need to achieve each month to hit your big goal?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyGoals.map((goal, index) => (
            <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4">
              <Label htmlFor={`month-${index + 1}`} className="font-bold text-lg text-muted-foreground">
                {index + 1}
              </Label>
              <Input
                id={`month-${index + 1}`}
                type="text"
                placeholder={`Goal for month ${index + 1}...`}
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Monthly Goals
        </Button>
      </div>
    </div>
  );
}
