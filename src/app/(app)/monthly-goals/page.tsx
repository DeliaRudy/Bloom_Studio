
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Target } from 'lucide-react';

export default function MonthlyGoalsPage() {
  const [bigGoal, setBigGoal] = React.useState('');
  const [monthlyGoals, setMonthlyGoals] = React.useState<string[]>(
    Array(12).fill('')
  );
  const { toast } = useToast();

  React.useEffect(() => {
    const savedBigGoal = localStorage.getItem('bigGoal');
    if (savedBigGoal) {
      setBigGoal(savedBigGoal);
    }
    const savedMonthlyGoals = localStorage.getItem('monthlyGoals');
    if (savedMonthlyGoals) {
      const parsedGoals = JSON.parse(savedMonthlyGoals);
      if (Array.isArray(parsedGoals)) {
        const fullList = Array(12).fill('');
        parsedGoals.forEach((g, i) => {
          if (i < 12) fullList[i] = g;
        });
        setMonthlyGoals(fullList);
      }
    }
  }, []);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...monthlyGoals];
    newGoals[index] = value;
    setMonthlyGoals(newGoals);
  };

  const handleSave = () => {
    localStorage.setItem('monthlyGoals', JSON.stringify(monthlyGoals));
    console.log('Saving Monthly Goals:', monthlyGoals);
    toast({
      title: 'Monthly Goals Saved',
      description: 'Your goals for the year have been updated.',
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <PageHeader
        title="Monthly Goals"
        description="Define the goals for each month that will help you get to the 1 big goal and get you closer to your 5-year vision and lifetime goals."
      />

      {bigGoal && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center gap-2">
              <Target /> Your 12-Month "Big Goal"
            </CardTitle>
            <CardDescription>
              This is your north star. Your monthly goals should be stepping
              stones to achieve this.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{bigGoal}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Monthly Breakdown</CardTitle>
          <CardDescription>
            What do you need to achieve each month to hit your big goal?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {monthlyGoals.map((goal, index) => (
            <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4">
              <Label htmlFor={`month-${index + 1}`} className="font-bold text-muted-foreground w-24">
                {months[index]}
              </Label>
              <Input
                id={`month-${index + 1}`}
                type="text"
                placeholder={`Goal for ${months[index]}...`}
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Monthly Goals
        </Button>
      </div>
    </div>
  );
}

    