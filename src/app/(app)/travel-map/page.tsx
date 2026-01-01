import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function TravelMapPage() {
  return (
    <div>
      <PageHeader
        title="My Travel Map"
        description="Pin your past journeys and future adventures. Where in the world do you want to go?"
      />
      <Card>
        <CardContent className="p-0">
            <div className="aspect-[16/9] relative">
                <Image
                    src="https://picsum.photos/seed/worldmap/1200/675"
                    alt="World map"
                    data-ai-hint="world map"
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
