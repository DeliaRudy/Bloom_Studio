
"use client";

import * as React from "react";
import { useActionState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { DateRange } from "react-day-picker";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAIReflection, type ReflectionState } from "./actions";

import { Sparkles, Calendar as CalendarIcon, Copy, History } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const initialState: ReflectionState = {
  summaryReflection: null,
  detailedReflection: null,
  error: null,
};

type PastReflection = {
    id: string;
    dateRange: string;
    summary: string;
    detailed: string;
    createdAt: Date;
}

export default function AiReflectionPage() {
  const [state, formAction] = useActionState(getAIReflection, initialState);
  const { toast } = useToast();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: new Date(),
  });
  const [allData, setAllData] = React.useState<string>("");
  const [pastReflections, setPastReflections] = React.useState<PastReflection[]>([]);
  const [selectedPastReflection, setSelectedPastReflection] = React.useState<PastReflection | null>(null);

  React.useEffect(() => {
    if (state.error) {
      toast({
        title: "Error Generating Reflection",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state.summaryReflection && date?.from && date?.to) {
        toast({
            title: "Reflection Generated!",
            description: "Your new AI-powered reflection is ready."
        });
        const newReflection: PastReflection = {
            id: new Date().toISOString(),
            dateRange: `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`,
            summary: state.summaryReflection,
            detailed: state.detailedReflection || "",
            createdAt: new Date(),
        };
        setPastReflections(prev => [newReflection, ...prev]);
        // Also update the selected reflection to show the newly generated one
        setSelectedPastReflection(newReflection);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  React.useEffect(() => {
    // In a real app, this would be a more robust data fetching and aggregation strategy
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
            data[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
            data[key] = localStorage.getItem(key);
        }
      }
    }
    setAllData(JSON.stringify(data));
  }, []);
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to Clipboard!",
        description: "The reflection has been copied."
    });
  }

  const reflectionToShow = selectedPastReflection || { summary: state.summaryReflection, detailed: state.detailedReflection };

  return (
    <div>
      <PageHeader
        title="AI-Powered Reflection"
        description="Let our AI assistant analyze your progress across the entire app and provide motivational feedback."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
             <Card>
                <form action={formAction}>
                    <input type="hidden" name="allData" value={allData} />
                    <input type="hidden" name="startDate" value={date?.from?.toISOString()} />
                    <input type="hidden" name="endDate" value={date?.to?.toISOString()} />
                    <CardHeader>
                    <CardTitle className="font-headline">Generate New Reflection</CardTitle>
                    <CardDescription>
                        Select a date range for the AI to analyze.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date-range">Date range</Label>
                        <DatePickerWithRange
                            date={date}
                            setDate={setDate}
                            className="w-full"
                        />
                    </div>
                    </CardContent>
                    <CardFooter>
                    <Button type="submit" className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Reflection
                    </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
        
        <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Your Reflection</CardTitle>
                        <CardDescription>
                            {selectedPastReflection ? `Viewing reflection from: ${selectedPastReflection.dateRange}` : "Here is your latest AI-generated progress reflection."}
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
                {reflectionToShow.summary || reflectionToShow.detailed ? (
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
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4 border-2 border-dashed rounded-lg">
                        <p>Your reflection will appear here once generated.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

       <Separator className="my-8" />

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><History className="h-5 w-5" /> Reflection History</CardTitle>
                <CardDescription>View your past reflections.</CardDescription>
            </CardHeader>
            <CardContent>
                {pastReflections.length > 0 ? (
                    <div className="space-y-2">
                        {pastReflections.map(reflection => (
                             <button 
                                key={reflection.id} 
                                onClick={() => setSelectedPastReflection(reflection)}
                                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors block"
                            >
                                <p className="font-semibold">{reflection.dateRange}</p>
                                <p className="text-sm text-muted-foreground truncate">{reflection.summary}</p>
                             </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No past reflections found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

    
