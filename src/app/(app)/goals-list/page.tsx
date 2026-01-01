
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Brain, Briefcase, User, Users } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { CategoryGoal } from "@/lib/types";

const goalCategories = [
  { id: "health-fitness", label: "Health & Fitness", icon: Dumbbell },
  { id: "strong-mind", label: "Strong Mind", icon: Brain },
  { id: "career-profession", label: "Career/Profession", icon: Briefcase },
  { id: "personal", label: "Personal", icon: User },
  { id: "family-friends", label: "Family & Friends", icon: Users },
];

export default function GoalsListPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const goalsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/categoryGoals`);
  }, [firestore, user]);

  const { data: goalsData, isLoading } = useCollection<CategoryGoal>(goalsCollection);

  const goals = React.useMemo(() => {
    const state: Record<string, Partial<CategoryGoal>> = {};
    goalCategories.forEach(cat => {
        const goal = goalsData?.find(g => g.id === cat.id);
        state[cat.id] = goal || { shortTermGoal: "", longTermGoal: ""};
    });
    return state;
  }, [goalsData]);


  const handleGoalChange = (category: string, type: "shortTermGoal" | "longTermGoal", value: string) => {
    if (!goalsCollection) return;
    
    const goalDocRef = doc(goalsCollection, category);
    setDocumentNonBlocking(goalDocRef, { 
        [type]: value,
        category: category, // Ensure category is set
        sessionID: 'default',
        id: category
    }, { merge: true });
  };

  const handleSave = () => {
    toast({
        title: "Goals Saved!",
        description: "Your short and long-term goals have been updated.",
    })
  }

  return (
    <div>
      <PageHeader
        title="Set Your Goals"
        description="Define your short-term (this year) and long-term (3-5 years) goals across the most important areas of your life."
      />
      <Tabs defaultValue="health-fitness" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {goalCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {goalCategories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <cat.icon className="h-6 w-6 text-primary" /> {cat.label} Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {isLoading ? <p>Loading goals...</p> : (<>
                    <div className="space-y-2">
                    <Label htmlFor={`${cat.id}-short`}>Short-Term Goal (1 year)</Label>
                    <Textarea
                        id={`${cat.id}-short`}
                        placeholder={`e.g., Go to the gym 3 times a week.`}
                        defaultValue={goals[cat.id]?.shortTermGoal || ''}
                        onBlur={(e) => handleGoalChange(cat.id, 'shortTermGoal', e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor={`${cat.id}-long`}>Long-Term Goal (3-5 years)</Label>
                    <Textarea
                        id={`${cat.id}-long`}
                        placeholder={`e.g., Complete a full marathon.`}
                        defaultValue={goals[cat.id]?.longTermGoal || ''}
                        onBlur={(e) => handleGoalChange(cat.id, 'longTermGoal', e.target.value)}
                    />
                    </div>
                 </>)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>Save All Goals</Button>
      </div>
    </div>
  );
}
