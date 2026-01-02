
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { useFirebase, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  DailyPlan,
  WeeklyPlan,
  MonthlyGoal,
  DailyHabit,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, CheckCircle, Repeat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductivityAnalysis, type AnalysisState } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


type StatCardProps = {
  title: string;
  value: number;
  emoji: string;
  description: string;
};

function StatCard({ title, value, emoji, description }: StatCardProps) {
  const isPercentage = !Number.isInteger(value);
  const displayValue = isPercentage ? `${Math.round(value * 100)}%` : value;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {title}
          <span className="text-2xl">{emoji}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">{displayValue}</div>
        <Progress value={isPercentage ? value * 100 : value} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatNumberCard({ title, value, icon: Icon, description }: { title: string, value: number, icon: React.ElementType, description: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

function getScoreEmoji(score: number): string {
  if (score >= 0.9) return "🔥";
  if (score >= 0.75) return "🚀";
  if (score >= 0.5) return "👍";
  if (score >= 0.25) return "🤔";
  return "🧊";
}

function DashboardClient() {
  const { firestore, user, isUserLoading } = useFirebase();
  const [stats, setStats] = React.useState({
    avgDailyTasks: 0,
    avgWeeklyGoals: 0,
    avgMonthlyGoals: 0,
    avgHabitScore: 0,
    totalMonthlyGoalsMet: 0,
    totalWeeklyGoalsMet: 0,
    uniquePeopleContacted: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [analysis, setAnalysis] = React.useState<AnalysisState>({ summary: null, detailed: null, error: null });
  const [isAnalysisLoading, setIsAnalysisLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      setIsLoading(true);
      setIsAnalysisLoading(true);

      const collectionsToFetch = [
        'dailyPlans', 'weeklyPlans', 'monthlyGoals', 'actionPlanItems',
        'successDefinitions', 'lifeVisionMilestones', 'fiveYearVisionPrompts',
        'visionStatements', 'visionBoardImages', 'categoryGoals', 'travelMapPins',
        'journalEntries', 'dailyHabits', 'habitsToManage', 'cycles'
      ];
      const allData: Record<string, any> = {};

      const dataPromises = collectionsToFetch.map(async (coll) => {
        try {
          const collRef = collection(firestore, `users/${user.uid}/sessions/default/${coll}`);
          const snapshot = await getDocs(collRef);
          return { name: coll, docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
        } catch (e) {
          console.warn(`Could not fetch collection ${coll}:`, e);
          return { name: coll, docs: [] };
        }
      });
      
      const allCollections = await Promise.all(dataPromises);
      allCollections.forEach(coll => {
          allData[coll.name] = coll.docs;
      });

      const dailyPlans = (allData.dailyPlans || []) as DailyPlan[];
      const weeklyPlans = (allData.weeklyPlans || []) as WeeklyPlan[];
      const monthlyGoals = (allData.monthlyGoals || []) as MonthlyGoal[];

      // Calculations
      let totalDailyCompletion = 0;
      dailyPlans.forEach(plan => {
          const total = plan.priorities?.length || 0;
          const completed = plan.priorities?.filter(p => p.completed).length || 0;
          if (total > 0) totalDailyCompletion += completed / total;
      });
      const avgDailyTasks = dailyPlans.length > 0 ? totalDailyCompletion / dailyPlans.length : 0;

      let totalWeeklyCompletion = 0;
      let totalWeeklyGoalsMet = 0;
      let allPeople = new Set<string>();
      weeklyPlans.forEach(plan => {
          const total = plan.goals?.length || 0;
          const completed = plan.goals?.filter(g => g.priority).length || 0;
          totalWeeklyGoalsMet += completed;
          if (total > 0) totalWeeklyCompletion += completed / total;
          plan.peopleToConnect?.filter(p => p.connected).forEach(p => allPeople.add(p.name));
      });
      const avgWeeklyGoals = weeklyPlans.length > 0 ? totalWeeklyCompletion / weeklyPlans.length : 0;
      
      let totalMonthlyCompletion = 0;
      let totalMonthlyGoalsMet = 0;
      monthlyGoals.forEach(plan => {
          const total = plan.goals?.length || 0;
          const completed = plan.goals?.filter(g => g.completed).length || 0;
          totalMonthlyGoalsMet += completed;
          if (total > 0) totalMonthlyCompletion += completed / total;
      });
      const avgMonthlyGoals = monthlyGoals.length > 0 ? totalMonthlyCompletion / monthlyGoals.length : 0;
      
      let totalHabitScore = 0;
      dailyPlans.forEach(plan => {
          const habitKeys = Object.keys(plan.habits || {});
          const total = habitKeys.length;
          const completed = habitKeys.filter(k => plan.habits[k]).length;
          if (total > 0) totalHabitScore += completed / total;
      });
      const avgHabitScore = dailyPlans.length > 0 ? totalHabitScore / dailyPlans.length : 0;

      setStats({
        avgDailyTasks,
        avgWeeklyGoals,
        avgMonthlyGoals,
        avgHabitScore,
        totalMonthlyGoalsMet,
        totalWeeklyGoalsMet,
        uniquePeopleContacted: allPeople.size,
      });
      setIsLoading(false);

      // Trigger AI Analysis
      const analysisResult = await getProductivityAnalysis({ allData: JSON.stringify(allData) });
      setAnalysis(analysisResult);
      setIsAnalysisLoading(false);
    };

    fetchAllData();
  }, [user, firestore]);
  
  const mainIsLoading = isLoading || isUserLoading;

  if (mainIsLoading) {
      return (
          <div>
              <PageHeader
                title="Dashboard"
                description="Your central hub for tracking progress and gaining insights."
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
              </div>
              <div className="mt-8">
                  <Skeleton className="h-64" />
              </div>
          </div>
      )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your central hub for tracking progress and gaining insights."
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Avg. Daily Tasks Completed" value={stats.avgDailyTasks} emoji={getScoreEmoji(stats.avgDailyTasks)} description="Based on your top 3 daily priorities." />
        <StatCard title="Avg. Weekly Goals Met" value={stats.avgWeeklyGoals} emoji={getScoreEmoji(stats.avgWeeklyGoals)} description="Based on prioritized weekly goals."/>
        <StatCard title="Avg. Monthly Goals Met" value={stats.avgMonthlyGoals} emoji={getScoreEmoji(stats.avgMonthlyGoals)} description="Based on completed monthly goals." />
        <StatCard title="Efficiency Tracking" value={stats.avgHabitScore} emoji={getScoreEmoji(stats.avgHabitScore)} description="Based on your daily habit checklist." />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Lifetime Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
            <StatNumberCard title="Monthly Goals Met" value={stats.totalMonthlyGoalsMet} icon={CheckCircle} description="Total number of monthly goals achieved."/>
            <StatNumberCard title="Weekly Goals Met" value={stats.totalWeeklyGoalsMet} icon={TrendingUp} description="Total number of prioritized weekly goals met."/>
            <StatNumberCard title="People Contacted" value={stats.uniquePeopleContacted} icon={Users} description="Total unique people you've connected with." />
        </div>
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary"/>
                    AI Productivity Analysis
                </CardTitle>
                <CardDescription>An auto-generated analysis of your productivity and suggestions for improvement.</CardDescription>
            </CardHeader>
            <CardContent>
                {isAnalysisLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : analysis.error ? (
                    <p className="text-destructive">{analysis.error}</p>
                ) : analysis.summary ? (
                    <div className="prose prose-sm max-w-none">
                       <p>{analysis.summary}</p>
                        {analysis.detailed && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto">View Detailed Analysis</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>Detailed Productivity Analysis</DialogTitle>
                                <DialogDescription>
                                  Here is a more in-depth look at your progress.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="prose prose-sm max-w-none h-96 overflow-y-auto">
                                <p>{analysis.detailed}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No analysis available.</p>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default function DashboardPage() {
    return <DashboardClient />;
}
