
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { SuccessDefinition } from "@/lib/types";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const facetsOfLife = [
    "Profession/Career/Business",
    "Health",
    "Wealth",
    "Family",
    "Friends",
    "Character",
    "Community",
    "Spirituality",
    "Leisure",
];

export default function DefineSuccessPage() {
  const { firestore, user } = useFirebase();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const { toast } = useToast();

  const successDefinitionsCollection = useMemoFirebase(() => {
    if (!user) return null;
    // Assuming one session for simplicity
    return collection(firestore, `users/${user.uid}/sessions/default/successDefinitions`);
  }, [firestore, user]);

  const { data: entries, isLoading } = useCollection<SuccessDefinition>(successDefinitionsCollection);

  const entriesPadded = React.useMemo(() => {
    const existing = entries || [];
    const needed = 5 - existing.length;
    if (needed > 0) {
      return [...existing, ...Array(needed).fill({ id: '', definitionText: "", facets: [] })];
    }
    return existing;
  }, [entries]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  const handleEntryChange = (index: number, value: string) => {
    const entry = entriesPadded[index];
    if (entry.id && successDefinitionsCollection) {
        const entryDoc = doc(successDefinitionsCollection, entry.id);
        updateDoc(entryDoc, { definitionText: value });
    } else if (!entry.id && value.trim() && successDefinitionsCollection) {
        addDoc(successDefinitionsCollection, { definitionText: value, facets: [], sessionID: 'default' });
    }
  };
  
  const handleFacetClick = (facet: string) => {
    const entry = entriesPadded[current];
    if (!entry.id || !successDefinitionsCollection) return;
    
    const entryDoc = doc(successDefinitionsCollection, entry.id);
    const currentFacets = entry.facets || [];
    const facetIndex = currentFacets.indexOf(facet);

    let newFacets: string[];
    if (facetIndex > -1) {
      newFacets = currentFacets.filter(f => f !== facet);
    } else {
      newFacets = [...currentFacets, facet];
    }
    updateDoc(entryDoc, { facets: newFacets });
  }

  const handleSave = () => {
    console.log("Saving entries:", entries);
    toast({
      title: "Success Definitions Saved",
      description: "Your vision of success has been updated.",
    });
  };

  const currentMetric = entriesPadded[current];
  const filledMetrics = entries?.filter(e => e.definitionText.trim() !== "").length || 0;
  const progress = (filledMetrics / 5) * 100;
  
  const getProgressEmoji = () => {
    if (filledMetrics === 0) return "🤔";
    if (filledMetrics < 3) return "✍️";
    if (filledMetrics < 5) return "💡";
    return "🎉";
  }

  return (
    <div>
      <PageHeader
        title="My Ambition"
        description="Ambition is the driving force that will help you to achieve success over the course of your life. Success means different things to different people. In order for you to achieve success and realise your ambition you must first define what Success means to you."
      />
      
      <Card className="mb-8">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 1</Badge>
                <CardTitle className="font-headline">Your Ambition</CardTitle>
            </div>
            <CardDescription>
                Living a successful and happy life is all about achieving balance and happiness in all areas of life. Click a facet to associate it with the current metric below.
            </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-wrap gap-2">
                {facetsOfLife.map(facet => (
                    <Badge 
                        key={facet} 
                        variant={currentMetric?.facets?.includes(facet) ? "default" : "outline"}
                        onClick={() => handleFacetClick(facet)}
                        className="cursor-pointer transition-colors"
                    >
                        {facet}
                    </Badge>
                ))}
            </div>
        </CardContent>
      </Card>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">I will know I am successful when...</h2>
        <p className="text-muted-foreground">Answer the question below at least 5 times.</p>
      </div>

       <Card className="mb-8">
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <span className="text-2xl">{getProgressEmoji()}</span>
                <div className="w-full">
                     <Progress value={progress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-green-500" />
                     <p className="text-sm text-muted-foreground mt-2 text-right">{filledMetrics} of 5 metrics defined</p>
                </div>
            </div>
        </CardContent>
       </Card>

      <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {entriesPadded.map((entry, index) => (
            <CarouselItem key={entry.id || index}>
              <div className="p-1">
                <Card>
                  <CardHeader className="pt-4 pb-2">
                    <div className="flex items-center justify-between min-h-[24px]">
                         <Label htmlFor={`success-entry-${index}`} className="text-lg font-medium">
                            Metric #{index + 1}
                        </Label>
                        <div className="flex flex-wrap gap-1 justify-end">
                            {entry.facets?.map(facet => (
                               <Badge key={facet} variant="secondary">{facet}</Badge>
                            ))}
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col aspect-video items-center justify-center p-6 pt-2 gap-4">
                    <Textarea
                      id={`success-entry-${index}`}
                      placeholder="e.g., I have financial freedom to travel the world."
                      defaultValue={entry.definitionText}
                      onBlur={(e) => handleEntryChange(index, e.target.value)}
                      className="text-center text-lg h-32 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      
      <div className="flex flex-col items-center gap-4 mt-8">
        <Button size="lg" onClick={handleSave}>Save & Continue</Button>
        <blockquote className="text-sm italic text-muted-foreground mt-4 text-center max-w-md">
            &ldquo;Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.&rdquo;
            <cite className="not-italic font-semibold"> - Albert Schweitzer</cite>
        </blockquote>
      </div>
    </div>
  );
}
