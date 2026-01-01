
"use client";

import * as React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WeeklyGoal = {
  id: string;
  text: string;
  priority: boolean;
};

const initialGoals: WeeklyGoal[] = [
  { id: "1", text: "Get the schedule for the future distributor", priority: true },
  { id: "2", text: "Get the Auto", priority: false },
  { id: "3", text: "Practice Officer Tang Schedule", priority: false },
];

export default function WeekPlannerPage() {
  const { toast } = useToast();
  const [week, setWeek] = React.useState(new Date());

  const [fiveYearVision, setFiveYearVision] = React.useState("");
  const [bigGoalYear, setBigGoalYear] = React.useState("");
  const [bigGoalMonth, setBigGoalMonth] = React.useState("");
  const [bigGoalWeek, setBigGoalWeek] = React.useState("");

  const [weeklyGoals, setWeeklyGoals] = React.useState<WeeklyGoal[]>(initialGoals);
  const [goalsAchieved, setGoalsAchieved] = React.useState(0);
  
  const [affirmations, setAffirmations] = React.useState("");
  const [habits, setHabits] = React.useState("");
  const [peopleToConnect, setPeopleToConnect] = React.useState("");


  React.useEffect(() => {
    const saved5YearVision = localStorage.getItem("5YearVision");
    if (saved5YearVision) setFiveYearVision(saved5YearVision);

    const savedBigGoal = localStorage.getItem("bigGoal");
    if (savedBigGoal) setBigGoalYear(savedBigGoal);

    const savedMonthlyBigGoal = localStorage.getItem("monthlyBigGoal");
    if (savedMonthlyBigGoal) setBigGoalMonth(savedMonthlyBigGoal);
  }, []);

  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handleSave = () => {
    toast({
      title: "Week Planner Saved!",
      description: "Your plan for the week has been successfully saved.",
    });
  };
  
  const handleAddGoal = () => {
    setWeeklyGoals([...weeklyGoals, { id: Date.now().toString(), text: "", priority: false }]);
  };

  const handleRemoveGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.filter(goal => goal.id !== id));
  };

  const handleGoalChange = (id: string, text: string) => {
    setWeeklyGoals(weeklyGoals.map(goal => goal.id === id ? { ...goal, text } : goal));
  };
  
  const handlePriorityChange = (id: string) => {
    setWeeklyGoals(weeklyGoals.map(goal => goal.id === id ? { ...goal, priority: !goal.priority } : goal));
  };

  const goalsSet = weeklyGoals.length;
  const score = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={`Weekly Plan - Week ${format(week, "w")}`}
        description={`Begin with Focus. ${format(weekStart, "MMMM d")} - ${format(addDays(weekStart, 6), "MMMM d, yyyy")}`}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>High-Level Focus</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Label className="w-36 font-semibold text-muted-foreground">5 Year Vision:</Label>
                <Input value={fiveYearVision} readOnly disabled className="font-bold" />
            </div>
             <div className="flex items-center gap-2">
                <Label className="w-36 font-semibold text-muted-foreground">Big Goal for YEAR:</Label>
                <Input value={bigGoalYear} readOnly disabled className="font-bold" />
            </div>
          </div>
          <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="w-36 font-semibold text-muted-foreground">Big Goal for MONTH:</Label>
                <Input value={bigGoalMonth} readOnly disabled className="font-bold" />
            </div>
             <div className="flex items-center gap-2">
                <Label className="w-36 font-semibold text-muted-foreground">Big Goal for WEEK:</Label>
                <Input placeholder="Define your main goal for this week..." value={bigGoalWeek} onChange={e => setBigGoalWeek(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
            <CardTitle>Weekly Schedule & Goals</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-12 gap-0">
                <div className="col-span-3 pr-4">
                    <h3 className="font-bold mb-2 text-center">Goals for the Week</h3>
                    <div className="space-y-2">
                        {weeklyGoals.map(goal => (
                            <div key={goal.id} className="flex items-center gap-2">
                                <Checkbox checked={goal.priority} onCheckedChange={() => handlePriorityChange(goal.id)} title="Mark as priority" />
                                <Input value={goal.text} onChange={e => handleGoalChange(goal.id, e.target.value)} className="h-8" />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveGoal(goal.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={handleAddGoal}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
                        </Button>
                    </div>
                </div>
                <div className="col-span-9">
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24 font-bold">Time</TableHead>
                                {weekDays.map(day => (
                                    <TableHead key={day.toISOString()} className="text-center font-bold">
                                        {format(day, "EEEE").toUpperCase()}
                                        <p className="font-normal text-xs">{format(day, "MMM d")}</p>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold align-middle text-center -rotate-90">MORNING</TableCell>
                                {Array.from({length: 7}).map((_, i) => <TableCell key={i}><Textarea className="min-h-24 bg-transparent border-0 focus-visible:ring-0" /></TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold align-middle text-center -rotate-90">AFTERNOON</TableCell>
                                {Array.from({length: 7}).map((_, i) => <TableCell key={i}><Textarea className="min-h-24 bg-transparent border-0 focus-visible:ring-0" /></TableCell>)}
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-bold align-middle text-center -rotate-90">EVENING</TableCell>
                                 {Array.from({length: 7}).map((_, i) => <TableCell key={i}><Textarea className="min-h-24 bg-transparent border-0 focus-visible:ring-0" /></TableCell>)}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
            <CardHeader><CardTitle>Affirmations for the Week</CardTitle></CardHeader>
            <CardContent>
                <Textarea value={affirmations} onChange={e => setAffirmations(e.target.value)} placeholder="Write your weekly affirmations..." />
            </CardContent>
        </Card>
         <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Habits for the Week</CardTitle></CardHeader>
                <CardContent>
                     <Textarea value={habits} onChange={e => setHabits(e.target.value)} placeholder="What habits are you focusing on?" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>People to Connect with This Week</CardTitle></CardHeader>
                <CardContent>
                    <Textarea value={peopleToConnect} onChange={e => setPeopleToConnect(e.target.value)} placeholder="List people you want to connect with..." />
                </CardContent>
            </Card>
        </div>
      </div>

       <Card>
        <CardHeader><CardTitle>Weekly Goal Achievement Score</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <Label># Goals Set:</Label>
                <Input value={goalsSet} readOnly className="w-16 text-center font-bold" />
            </div>
             <div className="flex items-center gap-2">
                <Label># Goals Achieved:</Label>
                <Input type="number" value={goalsAchieved} onChange={e => setGoalsAchieved(Number(e.target.value))} className="w-16" />
            </div>
            <div className="flex items-center gap-2">
                <Label>Score:</Label>
                <Input value={`${score}%`} readOnly className="w-20 text-center font-bold" />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Week Plan
        </Button>
      </div>
    </div>
  );
}
