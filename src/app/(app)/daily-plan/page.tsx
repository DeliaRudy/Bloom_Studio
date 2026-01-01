import { PageHeader } from "@/components/page-header";
import { DailyPlanClient } from "./daily-plan-client";

export default function DailyPlanPage() {
  return (
    <div>
      <PageHeader
        title="Daily Plan for 2026"
        description="Your daily guide to achieving greatness. Plan your priorities, schedule, and reflections for each day."
      />
      <DailyPlanClient />
    </div>
  );
}
