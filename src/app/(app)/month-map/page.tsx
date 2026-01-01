
import { PageHeader } from "@/components/page-header";

export default function MonthMapPage() {
  return (
    <div>
      <PageHeader
        title="Month Map"
        description="Visualize your month at a glance."
      />
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Month Map content will go here.</p>
      </div>
    </div>
  );
}
