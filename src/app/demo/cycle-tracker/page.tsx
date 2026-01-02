
'use client';
import * as React from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/datepicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Heart, X, Sparkles } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { predictCyclePhases, type PredictCyclePhasesOutput } from '@/ai/flows/predict-cycle-phases';
import { demoCycleData } from '@/lib/demo-data';
import { CycleDay } from '@/lib/types';


const flowLevels = ['none', 'light', 'medium', 'heavy'] as const;
type FlowLevel = (typeof flowLevels)[number];

const flowStyles: Record<
  FlowLevel,
  { fill: string; stroke: string; label: string }
> = {
  none: { fill: 'fill-transparent', stroke: 'stroke-muted-foreground/50', label: 'None' },
  light: { fill: 'fill-pink-200', stroke: 'stroke-pink-300', label: 'Light' },
  medium: { fill: 'fill-pink-300', stroke: 'stroke-pink-400', label: 'Medium' },
  heavy: { fill: 'fill-pink-400', stroke: 'stroke-pink-500', label: 'Heavy' },
};

const phaseStyles = {
  menstruation: 'bg-primary/20',
  follicular: 'bg-secondary/30',
  ovulation: 'bg-accent/40',
  luteal: 'bg-muted',
};

const phaseIndicatorStyles = {
  menstruation: 'bg-primary',
  follicular: 'bg-secondary',
  ovulation: 'bg-accent',
  luteal: 'bg-muted-foreground',
};

