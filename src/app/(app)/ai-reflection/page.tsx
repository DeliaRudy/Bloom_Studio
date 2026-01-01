"use client";

import { useFormState } from "react-dom";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAIReflection } from "./actions";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  reflection: "",
  error: null,
};

export default function AiReflectionPage() {
  const [state, formAction] = useFormState(getAIReflection, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
        toast({
            title: "Error Generating Reflection",
            description: state.error,
            variant: "destructive"
        })
    }
  }, [state, toast])

  return (
    <div>
      <PageHeader
        title="AI-Powered Reflection"
        description="Let our AI assistant analyze your recent progress and provide motivational feedback to keep you on track."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="font-headline">Provide Your Data</CardTitle>
              <CardDescription>
                Fill in the fields below. The more detail, the better the reflection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="journalEntries">Journal Entries</Label>
                <Textarea
                  id="journalEntries"
                  name="journalEntries"
                  placeholder="Paste your recent journal entries here..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visionBoardElements">Vision Board Elements</Label>
                <Textarea
                  id="visionBoardElements"
                  name="visionBoardElements"
                  placeholder="Describe some items on your vision board (e.g., 'A photo of a house by the lake')..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userActivity">Recent Activity</Label>
                <Textarea
                  id="userActivity"
                  name="userActivity"
                  placeholder="Describe your recent activities related to your goals (e.g., 'I started a coding bootcamp to work towards my career goal')..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Reflection
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Your Reflection</CardTitle>
                <CardDescription>
                    Here is your AI-generated progress reflection.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {state.reflection ? (
                     <div className="prose prose-sm max-w-none text-foreground p-4 bg-muted/50 rounded-lg h-full">
                        <p>{state.reflection}</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4 border-2 border-dashed rounded-lg">
                        <p>Your reflection will appear here once generated.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
