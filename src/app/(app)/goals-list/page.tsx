"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Brain, Briefcase, HeartHandshake, User, Users } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

const goalCategories = [
  { id: "health", label: "Health & Fitness", icon: Dumbbell },
  { id: "mind", label: "Strong Mind", icon: Brain },
  { id: "career", label: "Career/Profession", icon: Briefcase },
  { id: "personal", label: "Personal", icon: User },
  { id: "family", label: "Family & Friends", icon: Users },
];

type GoalState = Record<string, { shortTerm: string; longTerm: string }>;

export default function GoalsListPage() {
  const initialSate = goalCategories.reduce((acc, cat) => {
    acc[cat.id] = { shortTerm: "", longTerm: ""};
    return acc;
  }, {} as GoalState)
  const [goals, setGoals] = React.useState<GoalState>(initialSate);
  const { toast } = useToast();

  const handleGoalChange = (category: string, type: "shortTerm" | "longTerm", value: string) => {
    setGoals(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving goals:", goals);
    toast({
        title: "Goals Saved!",
        description: "Your short and long-term goals have been updated.",
    })
  }

  return (
    <div>
      <PageHeader
        title="Set Your Goals"
        description="Define your short-term (this year) and long-term (3-5 years) goals across the most important areas of your life."
      />
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {goalCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {goalCategories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <cat.icon className="h-6 w-6 text-primary" /> {cat.label} Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor={`${cat.id}-short`}>Short-Term Goal (1 year)</Label>
                  <Textarea
                    id={`${cat.id}-short`}
                    placeholder={`e.g., Go to the gym 3 times a week.`}
                    value={goals[cat.id]?.shortTerm}
                    onChange={(e) => handleGoalChange(cat.id, 'shortTerm', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${cat.id}-long`}>Long-Term Goal (3-5 years)</Label>
                  <Textarea
                    id={`${cat.id}-long`}
                    placeholder={`e.g., Complete a full marathon.`}
                    value={goals[cat.id]?.longTerm}
                    onChange={(e) => handleGoalChange(cat.id, 'longTerm', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>Save All Goals</Button>
      </div>
    </div>
  );
}
