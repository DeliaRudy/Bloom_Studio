

"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { demoAffirmations, demoGratitude } from "@/lib/demo-data";

export default function DemoAffirmationsGratitudePage() {
  const { toast } = useToast();
  const [affirmations, setAffirmations] = React.useState(demoAffirmations);
  const [gratitude, setGratitude] = React.useState(demoGratitude);

  const handleSave = () => {
    toast({
      title: "Demo Mode",
      description: "Changes are not saved in the demo.",
    });
  };

  const addEntry = (type: 'affirmation' | 'gratitude') => {
    toast({ title: "Demo Mode", description: "This is a read-only view." });
  };
  
  const removeEntry = (index: number, type: 'affirmation' | 'gratitude') => {
    if (type === 'affirmation') {
        setAffirmations(affirmations.filter((_, i) => i !== index));
    } else {
        setGratitude(gratitude.filter((_, i) => i !== index));
    }
  }

  const updateEntry = (index: number, text: string, type: 'affirmation' | 'gratitude') => {
      if (type === 'affirmation') {
          const newAffirmations = [...affirmations];
          newAffirmations[index] = text;
          setAffirmations(newAffirmations);
      } else {
          const newGratitude = [...gratitude];
          newGratitude[index] = text;
          setGratitude(newGratitude);
      }
  }


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
          <CardContent className="space-y-4">
             {affirmations.map((affirmation, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  defaultValue={affirmation}
                  onBlur={(e) => updateEntry(index, e.target.value, 'affirmation')}
                  placeholder="e.g., 'I attract positivity...'"
                />
                <Button variant="ghost" size="icon" onClick={() => removeEntry(index, 'affirmation')}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => addEntry('affirmation')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Affirmation
            </Button>
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
          <CardContent className="space-y-4">
            {gratitude.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input
                    defaultValue={item}
                    onBlur={(e) => updateEntry(index, e.target.value, 'gratitude')}
                    placeholder="e.g., 'The sunny weather...'"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeEntry(index, 'gratitude')}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
            ))}
             <Button variant="outline" className="w-full" onClick={() => addEntry('gratitude')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Gratitude
            </Button>
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

