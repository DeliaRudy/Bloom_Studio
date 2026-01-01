
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { VisionBoardImage } from "@/lib/types";

export default function VisionBoardPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const visionBoardCollection = useMemoFirebase(() => {
      if(!user) return null;
      return collection(firestore, `users/${user.uid}/sessions/default/visionBoardImages`);
  }, [user, firestore]);

  const { data: items, isLoading } = useCollection<VisionBoardImage>(visionBoardCollection);

  const handleAddItem = () => {
    if (!visionBoardCollection) return;
    
    const currentImageIds = items?.map(i => i.id) || [];
    const availablePlaceholders = PlaceHolderImages.filter(
      (p) => p.id.startsWith("vision-board-") && !currentImageIds.find((id) => id === p.id)
    );

    if (availablePlaceholders.length > 0) {
      const newItem = availablePlaceholders[0];
      addDocumentNonBlocking(visionBoardCollection, { 
          imageUrl: newItem.imageUrl, 
          caption: "",
          imageHint: newItem.imageHint,
          sessionID: 'default'
      });
    } else {
        toast({
            title: "No more images",
            description: "You've used all available placeholder images.",
        });
    }
  };

  const handleRemoveItem = (id: string) => {
    if (!visionBoardCollection) return;
    const docRef = doc(visionBoardCollection, id);
    deleteDocumentNonBlocking(docRef);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    if (!visionBoardCollection) return;
    const docRef = doc(visionBoardCollection, id);
    updateDocumentNonBlocking(docRef, { caption });
  };
  
  const handleSave = () => {
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
        {isLoading && <p>Loading board...</p>}
        {items?.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
             <CardContent className="p-0 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Vision board item"}
                  data-ai-hint={(item as any).imageHint}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Add a caption or quote..."
                  defaultValue={item.caption}
                  onBlur={(e) => handleCaptionChange(item.id, e.target.value)}
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
