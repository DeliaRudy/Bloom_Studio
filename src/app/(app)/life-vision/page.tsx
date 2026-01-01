
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
import { DatePicker } from "@/components/ui/datepicker";
import { addYears, differenceInYears, parse } from 'date-fns';

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

const decadeMilestones = [30, 40, 50, 60, 70, 80, 90, 100];

export default function LifeVisionPage() {
  const [decadeValues, setDecadeValues] = React.useState<Record<number, string>>(
    decadeMilestones.reduce((acc, age) => ({ ...acc, [age]: "" }), {})
  );
  const [fiveYearValues, setFiveYearValues] = React.useState<Record<string, string>>(
    fiveYearPrompts.reduce((acc, prompt) => ({ ...acc, [prompt]: "" }), {})
  );
  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");
  const [visionStatementDream, setVisionStatementDream] = React.useState("");
  const [visionStatementAmount, setVisionStatementAmount] = React.useState("");

  
  const { toast } = useToast();
  
  const fiveYearsFromNow = addYears(new Date(), 5);
  
  const dobDate = dateOfBirth ? parse(dateOfBirth, 'dd/MM/yyyy', new Date()) : undefined;
  const ageInFiveYears = dobDate && !isNaN(dobDate.getTime()) ? differenceInYears(fiveYearsFromNow, dobDate) : null;


  const handleSave = () => {
    const visionStatement = `I will ${visionStatementDream || "[dream]"} and I will have made/invested $${visionStatementAmount || "[amount]"} by ${fiveYearsFromNow.toLocaleDateString()}.`;
    localStorage.setItem("5YearVision", visionStatement);

    console.log("Saving life vision:", { decadeValues, fiveYearValues, dateOfBirth });
    toast({
      title: "Life Vision Saved",
      description: "Your long-term plans have been successfully updated.",
    });
  };

  const filledCount =
    Object.values(decadeValues).filter(Boolean).length +
    Object.values(fiveYearValues).filter(Boolean).length +
    (dateOfBirth ? 1 : 0);
  const totalCount = decadeMilestones.length + fiveYearPrompts.length + 1;
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
                  {decadeMilestones.map((age) => (
                    <div key={age} className="space-y-2">
                      <Label htmlFor={`decade-${age}`}>By age {age}, I will...</Label>
                      <Input
                        id={`decade-${age}`}
                        placeholder={`e.g., have visited all continents`}
                        value={decadeValues[age]}
                        onChange={(e) =>
                          setDecadeValues((prev) => ({ ...prev, [age]: e.target.value }))
                        }
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
                        value={fiveYearValues[prompt]}
                        onChange={(e) =>
                          setFiveYearValues((prev) => ({ ...prev, [prompt]: e.target.value }))
                        }
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
                <Input id="vision-dream" placeholder="buy my dream house" value={visionStatementDream} onChange={e => setVisionStatementDream(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vision-amount">...and I will have made/invested ($)</Label>
                <Input id="vision-amount" type="number" placeholder="50,000" value={visionStatementAmount} onChange={e => setVisionStatementAmount(e.target.value)} />
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
