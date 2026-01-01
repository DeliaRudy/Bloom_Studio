
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function VisionStatementPage() {
  const [goal, setGoal] = React.useState("")
  const { toast } = useToast();

  const handleLockGoal = () => {
    if (!goal) {
        toast({
            title: "Incomplete Goal",
            description: "Please write down your 12-month goal.",
            variant: "destructive"
        })
        return;
    }
    console.log("12-Month Goal:", goal)
    toast({
        title: "Goal Locked!",
        description: "Your first big goal is set. You've got this!"
    })
  }

  return (
    <div>
      <PageHeader
        title="My Big Goal"
        description="Solidify your vision with a powerful statement and choose one major goal to focus on for the next year."
      />
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 3</Badge>
                <CardTitle className="font-headline">Craft Your Statement</CardTitle>
            </div>
            <CardDescription>
                Choose 1 big goal to achieve in the next 12 months which is the first big milestone on your journey to achieving your 5 year vision, lifetime goals and realising your ambition. This goal must be measurable.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 pt-4">
            <Label htmlFor="12-month-goal">My One Measurable 12-Month Goal</Label>
            <Textarea
              id="12-month-goal"
              placeholder="e.g., Launch my side business and generate $10,000 in revenue."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="resize-none h-32 leading-loose bg-transparent"
              style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px 2rem)',
                lineHeight: '2rem',
                backgroundAttachment: 'local'
              }}
            />
            <p className="text-sm text-muted-foreground">This will be your north star for the next year.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="ml-auto" onClick={handleLockGoal}>Lock My First Big Goal</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
