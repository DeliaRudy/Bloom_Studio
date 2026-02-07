
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
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDocs, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { VisionStatement, MonthlyGoal } from '@/lib/types';
import { format } from 'date-fns';
import { AIInterview } from '@/components/ai-interview';
import { processMonthlyGoalsTranscript } from './actions';

export default function MonthlyGoalsPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const bigGoalDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal');
  }, [user, firestore]);
  const { data: bigGoalData } = useDoc<VisionStatement>(bigGoalDocRef);
  const bigGoal = bigGoalData?.goalText || '';

  const months = React.useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const [monthlyGoals, setMonthlyGoals] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  // This effect will fetch all 12 monthly goal documents for the year
  React.useEffect(() => {
      if (!user) return;
      setIsLoading(true);
      const fetchGoals = async () => {
          const goals: Record<string, string> = {};
          const goalsCollectionRef = collection(firestore, `users/${user.uid}/sessions/default/monthlyGoals`);
          const snapshot = await getDocs(goalsCollectionRef);
          snapshot.forEach(doc => {
              if(doc.id.startsWith(String(currentYear))) {
                goals[doc.id] = (doc.data() as MonthlyGoal).bigGoal || '';
              }
          });

          // Ensure all months for the current year are initialized
          months.forEach((_, i) => {
              const monthId = format(new Date(currentYear, i), 'yyyy-MM');
              if(!goals[monthId]) {
                  goals[monthId] = '';
              }
          });

          setMonthlyGoals(goals);
          setIsLoading(false);
      }
      fetchGoals();
  }, [user, firestore, currentYear, months]);


  const handleGoalChange = (monthId: string, value: string) => {
    if (!user) return;
    const newGoals = {...monthlyGoals, [monthId]: value };
    setMonthlyGoals(newGoals); // Optimistic update
    
    const goalDocRef = doc(firestore, `users/${user.uid}/sessions/default/monthlyGoals`, monthId);
    setDocumentNonBlocking(goalDocRef, { bigGoal: value, id: monthId, sessionID: 'default' }, { merge: true });
  };

  const handleSave = () => {
    toast({
      title: 'Monthly Goals Saved',
      description: 'Your goals for the year have been updated.',
    });
  };

  const handleInterviewTranscript = async (transcript: string) => {
    if (transcript.trim().length === 0) {
        toast({ title: 'No speech detected', variant: 'destructive' });
        return;
    }
    const result = await processMonthlyGoalsTranscript(transcript);
    if (result.error || !result.data) {
        toast({ title: 'Analysis Failed', description: result.error, variant: 'destructive' });
        return;
    }
    
    if (!user) return;

    const extractedGoals = result.data;
    const updatedGoals: Record<string, string> = {};

    for (const monthName in extractedGoals) {
        const monthIndex = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        if (monthIndex !== -1) {
            const monthId = format(new Date(currentYear, monthIndex), 'yyyy-MM');
            const goalText = extractedGoals[monthName];

            // Use the non-blocking update
            const goalDocRef = doc(firestore, `users/${user.uid}/sessions/default/monthlyGoals`, monthId);
            setDocumentNonBlocking(goalDocRef, { bigGoal: goalText, id: monthId, sessionID: 'default' }, { merge: true });
            
            updatedGoals[monthId] = goalText;
        }
    }
    
    // Optimistically update the local state to re-render the inputs
    setMonthlyGoals(prev => ({ ...prev, ...updatedGoals }));

    toast({ title: 'Monthly Goals Updated!', description: 'Your yearly goals have been updated from the interview.' });
  };


  return (
    <div>
      <PageHeader
        title="Monthly Goals"
        description="Define the goals for each month that will help you get to the 1 big goal and get you closer to your 5-year vision and lifetime goals."
      />

        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="font-headline">AI Interview</CardTitle>
                <CardDescription>Use your voice to state your goals for various months of the year.</CardDescription>
            </CardHeader>
            <CardContent>
                <AIInterview onTranscript={handleInterviewTranscript} />
            </CardContent>
        </Card>

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
          {isLoading ? <p>Loading goals...</p> : months.map((month, index) => {
              const monthId = format(new Date(currentYear, index), 'yyyy-MM');
              return (
                <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor={`month-${index + 1}`} className="font-bold text-muted-foreground w-24">
                    {months[index]}
                </Label>
                <Input
                    id={`month-${index + 1}`}
                    type="text"
                    placeholder={`Goal for ${months[index]}...`}
                    value={monthlyGoals[monthId] || ''}
                    onChange={(e) => handleGoalChange(monthId, e.target.value)}
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
