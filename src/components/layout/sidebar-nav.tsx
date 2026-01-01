"use client"

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
} from "lucide-react"
import Link from "next/link"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/define-success", label: "Define Success", icon: Target },
  { href: "/life-vision", label: "Life Vision", icon: Calendar },
  { href: "/action-plan", label: "Action Plan", icon: ListChecks },
  { href: "/vision-statement", label: "Vision Statement", icon: Quote },
  { href: "/vision-board", label: "Vision Board", icon: ImageIcon },
  { href: "/goal-setting", label: "Goal Setting", icon: ListTodo },
  { href: "/travel-map", label: "Travel Map", icon: Map },
  { href: "/ai-reflection", label: "AI Reflection", icon: Sparkles },
];

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
          {links.map((link) => (
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
      </SidebarContent>
    </>
  )
}
