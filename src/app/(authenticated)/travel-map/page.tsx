
import { PageHeader } from "@/components/page-header";
import { TravelMapClient } from "./travel-map-client";

export default function TravelMapPage() {
  return (
    <div>
      <PageHeader
        title="My Travel Map"
        description="Pin your past journeys and future adventures. Where in the world do you want to go?"
      />
      <TravelMapClient />
    </div>
  );
}
