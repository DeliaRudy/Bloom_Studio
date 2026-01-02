
'use client';

import * as React from 'react';
import {
  format,
  addDays,
  startOfWeek,
  subDays,
} from 'date-fns';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CycleSyncBanner } from '@/components/cycle-sync-banner';
import { demoDailyPlans, demoDailyHabits } from '@/lib/demo-data';

const hours = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`); // 7am to 7pm

export default function DemoDailyPlanPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const handleDateChange = (days: number) => {
    setCurrentDate((prev) => addDays(prev, days));
  };

  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };

  const planForDay =
    demoDailyPlans.find((p) => p.id === format(currentDate, 'yyyy-MM-dd')) ||
    demoDailyPlans[demoDailyPlans.length - 1]; // Fallback to last day

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title={`Daily Plan`}
          description="Focus on your top 3 priorities for the day to make consistent progress."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold text-primary w-48 text-center">
            {format(currentDate, 'EEEE, MMM d')}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      <CycleSyncBanner currentDate={currentDate} view="day" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 3 Priorities for Today</CardTitle>
              <CardDescription>
                What are the three most important things you need to accomplish?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planForDay.priorities.map((p, index) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`p-${p.id}`}
                      defaultChecked={p.completed}
                    />
                    <label
                      htmlFor={`p-${p.id}`}
                      className="flex-1 text-sm font-medium"
                    >
                      {p.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Block out your time to stay focused.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Time</TableHead>
                    <TableHead>Task / Appointment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hours.map((hour) => (
                    <TableRow key={hour}>
                      <TableCell className="font-semibold text-muted-foreground">
                        {hour}
                      </TableCell>
                      <TableCell>
                        <Textarea
                          className="bg-transparent border-dashed h-12"
                          defaultValue={
                            (planForDay.schedule as any)[hour] || ''
                          }
                          placeholder="..."
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Habit Checklist</CardTitle>
              <CardDescription>
                Check off your daily habits as you complete them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoDailyHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox
                      id={`h-${index}`}
                      defaultChecked={planForDay.habits[habit]}
                    />
                    <label
                      htmlFor={`h-${index}`}
                      className="text-sm font-medium"
                    >
                      {habit}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gratitude & Reflection</CardTitle>
              <CardDescription>End your day with intention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">I am grateful for...</label>
                <Textarea
                  defaultValue={planForDay.gratitude}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">My reflection on today...</label>
                <Textarea
                  defaultValue={planForDay.reflection}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save Day Plan
        </Button>
      </div>
    </div>
  );
}
