
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
  getWeek,
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
import { CycleSyncBanner } from '@/components/cycle-sync-banner';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { DailyHabit, DailyPlan, VisionStatement, MonthlyGoal, WeeklyPlan } from '@/lib/types';


const hours = Array.from({ length: 15 }, (_, i) =>
  `${(i + 6).toString().padStart(2, '0')}:00`
); // 6am to 8pm

export function DailyPlanClient() {
  const [currentDay, setCurrentDay] = React.useState(new Date());
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const dateString = format(currentDay, 'yyyy-MM-dd');
  const monthString = format(currentDay, 'yyyy-MM');
  const weekString = format(currentDay, 'yyyy-') + getWeek(currentDay, { weekStartsOn: 1 });


  const dailyPlanDocRef = useMemoFirebase(() => 
    user ? doc(firestore, `users/${user.uid}/sessions/default/dailyPlans`, dateString) : null
  , [user, firestore, dateString]);
  const { data: planForCurrentDay, isLoading: isPlanLoading } = useDoc<DailyPlan>(dailyPlanDocRef);

  const dailyHabitsCollectionRef = useMemoFirebase(() => 
      user ? collection(firestore, `users/${user.uid}/sessions/default/dailyHabits`) : null
  , [user, firestore]);
  const { data: dailyHabitsData, isLoading: areHabitsLoading } = useCollection<DailyHabit>(dailyHabitsCollectionRef);
  const dailyHabits = React.useMemo(() => dailyHabitsData?.sort((a,b) => a.order - b.order) || [], [dailyHabitsData]);

  const fiveYearVisionDocRef = useMemoFirebase(() => 
      user ? doc(firestore, `users/${user.uid}/sessions/default/fiveYearVisionPrompts`, 'visionStatement') : null
  , [user, firestore]);
  const { data: fiveYearVisionData } = useDoc<any>(fiveYearVisionDocRef);
  const fiveYearVision = fiveYearVisionData?.responseText || 'Not set yet';

  const bigGoalYearDocRef = useMemoFirebase(() => 
      user ? doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal') : null
  , [user, firestore]);
  const { data: bigGoalYearData } = useDoc<VisionStatement>(bigGoalYearDocRef);
  const bigGoalYear = bigGoalYearData?.goalText || 'Not set yet';

  const bigGoalMonthDocRef = useMemoFirebase(() =>
    user ? doc(firestore, `users/${user.uid}/sessions/default/monthlyGoals`, monthString) : null
  , [user, firestore, monthString]);
  const { data: bigGoalMonthData } = useDoc<MonthlyGoal>(bigGoalMonthDocRef);
  const bigGoalMonth = bigGoalMonthData?.bigGoal || 'Not set yet';

  const bigGoalWeekDocRef = useMemoFirebase(() =>
    user ? doc(firestore, `users/${user.uid}/sessions/default/weeklyPlans`, weekString) : null
  , [user, firestore, weekString]);
  const { data: bigGoalWeekData } = useDoc<WeeklyPlan>(bigGoalWeekDocRef);
  const bigGoalWeek = bigGoalWeekData?.bigGoal || 'Not set yet';
  

  const getPlanForDay = (): DailyPlan => {
    return (
      planForCurrentDay || {
        id: dateString,
        sessionID: 'default',
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
          (acc, habit) => ({ ...acc, [habit.text]: false }),
          {}
        ),
        todaysBigGoal: '',
      }
    );
  };
  
  const currentPlan = getPlanForDay();

  const updatePlanForDay = (newPlan: Partial<DailyPlan>) => {
      if (!dailyPlanDocRef) return;
      setDocumentNonBlocking(dailyPlanDocRef, { ...newPlan, id: dateString, sessionID: 'default' }, { merge: true });
  };

  const handleSave = () => {
    toast({
      title: 'Daily Plans Saved!',
      description: `Your plans for have been saved to the database.`,
    });
  };

  const handlePriorityChange = (
    id: string,
    field: 'text' | 'completed',
    value: string | boolean
  ) => {
    const newPriorities = currentPlan.priorities.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    updatePlanForDay({ priorities: newPriorities });
  };

  const handleScheduleChange = (
    hour: string,
    field: 'task' | 'priority' | 'notes',
    value: string
  ) => {
    const newSchedule = {
      ...currentPlan.schedule,
      [hour]: { ...currentPlan.schedule[hour], [field]: value },
    };
    updatePlanForDay({ schedule: newSchedule });
  };

  const handleGenericChange = (
    field: 'reflection' | 'gratitude' | 'todaysBigGoal',
    value: string
  ) => {
    updatePlanForDay({ [field]: value });
  };

  const handleHabitToggle = (habitText: string) => {
    const newHabits = { ...currentPlan.habits, [habitText]: !currentPlan.habits[habitText] };
    updatePlanForDay({ habits: newHabits });
  };


  const completedHabits = Object.values(currentPlan.habits).filter(
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

       <CycleSyncBanner currentDate={currentDay} view="day" />


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
            value={currentPlan.todaysBigGoal}
            onBlur={(e) =>
              handleGenericChange('todaysBigGoal', e.target.value)
            }
            defaultValue={currentPlan.todaysBigGoal}
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
              {currentPlan.priorities.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`${currentDay.toISOString()}-${p.id}`}
                    checked={p.completed}
                    onCheckedChange={(checked) =>
                      handlePriorityChange(
                        p.id,
                        'completed',
                        !!checked
                      )
                    }
                  />
                  <Input
                    defaultValue={p.text}
                    onBlur={(e) =>
                      handlePriorityChange(
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
              {areHabitsLoading ? <p>Loading habits...</p> : dailyHabits.length > 0 ? (
                <div className="space-y-2">
                  {dailyHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 cursor-pointer rounded-md p-2 hover:bg-muted/50"
                      onClick={() => handleHabitToggle(habit.text)}
                    >
                      <Checkbox checked={currentPlan.habits[habit.text]} />
                      <span
                        className={cn(
                          'text-sm',
                          currentPlan.habits[habit.text] &&
                            'line-through text-muted-foreground'
                        )}
                      >
                        {habit.text}
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
                          defaultValue={
                            currentPlan.schedule[hour]?.task || ''
                          }
                          onBlur={(e) =>
                            handleScheduleChange(
                              hour,
                              'task',
                              e.target.value
                            )
                          }
                          placeholder="Task/Activity"
                          className="bg-transparent border-0 border-b rounded-none"
                        />
                        <Input
                          defaultValue={
                            currentPlan.schedule[hour]?.notes || ''
                          }
                          onBlur={(e) =>
                            handleScheduleChange(
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
                            currentPlan.schedule[hour]?.priority ||
                            'Medium'
                          }
                          onValueChange={(
                            value: 'High' | 'Medium' | 'Low'
                          ) =>
                            handleScheduleChange(
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
                  defaultValue={currentPlan.gratitude}
                  onBlur={(e) =>
                    handleGenericChange(
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
                  defaultValue={currentPlan.reflection}
                  onBlur={(e) =>
                    handleGenericChange(
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
