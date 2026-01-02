

'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { demoUser } from "@/lib/demo-data";

const capabilities = [
    "Define Your Ambition: Clarify what success truly means to you across all facets of life.",
    "Cast Your Life Vision: Set long-term milestones for every decade of your life and craft a powerful 5-year plan.",
    "Set SMART Goals: Create a measurable 12-month 'Big Goal' and get AI-powered feedback to ensure it's achievable.",
    "Build Your Action Plan: Break down your goals into concrete, manageable to-do list items.",
    "Visualize Success: Create a dynamic Vision Board with images and captions that represent your dreams.",
    "Track Your Progress: Use detailed monthly, weekly, and daily planners to stay on track.",
    "Cultivate Your Persona: Define your 'Why' and the person you need to become to achieve your goals.",
    "Sync With Your Cycle: Leverage an AI-powered cycle tracker to align your tasks with your natural energy levels.",
    "Gain AI Insights: Receive auto-generated productivity analysis and reflections on your dashboard.",
];

const aiFeatures = [
    "SMART Goal Analysis: Get feedback on your 12-month goal to ensure it's Specific, Measurable, Achievable, Relevant, and Time-bound.",
    "AI-Powered Reflections: Generate deep insights into your progress across the entire app for any date range.",
    "Automated Productivity Analysis: The dashboard automatically provides an AI-generated summary of your recent productivity.",
    "AI Avatar Generation: Create a unique, abstract avatar for your profile based on a text prompt.",
    "Cycle Phase Prediction: The cycle tracker uses your data to predict the start and end dates of your menstrual phases.",
    "Email Content Generation: AI crafts the content for email notifications based on the type of reminder."
];


export default function DemoAboutPage() {
  return (
    <div>
      <PageHeader
        title="About Bloom"
        description="Understand the philosophy behind Bloom and how to use it to turn your dreams into reality."
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Elevator Pitch</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg font-semibold text-foreground">
              Bloom: Your AI life coach. Turn your dreams into daily actions and achieve your vision.
            </blockquote>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">App Capabilities</CardTitle>
            <CardDescription>
              Bloom is a comprehensive life planning tool designed to guide you from high-level ambition to daily execution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-foreground/90">{capability}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI-Powered Features</CardTitle>
            <CardDescription>
              Bloom uses AI to provide you with personalized insights and accelerate your growth. Here's how:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-foreground/90">{feature}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Guide to Planning: The Bloom Flow</CardTitle>
            <CardDescription>
              Each section of Bloom builds upon the last, creating a powerful, interconnected system for success. Follow these steps to build your comprehensive life plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-base">Step 1: Define Your Core (My Core)</AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none">
                  <p>Everything starts with your 'Why'. Before you can plan, you must understand your destination.</p>
                  <ul>
                    <li><strong>My Ambition:</strong> Define what success means to you personally.</li>
                    <li><strong>Persona Definition:</strong> Solidify your core motivations and the person you need to become.</li>
                    <li><strong>Life Vision:</strong> Set decade-by-decade goals and a powerful 5-year vision.</li>
                    <li><strong>My Big Goal:</strong> Create one primary, measurable goal for the next 12 months. The AI will help you make it SMART.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-base">Step 2: Create Your Strategy (My Plans)</AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none">
                  <p>Break down your 12-month goal into smaller, time-based objectives. This is where your vision becomes a concrete plan.</p>
                  <ul>
                    <li><strong>Monthly Goals:</strong> Assign a major milestone for each month of the year to work towards your Big Goal.</li>
                    <li><strong>Month Planner:</strong> Plan each month in detail, breaking down the monthly goal into smaller tasks.</li>
                    <li><strong>Week Planner:</strong> Schedule your tasks, habits, and connections for the upcoming week.</li>
                    <li><strong>Daily Plan:</strong> Set your top 3 priorities for the day, manage your schedule, and reflect on your progress.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold text-base">Step 3: Reinforce & Track</AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none">
                  <p>Use Bloom's tools to stay motivated and track your journey.</p>
                  <ul>
                    <li><strong>Vision Board:</strong> Keep your goals top-of-mind with a visual representation of your dreams.</li>
                    <li><strong>Action Plan:</strong> A master to-do list to capture all the small steps needed.</li>
                    <li><strong>Cycle Tracker:</strong> Sync your activities with your body's natural rhythms for enhanced productivity.</li>
                    <li><strong>Dashboard:</strong> View your progress at a glance with auto-calculated stats and AI-driven insights.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Impact on Productivity</CardTitle>
                <CardDescription>
                    By connecting your long-term vision to your daily tasks, Bloom ensures that every action you take is meaningful.
                </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
                <p>The structured flow from ambition to daily planning creates a powerful sense of purpose. You're no longer just completing tasks; you're laying the bricks of your future. The AI-powered feedback loop on your dashboard provides you with the data you need to understand your own patterns, double down on what's working, and adjust what isn't. This clarity eliminates decision fatigue and maximizes your efficiency, ensuring you are always moving in the right direction.</p>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
