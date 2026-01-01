"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Plus } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

type VisionBoardItem = {
  id: string;
  imageUrl: string;
  imageHint: string;
  caption: string;
};

const initialItems = PlaceHolderImages.filter(img => img.id.startsWith('vision-board-')).slice(0, 3).map(img => ({
    ...img,
    caption: `My dream: ${img.description.toLowerCase()}`
}));

export default function VisionBoardPage() {
  const [items, setItems] = React.useState<VisionBoardItem[]>(initialItems);
  const { toast } = useToast();

  const handleAddItem = () => {
    const availablePlaceholders = PlaceHolderImages.filter(
      (p) => p.id.startsWith("vision-board-") && !items.find((i) => i.id === p.id)
    );

    if (availablePlaceholders.length > 0) {
      const newItem = availablePlaceholders[0];
      setItems([...items, { ...newItem, caption: "" }]);
    } else {
        toast({
            title: "No more images",
            description: "You've used all available placeholder images.",
        });
    }
  };

  const handleCaptionChange = (id: string, caption: string) => {
    setItems(items.map(item => item.id === id ? { ...item, caption } : item));
  };
  
  const handleSave = () => {
    console.log("Saving vision board:", items);
    toast({
        title: "Vision Board Saved!",
        description: "Your visual goals are locked in.",
    })
  }

  return (
    <div>
      <PageHeader
        title="My Vision Board"
        description="If you can see it, you can be it. Add images, quotes, and captions that represent your dreams."
      />
      <div className="mb-8 flex justify-end gap-4">
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
        <Button onClick={handleSave} variant="default">My Board is Ready</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Vision board item"}
                  data-ai-hint={item.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Add a caption or quote..."
                  value={item.caption}
                  onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                  className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
