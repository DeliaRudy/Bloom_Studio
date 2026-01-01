
import { PageHeader } from "@/components/page-header";

export default function MonthlyGoalsPage() {
  return (
    <div>
      <PageHeader
        title="Monthly Goals"
        description="Set and track your goals for the current month."
      />
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Monthly Goals content will go here.</p>
      </div>
    </div>
  );
}
