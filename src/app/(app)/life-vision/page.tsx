
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
import { addYears, differenceInYears } from 'date-fns';

const fiveYearPrompts = [
  "Where will I live?",
  "Who will I be with?",
  "What will I have achieved in work or business?",
  "What assets will I own?",
  "What will I look like?",
  "How will I feel?",
  "What will I do in my free time?",
  "How much money will I have made?",
];

const decadeMilestones = [30, 40, 50, 60, 70, 80, 90, 100];

export default function LifeVisionPage() {
  const [decadeValues, setDecadeValues] = React.useState<Record<number, string>>(
    decadeMilestones.reduce((acc, age) => ({ ...acc, [age]: "" }), {})
  );
  const [fiveYearValues, setFiveYearValues] = React.useState<Record<string, string>>(
    fiveYearPrompts.reduce((acc, prompt) => ({ ...acc, [prompt]: "" }), {})
  );
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>();
  
  const { toast } = useToast();
  
  const fiveYearsFromNow = addYears(new Date(), 5);
  const ageInFiveYears = dateOfBirth ? differenceInYears(fiveYearsFromNow, dateOfBirth) : null;


  const handleSave = () => {
    console.log("Saving life vision:", { decadeValues, fiveYearValues });
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
                    <DatePicker 
                        date={dateOfBirth} 
                        setDate={setDateOfBirth} 
                        className="w-full"
                        captionLayout="dropdown-buttons"
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
      
      <Card>
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
      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>Next Step</Button>
      </div>
    </div>
  );
}
