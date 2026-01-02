
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function MonthMapPage() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [monthlyPlans, setMonthlyPlans] = React.useState<Record<string, string>>(
    months.reduce((acc, month) => ({ ...acc, [month]: '' }), {})
  );
  const { toast } = useToast();

  const handlePlanChange = (month: string, value: string) => {
    setMonthlyPlans((prev) => ({ ...prev, [month]: value }));
  };

  const handleSave = () => {
    console.log('Saving Month Map:', monthlyPlans);
    toast({
      title: 'Month Map Saved',
      description: 'Your yearly plan has been successfully saved.',
    });
  };

  return (
    <div>
      <PageHeader
        title={`Personal Success Plan - ${year}`}
        description="Create a map for the year by scheduling what you need to achieve by the end of each month."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month) => (
          <Card key={month} className="flex flex-col">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold font-headline">
                {month}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <Textarea
                placeholder="Your plan for this month..."
                value={monthlyPlans[month]}
                onChange={(e) => handlePlanChange(month, e.target.value)}
                className="resize-none h-full bg-transparent border-dashed"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleSave}>
          Save My Plan
        </Button>
      </div>
    </div>
  );
}
