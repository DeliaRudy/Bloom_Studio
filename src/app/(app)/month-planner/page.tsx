
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

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

const initialGoals: Goal[] = [];

export default function MonthPlannerPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [bigGoal, setBigGoal] = React.useState('');
  const [fiveYearVision, setFiveYearVision] = React.useState('');
  const [monthlyGoals, setMonthlyGoals] = React.useState<string[]>([]);
  const [selectedMonthlyBigGoal, setSelectedMonthlyBigGoal] = React.useState<
    string | undefined
  >(undefined);
  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);
  const [fiveWords, setFiveWords] = React.useState(Array(5).fill(''));

  const [startHabits, setStartHabits] = React.useState<string[]>([]);
  const [stopHabits, setStopHabits] = React.useState<string[]>([]);
  const [lifeRules, setLifeRules] = React.useState<string[]>([]);

  const [selectedStartHabit, setSelectedStartHabit] = React.useState<
    string | undefined
  >(undefined);
  const [selectedStopHabit, setSelectedStopHabit] = React.useState<
    string | undefined
  >(undefined);
  const [selectedLifeRules, setSelectedLifeRules] = React.useState<string[]>(
    []
  );

  const { toast } = useToast();

  React.useEffect(() => {
    const savedBigGoal = localStorage.getItem('bigGoal');
    if (savedBigGoal) setBigGoal(savedBigGoal);

    const saved5YearVision = localStorage.getItem('5YearVision');
    if (saved5YearVision) setFiveYearVision(saved5YearVision);

    const savedMonthlyGoals = localStorage.getItem('monthlyGoals');
    if (savedMonthlyGoals) setMonthlyGoals(JSON.parse(savedMonthlyGoals));

    const savedMonthlyBigGoal = localStorage.getItem('monthlyBigGoal');
    if (savedMonthlyBigGoal) setSelectedMonthlyBigGoal(savedMonthlyBigGoal);

    const savedStartHabits = localStorage.getItem('startHabits');
    if (savedStartHabits)
      setStartHabits(JSON.parse(savedStartHabits).filter((h: string) => h));

    const savedStopHabits = localStorage.getItem('stopHabits');
    if (savedStopHabits)
      setStopHabits(JSON.parse(savedStopHabits).filter((h: string) => h));

    const savedLifeRules = localStorage.getItem('personaWhy');
    if (savedLifeRules)
      setLifeRules(JSON.parse(savedLifeRules).filter((r: string) => r));

    const savedSelectedStartHabit = localStorage.getItem('selectedStartHabit');
    if (savedSelectedStartHabit)
      setSelectedStartHabit(savedSelectedStartHabit);

    const savedSelectedStopHabit = localStorage.getItem('selectedStopHabit');
    if (savedSelectedStopHabit) setSelectedStopHabit(savedSelectedStopHabit);

    const savedSelectedLifeRules = localStorage.getItem('selectedLifeRules');
    if (savedSelectedLifeRules)
      setSelectedLifeRules(JSON.parse(savedSelectedLifeRules));
  }, []);

  const handleToggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleSave = () => {
    if (selectedMonthlyBigGoal) {
      localStorage.setItem('monthlyBigGoal', selectedMonthlyBigGoal);
    }
    if (selectedStartHabit) {
      localStorage.setItem('selectedStartHabit', selectedStartHabit);
    } else {
      localStorage.removeItem('selectedStartHabit');
    }

    if (selectedStopHabit) {
      localStorage.setItem('selectedStopHabit', selectedStopHabit);
    } else {
      localStorage.removeItem('selectedStopHabit');
    }

    localStorage.setItem('selectedLifeRules', JSON.stringify(selectedLifeRules));

    console.log('Saving Monthly Planner Data...');
    toast({
      title: 'Planner Saved!',
      description: 'Your monthly plan has been successfully saved.',
    });
  };

  const handleMonthlyBigGoalChange = (value: string) => {
    setSelectedMonthlyBigGoal(value);
  };

  const handleGoalTextChange = (id: string, text: string) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, text } : goal)));
  };

  const handleAddGoal = () => {
    const newGoal: Goal = { id: Date.now().toString(), text: '', completed: false };
    setGoals([...goals, newGoal]);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const handleLifeRuleSelect = (rule: string) => {
    setSelectedLifeRules((prev) => {
      if (prev.includes(rule)) {
        return prev.filter((r) => r !== rule);
      }
      if (prev.length < 2) {
        return [...prev, rule];
      }
      toast({
        title: 'Limit Reached',
        description: 'You can only select up to 2 life rules.',
        variant: 'destructive',
      })
      return prev;
    });
  };

  const goalsAchieved = goals.filter((g) => g.completed).length;
  const goalsSet = goals.length;
  const achievementRate = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;

  const availableMonthlyGoals = monthlyGoals.filter((g) => g && g.trim() !== '');

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
              {fiveYearVision || 'Not set yet'}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the YEAR:
            </Label>
            <p className="font-bold flex-1 truncate">
              {bigGoal || 'Not set yet'}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the MONTH:
            </Label>
            <div className="flex-1">
              <Select
                onValueChange={handleMonthlyBigGoalChange}
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
                      No monthly goals set in Month Map
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
                    value={goal.text}
                    onChange={(e) => handleGoalTextChange(goal.id, e.target.value)}
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

    