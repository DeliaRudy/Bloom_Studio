
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";

type Entry = {
  id: string;
  text: string;
  type: 'affirmation' | 'gratitude';
};

export default function AffirmationsGratitudePage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const entriesCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/sessions/default/purposeReasons`);
  }, [firestore, user]);

  const { data: entries, isLoading } = useCollection<Entry>(entriesCollection);

  const affirmations = React.useMemo(() => entries?.filter(e => e.type === 'affirmation') || [], [entries]);
  const gratitude = React.useMemo(() => entries?.filter(e => e.type === 'gratitude') || [], [entries]);

  const handleSave = () => {
    toast({
      title: "Saved!",
      description: "Your affirmations and gratitude have been saved.",
    });
  };

  const addEntry = (type: 'affirmation' | 'gratitude') => {
    if (!entriesCollection) return;
    addDocumentNonBlocking(entriesCollection, { text: "", type, sessionID: 'default' });
  };

  const updateEntry = (id: string, text: string) => {
    if (!entriesCollection) return;
    const entryDoc = doc(entriesCollection, id);
    updateDocumentNonBlocking(entryDoc, { text });
  };

  const removeEntry = (id: string) => {
    if (!entriesCollection) return;
    const entryDoc = doc(entriesCollection, id);
    deleteDocumentNonBlocking(entryDoc);
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
            {isLoading && <p>Loading...</p>}
             {affirmations.map((affirmation) => (
              <div key={affirmation.id} className="flex items-center gap-2">
                <Input
                  value={affirmation.text}
                  onChange={(e) => updateEntry(affirmation.id, e.target.value)}
                  placeholder="e.g., 'I attract positivity...'"
                />
                <Button variant="ghost" size="icon" onClick={() => removeEntry(affirmation.id)}>
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
             {isLoading && <p>Loading...</p>}
            {gratitude.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                    <Input
                    value={item.text}
                    onChange={(e) => updateEntry(item.id, e.target.value)}
                    placeholder="e.g., 'The sunny weather...'"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeEntry(item.id)}>
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
