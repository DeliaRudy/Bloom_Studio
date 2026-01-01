
"use client"

import * as React from "react"
import { useFormState } from "react-dom"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { analyzeGoal } from "./actions"
import { Sparkles } from "lucide-react"
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { VisionStatement } from "@/lib/types"

const initialState = {
    isSmart: false,
    analysis: null,
    suggestions: null,
    error: null,
};

export default function VisionStatementPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [state, formAction] = useFormState(analyzeGoal, initialState);

  const goalDocRef = useMemoFirebase(() => {
      if (!user) return null;
      return doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'bigGoal');
  }, [firestore, user]);

  const { data: goalData, isLoading } = useDoc<VisionStatement>(goalDocRef);
  
  const [goal, setGoal] = React.useState("")
  React.useEffect(() => {
    if(goalData) {
        setGoal(goalData.goalText || "");
    }
  }, [goalData]);


  const handleLockGoal = () => {
    if (!goal) {
        toast({
            title: "Incomplete Goal",
            description: "Please write down your 12-month goal.",
            variant: "destructive"
        })
        return;
    }
    if(goalDocRef) {
        setDocumentNonBlocking(goalDocRef, {
            goalText: goal,
            sessionID: 'default'
        }, { merge: true });
    }

    toast({
        title: "Goal Locked!",
        description: "Your first big goal is set. You've got this!"
    })
  }
  
  React.useEffect(() => {
    if (state.error) {
        toast({
            title: "Error Analyzing Goal",
            description: state.error,
            variant: "destructive"
        })
    }
  }, [state.error, toast])


  return (
    <div>
      <PageHeader
        title="My Big Goal"
        description="Solidify your vision with a powerful statement and choose one major goal to focus on for the next year."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 3</Badge>
                        <CardTitle className="font-headline">Craft Your Statement</CardTitle>
                    </div>
                    <CardDescription>
                        Choose 1 big goal to achieve in the next 12 months which is the first big milestone on your journey to achieving your 5 year vision, lifetime goals and realising your ambition. This goal must be measurable.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-2 pt-4">
                    <Label htmlFor="12-month-goal">My One Measurable 12-Month Goal</Label>
                    <Textarea
                    id="12-month-goal"
                    name="goal"
                    placeholder="e.g., Launch my side business and generate $10,000 in revenue."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="resize-none h-32 leading-loose bg-transparent"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px 2rem)',
                        lineHeight: '2rem',
                        backgroundAttachment: 'local'
                    }}
                    />
                    <p className="text-sm text-muted-foreground">This will be your north star for the next year.</p>
                </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button type="submit">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Goal
                    </Button>
                    <Button size="lg" onClick={handleLockGoal}>Lock My First Big Goal</Button>
                </CardFooter>
            </form>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">SMART Goal Analysis</CardTitle>
                <CardDescription>
                    Here is the AI-powered analysis of your goal.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {state.analysis ? (
                     <div className="prose prose-sm max-w-none text-foreground p-4 bg-muted/50 rounded-lg h-full space-y-4">
                        <div>
                            <h4 className="font-semibold">Analysis:</h4>
                            <p>{state.analysis}</p>
                        </div>
                        {state.suggestions && (
                             <div>
                                <h4 className="font-semibold">Suggestions:</h4>
                                <p>{state.suggestions}</p>
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
  )
}
