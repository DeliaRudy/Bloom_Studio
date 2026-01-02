
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
import { demoBigGoal, demoMonthlyGoals } from '@/lib/demo-data';

export default function DemoMonthlyGoalsPage() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const months = React.useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const [monthlyGoals, setMonthlyGoals] = React.useState<Record<string, string>>(() => {
      const goals: Record<string, string> = {};
      demoMonthlyGoals.forEach(g => {
          goals[g.month] = g.goal;
      });
      return goals;
  });

  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Monthly Goals"
        description="Define the goals for each month that will help you get to the 1 big goal and get you closer to your 5-year vision and lifetime goals."
      />

      {demoBigGoal.goal && (
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
            <p className="text-lg font-semibold text-foreground">{demoBigGoal.goal}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Monthly Breakdown for {currentYear}</CardTitle>
          <CardDescription>
            What do you need to achieve each month to hit your big goal?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {months.map((month, index) => {
              return (
                <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor={`month-${index + 1}`} className="font-bold text-muted-foreground w-24">
                    {month}
                </Label>
                <Input
                    id={`month-${index + 1}`}
                    type="text"
                    placeholder={`Goal for ${month}...`}
                    defaultValue={monthlyGoals[month] || ''}
                />
                </div>
              )
          })}
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

