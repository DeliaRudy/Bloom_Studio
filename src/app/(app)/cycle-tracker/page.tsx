'use client';
import * as React from 'react';
import {
  format,
  startOfYear,
  addDays,
  isSameDay,
  parse,
  isValid,
  getDate,
  getMonth,
  getYear,
} from 'date-ns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import {
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
  addDocumentNonBlocking,
} from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { CycleDay, CycleSymptom } from '@/lib/types';
import {
  Calendar as CalendarIcon,
  PlusCircle,
  Trash2,
  Heart,
  X,
} from 'lucide-react';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown } from 'lucide-react';

const flowLevels = ['none', 'light', 'medium', 'heavy'] as const;
type FlowLevel = (typeof flowLevels)[number];

const flowStyles: Record<
  FlowLevel,
  { fill: string; stroke: string; label: string }
> = {
  none: {
    fill: 'fill-white',
    stroke: 'stroke-muted-foreground',
    label: 'None',
  },
  light: {
    fill: 'fill-[#f5c1cd]',
    stroke: 'stroke-[#d88fa3]',
    label: 'Light',
  },
  medium: {
    fill: 'fill-[#d88fa3]',
    stroke: 'stroke-[#6d100f]',
    label: 'Medium',
  },
  heavy: {
    fill: 'fill-[#6d100f]',
    stroke: 'stroke-[#6d100f]',
    label: 'Heavy',
  },
};

const allSymptoms = [
  'Cramps',
  'Acne',
  'Moody',
  'Sad',
  'Happy',
  'Energetic',
  'Bloated',
  'Headache',
  'Fatigue',
  'Cravings',
];

const months = Array.from({ length: 12 }, (_, i) =>
  format(new Date(0, i), 'MMM')
);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const YearlyCycleGrid = ({
  year,
  cycleData,
  onDayClick,
}: {
  year: number;
  cycleData: Record<string, CycleDay>;
  onDayClick: (date: Date, currentFlow: FlowLevel) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">
          PERIOD TRACKER - {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="grid grid-cols-13 gap-1" style={{minWidth: '800px'}}>
          {/* Header */}
          <div /> {/* Empty corner */}
          {months.map((month) => (
            <div key={month} className="text-center font-bold text-sm">
              {month.toUpperCase()}
            </div>
          ))}

          {/* Grid Body */}
          {days.map((day) => (
            <React.Fragment key={day}>
              <div className="text-center font-bold text-sm pr-2">{day}</div>
              {months.map((_, monthIndex) => {
                const date = new Date(year, monthIndex, day);
                if (date.getDate() !== day) {
                  return <div key={monthIndex} />; // Invalid date (e.g., Feb 30)
                }

                const dateKey = format(date, 'yyyy-MM-dd');
                const dayData = cycleData[dateKey];
                const flow = dayData?.flow || 'none';

                return (
                  <div
                    key={monthIndex}
                    className="flex items-center justify-center"
                  >
                    <button onClick={() => onDayClick(date, flow)}>
                      <Heart
                        className={cn(
                          'w-6 h-6 transition-all',
                          flowStyles[flow].fill,
                          flowStyles[flow].stroke
                        )}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SymptomsCombobox = ({
  selected,
  onChange,
  className,
}: {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (symptom: string) => {
    onChange(
      selected.includes(symptom)
        ? selected.filter((s) => s !== symptom)
        : [...selected, symptom]
    );
  };
  const handleRemove = (symptom: string) => {
    onChange(selected.filter((s) => s !== symptom));
  };
  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                  >
                    {item} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Select symptoms...</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search symptom..." />
            <CommandEmpty>No symptoms found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {allSymptoms.map((symptom) => (
                  <CommandItem
                    key={symptom}
                    onSelect={() => handleSelect(symptom)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.includes(symptom) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {symptom}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default function CycleTrackerPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [note, setNote] = React.useState('');

  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const cycleCollection = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/cycles`) : null),
    [user, firestore]
  );
  const { data: cycleDocuments, isLoading } =
    useCollection<CycleDay>(cycleCollection);

  const cycleData = React.useMemo(() => {
    if (!cycleDocuments) return {};
    return cycleDocuments.reduce((acc, doc) => {
      acc[doc.id] = doc;
      return acc;
    }, {} as Record<string, CycleDay>);
  }, [cycleDocuments]);

  const selectedDayData = cycleData[dateKey];
  const selectedSymptoms = selectedDayData?.symptoms || [];

  React.useEffect(() => {
    setNote(selectedDayData?.note || '');
  }, [selectedDayData]);

  const handleDayClick = (date: Date, currentFlow: FlowLevel) => {
    if (!cycleCollection) return;

    const newFlowIndex = (flowLevels.indexOf(currentFlow) + 1) % flowLevels.length;
    const newFlow = flowLevels[newFlowIndex];
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayDocRef = doc(cycleCollection, dateKey);

    setDocumentNonBlocking(dayDocRef, { flow: newFlow, id: dateKey }, { merge: true });
    toast({
      title: 'Flow Updated',
      description: `Set flow to ${newFlow} for ${format(date, 'MMM d')}.`,
    });
  };

  const handleNoteSave = () => {
    if (!selectedDate || !cycleCollection) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayDocRef = doc(cycleCollection, dateKey);
    setDocumentNonBlocking(dayDocRef, { note: note }, { merge: true });
    toast({
      title: 'Note Saved',
      description: `Your note for ${format(selectedDate, 'MMM d')} has been saved.`,
    });
  };

  const handleSymptomChange = (newSymptoms: string[]) => {
    if (!selectedDate || !cycleCollection) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayDocRef = doc(cycleCollection, dateKey);
    setDocumentNonBlocking(dayDocRef, { symptoms: newSymptoms }, { merge: true });
  };

  return (
    <div>
      <PageHeader
        title="Cycle Tracker"
        description="Track your menstrual cycle on a yearly basis. Click on a heart to log your flow."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <YearlyCycleGrid
            year={currentYear}
            cycleData={cycleData}
            onDayClick={handleDayClick}
          />
           <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setCurrentYear(currentYear - 1)}>
              Previous Year
            </Button>
            <Button onClick={() => setCurrentYear(currentYear + 1)}>
              Next Year
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <DatePicker
                  date={selectedDate}
                  setDate={setSelectedDate}
                  className="w-full"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Symptoms</h3>
                <SymptomsCombobox
                  selected={selectedSymptoms}
                  onChange={handleSymptomChange}
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Note</h3>
                <Textarea
                  placeholder="Add a note about symptoms, mood, etc."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={handleNoteSave}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Menstrual Flow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {Object.entries(flowStyles).filter(([key]) => key !== 'none').map(([key, style]) => (
                        <div key={key} className="flex items-center gap-3">
                            <Heart className={cn('w-5 h-5', style.fill, style.stroke)} strokeWidth={1.5} />
                            <span className="text-sm font-medium">{style.label}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
