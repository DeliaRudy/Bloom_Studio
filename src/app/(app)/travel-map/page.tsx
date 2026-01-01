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
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3b3JsZCUyMG1hcHxlbnwwfHx8fDE3NjcyNzQwODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="World map with pins"
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
