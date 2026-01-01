
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type FlowLevel = 'none' | 'light' | 'medium' | 'heavy';

const flowLevels: FlowLevel[] = ['none', 'light', 'medium', 'heavy'];

const flowColors: Record<FlowLevel, string> = {
  none: 'bg-transparent text-muted-foreground/50',
  light: 'bg-pink-200 fill-pink-200 text-pink-500',
  medium: 'bg-pink-400 fill-pink-400 text-pink-700',
  heavy: 'bg-red-500 fill-red-500 text-red-800',
};

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];
const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

export default function CycleTrackerPage() {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [cycleData, setCycleData] = React.useState<Record<string, FlowLevel>>({});
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  const handleDayClick = (day: number, monthIndex: number) => {
    const dateKey = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentFlow = cycleData[dateKey] || 'none';
    const nextFlowIndex = (flowLevels.indexOf(currentFlow) + 1) % flowLevels.length;
    const nextFlow = flowLevels[nextFlowIndex];

    setCycleData((prev) => ({
      ...prev,
      [dateKey]: nextFlow,
    }));
  };
  
  const handleSave = () => {
    // In a real app, you would save this data to a database.
    console.log({ year: currentYear, cycleData, notes });
    toast({
        title: 'Cycle Tracker Saved',
        description: 'Your cycle data for the year has been saved locally.',
    });
  }

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div>
      <PageHeader
        title="Cycle Tracker"
        description="Track your menstrual cycle throughout the year to understand your body's patterns."
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Period Tracker</CardTitle>
            <div className="flex items-center gap-4">
                <Select
                    value={String(currentYear)}
                    onValueChange={(value) => setCurrentYear(Number(value))}
                >
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(year => (
                             <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button onClick={handleSave}>Save Tracker</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div 
                className="grid gap-x-2 gap-y-1 min-w-[800px]"
                style={{
                    gridTemplateColumns: '30px repeat(12, 1fr)',
                }}
            >
              {/* Header */}
              <div />
              {months.map((month) => (
                <div key={month} className="text-center font-bold text-sm text-muted-foreground">
                  {month}
                </div>
              ))}

              {/* Days */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <React.Fragment key={day}>
                  <div className="text-center font-bold text-sm text-muted-foreground flex items-center justify-center">{day}</div>
                  {months.map((_, monthIndex) => {
                    if (day > daysInMonth(monthIndex, currentYear)) {
                      return <div key={monthIndex} />;
                    }
                    const dateKey = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const flow = cycleData[dateKey] || 'none';
                    return (
                      <div
                        key={monthIndex}
                        className="flex items-center justify-center"
                      >
                        <button
                          onClick={() => handleDayClick(day, monthIndex)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                            flow === 'none' ? 'hover:bg-muted' : ''
                          )}
                        >
                          <Heart
                            className={cn(
                              'w-5 h-5 transition-colors',
                              flowColors[flow]
                            )}
                          />
                        </button>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Note</CardTitle>
                        <CardDescription>Add any relevant notes about your cycle, symptoms, or feelings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="e.g., The bleeding and severe abdominal pain occurred in March."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                    <CardHeader>
                         <CardTitle className="font-headline text-lg">Menstrual Flow</CardTitle>
                         <CardDescription>The colors indicate the intensity of your flow.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                           <Heart className={cn("w-5 h-5", flowColors['light'])} />
                           <span className="text-sm font-medium">Light</span>
                        </div>
                         <div className="flex items-center gap-3">
                           <Heart className={cn("w-5 h-5", flowColors['medium'])} />
                           <span className="text-sm font-medium">Medium</span>
                        </div>
                         <div className="flex items-center gap-3">
                           <Heart className={cn("w-5 h-5", flowColors['heavy'])} />
                           <span className="text-sm font-medium">Heavy</span>
                        </div>
                    </CardContent>
                </Card>
              </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
