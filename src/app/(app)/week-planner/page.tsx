
'use client';

import * as React from 'react';
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  getWeek,
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
import { CycleSyncBanner } from '@/components/cycle-sync-banner';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { VisionStatement, MonthlyGoal, JournalEntry, WeeklyPlan } from '@/lib/types';


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


export default function WeekPlannerPage() {
  const { toast } = useToast();
  const [week, setWeek] = React.useState(new Date());
  const { user, firestore } = useFirebase();

  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekKey = format(weekStart, 'yyyy-') + getWeek(weekStart, { weekStartsOn: 1 });
  const monthKey = format(weekStart, 'yyyy-MM');

  // --- Data Fetching ---
  const fiveYearVisionDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/sessions/default/fiveYearVisionPrompts`, 'visionStatement') : null, [user, firestore]);
  const { data: fiveYearVisionData } = useDoc<any>(fiveYearVisionDocRef);
  const fiveYearVision = fiveYearVisionData?.responseText || 'Not set yet';

  const bigGoalYearDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal') : null, [user, firestore]);
  const { data: bigGoalYearData } = useDoc<VisionStatement>(bigGoalYearDocRef);
  const bigGoalYear = bigGoalYearData?.goalText || 'Not set yet';

  const bigGoalMonthDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/sessions/default/monthlyGoals`, monthKey) : null, [user, firestore, monthKey]);
  const { data: bigGoalMonthData } = useDoc<MonthlyGoal>(bigGoalMonthDocRef);
  const bigGoalMonth = bigGoalMonthData?.bigGoal || 'Not set yet';
  
  const journalEntriesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/sessions/default/journalEntries`) : null, [user, firestore]);
  const { data: journalEntriesData } = useCollection<JournalEntry>(journalEntriesCollectionRef);
  const availableAffirmations = React.useMemo(() => journalEntriesData?.filter(e => e.entryType === 'affirmation') || [], [journalEntriesData]);
  const habits = React.useMemo(() => {
     const startHabit = journalEntriesData?.find(e => e.entryType === 'habit_start_focus');
     const stopHabit = journalEntriesData?.find(e => e.entryType === 'habit_stop_focus');
     let habitsText = '';
     if (startHabit) habitsText += `Start: ${startHabit.text}\n`;
     if (stopHabit) habitsText += `Stop: ${stopHabit.text}`;
     return habitsText.trim() || 'Not set yet';
  }, [journalEntriesData]);

  const weeklyPlanDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/sessions/default/weeklyPlans`, weekKey) : null, [user, firestore, weekKey]);
  const { data: currentPlan, isLoading } = useDoc<WeeklyPlan>(weeklyPlanDocRef);
  
  const updatePlanForWeek = (newPlan: Partial<WeeklyPlan>) => {
    if (!weeklyPlanDocRef) return;
    setDocumentNonBlocking(weeklyPlanDocRef, { ...newPlan, id: weekKey, sessionID: 'default' }, { merge: true });
  };
  
  // --- Handlers ---
  const handleSave = () => {
    toast({
      title: 'Week Planner Saved!',
      description: 'Your plan for the week has been successfully saved.',
    });
  };

  const handleBigGoalWeekChange = (value: string) => {
    updatePlanForWeek({ bigGoal: value });
  };

  const handleAddGoal = () => {
    const newGoals = [
      ...(currentPlan?.goals || []),
      { id: Date.now().toString(), text: '', priority: false },
    ];
    updatePlanForWeek({ goals: newGoals });
  };

  const handleRemoveGoal = (id: string) => {
    const newGoals = (currentPlan?.goals || []).filter(
      (goal) => goal.id !== id
    );
    updatePlanForWeek({ goals: newGoals });
  };

  const handleGoalChange = (id: string, text: string) => {
    const newGoals = (currentPlan?.goals || []).map((goal) =>
      goal.id === id ? { ...goal, text } : goal
    );
    updatePlanForWeek({ goals: newGoals });
  };

  const handlePriorityChange = (id: string) => {
    const newGoals = (currentPlan?.goals || []).map((goal) =>
      goal.id === id ? { ...goal, priority: !goal.priority } : goal
    );
    updatePlanForWeek({ goals: newGoals });
  };

  const handleAffirmationSelect = (affirmationText: string) => {
    const currentAffirmations = currentPlan?.affirmations || [];
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
    updatePlanForWeek({ affirmations: newAffirmations });
  };

  const handleAddPerson = () => {
    const currentPeople = currentPlan?.peopleToConnect || [];
    if (currentPeople.length < 7) {
      const newPeople = [
        ...currentPeople,
        { id: Date.now().toString(), name: '', connected: false },
      ];
      updatePlanForWeek({ peopleToConnect: newPeople });
    } else {
      toast({
        title: 'Limit Reached',
        description: 'You can add up to 7 people to connect with.',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePerson = (id: string) => {
    const newPeople = (currentPlan?.peopleToConnect || []).filter(
      (p) => p.id !== id
    );
    updatePlanForWeek({ peopleToConnect: newPeople });
  };

  const handlePersonNameChange = (id: string, name: string) => {
    const newPeople = (currentPlan?.peopleToConnect || []).map((p) =>
      p.id === id ? { ...p, name } : p
    );
    updatePlanForWeek({ peopleToConnect: newPeople });
  };

  const handleToggleConnected = (id: string) => {
    const newPeople = (currentPlan?.peopleToConnect || []).map((p) =>
      p.id === id ? { ...p, connected: !p.connected } : p
    );
    updatePlanForWeek({ peopleToConnect: newPeople });
  };
   
  const handleScheduleChange = (day: string, part: 'morning' | 'afternoon' | 'evening', value: string) => {
    const schedule = currentPlan?.schedule || {};
    const daySchedule = schedule[day] || { morning: '', afternoon: '', evening: '' };
    const newDaySchedule = { ...daySchedule, [part]: value };
    const newSchedule = { ...schedule, [day]: newDaySchedule };
    updatePlanForWeek({ schedule: newSchedule });
  };

  // --- Derived State ---
  const goalsSet = currentPlan?.goals?.length || 0;
  const goalsAchievedValue = currentPlan?.goals?.filter(g => g.priority).length || 0;
  const score = goalsSet > 0 ? Math.round((goalsAchievedValue / goalsSet) * 100) : 0;

  if (isLoading) {
      return <div>Loading...</div>;
  }

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
            Week {getWeek(week, { weekStartsOn: 1 })}
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
      
      <CycleSyncBanner currentDate={weekStart} view="week" />

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
                <p className="font-bold truncate">{fiveYearVision}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for YEAR:</Label>
                <p className="font-bold truncate">{bigGoalYear}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for MONTH:</Label>
                <p className="font-bold truncate">{bigGoalMonth}</p>
             </div>
             <div className='flex items-center gap-4'>
                <Label className="font-semibold text-muted-foreground">Big Goal for WEEK:</Label>
                <Input
                  placeholder="Define your main goal for this week..."
                  defaultValue={currentPlan?.bigGoal}
                  onBlur={(e) => handleBigGoalWeekChange(e.target.value)}
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
                                                defaultValue={(currentPlan?.schedule as any)?.[dayKey]?.[part] || ''}
                                                onBlur={e => handleScheduleChange(dayKey, part, e.target.value)}
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
                        {(currentPlan?.goals || []).map(goal => (
                            <div key={goal.id} className="flex items-center gap-2">
                                <Checkbox checked={goal.priority} onCheckedChange={() => handlePriorityChange(goal.id)} title="Mark as priority" />
                                <Input defaultValue={goal.text} onBlur={e => handleGoalChange(goal.id, e.target.value)} className="h-8" placeholder="New goal..."/>
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
                        <Input type="number" defaultValue={goalsAchievedValue} onBlur={e => {
                            const newGoals = (currentPlan?.goals || []).map((g,i) => ({...g, priority: i < Number(e.target.value)}));
                            updatePlanForWeek({ goals: newGoals });
                        }} className="w-16 mt-1" />
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
                                        <Checkbox checked={(currentPlan?.affirmations || []).includes(affirmation.text)} className="mr-2"/>
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
                    {(currentPlan?.affirmations || []).map(affirmation => <Badge key={affirmation} variant="secondary">{affirmation}</Badge>)}
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
                        {(currentPlan?.peopleToConnect || []).map(person => (
                            <div key={person.id} className="flex items-center gap-2">
                                <Checkbox id={`person-${person.id}`} checked={person.connected} onCheckedChange={() => handleToggleConnected(person.id)} />
                                <Input
                                    defaultValue={person.name}
                                    onBlur={(e) => handlePersonNameChange(person.id, e.target.value)}
                                    placeholder="Enter person's name..."
                                    className={`h-8 ${person.connected ? 'line-through text-muted-foreground' : ''}`}
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemovePerson(person.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full" onClick={handleAddPerson} disabled={(currentPlan?.peopleToConnect || []).length >= 7}>
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
