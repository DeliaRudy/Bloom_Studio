
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { demoBigGoal } from '@/lib/demo-data';

export default function DemoVisionStatementPage() {
  const { toast } = useToast();
  const [goal, setGoal] = React.useState(demoBigGoal.goal);
  const [analysis, setAnalysis] = React.useState<any>(null);

  const handleLockGoal = () => {
    if (!goal) {
      toast({
        title: 'Incomplete Goal',
        description: 'Please write down your 12-month goal.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Demo Mode',
      description: 'Your goal is set for this demo session.',
    });
  };

  const handleAnalyze = () => {
    setAnalysis(demoBigGoal.aiAnalysis);
    toast({
      title: 'Analysis Complete!',
      description: 'This is a sample AI analysis for the demo.',
    });
  }

  return (
    <div>
      <PageHeader
        title="My Big Goal"
        description="Solidify your vision with a powerful statement and choose one major goal to focus on for the next year."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                STEP 3
              </Badge>
              <CardTitle className="font-headline">Craft Your Statement</CardTitle>
            </div>
            <CardDescription>
              Choose 1 big goal to achieve in the next 12 months which is the
              first big milestone on your journey to achieving your 5 year
              vision, lifetime goals and realising your ambition. This goal must
              be measurable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 pt-4">
              <Label htmlFor="12-month-goal">
                My One Measurable 12-Month Goal
              </Label>
              <Textarea
                id="12-month-goal"
                name="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="resize-none h-32 leading-loose bg-transparent"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px 2rem)',
                  lineHeight: '2rem',
                  backgroundAttachment: 'local',
                }}
              />
              <p className="text-sm text-muted-foreground">
                This will be your north star for the next year.
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button onClick={handleAnalyze}>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Goal
            </Button>
            <Button size="lg" onClick={handleLockGoal}>
              Lock My First Big Goal
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">SMART Goal Analysis</CardTitle>
            <CardDescription>
              Here is the AI-powered analysis of your goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {analysis ? (
              <div className="prose prose-sm max-w-none text-foreground p-4 bg-muted/50 rounded-lg h-full space-y-4">
                <div>
                  <h4 className="font-semibold">Analysis:</h4>
                  <p>{analysis.analysis}</p>
                </div>
                {analysis.suggestions && (
                  <div>
                    <h4 className="font-semibold">Suggestions:</h4>
                    <p>{analysis.suggestions}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4 border-2 border-dashed rounded-lg">
                <p>Your goal analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
