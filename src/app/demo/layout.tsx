

'use client';

import { DemoHeader } from "@/components/layout/demo-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DemoBanner } from "@/components/layout/demo-banner";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav isDemo={true} />
      </Sidebar>
      <SidebarInset>
        <DemoBanner />
        <DemoHeader />
        <main className="p-4 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
