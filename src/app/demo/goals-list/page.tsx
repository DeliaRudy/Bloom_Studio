
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Brain, Briefcase, User, Users } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

const goalCategories = [
  { id: "health-fitness", label: "Health & Fitness", icon: Dumbbell, short: "Run a 5K", long: "Run a half-marathon" },
  { id: "strong-mind", label: "Strong Mind", icon: Brain, short: "Meditate 3x a week", long: "Complete a 10-day silent retreat" },
  { id: "career-profession", label: "Career/Profession", icon: Briefcase, short: "Get a promotion", long: "Lead a department" },
  { id: "personal", label: "Personal", icon: User, short: "Read 12 books", long: "Write a novel" },
  { id: "family-friends", label: "Family & Friends", icon: Users, short: "Monthly family dinner", long: "Family vacation abroad" },
];

export default function DemoGoalsListPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
        title: "Demo Mode",
        description: "Your changes are not saved in the demo.",
    })
  }

  return (
    <div>
      <PageHeader
        title="Set Your Goals"
        description="Define your short-term (this year) and long-term (3-5 years) goals across the most important areas of your life."
      />
      <Tabs defaultValue="health-fitness" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {goalCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              <cat.icon className="mr-2 h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {goalCategories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <cat.icon className="h-6 w-6 text-primary" /> {cat.label} Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor={`${cat.id}-short`}>Short-Term Goal (1 year)</Label>
                <Textarea
                    id={`${cat.id}-short`}
                    defaultValue={cat.short}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor={`${cat.id}-long`}>Long-Term Goal (3-5 years)</Label>
                <Textarea
                    id={`${cat.id}-long`}
                    defaultValue={cat.long}
                />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>Save All Goals</Button>
      </div>
    </div>
  );
}
