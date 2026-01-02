
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PartyPopper, RefreshCw, Pencil } from 'lucide-react';

export function DemoBanner() {
  const router = useRouter();

  const handleReset = () => {
    // A simple page reload will reset the state of the client components
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between p-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PartyPopper className="h-5 w-5" />
            <span>You are viewing a demo. Changes are not saved.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Demo
            </Button>
            <Link href="/signup">
              <Button variant="secondary" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
