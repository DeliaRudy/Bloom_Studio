
'use client';
import * as React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isWithinInterval,
  parse,
  parseISO,
} from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { predictCyclePhases, PredictCyclePhasesOutput } from '@/ai/flows/predict-cycle-phases';
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { CycleDay, CycleNote } from '@/lib/types';
import { Calendar, Droplets, PlusCircle, Sparkles, Trash2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const flowLevels = ['none', 'light', 'medium', 'heavy'] as const;
type FlowLevel = typeof flowLevels[number];

type Phase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

const phaseDetails = {
  menstruation: {
    title: "Menstruation Phase (Days 1-7 | Inner Winter)",
    description: "Great time for setting and evaluating your goals. Work on solo projects and analytical tasks. Strategic thinking and set intentions for the next phase. Do big-picture work and self-assessment. Listen to your intuitions. Be gentle with yourself and highly reflective. Honor your body and get the sleep she wants.",
    color: "bg-[#f5c1cd] text-[#6d100f]",
    textColor: "text-[#6d100f]",
  },
  follicular: {
    title: "Follicular Phase (Days 8-14 | Inner Spring)",
    description: "Time to flex your creativity and brainstorm. Explore new opportunities and people. Be curious. Take an online course/Learn something new. Research. Get clear on your vision and intentions. Do something adventurous and take a chance on something new. Use your good mood and energy to help others.",
    color: "bg-[#e7a8b3] text-[#6d100f]",
    textColor: "text-[#6d100f]",
  },
  ovulation: {
    title: "Ovulation Phase (Days 15-17 | Inner Summer)",
    description: "Launch your new business. Pitch your ideas. Connect with your friends & family. Have hard conversations. Be seen and heard. Use your feminine energy. Attend conferences and network. Go out on a date. Engage in group work and be brave. Record YouTube or Podcast episodes. Have important conversations.",
    color: "bg-[#d88fa3] text-white",
    textColor: "text-[#d88fa3]",
  },
  luteal: {
    title: "Luteal Phase (Days 18-28 | Inner Autumn)",
    description: "Avoid big projects, tasks, and presentation. Focus on detail-oriented or repetitive task. Deep dive into your finances. Fully focus on your self-care and alone time. Prioritize admin tasks that have been ignored all month. Celebrate your wins. Flex your boundaries and say NO. Your anxiety will be high so do calming activities and give yourself grace.",
    color: "bg-[#c5768f] text-white",
    textColor: "text-[#c5768f]",
  },
};

const CalendarGrid = ({
  month,
  year,
  cycleData,
  predictedPhases,
  selectedDay,
  onDayClick,
}: {
  month: number;
  year: number;
  cycleData: Record<string, CycleDay>;
  predictedPhases: PredictCyclePhasesOutput | null;
  selectedDay: Date;
  onDayClick: (day: Date) => void;
}) => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(startDate);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const startingDayOfWeek = getDay(startDate) === 0 ? 6 : getDay(startDate) - 1; // Monday is 0

  const getDayPhase = (day: Date): Phase | null => {
    if (!predictedPhases) return null;
    for (const phaseName in predictedPhases) {
      const phase = predictedPhases[phaseName as Phase];
      if (isWithinInterval(day, { start: parseISO(phase.startDate), end: parseISO(phase.endDate) })) {
        return phaseName as Phase;
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-lg">
          {format(startDate, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = cycleData[dateKey];
            const flow = dayData?.flow || 'none';
            const phase = getDayPhase(day);

            return (
              <button
                key={dateKey}
                onClick={() => onDayClick(day)}
                className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out',
                  'text-sm font-medium',
                  !isSameMonth(day, startDate) && 'text-muted-foreground/50',
                  isSameDay(day, new Date()) && 'border-2 border-primary',
                  isSameDay(day, selectedDay) && 'ring-2 ring-primary ring-offset-2',
                  flow !== 'none' && phaseDetails.menstruation.color,
                  flow === 'none' && phase && phaseDetails[phase].color,
                  flow === 'none' && !phase && 'hover:bg-muted'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CycleTrackerPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState(new Date());
  const [newNote, setNewNote] = React.useState('');
  
  const [predictedPhases, setPredictedPhases] = React.useState<PredictCyclePhasesOutput | null>(null);
  const [isPredicting, setIsPredicting] = React.useState(false);

  const cycleCollection = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/cycles`) : null
  , [user, firestore]);

  const { data: cycleDocuments, isLoading } = useCollection<CycleDay>(cycleCollection);
  
  const cycleData = React.useMemo(() => {
    if (!cycleDocuments) return {};
    return cycleDocuments.reduce((acc, doc) => {
      acc[doc.id] = doc;
      return acc;
    }, {} as Record<string, CycleDay>);
  }, [cycleDocuments]);

  const selectedDayNotes = React.useMemo(() => {
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    return cycleData[dateKey]?.notes || [];
  }, [selectedDay, cycleData]);


  const getLatestPeriodStartDate = React.useCallback(() => {
    const periodDays = Object.values(cycleData)
      .filter(d => d.flow !== 'none')
      .map(d => parseISO(d.id))
      .sort((a, b) => b.getTime() - a.getTime());

    if (periodDays.length === 0) return null;

    let startDate = periodDays[0];
    for (let i = 1; i < periodDays.length; i++) {
        const diff = startDate.getDate() - periodDays[i].getDate();
        if (diff > 1) {
            break;
        }
        startDate = periodDays[i];
    }
    return startDate;
  }, [cycleData]);

  const handlePredictPhases = React.useCallback(async () => {
    const lastPeriodStart = getLatestPeriodStartDate();
    if (!lastPeriodStart) {
      setPredictedPhases(null);
      return;
    }

    setIsPredicting(true);
    try {
      const result = await predictCyclePhases({
        lastPeriodStartDate: format(lastPeriodStart, 'yyyy-MM-dd'),
      });
      setPredictedPhases(result);
    } catch (error) {
      console.error("Error predicting phases:", error);
      toast({ title: 'Prediction Failed', description: 'Could not predict cycle phases.', variant: 'destructive' });
    } finally {
      setIsPredicting(false);
    }
  }, [getLatestPeriodStartDate, toast]);

  React.useEffect(() => {
    handlePredictPhases();
  }, [cycleData, handlePredictPhases]);

  const handleFlowChange = (flow: FlowLevel) => {
    if (!cycleCollection) return;
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    const dayDocRef = doc(cycleCollection, dateKey);
    
    setDocumentNonBlocking(dayDocRef, { flow }, { merge: true });

    toast({
      title: 'Flow Updated',
      description: `Set flow to ${flow} for ${format(selectedDay, 'MMM d')}.`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !cycleCollection) return;
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    const dayDocRef = doc(cycleCollection, dateKey);
    const notesCollectionRef = collection(dayDocRef, 'notes');

    addDocumentNonBlocking(notesCollectionRef, {
        text: newNote,
        createdAt: new Date().toISOString(),
    })
    setNewNote('');
  };
  
  const handleRemoveNote = (noteId: string) => {
      if (!cycleCollection) return;
      const dateKey = format(selectedDay, 'yyyy-MM-dd');
      const noteDocRef = doc(firestore, `users/${user!.uid}/cycles/${dateKey}/notes/${noteId}`);
      deleteDocumentNonBlocking(noteDocRef);
  }

  const notesForSelectedDayQuery = useMemoFirebase(() => {
    if (!user) return null;
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    return query(collection(firestore, `users/${user.uid}/cycles/${dateKey}/notes`), orderBy('createdAt', 'desc'));
  }, [user, firestore, selectedDay]);

  const { data: notesForDay } = useCollection<CycleNote>(notesForSelectedDayQuery);

  return (
    <div>
      <PageHeader
        title="Cycle Syncing"
        description="Align Your Productivity With Your Menstrual Cycle."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Previous</Button>
                <h2 className="text-2xl font-headline">{format(currentDate, 'MMMM yyyy')}</h2>
                <Button variant="outline" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</Button>
            </div>
          <CalendarGrid
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            cycleData={cycleData}
            predictedPhases={predictedPhases}
            selectedDay={selectedDay}
            onDayClick={setSelectedDay}
          />
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Calendar className='w-5 h-5'/> Details for {format(selectedDay, 'MMMM d')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className='font-semibold'>Menstrual Flow</Label>
                        <Select onValueChange={handleFlowChange} value={cycleData[format(selectedDay, 'yyyy-MM-dd')]?.flow || 'none'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select flow level" />
                            </SelectTrigger>
                            <SelectContent>
                                {flowLevels.map(level => (
                                    <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label className='font-semibold'>Notes for this day</Label>
                        <div className="flex items-center gap-2">
                             <Textarea 
                                placeholder='Add a note about symptoms, mood, etc.'
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                rows={1}
                            />
                            <Button size="icon" onClick={handleAddNote}><PlusCircle className='w-4 h-4'/></Button>
                        </div>
                        <div className="space-y-2 mt-4 max-h-32 overflow-y-auto">
                            {notesForDay?.map(note => (
                                <div key={note.id} className="flex justify-between items-start text-sm bg-muted/50 p-2 rounded-md">
                                    <p className='flex-1 pr-2'>{note.text}</p>
                                    <Button size="icon" variant="ghost" className='h-5 w-5' onClick={() => handleRemoveNote(note.id)}>
                                        <X className='h-3 w-3' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Droplets className='w-5 h-5'/> Phases Key</CardTitle>
              <CardDescription>Learn about each phase of your cycle and how to work with your energy.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue='menstruation'>
                {Object.entries(phaseDetails).map(([key, value]) => (
                  <AccordionItem value={key} key={key}>
                    <AccordionTrigger className={cn("font-headline", value.textColor)}>
                      {value.title}
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                      {value.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    