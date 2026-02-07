
'use client';

import * as React from 'react';
import {
  format,
  addDays,
  startOfWeek,
  subDays,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Check, Clock, PlusCircle, Trash2, Link2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CycleSyncBanner } from '@/components/cycle-sync-banner';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { DailyHabit, DailyPlan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AIInterview } from '@/components/ai-interview';
import { processDailyPlanTranscript } from './actions';


const hours = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`); // 7am to 7pm

export function DailyPlanClient() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const dailyPlanDocRef = useMemoFirebase(() => 
      user ? doc(firestore, `users/${user.uid}/sessions/default/dailyPlans`, dateKey) : null
  , [user, firestore, dateKey]);

  const { data: dailyPlanData, isLoading: isPlanLoading } = useDoc<DailyPlan>(dailyPlanDocRef);

  const habitsCollectionRef = useMemoFirebase(() =>
    user ? collection(firestore, `users/${user.uid}/sessions/default/dailyHabits`) : null
  , [user, firestore]);
  
  const { data: habitsData, isLoading: areHabitsLoading } = useCollection<DailyHabit>(habitsCollectionRef);

  const dailyHabits = React.useMemo(() => habitsData?.sort((a,b) => a.order - b.order) || [], [habitsData]);

  const handleDateChange = (days: number) => {
    setCurrentDate((prev) => addDays(prev, days));
  };

  const handleUpdate = (field: keyof DailyPlan, value: any) => {
      if (!dailyPlanDocRef) return;
      setDocumentNonBlocking(dailyPlanDocRef, { [field]: value, id: dateKey, sessionID: 'default' }, { merge: true });
  }

  const handlePriorityChange = (id: string, text: string) => {
    const newPriorities = (dailyPlanData?.priorities || []).map(p => p.id === id ? { ...p, text } : p);
    handleUpdate('priorities', newPriorities);
  }

  const handlePriorityToggle = (id: string) => {
    const newPriorities = (dailyPlanData?.priorities || []).map(p => p.id === id ? { ...p, completed: !p.completed } : p);
     handleUpdate('priorities', newPriorities);
  }
  
  const handleAddPriority = () => {
    const newPriorities = [...(dailyPlanData?.priorities || []), { id: Date.now().toString(), text: '', completed: false }];
     handleUpdate('priorities', newPriorities);
  }

  const handleRemovePriority = (id: string) => {
    const newPriorities = (dailyPlanData?.priorities || []).filter(p => p.id !== id);
    handleUpdate('priorities', newPriorities);
  }
  
  const handleScheduleChange = (hour: string, value: string) => {
    const newSchedule = { ...(dailyPlanData?.schedule || {}), [hour]: value };
    handleUpdate('schedule', newSchedule);
  }

  const handleHabitToggle = (habitId: string) => {
    const newHabits = { ...(dailyPlanData?.habits || {}), [habitId]: !dailyPlanData?.habits?.[habitId] };
    handleUpdate('habits', newHabits);
  }
  
  const handleSave = () => {
    toast({
      title: 'Day Plan Saved!',
      description: 'Your plan for the day has been updated.',
    });
  };

  const handleConnectCalendar = () => {
    if (!user) return;
    // Pass the user's UID in the state parameter to securely identify them in the callback
    const state = btoa(JSON.stringify({ userId: user.uid }));
    window.location.href = `/api/auth/google?state=${state}`;
  }

  const handleInterviewTranscript = async (transcript: string) => {
    if (transcript.trim().length === 0) {
      toast({ title: 'No speech detected', variant: 'destructive' });
      return;
    }
    const result = await processDailyPlanTranscript(transcript);
    if (result.error || !result.data) {
      toast({ title: 'Analysis Failed', description: result.error, variant: 'destructive' });
      return;
    }
    if (!dailyPlanDocRef) return;

    const { priorities, schedule, gratitude, reflection } = result.data;
    const newPriorities = priorities.map((p, i) => ({ id: `${Date.now()}-${i}`, text: p, completed: false }));

    const updatePayload: Partial<DailyPlan> = {};
    if (newPriorities.length > 0) updatePayload.priorities = newPriorities;
    if (schedule && Object.keys(schedule).length > 0) updatePayload.schedule = { ...(dailyPlanData?.schedule || {}), ...schedule };
    if (gratitude) updatePayload.gratitude = gratitude;
    if (reflection) updatePayload.reflection = reflection;
    
    setDocumentNonBlocking(dailyPlanDocRef, updatePayload, { merge: true });

    toast({ title: 'Daily Plan Updated!', description: 'Your plan has been updated with your spoken entries.' });
  };

  const isLoading = isPlanLoading || areHabitsLoading;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title={`Daily Plan`}
          description="Focus on your top 3 priorities for the day to make consistent progress."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold text-primary w-48 text-center">
            {format(currentDate, 'EEEE, MMM d')}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
            <CardTitle className="font-headline">AI Interview</CardTitle>
            <CardDescription>Use your voice to fill out this section. The AI assistant will guide you through the questions for your daily plan.</CardDescription>
        </CardHeader>
        <CardContent>
            <AIInterview 
                onTranscript={handleInterviewTranscript}
            />
        </CardContent>
      </Card>

      <CycleSyncBanner currentDate={currentDate} view="day" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Priorities for Today</CardTitle>
              <CardDescription>
                What are the most important things you need to accomplish?
              </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-24" /> : (
                     <div className="space-y-3">
                        {(dailyPlanData?.priorities || []).map((p, index) => (
                        <div key={p.id} className="flex items-center gap-3">
                            <Checkbox
                                id={`p-${p.id}`}
                                checked={p.completed}
                                onCheckedChange={() => handlePriorityToggle(p.id)}
                            />
                            <Input
                                defaultValue={p.text}
                                onBlur={(e) => handlePriorityChange(p.id, e.target.value)}
                                className={p.completed ? 'line-through text-muted-foreground' : ''}
                                placeholder={`Priority #${index+1}`}
                            />
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePriority(p.id)}
                            >
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>
                        ))}
                        {(dailyPlanData?.priorities || []).length < 5 && (
                            <Button variant="outline" className="w-full" onClick={handleAddPriority}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Priority
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Block out your time to stay focused.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-96" /> : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Time</TableHead>
                            <TableHead>Task / Appointment</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {hours.map((hour) => (
                            <TableRow key={hour}>
                            <TableCell className="font-semibold text-muted-foreground">
                                {hour}
                            </TableCell>
                            <TableCell>
                                <Textarea
                                className="bg-transparent border-dashed h-12"
                                defaultValue={(dailyPlanData?.schedule as any)?.[hour] || ""}
                                onBlur={(e) => handleScheduleChange(hour, e.target.value)}
                                placeholder="..."
                                />
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect to external services.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleConnectCalendar}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect to Google Calendar
                </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Habit Checklist</CardTitle>
              <CardDescription>
                Check off your daily habits as you complete them.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48" /> : (
                    <div className="space-y-3">
                        {dailyHabits.map((habit) => (
                        <div key={habit.id} className="flex items-center gap-3">
                            <Checkbox
                            id={`h-${habit.id}`}
                            checked={dailyPlanData?.habits?.[habit.id] || false}
                            onCheckedChange={() => handleHabitToggle(habit.id)}
                            />
                            <label
                            htmlFor={`h-${habit.id}`}
                            className="text-sm font-medium"
                            >
                            {habit.text}
                            </label>
                        </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gratitude & Reflection</CardTitle>
              <CardDescription>End your day with intention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {isLoading ? <Skeleton className="h-32" /> : (<>
                    <div>
                        <label className="text-sm font-medium">I am grateful for...</label>
                        <Textarea
                        defaultValue={dailyPlanData?.gratitude}
                        onBlur={e => handleUpdate('gratitude', e.target.value)}
                        className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">My reflection on today...</label>
                        <Textarea
                         defaultValue={dailyPlanData?.reflection}
                         onBlur={e => handleUpdate('reflection', e.target.value)}
                        className="mt-1"
                        />
                    </div>
                 </>)}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Day Plan
        </Button>
      </div>
    </div>
  );
}
