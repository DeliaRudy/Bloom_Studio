import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Target, 
  Calendar, 
  ListChecks, 
  Quote, 
  Image as ImageIcon, 
  ListTodo, 
  Map, 
  Sparkles,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    href: "/define-success",
    title: "My Ambition",
    description: "Clarify what success means to you.",
    icon: Target,
  },
  {
    href: "/life-vision",
    title: "Life Vision",
    description: "Map out your long-term life plan.",
    icon: Calendar,
  },
  {
    href: "/vision-statement",
    title: "My Big Goal",
    description: "Craft a powerful statement for your future.",
    icon: Quote,
  },
  {
    href: "/action-plan",
    title: "Action Plan",
    description: "Create actionable steps for your goals.",
    icon: ListChecks,
  },
  {
    href: "/vision-board",
    title: "Vision Board",
    description: "Visualize your dreams and aspirations.",
    icon: ImageIcon,
  },
  {
    href: "/goals-list",
    title: "Goals List",
    description: "Set short and long-term goals.",
    icon: ListTodo,
  },
  {
    href: "/travel-map",
    title: "Travel Map",
    description: "Pin your dream destinations.",
    icon: Map,
  },
  {
    href: "/persona-definition",
    title: "Persona Definition",
    description: "Define your personal 'why'.",
    icon: UserCircle,
  },
{
    href: "/ai-reflection",
    title: "AI Reflection",
    description: "Get AI-powered insights on your progress.",
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome to BloomVision"
        description="Your personal space to define, visualize, and track your long-term goals. Let's start blooming."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href}>
            <Card className="h-full hover:bg-card/90 hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
