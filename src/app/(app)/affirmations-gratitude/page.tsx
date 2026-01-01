"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AffirmationsGratitudePage() {
  const [affirmations, setAffirmations] = React.useState("");
  const [gratitude, setGratitude] = React.useState("");
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Saving Affirmations:", affirmations);
    console.log("Saving Gratitude:", gratitude);
    toast({
      title: "Saved!",
      description: "Your affirmations and gratitude have been saved.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Affirmations & Gratitude"
        description="Cultivate a positive mindset by focusing on what empowers you and what you're thankful for."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Affirmations</CardTitle>
            <CardDescription>
              Write down your favorite affirmations. Repeat them daily to empower
              yourself.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="affirmations" className="sr-only">
                Affirmations
              </Label>
              <Textarea
                id="affirmations"
                placeholder="e.g., 'I am capable of achieving my dreams.' 'I attract positivity and success.'"
                value={affirmations}
                onChange={(e) => setAffirmations(e.target.value)}
                className="resize-none h-60"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Gratitude List</CardTitle>
            <CardDescription>
              List the things you are grateful for. Focusing on gratitude can
              improve your well-being.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="gratitude" className="sr-only">
                Gratitude
              </Label>
              <Textarea
                id="gratitude"
                placeholder="e.g., 'I am grateful for my supportive family.' 'I am grateful for the sunny weather today.'"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="resize-none h-60"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save My Thoughts
        </Button>
      </div>
    </div>
  );
}
