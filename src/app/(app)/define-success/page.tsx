"use client";

import * as React from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

const bannerImage = PlaceHolderImages.find(img => img.id === 'motivational-banner-1');

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
        title="Define Your Success"
        description="What does a successful life look like to you? List at least 5 things you would see, feel, or have."
      />
      
      <Card className="mb-8 overflow-hidden">
        {bannerImage && (
            <div className="relative w-full h-48 md:h-64">
                <Image
                    src={bannerImage.imageUrl}
                    alt={bannerImage.description}
                    data-ai-hint={bannerImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">I will know I am successful when...</h2>
                 </div>
            </div>
        )}
      </Card>

      <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
        <CarouselContent>
          {entries.map((entry, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col aspect-video items-center justify-center p-6 gap-4">
                    <Label htmlFor={`success-entry-${index}`} className="text-lg font-medium">
                      Success Metric #{index + 1}
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
      
      <div className="flex justify-center mt-8">
        <Button size="lg" onClick={handleSave}>Save & Continue</Button>
      </div>
    </div>
  );
}
