
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/datepicker"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function VisionStatementPage() {
  const [dream, setDream] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>()
  const [goal, setGoal] = React.useState("")
  const { toast } = useToast();

  const handleLockGoal = () => {
    if (!dream || !amount || !date || !goal) {
        toast({
            title: "Incomplete Statement",
            description: "Please fill out all fields to lock in your goal.",
            variant: "destructive"
        })
        return;
    }
    const visionStatement = `I will ${dream} and I will have made/invested $${amount} by ${date.toLocaleDateString()}`
    console.log("Vision Statement:", visionStatement)
    console.log("12-Month Goal:", goal)
    toast({
        title: "Goal Locked!",
        description: "Your first big goal is set. You've got this!"
    })
  }

  const statementPreview = `I will ${dream || "[dream]"} and I will have made/invested $${amount || "[amount]"} by ${date ? date.toLocaleDateString() : "[date]"}.`

  return (
    <div>
      <PageHeader
        title="Vision Statement & 12-Month Goal"
        description="Solidify your vision with a powerful statement and choose one major goal to focus on for the next year."
      />
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm">STEP 3</Badge>
                <CardTitle className="font-headline">Craft Your Statement</CardTitle>
            </div>
          <CardDescription>Fill in the blanks to create your personal vision statement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-lg italic text-center text-foreground/80">{statementPreview}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="dream">I will...</Label>
              <Input id="dream" placeholder="achieve my dream" value={dream} onChange={e => setDream(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">...and I will have made/invested ($)</Label>
              <Input id="amount" type="number" placeholder="100,000" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>by...</Label>
              <DatePicker date={date} setDate={setDate} className="w-full" />
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <Label htmlFor="12-month-goal">My One Measurable 12-Month Goal</Label>
            <Select onValueChange={setGoal} value={goal}>
                <SelectTrigger id="12-month-goal">
                    <SelectValue placeholder="Choose one goal to focus on..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Launch my side business">Launch my side business</SelectItem>
                    <SelectItem value="Run a half-marathon">Run a half-marathon</SelectItem>
                    <SelectItem value="Read 50 books">Read 50 books</SelectItem>
                    <SelectItem value="Save my first $10,000">Save my first $10,000</SelectItem>
                    <SelectItem value="Learn a new programming language">Learn a new programming language</SelectItem>
                </SelectContent>
            </Select>
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
