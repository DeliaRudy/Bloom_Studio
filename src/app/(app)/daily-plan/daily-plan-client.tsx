
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
import { eachDayOfInterval, startOfYear, endOfYear, format, isToday, differenceInDays } from "date-fns";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Priority = {
  id: string;
  text: string;
  completed: boolean;
};

type ScheduleItem = {
    task: string;
    priority: "High" | "Medium" | "Low";
}

type DailyPlan = {
  priorities: Priority[];
  schedule: Record<string, ScheduleItem>;
  reflection: string;
  habits: Record<string, boolean>;
};

const hours = Array.from({ length: 15 }, (_, i) => `${i + 6}:00`); // 6am to 8pm

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

    if (!api) return;

    const today = new Date();
    let initialSlide = 0;
    if (today.getFullYear() === 2026) {
        initialSlide = differenceInDays(today, startOfYear(year2026));
    }

    setCurrent(initialSlide);
    api.scrollTo(initialSlide, true);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };

  }, [api]);

  const handleSave = () => {
    localStorage.setItem("dailyPlans2026", JSON.stringify(dailyPlans));
    toast({
      title: "Daily Plans Saved!",
      description: "Your plans for 2026 have been saved locally.",
    });
  };

  const getPlanForDay = (date: Date): DailyPlan => {
    const dateString = format(date, "yyyy-MM-dd");
    return dailyPlans[dateString] || {
      priorities: [
        { id: "1", text: "", completed: false },
        { id: "2", text: "", completed: false },
        { id: "3", text: "", completed: false },
      ],
      schedule: hours.reduce((acc, hour) => ({...acc, [hour]: { task: '', priority: 'Medium' }}), {}),
      reflection: "",
      habits: dailyHabits.reduce((acc, habit) => ({...acc, [habit]: false}), {}),
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

  const handleScheduleChange = (date: Date, hour: string, field: 'task' | 'priority', value: string) => {
      const plan = getPlanForDay(date);
      const newSchedule = {...plan.schedule, [hour]: { ...plan.schedule[hour], [field]: value}};
      updatePlanForDay(date, { schedule: newSchedule });
  }

  const handleReflectionChange = (date: Date, value: string) => {
    updatePlanForDay(date, { reflection: value });
  }
  
  const handleHabitToggle = (date: Date, habit: string) => {
      const plan = getPlanForDay(date);
      const newHabits = {...plan.habits, [habit]: !plan.habits[habit]};
      updatePlanForDay(date, { habits: newHabits });
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-center">
                <p className="font-semibold">{format(daysOf2026[current], "EEEE")}</p>
                <p className="text-sm text-muted-foreground">{format(daysOf2026[current], "MMMM d, yyyy")}</p>
            </div>
            <Button onClick={handleSave}>Save All Plans</Button>
        </div>
      <Carousel setApi={setApi} className="w-full">
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
                                <div className="grid grid-cols-[1fr_2fr_1fr] gap-x-4 px-4 py-2">
                                    <Label className="font-semibold">Time</Label>
                                    <Label className="font-semibold">Task</Label>
                                    <Label className="font-semibold">Priority</Label>
                                </div>
                                <Separator />
                                {hours.map(hour => {
                                    const time = new Date(`1970-01-01T${hour}:00`);
                                    return (
                                        <div key={hour}>
                                            <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-x-4 px-4 py-2">
                                                <Label className="font-semibold text-pink-500">{format(time, "h:mm a")}</Label>
                                                <Input 
                                                    value={plan.schedule[hour]?.task || ''} 
                                                    onChange={e => handleScheduleChange(day, hour, 'task', e.target.value)} 
                                                    placeholder="Task/Activity" 
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
                         <Card>
                            <CardHeader>
                                <CardTitle>End-of-Day Reflection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea rows={4} placeholder="How did today go? What did you learn?" value={plan.reflection} onChange={e => handleReflectionChange(day, e.target.value)} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
              </div>
            </CarouselItem>
          )})}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
