
"use client";

import * as React from "react";
import { format, startOfWeek } from "date-fns";
import { DateRange } from "react-day-picker";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { demoAI } from "@/lib/demo-data";

import { Sparkles, Copy } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DemoAiReflectionPage() {
  const { toast } = useToast();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: new Date(),
  });

  const handleGenerate = () => {
     toast({
        title: "Reflection Ready!",
        description: "This is a sample AI-generated reflection for the demo."
    });
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to Clipboard!",
        description: "The reflection has been copied."
    });
  }

  const reflectionToShow = demoAI.reflection;

  return (
    <div>
      <PageHeader
        title="AI-Powered Reflection"
        description="Let our AI assistant analyze your progress across the entire app and provide motivational feedback."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                <CardTitle className="font-headline">Generate New Reflection</CardTitle>
                <CardDescription>
                    Select a date range for the AI to analyze.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <DatePickerWithRange
                        date={date}
                        setDate={setDate}
                        className="w-full"
                    />
                </div>
                </CardContent>
                <CardFooter>
                <Button onClick={handleGenerate} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Reflection
                </Button>
                </CardFooter>
            </Card>
        </div>
        
        <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Your Reflection</CardTitle>
                        <CardDescription>
                           Viewing sample reflection for: {`${format(date?.from!, "LLL dd, y")} - ${format(date?.to!, "LLL dd, y")}`}
                        </CardDescription>
                    </div>
                    {reflectionToShow.summary && (
                         <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(reflectionToShow.detailed || reflectionToShow.summary || "")}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                 <Tabs defaultValue="summary" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="flex-grow">
                        <div className="prose prose-sm max-w-none text-foreground p-4 bg-muted/50 rounded-b-lg h-full">
                            <p>{reflectionToShow.summary}</p>
                        </div>
                    </TabsContent>
                     <TabsContent value="detailed" className="flex-grow">
                         <div className="prose prose-sm max-w-none text-foreground p-4 bg-muted/50 rounded-b-lg h-full overflow-y-auto">
                            <p>{reflectionToShow.detailed}</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
