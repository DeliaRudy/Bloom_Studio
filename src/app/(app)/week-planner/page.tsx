
'use client';

import * as React from 'react';
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type WeeklyGoal = {
  id: string;
  text: string;
  priority: boolean;
};

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
  schedule: Record<string, string>;
};

export default function WeekPlannerPage() {
  const { toast } = useToast();
  const [week, setWeek] = React.useState(new Date());

  const [fiveYearVision, setFiveYearVision] = React.useState('');
  const [bigGoalYear, setBigGoalYear] = React.useState('');
  const [bigGoalMonth, setBigGoalMonth] = React.useState('');

  const [weeklyPlans, setWeeklyPlans] = React.useState<
    Record<string, Partial<WeeklyPlanData>>
  >({});

  const [availableAffirmations, setAvailableAffirmations] = React.useState<
    { id: string; text: string }[]
  >([]);

  const [habits, setHabits] = React.useState('');

  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekKey = format(weekStart, 'yyyy-MM-dd');

  const getPlanForWeek = React.useCallback(
    (key: string): Partial<WeeklyPlanData> => {
      return (
        weeklyPlans[key] || {
          bigGoal: '',
          weeklyGoals: [],
          goalsAchieved: 0,
          selectedAffirmations: [],
          peopleToConnect: [],
          schedule: {},
        }
      );
    },
    [weeklyPlans]
  );

  const currentPlan = getPlanForWeek(weekKey);

  const updatePlanForWeek = (key: string, newPlan: Partial<WeeklyPlanData>) => {
    const existingPlan = getPlanForWeek(key);
    setWeeklyPlans((prev) => ({
      ...prev,
      [key]: { ...existingPlan, ...newPlan },
    }));
  };

  React.useEffect(() => {
    const savedWeeklyGoals = localStorage.getItem('weeklyGoals');
    if (savedWeeklyGoals) {
      setWeeklyPlans(JSON.parse(savedWeeklyGoals));
    }

    const saved5YearVision = localStorage.getItem('5YearVision');
    setFiveYearVision(saved5YearVision || 'Not set yet');

    const savedBigGoal = localStorage.getItem('bigGoal');
    setBigGoalYear(savedBigGoal || 'Not set yet');

    const savedMonthlyBigGoal = localStorage.getItem('monthlyBigGoal');
    setBigGoalMonth(savedMonthlyBigGoal || 'Not set yet');

    const savedAffirmations = localStorage.getItem('affirmations');
    if (savedAffirmations) {
      const parsedAffirmations = JSON.parse(savedAffirmations);
      if (Array.isArray(parsedAffirmations)) {
        setAvailableAffirmations(parsedAffirmations.filter((a) => a.text));
      }
    }

    const startHabit = localStorage.getItem('selectedStartHabit');
    const stopHabit = localStorage.getItem('selectedStopHabit');

    let habitsText = '';
    if (startHabit && startHabit !== 'undefined')
      habitsText += `Start: ${startHabit}\n`;
    if (stopHabit && stopHabit !== 'undefined')
      habitsText += `Stop: ${stopHabit}`;

    setHabits(habitsText.trim() || 'Not set yet');
  }, [week]);

  const handleSave = () => {
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyPlans));
    toast({
      title: 'Week Planner Saved!',
      description: 'Your plan for the week has been successfully saved.',
    });
  };

  const handleBigGoalWeekChange = (value: string) => {
    updatePlanForWeek(weekKey, { bigGoal: value });
  };

  const handleAddGoal = () => {
    const newGoals = [
      ...(currentPlan.weeklyGoals || []),
      { id: Date.now().toString(), text: '', priority: false },
    ];
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleRemoveGoal = (id: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).filter(
      (goal) => goal.id !== id
    );
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleGoalChange = (id: string, text: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).map((goal) =>
      goal.id === id ? { ...goal, text } : goal
    );
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handlePriorityChange = (id: string) => {
    const newGoals = (currentPlan.weeklyGoals || []).map((goal) =>
      goal.id === id ? { ...goal, priority: !goal.priority } : goal
    );
    updatePlanForWeek(weekKey, { weeklyGoals: newGoals });
  };

  const handleAffirmationSelect = (affirmationText: string) => {
    const currentAffirmations = currentPlan.selectedAffirmations || [];
    let newAffirmations: string[];
    if (currentAffirmations.includes(affirmationText)) {
      newAffirmations = currentAffirmations.filter((a) => a !== affirmationText);
    } else if (currentAffirmations.length < 4) {
      newAffirmations = [...currentAffirmations, affirmationText];
    } else {
      toast({
        title: 'Limit Reached',
        description: 'You can select up to 4 affirmations.',
        variant: 'destructive',
      });
      newAffirmations = currentAffirmations;
    }
    updatePlanForWeek(weekKey, { selectedAffirmations: newAffirmations });
  };

  const handleAddPerson = () => {
    const currentPeople = currentPlan.peopleToConnect || [];
    if (currentPeople.length < 7) {
      const newPeople = [
        ...currentPeople,
        { id: Date.now().toString(), name: '', connected: false },
      ];
      updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
    } else {
      toast({
        title: 'Limit Reached',
        description: 'You can add up to 7 people to connect with.',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePerson = (id: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).filter(
      (p) => p.id !== id
    );
    updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handlePersonNameChange = (id: string, name: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).map((p) =>
      p.id === id ? { ...p, name } : p
    );
    updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handleToggleConnected = (id: string) => {
    const newPeople = (currentPlan.peopleToConnect || []).map((p) =>
      p.id === id ? { ...p, connected: !p.connected } : p
    );
    updatePlanForWeek(weekKey, { peopleToConnect: newPeople });
  };

  const handleGoalsAchievedChange = (value: number) => {
    updatePlanForWeek(weekKey, { goalsAchieved: value });
  };
  
   const handleScheduleChange = (day: string, part: 'morning' | 'afternoon' | 'evening', value: string) => {
    const schedule = currentPlan.schedule || {};
    const daySchedule = schedule[day] || {};
    const newDaySchedule = { ...daySchedule, [part]: value };
    const newSchedule = { ...schedule, [day]: newDaySchedule };
    updatePlanForWeek(weekKey, { schedule: newSchedule as any }); // Type assertion to avoid complexity
  };

  const goalsSet = currentPlan.weeklyGoals?.length || 0;
  const goalsAchievedValue = currentPlan.goalsAchieved || 0;
  const score = goalsSet > 0 ? Math.round((goalsAchievedValue / goalsSet) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title={`Weekly Plan`}
          description={`Begin with Focus: ${format(
            weekStart,
            'MMMM d'
          )} - ${format(addDays(weekStart, 6), 'MMMM d, yyyy')}`}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeek(subWeeks(week, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
           <p className="text-lg font-semibold text-primary w-28 text-center">
            Week {format(week, "w")}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeek(addWeeks(week, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setWeek(new Date())}>
            This Week
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>High-Level Focus</CardTitle>
          <CardDescription>
            Your long-term vision and monthly goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
                <Label className="font-semibold text-muted-foreground">5 Year Vision:</Label>
                <p className="font-bold truncate">{fiveYearVision || "Not set yet"}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for YEAR:</Label>
                <p className="font-bold truncate">{bigGoalYear || "Not set yet"}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for MONTH:</Label>
                <p className="font-bold truncate">{bigGoalMonth || "Not set yet"}</p>
             </div>
             <div className='flex items-center gap-4'>
                <Label className="font-semibold text-muted-foreground">Big Goal for WEEK:</Label>
                <Input
                  placeholder="Define your main goal for this week..."
                  value={currentPlan.bigGoal}
                  onChange={(e) => handleBigGoalWeekChange(e.target.value)}
                  className="font-bold flex-1"
                />
             </div>
           </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Weekly Schedule & Goals</CardTitle>
                <CardDescription>Plan your tasks for each part of the day.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table className="border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24 font-bold text-center">Time</TableHead>
                            {weekDays.map(day => (
                                <TableHead key={day.toISOString()} className="text-center font-bold">
                                    {format(day, "EEE").toUpperCase()}
                                    <p className="font-normal text-xs">{format(day, "d MMM")}</p>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(['morning', 'afternoon', 'evening'] as const).map(part => (
                            <TableRow key={part}>
                                <TableCell className="font-bold align-middle text-center capitalize">{part}</TableCell>
                                {weekDays.map(day => {
                                    const dayKey = format(day, 'yyyy-MM-dd');
                                    return (
                                        <TableCell key={day.toISOString()}>
                                            <Textarea 
                                                className="min-h-24 bg-transparent border-dashed focus-visible:ring-1 focus-visible:ring-offset-0" 
                                                value={(currentPlan.schedule as any)?.[dayKey]?.[part] || ''}
                                                onChange={e => handleScheduleChange(dayKey, part, e.target.value)}
                                            />
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        
          <div className="space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle>Goals for the Week</CardTitle>
                    <CardDescription>Prioritize your key objectives.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-2">
                        {(currentPlan.weeklyGoals || []).map(goal => (
                            <div key={goal.id} className="flex items-center gap-2">
                                <Checkbox checked={goal.priority} onCheckedChange={() => handlePriorityChange(goal.id)} title="Mark as priority" />
                                <Input value={goal.text} onChange={e => handleGoalChange(goal.id, e.target.value)} className="h-8" placeholder="New goal..."/>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveGoal(goal.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={handleAddGoal}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
                        </Button>
                    </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle>Weekly Goal Score</CardTitle>
                    <CardDescription>Track your achievements.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div className="text-center">
                        <Label>Set</Label>
                        <Input value={goalsSet} readOnly className="w-16 text-center font-bold mt-1" />
                    </div>
                    <div className="text-center">
                        <Label>Achieved</Label>
                        <Input type="number" value={goalsAchievedValue} onChange={e => handleGoalsAchievedChange(Number(e.target.value))} className="w-16 mt-1" />
                    </div>
                    <div className="text-center flex-1">
                        <Label>Score</Label>
                        <div className="text-3xl font-bold text-primary mt-1">{score}%</div>
                    </div>
                </CardContent>
              </Card>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
            <CardHeader>
                <CardTitle>Affirmations for the Week</CardTitle>
                <CardDescription>Select up to 4 affirmations to focus on.</CardDescription>
            </CardHeader>
            <CardContent>
                <Select onValueChange={() => {}} value="">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose affirmations for the week" />
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
                 <div className="flex flex-wrap gap-2 pt-4">
                    {(currentPlan.selectedAffirmations || []).map(affirmation => <Badge key={affirmation} variant="secondary">{affirmation}</Badge>)}
                </div>
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Habits for the Week</CardTitle>
                    <CardDescription>Your selected habits to start and stop.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Textarea value={habits} readOnly disabled rows={2} placeholder="Not set yet"/>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>People to Connect with</CardTitle>
                    <CardDescription>Nurture your relationships this week.</CardDescription>
                </CardHeader>
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

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Week Plan
        </Button>
      </div>
    </div>
  );
}

    