const allSymptoms = ['Cramps', 'Acne', 'Moody', 'Sad', 'Happy', 'Energetic', 'Bloated', 'Headache', 'Fatigue', 'Cravings'];
const months = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), 'MMM'));
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const YearlyCycleGrid = ({
  year,
  cycleData,
  onDayClick,
  predictedPhases,
}: {
  year: number;
  cycleData: Record<string, CycleDay>;
  onDayClick: (date: Date, currentFlow: FlowLevel) => void;
  predictedPhases: PredictCyclePhasesOutput | null;
}) => {
  const getPhaseForDate = (date: Date): keyof typeof phaseStyles | null => {
    if (!predictedPhases) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    for (const phase in predictedPhases) {
      const { startDate, endDate } = predictedPhases[phase as keyof typeof predictedPhases];
      if (dateStr >= startDate && dateStr <= endDate) {
        return phase as keyof typeof phaseStyles;
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">PERIOD TRACKER - {year}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(12, 1fr)', minWidth: '800px' }}>
          <div />
          {months.map((month) => (
            <div key={month} className="text-center font-bold text-sm">{month.toUpperCase()}</div>
          ))}
          {days.map((day) => (
            <React.Fragment key={day}>
              <div className="text-center font-bold text-sm pr-2 flex items-center justify-center">{day}</div>
              {months.map((_, monthIndex) => {
                const date = new Date(year, monthIndex, day);
                if (date.getDate() !== day) {
                  return <div key={monthIndex} />;
                }
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayData = cycleData[dateKey];
                const flow = dayData?.flow || 'none';
                const phase = getPhaseForDate(date);
                return (
                  <div key={monthIndex} className={cn('flex items-center justify-center rounded-sm h-8', phase && phaseStyles[phase])}>
                    <button onClick={() => onDayClick(date, flow)}>
                      <Heart className={cn('w-6 h-6 transition-all', flowStyles[flow].fill, flowStyles[flow].stroke)} strokeWidth={1.5} />
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
  const handleSelect = (symptom: string) => { onChange(selected.includes(symptom) ? selected.filter((s) => s !== symptom) : [...selected, symptom]); };
  const handleRemove = (symptom: string) => { onChange(selected.filter((s) => s !== symptom)); };
  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto min-h-10">
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge variant="secondary" key={item} className="mr-1" onClick={(e) => { e.stopPropagation(); handleRemove(item); }}>
                    {item} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              ) : ( <span className="text-muted-foreground">Select symptoms...</span> )}
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
                  <CommandItem key={symptom} onSelect={() => handleSelect(symptom)}>
                    <Check className={cn('mr-2 h-4 w-4', selected.includes(symptom) ? 'opacity-100' : 'opacity-0')} />
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

export default function DemoCycleTrackerPage() {
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [predictedPhases, setPredictedPhases] = React.useState<PredictCyclePhasesOutput | null>(null);
  const [cycleData, setCycleData] = React.useState<Record<string, CycleDay>>(demoCycleData);
  const [note, setNote] = React.useState('');

  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedDayData = cycleData[dateKey];
  const selectedSymptoms = selectedDayData?.symptoms || [];

  React.useEffect(() => { setNote(selectedDayData?.note || ''); }, [selectedDayData]);

  const handleDayClick = (date: Date, currentFlow: FlowLevel) => {
    const newFlowIndex = (flowLevels.indexOf(currentFlow) + 1) % flowLevels.length;
    const newFlow = flowLevels[newFlowIndex];
    const dateKey = format(date, 'yyyy-MM-dd');
    setCycleData(prev => ({ ...prev, [dateKey]: { ...prev[dateKey], id: dateKey, flow: newFlow } }));
    toast({ title: 'Flow Updated', description: `Set flow to ${newFlow} for ${format(date, 'MMM d')}. (Demo only)` });
  };
  
  const handleSymptomChange = (newSymptoms: string[]) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setCycleData(prev => ({ ...prev, [dateKey]: { ...prev[dateKey], id: dateKey, flow: prev[dateKey]?.flow || 'none', symptoms: newSymptoms } }));
  };

  const handlePredictPhases = async () => {
    const periodDays = Object.values(cycleData).filter(day => day.flow && day.flow !== 'none').map(day => parseISO(day.id)).sort((a, b) => b.getTime() - a.getTime());
    if (periodDays.length === 0) { toast({ title: 'No Period Data', description: 'Please log at least one period day.', variant: 'destructive' }); return; }
    const lastPeriodDate = periodDays[0];
    try {
      const result = await predictCyclePhases({ lastPeriodStartDate: format(lastPeriodDate, 'yyyy-MM-dd') });
      setPredictedPhases(result);
      toast({ title: 'Phases Predicted!', description: 'Your upcoming cycle phases have been highlighted.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Prediction Failed', variant: 'destructive' });
    }
  };

  React.useEffect(() => { handlePredictPhases() }, []);

  return (
    <div>
      <PageHeader title="Cycle Tracker" description="Track your menstrual cycle on a yearly basis. Click on a heart to log your flow." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <YearlyCycleGrid year={currentYear} cycleData={cycleData} onDayClick={handleDayClick} predictedPhases={predictedPhases} />
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setCurrentYear(currentYear - 1)}>Previous Year</Button>
            <Button onClick={() => setCurrentYear(currentYear + 1)}>Next Year</Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader> <CardTitle>Details</CardTitle> </CardHeader>
            <CardContent className="space-y-4">
              <div> <Label>Select a Date</Label> <DatePicker date={selectedDate} setDate={setSelectedDate} className="w-full" /> </div>
              <div> <Label className="font-semibold mb-2">Symptoms</Label> <SymptomsCombobox selected={selectedSymptoms} onChange={handleSymptomChange} /> </div>
              <div> <Label className="font-semibold mb-2">Note for the day</Label> <Textarea placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => toast({ title: 'Note Saved (Demo Only)' })}/> </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader> <CardTitle>Menstrual Flow</CardTitle> </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(flowStyles).map(([key, style]) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
        <Card className="lg:col-span-2">
          <CardHeader> <CardTitle className="font-headline">AI Phase Prediction</CardTitle> <CardDescription>Predict and highlight your upcoming cycle phases based on your logged period data.</CardDescription> </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handlePredictPhases} className="w-full"> <Sparkles className="mr-2 h-4 w-4" /> Predict Phases From My Tracker Data </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader> <CardTitle>Phases Key</CardTitle> </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(phaseIndicatorStyles).map(([key, style]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={cn('w-4 h-4 rounded-full', style)}></div>
                  <span className="text-sm font-medium capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader> <CardTitle className="font-headline">Cycle Syncing Guide</CardTitle> <CardDescription>Learn how to work with your body's natural rhythms.</CardDescription> </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="menstruation"> <AccordionTrigger className='font-semibold text-base text-primary'>Phase 1: Menstruation (Days 1-7)</AccordionTrigger> <AccordionContent className="prose prose-sm max-w-none"> <p>Your body is releasing the uterine lining. Energy is lowest. This is a time for rest, reflection, and gentle movement.</p> <h4>Productivity:</h4> <ul> <li>Rest &amp; Recover: Allow yourself downtime.</li> <li>Reflect &amp; Journal: Great for introspection and setting intentions.</li> <li>Gentle Tasks: Focus on low-energy, solo work.</li> </ul> <h4>Self-Care:</h4> <ul> <li>Nourishing Foods: Iron-rich foods like leafy greens and red meat.</li> <li>Warmth: Use a heating pad, take warm baths.</li> <li>Gentle Movement: Yin yoga, stretching, or walking.</li> </ul> </AccordionContent> </AccordionItem>
            <AccordionItem value="follicular"> <AccordionTrigger className='font-semibold text-base text-secondary-foreground'>Phase 2: Follicular (Days 8-14)</AccordionTrigger> <AccordionContent className="prose prose-sm max-w-none"> <p>Estrogen is rising, boosting your energy, mood, and brain skills. It's a time for new beginnings and planning.</p> <h4>Productivity:</h4> <ul> <li>Brainstorm &amp; Strategize: Creativity and problem-solving are high.</li> <li>Start New Projects: Your motivation is increasing.</li> <li>Learn New Skills: Your mind is sharp and receptive.</li> </ul> <h4>Self-Care:</h4> <ul> <li>Lighter Foods: Focus on lean proteins, fresh vegetables, and fermented foods.</li> <li>Cardio &amp; Strength: Your body can handle more intense workouts.</li> <li>Socialize: You'll likely feel more outgoing.</li> </ul> </AccordionContent> </AccordionItem>
            <AccordionItem value="ovulation"> <AccordionTrigger className='font-semibold text-base text-accent-foreground'>Phase 3: Ovulation (Days 15-17)</AccordionTrigger> <AccordionContent className="prose prose-sm max-w-none"> <p>Estrogen and testosterone peak, making you feel your most confident, energetic, and social. This is the time to connect.</p> <h4>Productivity:</h4> <ul> <li>Collaborate: Perfect for team meetings and networking.</li> <li>Important Conversations: Communication skills are at their peak.</li> <li>Public Speaking/Presenting: You're magnetic and persuasive.</li> </ul> <h4>Self-Care:</h4> <ul> <li>High-Intensity Workouts: HIIT, running, or group fitness classes.</li> <li>Light &amp; Fresh Foods: Salads, smoothies, and grilled vegetables.</li> <li>Connect with Others: Plan social events or date nights.</li> </ul> </AccordionContent> </AccordionItem>
            <AccordionItem value="luteal"> <AccordionTrigger className='font-semibold text-base text-muted-foreground'>Phase 4: Luteal (Days 18-28)</AccordionTrigger> <AccordionContent className="prose prose-sm max-w-none"> <p>Progesterone rises, energy winds down. This is a time for nesting, organizing, and completing tasks.</p> <h4>Productivity:</h4> <ul> <li>Detail-Oriented Work: Great for editing, organizing, and admin tasks.</li> <li>Wrap Up Projects: Focus on completion rather than starting new things.</li> <li>Work Independently: You may prefer focused, solo work.</li> </ul> <h4>Self-Care:</h4> <ul> <li>Comforting Foods: Complex carbs like sweet potatoes and brown rice to stabilize mood.</li> <li>Moderate Exercise: Pilates, strength training, or hiking.</li> <li>Create a Cozy Environment: Spend time at home, decluttering and nesting.</li> </ul> </AccordionContent> </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
