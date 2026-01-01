
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [entries, setEntries] = React.useState<string[]>(Array(5).fill(""));
  const { toast } = useToast();

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };
  
  const handleSave = () => {
    // Here you would typically save the data to a backend
    console.log("Saving entries:", entries);
    toast({
      title: "Success Definitions Saved",
      description: "Your vision of success has been updated.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Ambition (My Definition of Success)"
        description="Ambition is the driving force that will help you to achieve success over the course of your life. Success means different things to different people. In order for you to achieve success and realise your ambition you must first define what Success means to you."
      />
      
      <Card className="mb-8">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 1</Badge>
                <CardTitle className="font-headline">Your Ambition</CardTitle>
            </div>
            <CardDescription>
                Living a successful and happy life is all about achieving balance and happiness in all areas of life. Consider these different facets:
            </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-wrap gap-2">
                {facetsOfLife.map(facet => (
                    <Badge key={facet} variant="outline">{facet}</Badge>
                ))}
            </div>
        </CardContent>
      </Card>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">I will know I am successful when...</h2>
        <p className="text-muted-foreground">Answer the question below at least 5 times.</p>
      </div>

      <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
        <CarouselContent>
          {entries.map((entry, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col aspect-video items-center justify-center p-6 gap-4">
                    <Label htmlFor={`success-entry-${index}`} className="text-lg font-medium">
                      Metric #{index + 1}
                    </Label>
                    <Textarea
                      id={`success-entry-${index}`}
                      placeholder="e.g., I have financial freedom to travel the world."
                      value={entry}
                      onChange={(e) => handleEntryChange(index, e.target.value)}
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
        <blockquote className="text-sm italic text-muted-foreground mt-4 text-center">
            &ldquo;Success is not the key to happiness. Happiness is the key to success.&rdquo;
            <cite className="not-italic font-semibold"> - Albert Schweitzer</cite>
        </blockquote>
      </div>
    </div>
  );
}
