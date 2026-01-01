import { PageHeader } from "@/components/page-header";
import TravelMapClient from "./travel-map-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TravelMapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <PageHeader
        title="My Travel Map"
        description="Pin your past journeys and future adventures. Where in the world do you want to go?"
      />
      <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-lg" />}>
        <TravelMapClient apiKey={apiKey} />
      </Suspense>
    </div>
  );
}
