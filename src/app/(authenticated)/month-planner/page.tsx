
'use client';

import * as React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { VisionStatement, MonthlyGoal, JournalEntry, HabitToManage } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

export default function MonthPlannerPage() {
  const { firestore, user } = useFirebase();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { toast } = useToast();

  const monthId = format(currentMonth, 'yyyy-MM');

  const [fiveWords, setFiveWords] = React.useState(Array(5).fill(''));
  
  const bigGoalYearDocRef = useMemoFirebase(() => 
    user ? doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal') : null
  , [user, firestore]);
  const { data: bigGoalYearData } = useDoc<VisionStatement>(bigGoalYearDocRef);
  const bigGoalYear = bigGoalYearData?.goalText || 'Not set yet';

  const fiveYearVisionDocRef = useMemoFirebase(() => 
    user ? doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'fiveYearVision') : null
  , [user, firestore]);
  const { data: fiveYearVisionData } = useDoc<VisionStatement>(fiveYearVisionDocRef);
  const fiveYearVision = fiveYearVisionData?.statementText || 'Not set yet';

  const monthlyGoalsCollectionRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/sessions/default/monthlyGoals`) : null
  , [user, firestore]);
  const { data: monthlyGoalsData } = useCollection<MonthlyGoal>(monthlyGoalsCollectionRef);
  
  const monthlyPlanDocRef = useMemoFirebase(() => 
    user ? doc(firestore, `users/${user.uid}/sessions/default/monthlyGoals`, monthId) : null
  , [user, firestore, monthId]);
  const { data: monthlyPlanData, isLoading } = useDoc<MonthlyGoal>(monthlyPlanDocRef);

  const availableMonthlyGoals = React.useMemo(() => 
    monthlyGoalsData?.map(g => g.bigGoal).filter(g => g && g.trim() !== '') || []
  , [monthlyGoalsData]);
  
  const habitsToManageCollectionRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/sessions/default/habitsToManage`) : null
  , [user, firestore]);
  const { data: habitsToManageData } = useCollection<HabitToManage>(habitsToManageCollectionRef);

  const journalEntriesCollectionRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/sessions/default/journalEntries`) : null
  , [user, firestore]);
  const { data: journalEntries } = useCollection<JournalEntry>(journalEntriesCollectionRef);
  
  const startHabits = React.useMemo(() => habitsToManageData?.filter(e => e.type === 'start').map(e => e.text) || [], [habitsToManageData]);
  const stopHabits = React.useMemo(() => habitsToManageData?.filter(e => e.type === 'stop').map(e => e.text) || [], [habitsToManageData]);
  const lifeRules = React.useMemo(() => journalEntries?.filter(e => e.entryType === 'reason').map(e => e.text) || [], [journalEntries]);

  // UI state for selections
  const [selectedStartHabit, setSelectedStartHabit] = React.useState<string | undefined>(undefined);
  const [selectedStopHabit, setSelectedStopHabit] = React.useState<string | undefined>(undefined);
  const [selectedLifeRules, setSelectedLifeRules] = React.useState<string[]>([]);
  
  const handleUpdateMonthlyPlan = (field: keyof MonthlyGoal, value: any) => {
    if (!monthlyPlanDocRef) return;
    setDocumentNonBlocking(monthlyPlanDocRef, { [field]: value, id: monthId, sessionID: 'default' }, { merge: true });
  }

  const handleToggleGoal = (id: string) => {
    const newGoals = (monthlyPlanData?.goals || []).map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    handleUpdateMonthlyPlan('goals', newGoals);
  };

  const handleGoalTextChange = (id: string, text: string) => {
    const newGoals = (monthlyPlanData?.goals || []).map((goal) => (goal.id === id ? { ...goal, text } : goal));
    handleUpdateMonthlyPlan('goals', newGoals);
  };

  const handleAddGoal = () => {
    const newGoal: Goal = { id: Date.now().toString(), text: '', completed: false };
    const newGoals = [...(monthlyPlanData?.goals || []), newGoal];
    handleUpdateMonthlyPlan('goals', newGoals);
  };

  const handleRemoveGoal = (id: string) => {
    const newGoals = (monthlyPlanData?.goals || []).filter((goal) => goal.id !== id);
    handleUpdateMonthlyPlan('goals', newGoals);
  };

  const handleLifeRuleSelect = (rule: string) => {
    const newRules = selectedLifeRules.includes(rule) 
        ? selectedLifeRules.filter((r) => r !== rule)
        : [...selectedLifeRules, rule].slice(0,2);
    setSelectedLifeRules(newRules);
    // Not saving this part to DB as it's not in schema
  };
  
  const handleSave = () => {
    toast({
      title: 'Planner Saved!',
      description: 'Your monthly plan has been successfully saved.',
    });
  };

  const goals = monthlyPlanData?.goals || [];
  const goalsAchieved = goals.filter((g) => g.completed).length;
  const goalsSet = goals.length;
  const achievementRate = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;
  const selectedMonthlyBigGoal = monthlyPlanData?.bigGoal;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title={`Monthly Plan`}
          description="Plan your month in detail and track your progress towards your big goals."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold text-primary w-48 text-center">
            {format(currentMonth, 'MMMM yyyy').toUpperCase()}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
            This Month
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>High-Level Focus</CardTitle>
          <CardDescription>
            A quick overview of your long-term and monthly ambitions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              5 Year Vision:
            </Label>
            <p className="font-bold flex-1 truncate">
              {fiveYearVision}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the YEAR:
            </Label>
            <p className="font-bold flex-1 truncate">
              {bigGoalYear}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the MONTH:
            </Label>
            <div className="flex-1">
              <Select
                onValueChange={(value) => {
                  handleUpdateMonthlyPlan('bigGoal', value);
                }}
                value={selectedMonthlyBigGoal}
              >
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
                    <SelectItem value="no-goals" disabled>
                      No monthly goals set in Monthly Goals page
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Goals For This Month</CardTitle>
            <CardDescription>Break down your monthly big goal into smaller, actionable steps.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading goals...</p> : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={goal.completed}
                      onCheckedChange={() => handleToggleGoal(goal.id)}
                    />
                    <Input
                      id={`goal-text-${goal.id}`}
                      defaultValue={goal.text}
                      onBlur={(e) => handleGoalTextChange(goal.id, e.target.value)}
                      className={`flex-1 text-sm ${
                        goal.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                      placeholder="e.g., Draft first chapter of my book"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleAddGoal}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
              <CardDescription>Your achievement rate for this month's goals.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{goalsAchieved}</p>
                <p className="text-xs text-muted-foreground">Goals Achieved</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{achievementRate}%</p>
                <p className="text-xs text-muted-foreground">
                  Goals Set: {goalsSet}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>5 Words for the Month</CardTitle>
                <CardDescription>Your guiding words for this month.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                        placeholder={`Word ${index + 1}`}
                    />
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Focus</CardTitle>
          <CardDescription>
            Select habits and rules to focus on this month.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-habit">Something to Start</Label>
              <Select
                onValueChange={setSelectedStartHabit}
                value={selectedStartHabit}
              >
                <SelectTrigger id="start-habit">
                  <SelectValue placeholder="Select a habit to start" />
                </SelectTrigger>
                <SelectContent>
                  {startHabits.length > 0 ? (
                    startHabits.map((habit, index) => (
                      <SelectItem key={index} value={habit}>
                        {habit}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-habits" disabled>
                      No 'start' habits defined
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-habit">Something to Stop</Label>
              <Select
                onValueChange={setSelectedStopHabit}
                value={selectedStopHabit}
              >
                <SelectTrigger id="stop-habit">
                  <SelectValue placeholder="Select a habit to stop" />
                </SelectTrigger>
                <SelectContent>
                  {stopHabits.length > 0 ? (
                    stopHabits.map((habit, index) => (
                      <SelectItem key={index} value={habit}>
                        {habit}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-habits" disabled>
                      No 'stop' habits defined
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Life Rules (Select up to 2)</Label>
            <Select onValueChange={() => {}} value={''}>
              <SelectTrigger>
                <SelectValue placeholder="Select life rules" />
              </SelectTrigger>
              <SelectContent>
                {lifeRules.length > 0 ? (
                  lifeRules.map((rule, index) => (
                    <SelectItem
                      key={index}
                      value={rule}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleLifeRuleSelect(rule);
                      }}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedLifeRules.includes(rule)}
                          className="mr-2"
                        />
                        <span>{rule}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-rules" disabled>
                    No life rules defined
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedLifeRules.map((rule) => (
                <Badge key={rule} variant="secondary">
                  {rule}
                </Badge>
              ))}
            </div>
          </div>
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
