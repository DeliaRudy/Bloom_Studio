
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
  Settings,
  Droplets,
  Bell,
  Info,
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { Rose } from "@/components/icons/rose"

type SidebarNavProps = {
  isDemo?: boolean;
}

export function SidebarNav({ isDemo = false }: SidebarNavProps) {
  const pathname = usePathname()
  const basePath = isDemo ? "/demo" : "";

  const coreLinks = [
    { href: `${basePath}/define-success`, label: "My Ambition", icon: Target },
    { href: `${basePath}/persona-definition`, label: "Persona Definition", icon: UserCircle },
    { href: `${basePath}/life-vision`, label: "Life Vision", icon: Calendar },
    { href: `${basePath}/vision-statement`, label: "My Big Goal", icon: Quote },
  ];
  
  const plansLinks = [
      { href: `${basePath}/monthly-goals`, label: "Monthly Goals", icon: CalendarCheck },
      { href: `${basePath}/month-planner`, label: "Month Planner", icon: CalendarPlus },
      { href: `${basePath}/week-planner`, label: "Week Planner", icon: CalendarDays },
      { href: `${basePath}/daily-plan`, label: "Daily Plan", icon: BookOpenCheck },
  ]

  const toolsLinks = [
    { href: `${basePath}/vision-board`, label: "Vision Board", icon: ImageIcon },
    { href: `${basePath}/action-plan`, label: "Action Plan", icon: ListChecks },
    { href: `${basePath}/habits`, label: "Habits", icon: Repeat },
    { href: `${basePath}/daily-habits`, label: "Daily Habits", icon: ClipboardList },
    { href: `${basePath}/affirmations-gratitude`, label: "Affirmations & Gratitude", icon: BookHeart },
    { href: `${basePath}/cycle-tracker`, label: "Cycle Tracker", icon: Droplets },
    { href: `${basePath}/travel-map`, label: "Travel Map", icon: Map },
    { href: `${basePath}/goals-list`, label: "Goals List", icon: ListTodo },
  ]

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Rose className="w-8 h-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary">Bloom</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href={`${basePath}/dashboard`}>
                <SidebarMenuButton
                  isActive={pathname === `${basePath}/dashboard`}
                  tooltip={{
                    children: "Dashboard",
                  }}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            
            <SidebarGroup>
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
                                    <Link href={link.href}>
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

            <SidebarGroup>
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
                                    <Link href={link.href}>
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

            <SidebarGroup>
                 <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer group/label">
                            <Sparkles className="h-4 w-4" />
                            Tools & Trackers
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/label:rotate-90" />
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {toolsLinks.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                    <Link href={link.href}>
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
              <Link href={`${basePath}/ai-reflection`}>
                <SidebarMenuButton
                  isActive={pathname === `${basePath}/ai-reflection`}
                  tooltip={{
                    children: "AI Reflection",
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>AI Reflection</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

             <SidebarMenuItem>
              <Link href={`${basePath}/notifications`}>
                <SidebarMenuButton
                  isActive={pathname === `${basePath}/notifications`}
                  tooltip={{
                    children: "Notifications",
                  }}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

             <SidebarMenuItem>
                <Link href={`${basePath}/settings`}>
                    <SidebarMenuButton
                    isActive={pathname === `${basePath}/settings`}
                    tooltip={{
                        children: "Settings",
                    }}
                    >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link href={`${basePath}/about`}>
                <SidebarMenuButton
                  isActive={pathname === `${basePath}/about`}
                  tooltip={{
                    children: "About",
                  }}
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}
