
"use client"

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
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
  Flower2,
  UserCircle,
  BookHeart,
  Repeat,
  Heart,
  DraftingCompass,
  CalendarCheck,
  CalendarHeart,
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  BookOpenCheck,
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

const coreLinks = [
  { href: "/define-success", label: "My Ambition", icon: Target },
  { href: "/life-vision", label: "Life Vision", icon: Calendar },
  { href: "/vision-statement", label: "My Big Goal", icon: Quote },
  { href: "/action-plan", label: "Action Plan", icon: ListChecks },
  { href: "/vision-board", label: "Vision Board", icon: ImageIcon },
  { href: "/goals-list", label: "Goals List", icon: ListTodo },
  { href: "/travel-map", label: "Travel Map", icon: Map },
  { href: "/persona-definition", label: "Persona Definition", icon: UserCircle },
  { href: "/affirmations-gratitude", label: "Affirmations & Gratitude", icon: BookHeart },
  { href: "/habits", label: "Habits", icon: Repeat },
  { href: "/daily-habits", label: "Daily Habits", icon: ClipboardList },
];

const plansLinks = [
    { href: "/monthly-goals", label: "Monthly Goals", icon: CalendarCheck },
    { href: "/month-map", label: "Month Map", icon: CalendarHeart },
    { href: "/month-planner", label: "Month Planner", icon: CalendarPlus },
    { href: "/week-planner", label: "Week Planner", icon: CalendarDays },
    { href: "/daily-plan", label: "Daily Plan", icon: BookOpenCheck },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Flower2 className="w-8 h-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary">BloomVision</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  tooltip={{
                    children: "Dashboard",
                  }}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            
            <SidebarGroup asChild>
                <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer group/label">
                            <Heart className="h-4 w-4" />
                            My Core
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/label:rotate-90" />
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {coreLinks.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                    <Link href={link.href} legacyBehavior passHref>
                                        <SidebarMenuButton
                                        isActive={pathname === link.href}
                                        tooltip={{
                                            children: link.label,
                                        }}
                                        >
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarGroup>

            <SidebarGroup asChild>
                 <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer group/label">
                            <DraftingCompass className="h-4 w-4" />
                            My Plans
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/label:rotate-90" />
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {plansLinks.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                    <Link href={link.href} legacyBehavior passHref>
                                        <SidebarMenuButton
                                        isActive={pathname === link.href}
                                        tooltip={{
                                            children: link.label,
                                        }}
                                        >
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarGroup>

             <SidebarMenuItem>
              <Link href="/ai-reflection" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/ai-reflection"}
                  tooltip={{
                    children: "AI Reflection",
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>AI Reflection</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}
