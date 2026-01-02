
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { demoVisionBoard } from "@/lib/demo-data";

export default function DemoVisionBoardPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState(demoVisionBoard);

  const handleAddItem = () => {
    toast({
        title: "Demo Mode",
        description: "Adding new images is disabled in the demo.",
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
        title: "Demo Mode",
        description: "Image removed for this session only.",
    });
  };

  const handleSave = () => {
    toast({
        title: "Demo Mode",
        description: "Your changes are not saved in the demo.",
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
             <CardContent className="p-0 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Vision board item"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Add a caption or quote..."
                  defaultValue={item.caption}
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
