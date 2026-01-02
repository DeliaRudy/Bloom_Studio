
'use client';

import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { addYears, differenceInYears, parse } from 'date-fns';
import { demoLifeVision } from '@/lib/demo-data';

const fiveYearPrompts = demoLifeVision.fiveYearPrompts.map((p) => p.prompt);
const decadeMilestonesAges = demoLifeVision.decades.map((d) => d.age);

export default function DemoLifeVisionPage() {
  const { toast } = useToast();

  const [dateOfBirth, setDateOfBirth] = React.useState<string>('05/10/1995');
  const [visionStatementDream, setVisionStatementDream] = React.useState('build a personal brand');
  const [visionStatementAmount, setVisionStatementAmount] = React.useState('100000');


  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  const fiveYearsFromNow = addYears(new Date(), 5);
  const dobDate = dateOfBirth
    ? parse(dateOfBirth, 'dd/MM/yyyy', new Date())
    : undefined;
  const ageInFiveYears =
    dobDate && !isNaN(dobDate.getTime())
      ? differenceInYears(fiveYearsFromNow, dobDate)
      : null;

  const progress = 95; // Hardcoded for demo

  const visionStatementPreview = `I will ${
    visionStatementDream || '[dream]'
  } and I will have made/invested $${
    visionStatementAmount || '[amount]'
  } by ${fiveYearsFromNow.toLocaleDateString()}.`;

  return (
    <div>
      <PageHeader
        title="My Life Vision"
        description="Dream big and cast a vision for your future. This is your long-term roadmap."
      />
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              STEP 2
            </Badge>
            <CardTitle className="font-headline">Vision Progress</CardTitle>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Progress value={progress} className="w-full" />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {Math.round(progress)}% Complete
            </span>
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
              <Input
                value={ageInFiveYears !== null ? ageInFiveYears : 'Enter DOB'}
                readOnly
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['item-1', 'item-2']}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-headline">
                Decade Milestones
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {demoLifeVision.decades.map((item) => (
                    <div key={item.age} className="space-y-2">
                      <Label htmlFor={`decade-${item.age}`}>
                        By age {item.age}, I will...
                      </Label>
                      <Input
                        id={`decade-${item.age}`}
                        defaultValue={item.milestone}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-headline">
                My 5-Year Vision
              </AccordionTrigger>
              <AccordionContent>
                <CardDescription className="px-4 pb-4">
                  Picture yourself 5 years from now and answer the following
                  questions. Think without limits.
                </CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pt-0">
                  {demoLifeVision.fiveYearPrompts.map((item) => (
                    <div key={item.prompt} className="space-y-2">
                      <Label htmlFor={item.prompt}>{item.prompt}</Label>
                      <Textarea
                        id={item.prompt}
                        defaultValue={item.response}
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
          <CardTitle className="font-headline">
            5-Year Vision Statement
          </CardTitle>
          <CardDescription>
            Craft a powerful, concise statement for your five-year goal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg mb-6">
            <p className="text-lg italic text-center text-foreground/80">
              {visionStatementPreview}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="vision-dream">I will...</Label>
              <Input
                id="vision-dream"
                placeholder="buy my dream house"
                value={visionStatementDream}
                onChange={(e) => {
                  setVisionStatementDream(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision-amount">
                ...and I will have made/invested ($)
              </Label>
              <Input
                id="vision-amount"
                type="number"
                placeholder="50,000"
                value={visionStatementAmount}
                onChange={(e) => {
                  setVisionStatementAmount(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>by...</Label>
              <Input
                value={fiveYearsFromNow.toLocaleDateString()}
                readOnly
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
