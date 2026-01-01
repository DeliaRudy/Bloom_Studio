'use client';

import * as React from 'react';
import { Lightbulb, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { parseISO, isWithinInterval } from 'date-fns';
import { CycleDay } from '@/lib/types';
import {
  predictCyclePhases,
  type PredictCyclePhasesOutput,
} from '@/ai/flows/predict-cycle-phases';

const phaseReminders: Record<string, string> = {
  menstruation: 'Your energy is lowest. Focus on rest, reflection, and gentle tasks.',
  follicular: 'Energy is rising. A great time for brainstorming, planning, and starting new projects.',
  ovulation: 'Energy and confidence are at their peak. Ideal for collaboration and important conversations.',
  luteal: 'Energy is winding down. Focus on detail-oriented work and completing tasks.',
  unknown: 'Log your period in the Cycle Tracker to get personalized phase reminders.',
};

type CycleSyncBannerProps = {
  currentDate: Date;
  view: 'day' | 'week';
};

export function CycleSyncBanner({ currentDate, view }: CycleSyncBannerProps) {
  const { firestore, user } = useFirebase();
  const [predictedPhases, setPredictedPhases] = React.useState<PredictCyclePhasesOutput | null>(null);
  const [currentPhases, setCurrentPhases] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const cycleCollection = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/cycles`) : null),
    [user, firestore]
  );
  const { data: cycleDocuments, isLoading: isCycleDataLoading } = useCollection<CycleDay>(cycleCollection);

  React.useEffect(() => {
    const fetchPhases = async () => {
      if (isCycleDataLoading || !cycleDocuments) return;

      const periodDays = Object.values(cycleDocuments)
        .filter((day) => day.flow && day.flow !== 'none')
        .map((day) => parseISO(day.id))
        .sort((a, b) => b.getTime() - a.getTime());

      if (periodDays.length > 0) {
        const lastPeriodDate = periodDays[0];
        try {
          const result = await predictCyclePhases({
            lastPeriodStartDate: lastPeriodDate.toISOString(),
          });
          setPredictedPhases(result);
        } catch (error) {
          console.error('Failed to predict cycle phases:', error);
        }
      }
      setIsLoading(false);
    };

    fetchPhases();
  }, [cycleDocuments, isCycleDataLoading]);

  React.useEffect(() => {
    if (!predictedPhases) {
      setCurrentPhases([]);
      return;
    }

    const getPhasesForDate = (date: Date): string[] => {
      const phases: string[] = [];
      for (const phase in predictedPhases) {
        const { startDate, endDate } = predictedPhases[phase as keyof typeof predictedPhases];
        if (isWithinInterval(date, { start: parseISO(startDate), end: parseISO(endDate) })) {
          phases.push(phase);
        }
      }
      return phases;
    };

    if (view === 'day') {
      setCurrentPhases(getPhasesForDate(currentDate));
    } else {
      const weekStart = currentDate;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const phasesInWeek = new Set<string>();
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        getPhasesForDate(day).forEach(p => phasesInWeek.add(p));
      }
      setCurrentPhases(Array.from(phasesInWeek));
    }
  }, [predictedPhases, currentDate, view]);

  const displayPhases = currentPhases.length > 0 ? currentPhases : ['unknown'];
  const reminder = phaseReminders[displayPhases[0]] || phaseReminders['unknown'];
  
  if (isLoading) {
    return null; // Don't show anything while loading to avoid flashes of content
  }

  return (
    <Card className="mb-6 bg-pink-100/50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-pink-200/50 rounded-full">
            <Droplets className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h3 className="font-semibold text-pink-800 dark:text-pink-200">
              Cycle Sync: <span className="capitalize">{displayPhases.join(' & ')}</span>
            </h3>
            <p className="text-sm text-pink-700 dark:text-pink-300 flex items-start gap-1.5">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{reminder}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
