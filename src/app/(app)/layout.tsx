
'use client';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  const handleDictationClick = () => {
    toast({
      title: "Coming Soon!",
      description: "AI-powered dictation is on its way to make data entry even easier.",
    });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="min-h-[calc(100vh-4rem-1px)] p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
        <Button
            onClick={handleDictationClick}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
            aria-label="Start dictation"
        >
            <Mic className="h-6 w-6" />
        </Button>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  )
}
