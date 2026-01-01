
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
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

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
  const [fiveYearVision, setFiveYearVision] = React.useState("");
  const [monthlyGoals, setMonthlyGoals] = React.useState<string[]>([]);
  const [selectedMonthlyBigGoal, setSelectedMonthlyBigGoal] = React.useState<string | undefined>(undefined);
  const [monthlyBigGoal, setMonthlyBigGoal] = React.useState("To plan out the year and related APIs");
  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);
  const [fiveWords, setFiveWords] = React.useState(["Driven", "Attentive", "Determined", "Amazing", "Inspired"]);
  const { toast } = useToast();
  
  React.useEffect(() => {
    const savedBigGoal = localStorage.getItem("bigGoal");
    if (savedBigGoal) {
      setBigGoal(savedBigGoal);
    }
    const saved5YearVision = localStorage.getItem("5YearVision");
    if (saved5YearVision) {
      setFiveYearVision(saved5YearVision);
    }
    const savedMonthlyGoals = localStorage.getItem("monthlyGoals");
    if (savedMonthlyGoals) {
      setMonthlyGoals(JSON.parse(savedMonthlyGoals));
    }
    const savedMonthlyBigGoal = localStorage.getItem("monthlyBigGoal");
    if (savedMonthlyBigGoal) {
        setSelectedMonthlyBigGoal(savedMonthlyBigGoal);
    }
  }, []);

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
  };
  
  const handleSave = () => {
    if (selectedMonthlyBigGoal) {
      localStorage.setItem("monthlyBigGoal", selectedMonthlyBigGoal);
    }
    console.log("Saving Monthly Planner Data...");
    toast({
        title: "Planner Saved!",
        description: "Your monthly plan has been successfully saved."
    })
  }

  const handleMonthlyBigGoalChange = (value: string) => {
    setSelectedMonthlyBigGoal(value);
  }

  const handleGoalTextChange = (id: string, text: string) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, text } : goal));
  };

  const handleAddGoal = () => {
    const newGoal: Goal = { id: Date.now().toString(), text: "", completed: false };
    setGoals([...goals, newGoal]);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };


  const goalsAchieved = goals.filter(g => g.completed).length;
  const goalsSet = goals.length;
  const achievementRate = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;
  
  const availableMonthlyGoals = monthlyGoals.filter(g => g && g.trim() !== "");

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
            <p className="font-bold">{fiveYearVision || "Not set yet"}</p>
          </div>
           <div className="space-y-1">
            <p className="font-semibold text-muted-foreground">Big Goal for the YEAR:</p>
            <p className="font-bold">{bigGoal || "Not set yet"}</p>
          </div>
           <div className="space-y-1">
            <p className="font-semibold text-muted-foreground">Big Goal for the MONTH:</p>
            <Select onValueChange={handleMonthlyBigGoalChange} value={selectedMonthlyBigGoal}>
              <SelectTrigger className="font-bold">
                <SelectValue placeholder="Select a goal for the month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonthlyGoals.length > 0 ? (
                  availableMonthlyGoals.map((goal, index) => (
                    <SelectItem key={index} value={goal}>
                      {goal}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-goals" disabled>No monthly goals set</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Goals For This Month</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {goals.map(goal => (
                         <div key={goal.id} className="flex items-center gap-3">
                            <Checkbox id={`goal-${goal.id}`} checked={goal.completed} onCheckedChange={() => handleToggleGoal(goal.id)} />
                            <Input
                                id={`goal-text-${goal.id}`}
                                value={goal.text}
                                onChange={(e) => handleGoalTextChange(goal.id, e.target.value)}
                                className={`flex-1 text-sm h-auto py-1.5 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveGoal(goal.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-4" onClick={handleAddGoal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
                </Button>
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
