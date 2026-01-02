
'use client';

import * as React from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, getWeek } from 'date-fns';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CycleSyncBanner } from '@/components/cycle-sync-banner';
import { demoWeeklyPlans, demoBigGoal, demoLifeVision, demoPersona, demoMonthlyGoals, demoAffirmations } from '@/lib/demo-data';

export default function DemoWeekPlannerPage() {
  const { toast } = useToast();
  const [week, setWeek] = React.useState(new Date());

  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const currentPlan = demoWeeklyPlans.find(p => p.id === (format(weekStart, 'yyyy-') + getWeek(weekStart, { weekStartsOn: 1 }))) || demoWeeklyPlans[0];

  const goalsSet = currentPlan.goals.length;
  const goalsAchievedValue = currentPlan.goals.filter(g => g.priority).length;
  const score = goalsSet > 0 ? Math.round((goalsAchievedValue / goalsSet) * 100) : 0;
  
  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title={`Weekly Plan`}
          description={`Begin with Focus: ${format(weekStart, 'MMMM d')} - ${format(addDays(weekStart, 6), 'MMMM d, yyyy')}`}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeek(subWeeks(week, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold text-primary w-28 text-center">
            Week {getWeek(week, { weekStartsOn: 1 })}
          </p>
          <Button variant="outline" size="icon" onClick={() => setWeek(addWeeks(week, 1))}>
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
          <CardDescription>Your long-term vision and monthly goals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
                <Label className="font-semibold text-muted-foreground">5 Year Vision:</Label>
                <p className="font-bold truncate">{demoLifeVision.fiveYearVision}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for YEAR:</Label>
                <p className="font-bold truncate">{demoBigGoal.goal}</p>
             </div>
              <div>
                <Label className="font-semibold text-muted-foreground">Big Goal for MONTH:</Label>
                <p className="font-bold truncate">{demoMonthlyGoals[week.getMonth()].goal}</p>
             </div>
             <div className='flex items-center gap-4'>
                <Label className="font-semibold text-muted-foreground">Big Goal for WEEK:</Label>
                <Input defaultValue={currentPlan.bigGoal} className="font-bold flex-1" />
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
                                {weekDays.map(day => (
                                    <TableCell key={day.toISOString()}>
                                        <Textarea className="min-h-24 bg-transparent border-dashed" placeholder="Plan..." />
                                    </TableCell>
                                ))}
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
                        {currentPlan.goals.map(goal => (
                            <div key={goal.id} className="flex items-center gap-2">
                                <Checkbox defaultChecked={goal.priority} />
                                <Input defaultValue={goal.text} className="h-8" />
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
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
                        <Input type="number" defaultValue={goalsAchievedValue} className="w-16 mt-1" />
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
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose affirmations..." />
                    </SelectTrigger>
                    <SelectContent>
                        {demoAffirmations.map((affirmation, i) => (
                            <SelectItem key={i} value={affirmation}>
                                <div className="flex items-center">
                                    <Checkbox className="mr-2"/>
                                    <span>{affirmation}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <div className="flex flex-wrap gap-2 pt-4">
                    {demoAffirmations.slice(0,2).map(affirmation => <Badge key={affirmation} variant="secondary">{affirmation}</Badge>)}
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
                     <Textarea defaultValue={`Start: ${demoPersona.habitsToStart[0]}\nStop: ${demoPersona.habitsToStop[0]}`} readOnly rows={2} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>People to Connect with</CardTitle>
                    <CardDescription>Nurture your relationships this week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {currentPlan.peopleToConnect.map(person => (
                            <div key={person.id} className="flex items-center gap-2">
                                <Checkbox defaultChecked={person.connected} />
                                <Input defaultValue={person.name} className={`h-8 ${person.connected ? 'line-through text-muted-foreground' : ''}`} />
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
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
