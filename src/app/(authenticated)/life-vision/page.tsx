
"use client";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { addYears, differenceInYears, parse } from 'date-fns';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const fiveYearPrompts = [
  "Where will I live?",
  "Who will I be with?",
  "What will I have achieved in work or business?",
  "What will I own?",
  "What will I look like?",
  "How will I feel?",
  "What will I do in my free time?",
  "How much money will I have made?",
  "What do I need to do to make this money and live this life?",
];

const decadeMilestonesAges = [30, 40, 50, 60, 70, 80, 90, 100];

type LifeVisionMilestone = {
    id: string;
    age: number;
    milestoneText: string;
}

type FiveYearVisionPrompt = {
    id: string;
    promptKey: string;
    responseText: string;
}

export default function LifeVisionPage() {
  const { firestore, user } = useFirebase();

  const { toast } = useToast();

  const lifeVisionMilestonesCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/lifeVisionMilestones`);
  }, [firestore, user]);

  const fiveYearVisionPromptsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/fiveYearVisionPrompts`);
  }, [firestore, user]);
  
  const visionStatementDocRef = useMemoFirebase(() => {
      if(!user) return null;
      return doc(firestore, `users/${user.uid}/sessions/default/visionStatements`, 'fiveYearVision');
  }, [user, firestore]);
  
  const { data: visionStatementData } = useDoc<any>(visionStatementDocRef);

  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");
  const [visionStatementDream, setVisionStatementDream] = React.useState(visionStatementData?.dream || "");
  const [visionStatementAmount, setVisionStatementAmount] = React.useState(visionStatementData?.amount || "");

  React.useEffect(() => {
      if (visionStatementData) {
          setVisionStatementDream(visionStatementData.dream || "");
          setVisionStatementAmount(visionStatementData.amount || "");
      }
  }, [visionStatementData]);


  const { data: decadeMilestones } = useCollection<LifeVisionMilestone>(lifeVisionMilestonesCollection);
  const { data: fiveYearPromptsData } = useCollection<FiveYearVisionPrompt>(fiveYearVisionPromptsCollection);
  
  const decadeValues = React.useMemo(() => {
    const values: Record<number, LifeVisionMilestone | undefined> = {};
    decadeMilestones?.forEach(item => {
        values[item.age] = item;
    });
    return values;
  }, [decadeMilestones]);

  const fiveYearValues = React.useMemo(() => {
    const values: Record<string, FiveYearVisionPrompt | undefined> = {};
    fiveYearPromptsData?.forEach(item => {
        values[item.promptKey] = item;
    });
    return values;
  }, [fiveYearPromptsData]);

  const handleDecadeChange = (age: number, milestoneText: string) => {
    if (!lifeVisionMilestonesCollection) return;
    const existing = decadeValues[age];
    if (existing) {
        const docRef = doc(lifeVisionMilestonesCollection, existing.id);
        updateDoc(docRef, { milestoneText });
    } else {
        addDocumentNonBlocking(lifeVisionMilestonesCollection, { age, milestoneText, sessionID: 'default' });
    }
  };

  const handleFiveYearChange = (promptKey: string, responseText: string) => {
    if (!fiveYearVisionPromptsCollection) return;
    const existing = fiveYearValues[promptKey];
    const docId = promptKey.replace(/[^a-zA-Z0-9]/g, ''); // Sanitize to create a Firestore-friendly ID

    const docRef = doc(fiveYearVisionPromptsCollection, docId);
    setDocumentNonBlocking(docRef, {
        promptKey: promptKey,
        responseText: responseText,
        sessionID: 'default'
    }, { merge: true });
  };
  
  const handleVisionStatementChange = (dream: string, amount: string) => {
      if (!visionStatementDocRef) return;
      const fiveYearsFromNow = addYears(new Date(), 5);
      const fullStatement = `I will ${dream || "[dream]"} and I will have made/invested $${amount || "[amount]"} by ${fiveYearsFromNow.toLocaleDateString()}.`;

      setDocumentNonBlocking(visionStatementDocRef, {
          dream,
          amount,
          statementText: fullStatement,
          sessionID: 'default'
      }, { merge: true });
  }


  const handleSave = () => {
    // This function can be used for navigation or other side-effects,
    // as data is now saved on-the-fly.
    toast({
      title: "Life Vision Saved",
      description: "Your long-term plans have been successfully updated in the database.",
    });
  };

  const fiveYearsFromNow = addYears(new Date(), 5);
  const dobDate = dateOfBirth ? parse(dateOfBirth, 'dd/MM/yyyy', new Date()) : undefined;
  const ageInFiveYears = dobDate && !isNaN(dobDate.getTime()) ? differenceInYears(fiveYearsFromNow, dobDate) : null;

  const filledCount =
    (decadeMilestones?.filter(d => d.milestoneText).length || 0) +
    (fiveYearPromptsData?.filter(p => p.responseText).length || 0) +
    (dateOfBirth ? 1 : 0);
  const totalCount = decadeMilestonesAges.length + fiveYearPrompts.length + 1;
  const progress = (filledCount / totalCount) * 100;

  const visionStatementPreview = `I will ${visionStatementDream || "[dream]"} and I will have made/invested $${visionStatementAmount || "[amount]"} by ${fiveYearsFromNow.toLocaleDateString()}.`


  return (
    <div>
      <PageHeader
        title="My Life Vision"
        description="Dream big and cast a vision for your future. This is your long-term roadmap."
      />
      <Card className="mb-6">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 2</Badge>
                <CardTitle className="font-headline">Vision Progress</CardTitle>
            </div>
          <div className="flex items-center gap-4 pt-2">
            <Progress value={progress} className="w-full" />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{Math.round(progress)}% Complete</span>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="dob">Your Date of Birth</Label>
                    <Input
                        id="dob"
                        placeholder="DD/MM/YYYY"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label>Date in 5 Years</Label>
                    <Input value={fiveYearsFromNow.toLocaleDateString()} readOnly disabled />
                </div>
                 <div className="space-y-2">
                    <Label>Your Age in 5 Years</Label>
                    <Input value={ageInFiveYears !== null ? ageInFiveYears : "Enter DOB"} readOnly disabled />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Accordion type="multiple" className="w-full" defaultValue={["item-1", "item-2"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-headline">Decade Milestones</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {decadeMilestonesAges.map((age) => (
                    <div key={age} className="space-y-2">
                      <Label htmlFor={`decade-${age}`}>By age {age}, I will...</Label>
                      <Input
                        id={`decade-${age}`}
                        placeholder={`e.g., have visited all continents`}
                        defaultValue={decadeValues[age]?.milestoneText || ''}
                        onBlur={(e) => handleDecadeChange(age, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-headline">My 5-Year Vision</AccordionTrigger>
              <AccordionContent>
                 <CardDescription className="px-4 pb-4">
                    Picture yourself 5 years from now and answer the following questions. Think without limits.
                </CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pt-0">
                  {fiveYearPrompts.map((prompt) => (
                    <div key={prompt} className="space-y-2">
                      <Label htmlFor={prompt}>{prompt}</Label>
                      <Textarea
                        id={prompt}
                        defaultValue={fiveYearValues[prompt]?.responseText || ''}
                        onBlur={(e) => handleFiveYearChange(prompt, e.target.value)}
                        placeholder="Describe your vision..."
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">5-Year Vision Statement</CardTitle>
          <CardDescription>Craft a powerful, concise statement for your five-year goal.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="p-4 bg-muted/50 rounded-lg mb-6">
            <p className="text-lg italic text-center text-foreground/80">{visionStatementPreview}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
             <div className="space-y-2 md:col-span-1">
                <Label htmlFor="vision-dream">I will...</Label>
                <Input id="vision-dream" placeholder="buy my dream house" value={visionStatementDream} onChange={e => {
                    setVisionStatementDream(e.target.value);
                    handleVisionStatementChange(e.target.value, visionStatementAmount);
                }} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vision-amount">...and I will have made/invested ($)</Label>
                <Input id="vision-amount" type="number" placeholder="50,000" value={visionStatementAmount} onChange={e => {
                    setVisionStatementAmount(e.target.value);
                    handleVisionStatementChange(visionStatementDream, e.target.value);
                }} />
            </div>
            <div className="space-y-2">
                <Label>by...</Label>
                <Input value={fiveYearsFromNow.toLocaleDateString()} readOnly disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>Next Step</Button>
      </div>
    </div>
  );
}
