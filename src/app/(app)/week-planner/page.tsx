
"use client";

import * as React from "react";
import { format, addDays, startOfWeek, getMonth } from "date-fns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

type Affirmation = {
  id: string;
  text: string;
}

type PersonToConnect = {
    id: string;
    name: string;
    connected: boolean;
};

type WeeklyPlanData = {
    bigGoal: string;
    weeklyGoals: WeeklyGoal[];
    goalsAchieved: number;
    selectedAffirmations: string[];
    peopleToConnect: PersonToConnect[];
    schedule: Record<string, Record<string, string>>;
}

export default function WeekPlannerPage() {
  const { toast } = useToast();
  const [week, setWeek] = React.useState(new Date());

  const [fiveYearVision, setFiveYearVision] = React.useState("");
  const [bigGoalYear, setBigGoalYear] = React.useState("");
  const [bigGoalMonth, setBigGoalMonth] = React.useState("");

  const [weeklyPlans, setWeeklyPlans] = React.useState<Record<string, Partial<WeeklyPlanData>>>({});

  const [availableAffirmations, setAvailableAffirmations] = React.useState<Affirmation[]>([]);
  
  const [habits, setHabits] = React.useState("");
  
  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekKey = format(weekStart, 'yyyy-MM-dd');

  const getPlanForWeek = React.useCallback((key: string): Partial<WeeklyPlanData> => {
    return weeklyPlans[key] || {
        bigGoal: "",
        weeklyGoals: initialGoals,
        goalsAchieved: 0,
        selectedAffirmations: [],
        peopleToConnect: [],
        schedule: {},
    };
  }, [weeklyPlans]);

  const currentPlan = getPlanForWeek(weekKey);
  
  const updatePlanForWeek = (key: string, newPlan: Partial<WeeklyPlanData>) => {
    const existingPlan = getPlanForWeek(key);
    setWeeklyPlans(prev => ({
        ...prev,
        [key]: { ...existingPlan, ...newPlan }
    }));
  };

  React.useEffect(() => {
    const savedWeeklyGoals = localStorage.getItem('weeklyGoals');
    if (savedWeeklyGoals) {
        setWeeklyPlans(JSON.parse(savedWeeklyGoals));
    }
    
    const saved5YearVision = localStorage.getItem("5YearVision");
    setFiveYearVision(saved5YearVision || "Not set yet");

    const savedBigGoal = localStorage.getItem("bigGoal");
    setBigGoalYear(savedBigGoal || "Not set yet");
    
    const savedMonthlyBigGoal = localStorage.getItem("monthlyBigGoal");
    setBigGoalMonth(savedMonthlyBigGoal || "Not set yet");
    
    const savedAffirmations = localStorage.getItem("affirmations");
    if (savedAffirmations) {
        const parsedAffirmations = JSON.parse(savedAffirmations);
        if (Array.isArray(parsedAffirmations)) {
            setAvailableAffirmations(parsedAffirmations.filter(a => a.text));
        }
    }

    const startHabit = localStorage.getItem("selectedStartHabit");
    const stopHabit = localStorage.getItem("selectedStopHabit");

    let habitsText = "";
    if(startHabit && startHabit !== 'undefined') habitsText += `Start: ${startHabit}\n`;
    if(stopHabit && stopHabit !== 'undefined') habitsText += `Stop: ${stopHabit}`;

    setHabits(habitsText.trim() || "Not set yet");

  }, [week]);


  const handleSave = () => {
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyPlans));
    toast({
      title: "Week Planner Saved!",
      description: "Your plan for the week has been successfully saved.",
    });
  };

  const handleBigGoalWeekChange = (value: string) => {
    updatePlanForWeek(weekKey, { bigGoal: value });
  };
  
  const handleAddGoal = () => {
    const newGoals = [...(currentPlan.weeklyGoals || []), { id: Date.now().toString(), text: "", priority: false }];
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleRemoveGoal = (id: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).filter(goal => goal.id !== id);
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleGoalChange = (id: string, text: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).map(goal => goal.id === id ? { ...goal, text } : goal);
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };
  
  const handlePriorityChange = (id: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).map(goal => goal.id === id ? { ...goal, priority: !goal.priority } : goal);
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleAffirmationSelect = (affirmationText: string) => {
    const currentAffirmations = currentPlan.selectedAffirmations || [];
    let newAffirmations: string[];
    if (currentAffirmations.includes(affirmationText)) {
        newAffirmations = currentAffirmations.filter(a => a !== affirmationText);
    } else if (currentAffirmations.length < 4) {
        newAffirmations = [...currentAffirmations, affirmationText];
    } else {
        toast({
            title: "Limit Reached",
            description: "You can select up to 4 affirmations.",
            variant: "destructive"
        })
        newAffirmations = currentAffirmations;
    }
    updatePlanForWeek(weekKey, { selectedAffirmations: newAffirmations });
  };

  const handleAddPerson = () => {
    const currentPeople = currentPlan.peopleToConnect || [];
    if (currentPeople.length < 7) {
        const newPeople = [...currentPeople, {id: Date.now().toString(), name: "", connected: false}];
        updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
    } else {
        toast({
            title: "Limit Reached",
            description: "You can add up to 7 people to connect with.",
            variant: "destructive",
        })
    }
  };

  const handleRemovePerson = (id: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).filter(p => p.id !== id);
    updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handlePersonNameChange = (id: string, name: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).map(p => p.id === id ? {...p, name} : p);
    updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handleToggleConnected = (id: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).map(p => p.id === id ? {...p, connected: !p.connected} : p);
     updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handleGoalsAchievedChange = (value: number) => {
    updatePlanForWeek(weekKey, { goalsAchieved: value });
  };

  const goalsSet = currentPlan.weeklyGoals?.length || 0;
  const goalsAchievedValue = currentPlan.goalsAchieved || 0;
  const score = goalsSet > 0 ? Math.round((goalsAchievedValue / goalsSet) * 100) : 0;

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
                <Input placeholder="Define your main goal for this week..." value={currentPlan.bigGoal} onChange={e => handleBigGoalWeekChange(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
            <CardTitle>Weekly Schedule & Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-bold mb-2 text-center">Goals for the Week</h3>
                <div className="space-y-2 max-w-lg mx-auto">
                    {(currentPlan.weeklyGoals || []).map(goal => (
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
            <div>
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
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
            <CardHeader><CardTitle>Affirmations for the Week</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label>Select up to 4 affirmations</Label>
                    <Select onValueChange={handleAffirmationSelect} value={(currentPlan.selectedAffirmations || []).join(', ')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select affirmations for the week" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableAffirmations.length > 0 ? (
                                availableAffirmations.map((affirmation) => (
                                    <SelectItem 
                                        key={affirmation.id} 
                                        value={affirmation.text} 
                                        onSelect={(e) => { e.preventDefault(); handleAffirmationSelect(affirmation.text)}}>
                                        <div className="flex items-center">
                                            <Checkbox checked={(currentPlan.selectedAffirmations || []).includes(affirmation.text)} className="mr-2"/>
                                            <span>{affirmation.text}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-affirmations" disabled>No affirmations defined yet</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                     <div className="flex flex-wrap gap-1 pt-2">
                        {(currentPlan.selectedAffirmations || []).map(affirmation => <Badge key={affirmation} variant="secondary">{affirmation}</Badge>)}
                    </div>
                </div>
            </CardContent>
        </Card>
         <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Habits for the Week</CardTitle></CardHeader>
                <CardContent>
                     <Textarea value={habits} readOnly disabled rows={3} placeholder="Not set yet"/>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>People to Connect with This Week</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {(currentPlan.peopleToConnect || []).map(person => (
                            <div key={person.id} className="flex items-center gap-2">
                                <Checkbox id={`person-${person.id}`} checked={person.connected} onCheckedChange={() => handleToggleConnected(person.id)} />
                                <Input
                                    value={person.name}
                                    onChange={(e) => handlePersonNameChange(person.id, e.target.value)}
                                    placeholder="Enter person's name..."
                                    className={`h-8 ${person.connected ? 'line-through text-muted-foreground' : ''}`}
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemovePerson(person.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={handleAddPerson} disabled={(currentPlan.peopleToConnect || []).length >= 7}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Person
                        </Button>
                    </div>
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
                <Input type="number" value={goalsAchievedValue} onChange={e => handleGoalsAchievedChange(Number(e.target.value))} className="w-16" />
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
