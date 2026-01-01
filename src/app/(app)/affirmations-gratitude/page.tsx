
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
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Entry = {
  id: string;
  text: string;
};

export default function AffirmationsGratitudePage() {
  const [affirmations, setAffirmations] = React.useState<Entry[]>([
    { id: "aff1", text: "I am capable of achieving my dreams." },
  ]);
  const [gratitude, setGratitude] = React.useState<Entry[]>([
    { id: "gra1", text: "I am grateful for my supportive family." },
  ]);
  const { toast } = useToast();

  React.useEffect(() => {
    const savedAffirmations = localStorage.getItem("affirmations");
    if (savedAffirmations) {
      setAffirmations(JSON.parse(savedAffirmations));
    }
    const savedGratitude = localStorage.getItem("gratitude");
    if (savedGratitude) {
      setGratitude(JSON.parse(savedGratitude));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("affirmations", JSON.stringify(affirmations.filter(a => a.text.trim() !== '')));
    localStorage.setItem("gratitude", JSON.stringify(gratitude.filter(g => g.text.trim() !== '')));
    toast({
      title: "Saved!",
      description: "Your affirmations and gratitude have been saved.",
    });
  };

  const addEntry = (list: Entry[], setList: React.Dispatch<React.SetStateAction<Entry[]>>) => {
    const newEntry: Entry = { id: `${list.length}-${Date.now()}`, text: "" };
    setList([...list, newEntry]);
  };

  const updateEntry = (id: string, text: string, list: Entry[], setList: React.Dispatch<React.SetStateAction<Entry[]>>) => {
    setList(list.map(entry => (entry.id === id ? { ...entry, text } : entry)));
  };

  const removeEntry = (id: string, list: Entry[], setList: React.Dispatch<React.SetStateAction<Entry[]>>) => {
    setList(list.filter(entry => entry.id !== id));
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
          <CardContent className="space-y-4">
             {affirmations.map((affirmation) => (
              <div key={affirmation.id} className="flex items-center gap-2">
                <Input
                  value={affirmation.text}
                  onChange={(e) => updateEntry(affirmation.id, e.target.value, affirmations, setAffirmations)}
                  placeholder="e.g., 'I attract positivity...'"
                />
                <Button variant="ghost" size="icon" onClick={() => removeEntry(affirmation.id, affirmations, setAffirmations)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => addEntry(affirmations, setAffirmations)}>
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
            {gratitude.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                    <Input
                    value={item.text}
                    onChange={(e) => updateEntry(item.id, e.target.value, gratitude, setGratitude)}
                    placeholder="e.g., 'The sunny weather...'"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeEntry(item.id, gratitude, setGratitude)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
            ))}
             <Button variant="outline" className="w-full" onClick={() => addEntry(gratitude, setGratitude)}>
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
