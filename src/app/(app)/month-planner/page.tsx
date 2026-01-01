
import { PageHeader } from "@/components/page-header";

export default function MonthPlannerPage() {
  return (
    <div>
      <PageHeader
        title="Month Planner"
        description="Plan your month in detail."
      />
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Month Planner content will go here.</p>
      </div>
    </div>
  );
}
