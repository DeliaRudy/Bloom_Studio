
"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { eachDayOfInterval, startOfYear, endOfYear, format, isToday, differenceInDays, getMonth } from "date-fns";
import { BookOpenCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Priority = {
  id: string;
  text: string;
  completed: boolean;
};

type ScheduleItem = {
    task: string;
    priority: "High" | "Medium" | "Low";
    notes: string;
}

type DailyPlan = {
  priorities: Priority[];
  schedule: Record<string, ScheduleItem>;
  reflection: string;
  gratitude: string;
  habits: Record<string, boolean>;
  todaysBigGoal: string;
  weeklyBigGoal: string;
};

const hours = Array.from({ length: 15 }, (_, i) => `${(i + 6).toString().padStart(2, '0')}:00`); // 6am to 8pm

export function DailyPlanClient() {
  const year2026 = new Date("2026-01-01T00:00:00");
  const daysOf2026 = eachDayOfInterval({
    start: startOfYear(year2026),
    end: endOfYear(year2026),
  });

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [dailyPlans, setDailyPlans] = React.useState<Record<string, DailyPlan>>({});
  const [dailyHabits, setDailyHabits] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [fiveYearVision, setFiveYearVision] = React.useState("");
  const [bigGoalYear, setBigGoalYear] = React.useState("");
  const [bigGoalMonth, setBigGoalMonth] = React.useState("");
  
  React.useEffect(() => {
    // Load data from local storage
    const savedPlans = localStorage.getItem("dailyPlans2026");
    if (savedPlans) {
      setDailyPlans(JSON.parse(savedPlans));
    }
    const savedHabits = localStorage.getItem("dailyHabits");
    if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        setDailyHabits(parsedHabits.filter((h: string) => h && h.trim() !== ''));
    }

    const saved5YearVision = localStorage.getItem("5YearVision");
    setFiveYearVision(saved5YearVision || "not set yet");

    const savedBigGoalYear = localStorage.getItem("bigGoal");
    setBigGoalYear(savedBigGoalYear || "not set yet");
    
    if (!api) return;

    const today = new Date();
    let initialSlide = 0;
    if (today.getFullYear() === 2026) {
        initialSlide = differenceInDays(today, startOfYear(year2026));
    }

    api.scrollTo(initialSlide, true);
    setCurrent(api.selectedScrollSnap());


    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex);
      const selectedDate = daysOf2026[selectedIndex];
      const monthIndex = getMonth(selectedDate);
      const monthlyGoals = JSON.parse(localStorage.getItem("monthlyGoals") || "[]");
      setBigGoalMonth(monthlyGoals[monthIndex] || "not set yet");
    };

    api.on("select", onSelect);
    onSelect(); // initial call
    return () => {
      api.off("select", onSelect);
    };

  }, [api]);
  
  const getPlanForDay = (date: Date): DailyPlan => {
    const dateString = format(date, "yyyy-MM-dd");
    return dailyPlans[dateString] || {
      priorities: [
        { id: "1", text: "", completed: false },
        { id: "2", text: "", completed: false },
        { id: "3", text: "", completed: false },
      ],
      schedule: hours.reduce((acc, hour) => ({...acc, [hour]: { task: '', priority: 'Medium', notes: '' }}), {}),
      reflection: "",
      gratitude: "",
      habits: dailyHabits.reduce((acc, habit) => ({...acc, [habit]: false}), {}),
      todaysBigGoal: "",
      weeklyBigGoal: "",
    };
  };

  const updatePlanForDay = (date: Date, newPlan: Partial<DailyPlan>) => {
    const dateString = format(date, "yyyy-MM-dd");
    const existingPlan = getPlanForDay(date);
    setDailyPlans(prev => ({
        ...prev,
        [dateString]: { ...existingPlan, ...newPlan }
    }));
  };

  const handleSave = () => {
    localStorage.setItem("dailyPlans2026", JSON.stringify(dailyPlans));
    toast({
      title: "Daily Plans Saved!",
      description: "Your plans for 2026 have been saved locally.",
    });
  };

  
  const handlePriorityChange = (date: Date, id: string, field: 'text' | 'completed', value: string | boolean) => {
    const plan = getPlanForDay(date);
    const newPriorities = plan.priorities.map(p => {
        if (p.id === id) {
            return {...p, [field]: value};
        }
        return p;
    });
    updatePlanForDay(date, { priorities: newPriorities });
  }

  const handleScheduleChange = (date: Date, hour: string, field: 'task' | 'priority' | 'notes', value: string) => {
      const plan = getPlanForDay(date);
      const newSchedule = {...plan.schedule, [hour]: { ...plan.schedule[hour], [field]: value}};
      updatePlanForDay(date, { schedule: newSchedule });
  }

  const handleGenericChange = (date: Date, field: "reflection" | "gratitude" | "todaysBigGoal" | "weeklyBigGoal", value: string) => {
    updatePlanForDay(date, { [field]: value });
  }
  
  const handleHabitToggle = (date: Date, habit: string) => {
      const plan = getPlanForDay(date);
      const newHabits = {...plan.habits, [habit]: !plan.habits[habit]};
      updatePlanForDay(date, { habits: newHabits });
  }

  const handleGoToToday = () => {
    const today = new Date();
    if (today.getFullYear() !== 2026) {
        toast({
            title: "Outside Range",
            description: "Today's date is not in 2026.",
            variant: "destructive"
        })
        return;
    }
    const todayIndex = differenceInDays(today, startOfYear(year2026));
    if (api) {
        api.scrollTo(todayIndex);
    }
  }
  
  const currentDay = daysOf2026[current];
  const planForCurrentDay = getPlanForDay(currentDay);

  return (
    <div>
        <div className="text-center mb-6">
            <p className="max-w-2xl mx-auto text-muted-foreground">Turn your vision and annual goals into monthly, weekly, and daily strategy. Navigate with the tabs below to plan and execute your dreams!</p>
        </div>
        <div className="flex justify-center mb-8">
            <Tabs defaultValue="daily-plan">
                <TabsList>
                    <TabsTrigger value="monthly-plan" asChild><Link href="/month-planner">Monthly Plan</Link></TabsTrigger>
                    <TabsTrigger value="weekly-plan" asChild><Link href="/week-planner">Weekly Plan</Link></TabsTrigger>
                    <TabsTrigger value="daily-plan">Daily Plan</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

      <Carousel setApi={setApi} className="w-full">
         <div className="flex justify-between items-center mb-4 px-12">
            <div className="flex items-center gap-4">
                <BookOpenCheck className="w-8 h-8 text-primary" />
                <div>
                    <h2 className="font-headline text-2xl font-bold">DAILY PLAN</h2>
                    <p className="text-muted-foreground text-sm">Designed to instill intentional habits, reinforce discipline, and measure daily consistency.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <CarouselPrevious />
                <div className="text-center w-32">
                    <p className="font-semibold text-lg">{format(currentDay, "MMMM")}</p>
                    <p className="text-2xl font-bold text-primary">{format(currentDay, "do,")}</p>
                    <p className="text-lg text-muted-foreground">{format(currentDay, "yyyy")}</p>
                </div>
                <CarouselNext />
                <Button variant="outline" onClick={handleGoToToday}>Today</Button>
            </div>
        </div>

        <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1 bg-muted/50 p-2 rounded-md">
                    <p className="text-xs font-bold text-primary uppercase">5-Year Vision</p>
                    <p className="text-xs font-semibold truncate" title={fiveYearVision}>{fiveYearVision}</p>
                </div>
                 <div className="space-y-1 bg-muted/50 p-2 rounded-md">
                    <p className="text-xs font-bold text-primary uppercase">1-Year Big Goal</p>
                    <p className="text-xs font-semibold truncate" title={bigGoalYear}>{bigGoalYear}</p>
                </div>
                 <div className="space-y-1 bg-muted/50 p-2 rounded-md">
                    <p className="text-xs font-bold text-primary uppercase">Goal for the Month</p>
                    <p className="text-xs font-semibold truncate" title={bigGoalMonth}>{bigGoalMonth}</p>
                </div>
                 <div className="space-y-1 bg-muted/50 p-2 rounded-md">
                    <p className="text-xs font-bold text-primary uppercase">Weekly Big Goal</p>
                    <Input 
                        className="text-xs h-6 text-center font-semibold" 
                        placeholder="not set yet"
                        value={planForCurrentDay.weeklyBigGoal}
                        onChange={e => handleGenericChange(currentDay, "weeklyBigGoal", e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-base text-primary">Today's Big Goal</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Enter the most important result for today"
                    value={planForCurrentDay.todaysBigGoal}
                    onChange={e => handleGenericChange(currentDay, "todaysBigGoal", e.target.value)}
                    rows={1}
                />
            </CardContent>
        </Card>

        <div className="flex justify-end mb-4">
             <Button onClick={handleSave}>Save All Plans</Button>
        </div>
        <CarouselContent>
          {daysOf2026.map((day, index) => {
            const plan = getPlanForDay(day);
            const completedHabits = Object.values(plan.habits).filter(Boolean).length;
            const totalHabits = dailyHabits.length;
            const disciplinePercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
            return(
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top 3 Priorities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {plan.priorities.map(p => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <Checkbox checked={p.completed} onCheckedChange={(checked) => handlePriorityChange(day, p.id, 'completed', !!checked)} />
                                        <Input value={p.text} onChange={e => handlePriorityChange(day, p.id, 'text', e.target.value)} className={p.completed ? 'line-through text-muted-foreground' : ''} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Discipline Checklist</CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-2 text-primary">
                                    <Heart className="w-8 h-8 text-primary" />
                                    <span className="text-lg font-bold">{completedHabits} / {totalHabits}</span>
                                    <span className="text-lg">&mdash; {disciplinePercentage}% discipline</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dailyHabits.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                        {dailyHabits.map(habit => (
                                            <div 
                                                key={habit} 
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => handleHabitToggle(day, habit)}
                                            >
                                                <Heart className={cn("w-5 h-5 text-primary transition-all", plan.habits[habit] && "fill-primary text-primary-foreground")} />
                                                <span className={cn("text-sm", plan.habits[habit] && "line-through text-muted-foreground")}>{habit}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">No daily habits defined yet. Go to the Daily Habits page to add some.</p>}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-pink-500 font-headline">Schedule for the Day</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="grid grid-cols-[auto_1.5fr_1.5fr_1fr] gap-x-2 px-4 py-2">
                                    <Label className="font-semibold">Time</Label>
                                    <Label className="font-semibold">Task</Label>
                                    <Label className="font-semibold">Notes</Label>
                                    <Label className="font-semibold">Priority</Label>
                                </div>
                                <Separator />
                                {hours.map(hour => {
                                    const time = new Date(`1970-01-01T${hour}`);
                                    return (
                                        <div key={hour}>
                                            <div className="grid grid-cols-[auto_1.5fr_1.5fr_1fr] items-center gap-x-2 px-4 py-2">
                                                <Label className="font-semibold text-pink-500 w-20">{format(time, "h:mm a")}</Label>
                                                <Input 
                                                    value={plan.schedule[hour]?.task || ''} 
                                                    onChange={e => handleScheduleChange(day, hour, 'task', e.target.value)} 
                                                    placeholder="Task/Activity" 
                                                />
                                                <Input 
                                                    value={plan.schedule[hour]?.notes || ''} 
                                                    onChange={e => handleScheduleChange(day, hour, 'notes', e.target.value)} 
                                                    placeholder="Notes..." 
                                                />
                                                <Select
                                                    value={plan.schedule[hour]?.priority || 'Medium'}
                                                    onValueChange={(value: "High" | "Medium" | "Low") => handleScheduleChange(day, hour, 'priority', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="High">High</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Separator />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gratitude</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea rows={4} placeholder="What are you grateful for today?" value={plan.gratitude} onChange={e => handleGenericChange(day, "gratitude", e.target.value)} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>End-of-Day Reflection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea rows={4} placeholder="How did today go? What did you learn?" value={plan.reflection} onChange={e => handleGenericChange(day, "reflection", e.target.value)} />
                                </CardContent>
                            </Card>
                         </div>
                    </div>
                </div>
              </div>
            </CarouselItem>
          )})}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
