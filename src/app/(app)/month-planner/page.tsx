
"use client";

import * as React from "react";
import { format } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

const initialGoals: Goal[] = [
  { id: "1", text: "Send a good application for TechHaven 2025", completed: true },
  { id: "2", text: "Certify with the Raspberry Pi Foundation - Tutor", completed: true },
  { id: "3", text: "Send Application to be a Raspberry Pi Foundation Cert. partner", completed: false },
  { id: "4", text: "Set a bible reading schedule and plan", completed: false },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthPlannerPage() {
  const [currentMonth] = React.useState(new Date());
  const [bigGoal, setBigGoal] = React.useState("");
  const [monthlyBigGoal, setMonthlyBigGoal] = React.useState("To plan out the year and related APIs");
  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);
  const [fiveWords, setFiveWords] = React.useState(["Driven", "Attentive", "Determined", "Amazing", "Inspired"]);
  const { toast } = useToast();
  
  React.useEffect(() => {
    const savedBigGoal = localStorage.getItem("bigGoal");
    if (savedBigGoal) {
      setBigGoal(savedBigGoal);
    }
  }, []);

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
  };
  
  const handleSave = () => {
    console.log("Saving Monthly Planner Data...");
    toast({
        title: "Planner Saved!",
        description: "Your monthly plan has been successfully saved."
    })
  }

  const goalsAchieved = goals.filter(g => g.completed).length;
  const goalsSet = goals.length;
  const achievementRate = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={`Monthly Goals and Plans - ${format(currentMonth, "MMMM").toUpperCase()}`}
        description="Here's your space to plan out your month in detail and track your progress."
      />

      <Card className="mb-6">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-muted-foreground">5 Year Vision:</p>
            <p className="font-bold">Award Winning Professional</p>
          </div>
           <div className="space-y-1">
            <p className="font-semibold text-muted-foreground">Big Goal for the YEAR:</p>
            <p className="font-bold">{bigGoal || "Not set yet"}</p>
          </div>
           <div className="space-y-1">
            <p className="font-semibold text-muted-foreground">Big Goal for the MONTH:</p>
            <Input className="font-bold" value={monthlyBigGoal} onChange={(e) => setMonthlyBigGoal(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Goals For This Month</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {goals.map(goal => (
                         <div key={goal.id} className="flex items-center gap-3 p-2 rounded-md border">
                            <Checkbox id={`goal-${goal.id}`} checked={goal.completed} onCheckedChange={() => handleToggleGoal(goal.id)} />
                            <label htmlFor={`goal-${goal.id}`} className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {goal.text}
                            </label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Game Changers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="What are your game changers this month?" rows={3} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Must Win Battles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="What battles must you win?" rows={3} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{goalsAchieved}</p>
                        <p className="text-xs text-muted-foreground">Goals Achieved</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold">{achievementRate}%</p>
                        <p className="text-xs text-muted-foreground">Goals Set: {goalsSet}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5 Words for the Month</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {fiveWords.map((word, index) => (
            <Input 
                key={index}
                value={word}
                onChange={(e) => {
                    const newWords = [...fiveWords];
                    newWords[index] = e.target.value;
                    setFiveWords(newWords);
                }}
                className="text-center font-semibold"
             />
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
            <CardTitle>Thought for the Month</CardTitle>
        </CardHeader>
        <CardContent>
            <blockquote className="text-center italic text-lg text-muted-foreground">
                &ldquo;Define goals clearly and take decisive actions.&rdquo;
            </blockquote>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Month Plan
        </Button>
      </div>
    </div>
  );
}
