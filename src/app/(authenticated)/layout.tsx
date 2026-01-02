
'use client';

import { useUser } from '@/firebase';
import { usePathname, redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from '@/components/ui/toaster';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);


  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-8">
            {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
