
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  format,
  isToday,
  startOfWeek,
  addDays,
  subDays,
} from 'date-fns';
import { BookOpenCheck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Priority = {
  id: string;
  text: string;
  completed: boolean;
};

type ScheduleItem = {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
};

type DailyPlan = {
  priorities: Priority[];
  schedule: Record<string, ScheduleItem>;
  reflection: string;
  gratitude: string;
  habits: Record<string, boolean>;
  todaysBigGoal: string;
};

const hours = Array.from({ length: 15 }, (_, i) =>
  `${(i + 6).toString().padStart(2, '0')}:00`
); // 6am to 8pm

export function DailyPlanClient() {
  const [currentDay, setCurrentDay] = React.useState(new Date());
  const [dailyPlans, setDailyPlans] = React.useState<Record<string, DailyPlan>>(
    {}
  );
  const [dailyHabits, setDailyHabits] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [fiveYearVision, setFiveYearVision] = React.useState('');
  const [bigGoalYear, setBigGoalYear] = React.useState('');
  const [bigGoalMonth, setBigGoalMonth] = React.useState('');
  const [bigGoalWeek, setBigGoalWeek] = React.useState('');

  React.useEffect(() => {
    // Load data from local storage
    const savedPlans = localStorage.getItem(
      `dailyPlans${currentDay.getFullYear()}`
    );
    if (savedPlans) {
      setDailyPlans(JSON.parse(savedPlans));
    }
    const savedHabits = localStorage.getItem('dailyHabits');
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      setDailyHabits(parsedHabits.filter((h: string) => h && h.trim() !== ''));
    }

    const saved5YearVision = localStorage.getItem('5YearVision');
    setFiveYearVision(saved5YearVision || 'Not set yet');

    const savedBigGoalYear = localStorage.getItem('bigGoal');
    setBigGoalYear(savedBigGoalYear || 'Not set yet');

    const monthlyGoalsData = localStorage.getItem('monthlyBigGoal');
    setBigGoalMonth(monthlyGoalsData || 'Not set yet');

    const weekKey = format(startOfWeek(currentDay, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const savedWeeklyGoals = JSON.parse(localStorage.getItem('weeklyGoals') || '{}');
    setBigGoalWeek(savedWeeklyGoals[weekKey]?.bigGoal || 'Not set yet');
  }, [currentDay]);

  const getPlanForDay = (date: Date): DailyPlan => {
    const dateString = format(date, 'yyyy-MM-dd');
    return (
      dailyPlans[dateString] || {
        priorities: [
          { id: '1', text: '', completed: false },
          { id: '2', text: '', completed: false },
          { id: '3', text: '', completed: false },
        ],
        schedule: hours.reduce(
          (acc, hour) => ({
            ...acc,
            [hour]: { task: '', priority: 'Medium', notes: '' },
          }),
          {}
        ),
        reflection: '',
        gratitude: '',
        habits: dailyHabits.reduce(
          (acc, habit) => ({ ...acc, [habit]: false }),
          {}
        ),
        todaysBigGoal: '',
      }
    );
  };

  const updatePlanForDay = (date: Date, newPlan: Partial<DailyPlan>) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const existingPlan = getPlanForDay(date);
    setDailyPlans((prev) => ({
      ...prev,
      [dateString]: { ...existingPlan, ...newPlan },
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      `dailyPlans${currentDay.getFullYear()}`,
      JSON.stringify(dailyPlans)
    );
    toast({
      title: 'Daily Plans Saved!',
      description: `Your plans for ${currentDay.getFullYear()} have been saved locally.`,
    });
  };

  const handlePriorityChange = (
    date: Date,
    id: string,
    field: 'text' | 'completed',
    value: string | boolean
  ) => {
    const plan = getPlanForDay(date);
    const newPriorities = plan.priorities.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    updatePlanForDay(date, { priorities: newPriorities });
  };

  const handleScheduleChange = (
    date: Date,
    hour: string,
    field: 'task' | 'priority' | 'notes',
    value: string
  ) => {
    const plan = getPlanForDay(date);
    const newSchedule = {
      ...plan.schedule,
      [hour]: { ...plan.schedule[hour], [field]: value },
    };
    updatePlanForDay(date, { schedule: newSchedule });
  };

  const handleGenericChange = (
    date: Date,
    field: 'reflection' | 'gratitude' | 'todaysBigGoal',
    value: string
  ) => {
    updatePlanForDay(date, { [field]: value });
  };

  const handleHabitToggle = (date: Date, habit: string) => {
    const plan = getPlanForDay(date);
    const newHabits = { ...plan.habits, [habit]: !plan.habits[habit] };
    updatePlanForDay(date, { habits: newHabits });
  };

  const planForCurrentDay = getPlanForDay(currentDay);
  const completedHabits = Object.values(planForCurrentDay.habits).filter(
    Boolean
  ).length;
  const totalHabits = dailyHabits.length;
  const disciplinePercentage =
    totalHabits > 0
      ? Math.round((completedHabits / totalHabits) * 100)
      : 0;

  return (
    <div>
      <div className="text-center mb-6">
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Turn your vision and annual goals into monthly, weekly, and daily
          strategy. Navigate with the tabs below to plan and execute your
          dreams!
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <Tabs defaultValue="daily-plan">
          <TabsList>
            <TabsTrigger value="monthly-plan" asChild>
              <Link href="/month-planner">Monthly Plan</Link>
            </TabsTrigger>
            <TabsTrigger value="weekly-plan" asChild>
              <Link href="/week-planner">Weekly Plan</Link>
            </TabsTrigger>
            <TabsTrigger value="daily-plan">Daily Plan</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col mb-4 px-1 gap-4">
        <div className="flex items-center gap-4">
          <BookOpenCheck className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-headline text-2xl font-bold">DAILY PLAN</h2>
            <p className="text-muted-foreground text-sm">
              Designed to instill intentional habits, reinforce discipline,
              and measure daily consistency.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
           <Button variant="outline" size="icon" onClick={() => setCurrentDay(subDays(currentDay, 1))}>
              <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold text-primary w-72 text-center">
            {format(currentDay, 'EEEE, do MMMM yyyy')}
          </p>
          <Button variant="outline" size="icon" onClick={() => setCurrentDay(addDays(currentDay, 1))}>
              <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDay(new Date())}>
            Today
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>High-Level Focus</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Label className="w-36 pt-1.5 font-semibold text-muted-foreground shrink-0">
                5 Year Vision:
              </Label>
              <p className="font-bold leading-relaxed break-words min-w-0">
                {fiveYearVision}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Label className="w-36 pt-1.5 font-semibold text-muted-foreground shrink-0">
                Big Goal for YEAR:
              </Label>
              <p className="font-bold leading-relaxed break-words min-w-0">
                {bigGoalYear}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Label className="w-36 pt-1.5 font-semibold text-muted-foreground shrink-0">
                Big Goal for MONTH:
              </Label>
              <p className="font-bold leading-relaxed break-words min-w-0">
                {bigGoalMonth}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Label className="w-36 pt-1.5 font-semibold text-muted-foreground shrink-0">
                Big Goal for WEEK:
              </Label>
              <p className="font-bold leading-relaxed break-words min-w-0">
                {bigGoalWeek}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base text-primary">
            Today&apos;s Big Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter the most important result for today"
            value={planForCurrentDay.todaysBigGoal}
            onChange={(e) =>
              handleGenericChange(currentDay, 'todaysBigGoal', e.target.value)
            }
            rows={1}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end mb-4">
        <Button onClick={handleSave}>Save All Plans</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 3 Priorities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {planForCurrentDay.priorities.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`${currentDay.toISOString()}-${p.id}`}
                    checked={p.completed}
                    onCheckedChange={(checked) =>
                      handlePriorityChange(
                        currentDay,
                        p.id,
                        'completed',
                        !!checked
                      )
                    }
                  />
                  <Input
                    value={p.text}
                    onChange={(e) =>
                      handlePriorityChange(
                        currentDay,
                        p.id,
                        'text',
                        e.target.value
                      )
                    }
                    className={cn(
                      'h-9',
                      p.completed ? 'line-through text-muted-foreground' : ''
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Discipline Checklist</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-2 text-primary">
                <Heart className="w-8 h-8 text-primary" />
                <span className="text-lg font-bold">
                  {completedHabits} / {totalHabits}
                </span>
                <span className="text-lg">
                  &mdash; {disciplinePercentage}% discipline
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailyHabits.length > 0 ? (
                <div className="space-y-2">
                  {dailyHabits.map((habit) => (
                    <div
                      key={habit}
                      className="flex items-center gap-3 cursor-pointer rounded-md p-2 hover:bg-muted/50"
                      onClick={() => handleHabitToggle(currentDay, habit)}
                    >
                      <Checkbox checked={planForCurrentDay.habits[habit]} />
                      <span
                        className={cn(
                          'text-sm',
                          planForCurrentDay.habits[habit] &&
                            'line-through text-muted-foreground'
                        )}
                      >
                        {habit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No daily habits defined yet. Go to the{' '}
                  <Link href="/daily-habits" className="underline font-semibold">
                    Daily Habits
                  </Link>{' '}
                  page to add some.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-headline">
                Schedule for the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-4 px-4 py-2">
                  <Label className="font-semibold">Time</Label>
                  <Label className="font-semibold">Task</Label>
                  <Label className="font-semibold">Notes</Label>
                  <Label className="font-semibold text-right pr-2">
                    Priority
                  </Label>
                </div>
                <Separator />
                <div className="max-h-[480px] overflow-y-auto pr-2">
                  {hours.map((hour, hourIndex) => {
                    const time = new Date(`1970-01-01T${hour}`);
                    return (
                      <div
                        key={hour}
                        className={cn(
                          'grid grid-cols-[auto_1fr_1fr_auto] items-center gap-x-4 px-2 rounded-md',
                          hourIndex % 2 === 0 ? 'bg-muted/30' : ''
                        )}
                      >
                        <Label className="font-semibold text-primary w-20 py-3 text-center">
                          {format(time, 'h:mm a')}
                        </Label>
                        <Input
                          value={
                            planForCurrentDay.schedule[hour]?.task || ''
                          }
                          onChange={(e) =>
                            handleScheduleChange(
                              currentDay,
                              hour,
                              'task',
                              e.target.value
                            )
                          }
                          placeholder="Task/Activity"
                          className="bg-transparent border-0 border-b rounded-none"
                        />
                        <Input
                          value={
                            planForCurrentDay.schedule[hour]?.notes || ''
                          }
                          onChange={(e) =>
                            handleScheduleChange(
                              currentDay,
                              hour,
                              'notes',
                              e.target.value
                            )
                          }
                          placeholder="Notes..."
                          className="bg-transparent border-0 border-b rounded-none"
                        />
                        <Select
                          value={
                            planForCurrentDay.schedule[hour]?.priority ||
                            'Medium'
                          }
                          onValueChange={(
                            value: 'High' | 'Medium' | 'Low'
                          ) =>
                            handleScheduleChange(
                              currentDay,
                              hour,
                              'priority',
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-28 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gratitude</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  placeholder="What are you grateful for today?"
                  value={planForCurrentDay.gratitude}
                  onChange={(e) =>
                    handleGenericChange(
                      currentDay,
                      'gratitude',
                      e.target.value
                    )
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>End-of-Day Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  placeholder="How did today go? What did you learn?"
                  value={planForCurrentDay.reflection}
                  onChange={(e) =>
                    handleGenericChange(
                      currentDay,
                      'reflection',
                      e.target.value
                    )
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
