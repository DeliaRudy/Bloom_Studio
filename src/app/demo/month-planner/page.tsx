
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
import { demoMonthlyGoals, demoBigGoal, demoLifeVision, demoPersona } from '@/lib/demo-data';

type Goal = {
  id: string;
  text: string;
  completed: boolean;
};

export default function DemoMonthPlannerPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { toast } = useToast();

  const [goals, setGoals] = React.useState<Goal[]>([
    { id: '1', text: 'Define content pillars for Q2', completed: true },
    { id: '2', text: 'Secure 1 paid brand collaboration', completed: true },
    { id: '3', text: 'Batch produce 15 short-form videos', completed: false },
    { id: '4', text: 'Reach out to 10 creators for potential collabs', completed: false },
  ]);

  const [fiveWords, setFiveWords] = React.useState(['Focus', 'Execute', 'Connect', 'Create', 'Rest']);
  const [selectedStartHabit] = React.useState(demoPersona.habitsToStart[0]);
  const [selectedStopHabit] = React.useState(demoPersona.habitsToStop[0]);
  const [selectedLifeRules, setSelectedLifeRules] = React.useState([demoPersona.philosophies.split('.')[0]]);

  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  const goalsAchieved = goals.filter((g) => g.completed).length;
  const goalsSet = goals.length;
  const achievementRate = goalsSet > 0 ? Math.round((goalsAchieved / goalsSet) * 100) : 0;
  const selectedMonthlyBigGoal = demoMonthlyGoals[currentMonth.getMonth()].goal;

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
              {demoLifeVision.fiveYearVision}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the YEAR:
            </Label>
            <p className="font-bold flex-1 truncate">
              {demoBigGoal.goal}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Label className="w-40 font-semibold text-muted-foreground">
              Big Goal for the MONTH:
            </Label>
            <div className="flex-1">
              <Select
                value={selectedMonthlyBigGoal}
              >
                <SelectTrigger className="font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demoMonthlyGoals.map((goal, index) => (
                      <SelectItem key={index} value={goal.goal}>
                        {goal.goal}
                      </SelectItem>
                    ))}
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
                      defaultChecked={goal.completed}
                    />
                    <Input
                      id={`goal-text-${goal.id}`}
                      defaultValue={goal.text}
                      className={`flex-1 text-sm ${
                        goal.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            <Button
              variant="outline"
              className="w-full mt-4"
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
                        defaultValue={word}
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
                value={selectedStartHabit}
              >
                <SelectTrigger id="start-habit">
                  <SelectValue placeholder="Select a habit to start" />
                </SelectTrigger>
                <SelectContent>
                  {demoPersona.habitsToStart.map((habit, index) => (
                      <SelectItem key={index} value={habit}>
                        {habit}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-habit">Something to Stop</Label>
              <Select
                value={selectedStopHabit}
              >
                <SelectTrigger id="stop-habit">
                  <SelectValue placeholder="Select a habit to stop" />
                </SelectTrigger>
                <SelectContent>
                  {demoPersona.habitsToStop.map((habit, index) => (
                      <SelectItem key={index} value={habit}>
                        {habit}
                      </SelectItem>
                    ))}
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
                {demoPersona.philosophies.split('. ').map((rule, index) => (
                    <SelectItem
                      key={index}
                      value={rule}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedLifeRules.includes(rule)}
                          className="mr-2"
                        />
                        <span>{rule}</span>
                      </div>
                    </SelectItem>
                  ))}
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
